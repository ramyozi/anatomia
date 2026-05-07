"""Smoke tests — assert that all API routes return 200 with seeded data."""

import os

os.environ.setdefault("DATABASE_URL", "sqlite:///./test_anatomia.db")

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture(scope="module")
def client() -> TestClient:
    with TestClient(app) as c:
        yield c


def test_health(client: TestClient) -> None:
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_organs_list(client: TestClient) -> None:
    r = client.get("/api/organs")
    assert r.status_code == 200
    items = r.json()
    assert len(items) >= 10
    assert {"slug", "name", "system", "shortDescription"}.issubset(items[0])


def test_organ_detail(client: TestClient) -> None:
    r = client.get("/api/organs/coeur")
    assert r.status_code == 200
    body = r.json()
    assert body["name"] == "Cœur"
    assert any(s["slug"].startswith("ventricule") for s in body["subOrgans"])


def test_diseases_list_filters(client: TestClient) -> None:
    r = client.get("/api/diseases?category=Cardiovasculaire")
    assert r.status_code == 200
    for d in r.json():
        assert d["category"] == "Cardiovasculaire"


def test_disease_detail(client: TestClient) -> None:
    r = client.get("/api/diseases/infarctus-myocarde")
    assert r.status_code == 200
    body = r.json()
    assert body["severity"] == "critical"
    assert body["epidemiology"]["globalCases"] > 0
    assert len(body["timeline"]) > 0


def test_world_burden(client: TestClient) -> None:
    r = client.get("/api/world/burden")
    assert r.status_code == 200
    items = r.json()
    assert len(items) >= 10
    assert {"countryCode", "per100k"}.issubset(items[0])


def test_country_detail(client: TestClient) -> None:
    r = client.get("/api/countries/FRA")
    assert r.status_code == 200
    body = r.json()
    assert body["name"] == "France"
    assert len(body["topDiseases"]) > 0


def test_search_fuzzy(client: TestClient) -> None:
    r = client.get("/api/search?q=coeur")
    assert r.status_code == 200
    results = r.json()
    assert len(results) > 0


def test_quiz_generation(client: TestClient) -> None:
    r = client.get("/api/quiz?n=5")
    assert r.status_code == 200
    qs = r.json()
    assert len(qs) == 5
    for q in qs:
        choice_ids = {c["id"] for c in q["choices"]}
        assert q["correctChoiceId"] in choice_ids


def test_stats_global(client: TestClient) -> None:
    r = client.get("/api/stats/global")
    assert r.status_code == 200
    body = r.json()
    assert body["totalDiseasesTracked"] > 0
    assert len(body["burdenTimeline"]) > 0
    assert len(body["topKillers"]) > 0
