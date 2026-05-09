"""Enrich each disease with a short Wikipedia summary.

Calls the public REST summary endpoint:
    https://en.wikipedia.org/api/rest_v1/page/summary/<title>

Cached 7 days in ``external_cache``; if the API is unreachable we keep the
last known payload silently.
"""

from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Disease
from app.scripts.ingest.base import Ingestor, RunStats

WIKI_TITLES = {
    "infarctus-myocarde": "Myocardial_infarction",
    "diabete-type-2": "Type_2_diabetes",
    "alzheimer": "Alzheimer's_disease",
    "asthme": "Asthma",
    "bpco": "Chronic_obstructive_pulmonary_disease",
    "cancer-poumon": "Lung_cancer",
    "avc": "Stroke",
    "hypertension": "Hypertension",
    "tuberculose": "Tuberculosis",
    "covid-19": "COVID-19",
    "depression": "Major_depressive_disorder",
    "obesite": "Obesity",
    "paludisme": "Malaria",
    "vih": "HIV/AIDS",
    "grippe": "Influenza",
    "parkinson": "Parkinson's_disease",
    "insuffisance-renale": "Chronic_kidney_disease",
    "hepatite-b": "Hepatitis_B",
    "cancer-sein": "Breast_cancer",
    "anxiete": "Anxiety_disorder",
    "sclerose-en-plaques": "Multiple_sclerosis",
    "polyarthrite-rhumatoide": "Rheumatoid_arthritis",
    "lupus": "Systemic_lupus_erythematosus",
    "sla": "Amyotrophic_lateral_sclerosis",
    "epilepsie": "Epilepsy",
    "migraine": "Migraine",
    "fibrillation-atriale": "Atrial_fibrillation",
    "insuffisance-cardiaque": "Heart_failure",
    "cancer-colorectal": "Colorectal_cancer",
    "leucemie": "Leukemia",
    "drepanocytose": "Sickle_cell_disease",
    "mucoviscidose": "Cystic_fibrosis",
    "cancer-prostate": "Prostate_cancer",
    "glaucome": "Glaucoma",
    "schizophrenie": "Schizophrenia",
    "trouble-bipolaire": "Bipolar_disorder",
    "anemie-ferriprive": "Iron-deficiency_anemia",
    "ostroporose": "Osteoporosis",
    "arthrose": "Osteoarthritis",
    "maladie-crohn": "Crohn's_disease",
    "thyroidite-hashimoto": "Hashimoto's_thyroiditis",
    "diabete-type-1": "Type_1_diabetes",
    "rougeole": "Measles",
    "cancer-foie": "Hepatocellular_carcinoma",
    "tdah": "Attention_deficit_hyperactivity_disorder",
    "autisme": "Autism_spectrum",
}


class WikipediaIngestor(Ingestor):
    source_name = "wikipedia"

    def execute(self, target: str, session: Session, stats: RunStats) -> None:
        diseases = (
            [session.get(Disease, target)]
            if target != "all"
            else session.execute(select(Disease)).scalars().all()
        )
        for d in diseases:
            if d is None:
                continue
            title = WIKI_TITLES.get(d.slug)
            if not title:
                stats.skipped += 1
                continue
            payload = self.cached_json(
                session,
                key=title,
                url=f"https://en.wikipedia.org/api/rest_v1/page/summary/{title}",
                ttl_seconds=7 * 86400,
            )
            if not payload:
                stats.skipped += 1
                continue
            extract = payload.get("extract")
            page_url = payload.get("content_urls", {}).get("desktop", {}).get("page")
            if not extract:
                stats.skipped += 1
                continue
            epi = dict(d.epidemiology or {})
            epi["wikipedia_summary"] = extract
            epi["wikipedia_url"] = page_url
            d.epidemiology = epi
            stats.updated += 1
        session.commit()


def main() -> int:
    ing = WikipediaIngestor()
    s = ing.run("all")
    print(f"wikipedia: updated={s.updated} skipped={s.skipped}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
