"""Pull WHO Global Health Observatory indicators per country.

The GHO OData endpoint:
    https://ghoapi.azureedge.net/api/<INDICATOR>?$filter=...&$select=...

This script is intentionally narrow — it only refreshes the
"life expectancy at birth" indicator (WHOSIS_000001) for the countries
already in our DB. Each call is cached 30 days.
"""

from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Country
from app.scripts.ingest.base import Ingestor, RunStats

INDICATORS = {
    "life_expectancy": "WHOSIS_000001",  # Life expectancy at birth (years)
}


class WhoGhoIngestor(Ingestor):
    source_name = "who_gho"

    def execute(self, target: str, session: Session, stats: RunStats) -> None:
        countries = session.execute(select(Country)).scalars().all()
        codes = {c.code: c for c in countries}

        # Fetch the global indicator and pick out the latest year per country.
        url = (
            "https://ghoapi.azureedge.net/api/"
            f"{INDICATORS['life_expectancy']}"
            "?$filter=Dim1 eq 'BTSX'"
        )
        payload = self.cached_json(session, key="life_expectancy:BTSX", url=url, ttl_seconds=30 * 86400)
        if not payload:
            stats.skipped += len(countries)
            return

        latest_per_country: dict[str, tuple[int, float]] = {}
        for row in payload.get("value", []):
            country_code = row.get("SpatialDim")
            year = row.get("TimeDim")
            value = row.get("NumericValue")
            if not country_code or year is None or value is None:
                continue
            best = latest_per_country.get(country_code)
            if best is None or year > best[0]:
                latest_per_country[country_code] = (int(year), float(value))

        for code, (year, value) in latest_per_country.items():
            country = codes.get(code)
            if country is None:
                continue
            if abs(country.life_expectancy - value) > 0.01:
                country.life_expectancy = value
                stats.updated += 1
            country.notes = (
                f"Espérance de vie OMS/GHO {year} : {value:.1f} ans"
                if not country.notes or "OMS/GHO" in (country.notes or "")
                else country.notes
            )
        session.commit()


def main() -> int:
    ing = WhoGhoIngestor()
    s = ing.run("all")
    print(f"who_gho: updated={s.updated} skipped={s.skipped}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
