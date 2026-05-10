"""Quiz generator.

Pulls QCMs from the existing organ + disease + glossary catalogues.
We generate up to ``n`` questions, shuffling across 7 distinct templates
so a session feels varied without adding a new data pipeline.
"""

import random

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Disease, GlossaryEntry, Organ

router = APIRouter()


def _qcm(
    *,
    qid: str,
    topic: str,
    prompt: str,
    correct: str,
    wrongs: list[str],
    explanation: str,
    rng: random.Random,
) -> dict:
    """Wrap a single right answer + 3 wrong answers into the front-end format."""
    items = [correct, *wrongs[:3]]
    choices = [{"id": str(i), "label": label} for i, label in enumerate(items)]
    rng.shuffle(choices)
    correct_id = next(c["id"] for c in choices if c["label"] == correct)
    return {
        "id": qid,
        "topic": topic,
        "prompt": prompt,
        "choices": choices,
        "correctChoiceId": correct_id,
        "explanation": explanation,
    }


def _organ_function_q(rng, o, organs):
    if not o.functions:
        return None
    correct = o.functions[0]
    wrong_pool = [
        f for other in organs if other.slug != o.slug for f in (other.functions or [])
    ]
    if len(wrong_pool) < 3:
        return None
    return _qcm(
        qid=f"fn-{o.slug}",
        topic="Anatomie",
        prompt=f"Quelle est une fonction principale de : {o.name} ?",
        correct=correct,
        wrongs=rng.sample(wrong_pool, k=3),
        explanation=o.short_description,
        rng=rng,
    )


def _disease_organ_q(rng, d, organs):
    if not d.organs:
        return None
    correct = d.organs[0]
    pool = [o.slug for o in organs if o.slug != correct]
    if len(pool) < 3:
        return None
    return _qcm(
        qid=f"dis-org-{d.slug}",
        topic="Pathologie",
        prompt=f"Quel organe est principalement touché par : {d.name} ?",
        correct=correct,
        wrongs=rng.sample(pool, k=3),
        explanation=d.short_description,
        rng=rng,
    )


def _disease_category_q(rng, d, all_categories):
    if not d.category:
        return None
    others = [c for c in all_categories if c != d.category]
    if len(others) < 3:
        return None
    return _qcm(
        qid=f"dis-cat-{d.slug}",
        topic="Catégorie",
        prompt=f"À quelle catégorie appartient : {d.name} ?",
        correct=d.category,
        wrongs=rng.sample(others, k=3),
        explanation=d.short_description,
        rng=rng,
    )


def _disease_severity_q(rng, d):
    labels = {
        "mild": "Légère",
        "moderate": "Modérée",
        "severe": "Sévère",
        "critical": "Critique",
    }
    if d.severity not in labels:
        return None
    correct = labels[d.severity]
    wrongs = [v for k, v in labels.items() if k != d.severity]
    return _qcm(
        qid=f"dis-sev-{d.slug}",
        topic="Sévérité",
        prompt=f"Comment est classée la sévérité de : {d.name} ?",
        correct=correct,
        wrongs=wrongs,
        explanation=f"{d.name} est classée {correct.lower()}.",
        rng=rng,
    )


def _disease_symptom_q(rng, d, diseases):
    if not d.symptoms:
        return None
    correct_disease = d.name
    symptom = rng.choice(d.symptoms)
    others = [
        x.name
        for x in diseases
        if x.slug != d.slug and symptom not in (x.symptoms or [])
    ]
    if len(others) < 3:
        return None
    return _qcm(
        qid=f"sym-{d.slug}-{abs(hash(symptom)) % 9999}",
        topic="Symptômes",
        prompt=f"« {symptom} » est un symptôme caractéristique de quelle maladie ?",
        correct=correct_disease,
        wrongs=rng.sample(others, k=3),
        explanation=d.short_description,
        rng=rng,
    )


