"""Top-level entrypoint to run all ingestion scripts in sequence.

Usage:
    python -m app.scripts.ingest.runner
    python -m app.scripts.ingest.runner --only wikipedia
"""

from __future__ import annotations

import argparse
import sys

from app.scripts.ingest.who_gho import WhoGhoIngestor
from app.scripts.ingest.wikipedia import WikipediaIngestor

INGESTORS = {
    "wikipedia": WikipediaIngestor,
    "who_gho": WhoGhoIngestor,
}


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--only", action="append", help="Run only the given ingestor (repeatable).")
    args = parser.parse_args(argv)

    selected = args.only or list(INGESTORS.keys())
    overall_ok = True
    for name in selected:
        if name not in INGESTORS:
            print(f"unknown ingestor: {name}", file=sys.stderr)
            overall_ok = False
            continue
        ing = INGESTORS[name]()
        try:
            stats = ing.run("all")
            print(
                f"[{name}] inserted={stats.inserted} updated={stats.updated} skipped={stats.skipped}"
            )
        except Exception as exc:  # noqa: BLE001
            print(f"[{name}] FAILED: {exc}", file=sys.stderr)
            overall_ok = False
    return 0 if overall_ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
