import random

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Disease, Organ

router = APIRouter()


@router.get("")
def get_quiz(
    db: Session = Depends(get_db),
    n: int = Query(default=8, ge=3, le=20),
) -> list[dict]:
    organs = db.execute(select(Organ)).scalars().all()
    diseases = db.execute(select(Disease)).scalars().all()
    rng = random.Random()

    questions: list[dict] = []

    organ_pool = [o for o in organs if len(o.functions or []) > 0]
    for o in rng.sample(organ_pool, k=min(len(organ_pool), n // 2)):
        correct = (o.functions or [""])[0]
        wrong_pool = [
            f
            for other in organs
            if other.slug != o.slug
            for f in (other.functions or [])
        ]
        if len(wrong_pool) < 3:
            continue
        wrongs = rng.sample(wrong_pool, k=3)
        choices = [{"id": str(i), "label": label} for i, label in enumerate([correct, *wrongs])]
        rng.shuffle(choices)
        correct_id = next(c["id"] for c in choices if c["label"] == correct)
        questions.append(
            {
                "id": f"organ-{o.slug}",
                "topic": "Anatomie",
                "prompt": f"Quelle est l'une des fonctions principales de : {o.name} ?",
                "choices": choices,
                "correctChoiceId": correct_id,
                "explanation": o.short_description,
            }
        )

    disease_pool = [d for d in diseases if d.organs]
    needed = n - len(questions)
    for d in rng.sample(disease_pool, k=min(len(disease_pool), needed)):
        correct = d.organs[0]
        all_organs = [o.slug for o in organs if o.slug != correct]
        wrongs = rng.sample(all_organs, k=min(3, len(all_organs)))
        choices = [{"id": str(i), "label": label} for i, label in enumerate([correct, *wrongs])]
        rng.shuffle(choices)
        correct_id = next(c["id"] for c in choices if c["label"] == correct)
        questions.append(
            {
                "id": f"disease-{d.slug}",
                "topic": "Pathologie",
                "prompt": f"Quel organe est principalement touché par : {d.name} ?",
                "choices": choices,
                "correctChoiceId": correct_id,
                "explanation": d.short_description,
            }
        )

    rng.shuffle(questions)
    return questions[:n]