def _system_organ_q(rng, target_system, organs):
    in_sys = [o for o in organs if o.system == target_system]
    out_sys = [o for o in organs if o.system != target_system]
    if not in_sys or len(out_sys) < 3:
        return None
    correct = rng.choice(in_sys).name
    wrongs = rng.sample([o.name for o in out_sys], k=3)
    return _qcm(
        qid=f"sys-{target_system}-{abs(hash(correct)) % 9999}",
        topic="Systèmes",
        prompt=f"Quel organe appartient au système {_pretty_system(target_system)} ?",
        correct=correct,
        wrongs=wrongs,
        explanation=f"« {correct} » fait partie du système {_pretty_system(target_system)}.",
        rng=rng,
    )


def _glossary_q(rng, g, glossary):
    others = [
        x.definition.split(".")[0]
        for x in glossary
        if x.slug != g.slug and len(x.definition) > 20
    ]
    if len(others) < 3:
        return None
    correct = g.definition.split(".")[0]
    return _qcm(
        qid=f"glo-{g.slug}",
        topic="Glossaire",
        prompt=f"Que signifie : {g.term} ?",
        correct=correct,
        wrongs=rng.sample(others, k=3),
        explanation=g.definition,
        rng=rng,
    )


SYSTEM_PRETTY = {
    "nervous": "nerveux",
    "cardiovascular": "cardiovasculaire",
    "respiratory": "respiratoire",
    "digestive": "digestif",
    "urinary": "urinaire",
    "endocrine": "endocrinien",
    "sensory": "sensoriel",
    "lymphatic": "lymphatique",
    "skeletal": "squelettique",
    "muscular": "musculaire",
    "integumentary": "tégumentaire",
}


def _pretty_system(s: str) -> str:
    return SYSTEM_PRETTY.get(s, s)


@router.get("")
def get_quiz(
    db: Session = Depends(get_db),
    n: int = Query(default=10, ge=3, le=20),
    topic: str | None = Query(default=None, description="Optional topic filter."),
) -> list[dict]:
    """Generate a fresh batch of quiz questions covering all templates.

    The optional ``topic`` filter narrows the question pool to a single
    template (``Anatomie``, ``Pathologie``, ``Catégorie``, ``Sévérité``,
    ``Symptômes``, ``Systèmes``, ``Glossaire``).
    """
    organs = db.execute(select(Organ)).scalars().all()
    diseases = db.execute(select(Disease)).scalars().all()
    glossary = db.execute(select(GlossaryEntry)).scalars().all()
    rng = random.Random()

    all_categories = sorted({d.category for d in diseases if d.category})
    all_systems = sorted({o.system for o in organs if o.system})

    candidates: list[dict] = []

    # Anatomy: organ → function
    for o in rng.sample(organs, k=len(organs)):
        q = _organ_function_q(rng, o, organs)
        if q:
            candidates.append(q)

    # Pathology: disease → main organ
    for d in rng.sample(diseases, k=len(diseases)):
        q = _disease_organ_q(rng, d, organs)
        if q:
            candidates.append(q)

    # Category: disease → category
    for d in rng.sample(diseases, k=len(diseases)):
        q = _disease_category_q(rng, d, all_categories)
        if q:
            candidates.append(q)

    # Severity: disease → severity
    for d in rng.sample(diseases, k=len(diseases)):
        q = _disease_severity_q(rng, d)
        if q:
            candidates.append(q)

    # Symptoms: symptom → disease
    for d in rng.sample(diseases, k=len(diseases)):
        q = _disease_symptom_q(rng, d, diseases)
        if q:
            candidates.append(q)

    # Systems: system → which organ belongs
    for sys in all_systems:
        for _ in range(2):
            q = _system_organ_q(rng, sys, organs)
            if q:
                candidates.append(q)

    # Glossary: term → definition
    for g in rng.sample(glossary, k=len(glossary)):
        q = _glossary_q(rng, g, glossary)
        if q:
            candidates.append(q)

    if topic:
        candidates = [q for q in candidates if q["topic"] == topic]

    rng.shuffle(candidates)
    return candidates[:n]


@router.get("/topics")
def list_topics() -> list[str]:
    """List the supported quiz topic names — used by the frontend filter UI."""
    return [
        "Anatomie",
        "Pathologie",
        "Catégorie",
        "Sévérité",
        "Symptômes",
        "Systèmes",
        "Glossaire",
    ]
