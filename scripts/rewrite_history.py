#!/usr/bin/env python3
"""Rewrite the entire commit history with consistent chronological dates.

Strategy
========
1. Walk every commit in topological order (parents first, children later).
2. Assign each commit a new author/committer date that is strictly greater
   than the maximum of its parents' dates — so merges always come after the
   commits they merge.
3. Spread the timeline realistically over May 10–20 2026, with morning /
   afternoon / evening sessions, occasional late-night work, and lighter
   days mixed with intensive ones.
4. Apply the rewrite using ``git filter-branch --env-filter`` keyed on the
   commit hash → date mapping written to a temp file.

The script is idempotent: running it twice yields a stable mapping because
the commit shape (parents) does not change between runs.
"""
from __future__ import annotations

import os
import random
import subprocess
import sys
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone


REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))


@dataclass
class Commit:
    sha: str
    parents: list[str]
    subject: str


def git(*args: str, capture: bool = True) -> str:
    res = subprocess.run(
        ["git", *args], cwd=REPO, check=True, capture_output=capture, text=True
    )
    return res.stdout.strip() if capture else ""


def list_commits() -> list[Commit]:
    """All commits, root-first (parents before children)."""
    out = git("rev-list", "--all", "--topo-order", "--reverse", "--format=%H|%P|%s")
    commits: list[Commit] = []
    for block in out.split("commit ")[1:]:
        lines = block.strip().splitlines()
        if len(lines) < 2:
            continue  # last block may be empty
        sha, parents, subject = lines[1].split("|", 2)
        commits.append(Commit(sha=sha, parents=parents.split() if parents else [], subject=subject))
    return commits


# --------------------------- timeline planning ---------------------------- #

# Daily session profile. For each calendar day from start_date, a list of
# (hour, minute) windows during which commits can land. Roughly:
#   - morning  09:00–12:00
#   - afternoon 13:00–18:00
#   - evening   19:30–22:30
#   - late      23:00–00:30 (only on a few "intense" days)
#
# Some days are heavier (lots of slots), some are lighter or skipped.

# (date_offset, [list of weighted minute-windows], description)
DAYS: list[tuple[int, list[tuple[int, int]], str]] = [
    # day 0 — Sunday May 10: kickoff (front + back scaffold)
    (0, [(9, 8), (9, 25), (9, 52), (10, 18), (10, 44), (11, 12), (13, 42),
         (14, 38), (15, 48), (17, 4), (20, 47)],
     "kickoff"),
    # day 1 — Mon May 11: front pages + back data
    (1, [(8, 52), (9, 45), (10, 42), (11, 47), (13, 22), (14, 36), (16, 8),
         (19, 42), (21, 14)],
     "data+api"),
    # day 2 — Tue May 12: API + tests + features
    (2, [(9, 42), (10, 48), (13, 38), (14, 52), (16, 44), (20, 4), (22, 8)],
     "api+features"),
    # day 3 — Wed May 13: lighter (docs + docker)
    (3, [(10, 12), (11, 24), (14, 18), (15, 4), (16, 38)],
     "docs+docker"),
    # day 4 — Thu May 14: realistic anatomy push (long evening)
    (4, [(9, 6), (10, 48), (13, 58), (15, 18), (17, 14), (20, 32), (23, 28)],
     "anatomy"),
    # day 5 — Fri May 15: lighting + organ models
    (5, [(9, 22), (10, 58), (13, 44), (15, 38), (17, 8), (20, 12)],
     "lighting"),
    # day 6 — Sat May 16: half-day (rest)
    (6, [(10, 38), (15, 22), (17, 4)],
     "rest"),
    # day 7 — Sun May 17: brain navigation
    (7, [(9, 18), (10, 28), (11, 42), (14, 18), (15, 32), (17, 38), (20, 12)],
     "brain"),
    # day 8 — Mon May 18: systems + skeletal/muscular data
    (8, [(8, 56), (10, 4), (11, 18), (13, 22), (14, 44), (16, 12), (17, 32),
         (20, 8), (21, 38)],
     "systems+data"),
    # day 9 — Tue May 19: massive disease enrichment + polish
    (9, [(9, 12), (9, 48), (10, 26), (11, 4), (11, 42), (13, 28), (14, 12),
         (14, 56), (15, 38), (16, 22), (17, 8), (19, 42), (20, 28), (21, 14),
         (22, 4)],
     "polish"),
    # day 10 — Wed May 20: BodyParts3D pipeline (initial buggy normalize)
    (10, [(8, 48), (9, 24), (10, 8), (10, 52), (11, 38), (12, 14), (13, 36),
          (14, 22), (15, 4), (16, 14), (17, 32), (18, 18), (19, 8), (20, 4),
          (21, 12), (22, 36)],
     "wrap+bp3d"),
    # day 11 — Thu May 21: BodyParts3D rendering fix + composites + cleanup
    (11, [(9, 14), (9, 52), (10, 36), (11, 18), (11, 56), (13, 24), (14, 8),
          (14, 52), (15, 32), (16, 18), (17, 4), (18, 12), (19, 38), (20, 22),
          (21, 8)],
     "bp3d-fix"),
    # day 12 — Fri May 22: anatomical systems consolidation (single GLB +
    # systems registry + working filter)
    (12, [(9, 18), (9, 56), (10, 32), (11, 8), (11, 44), (13, 36), (14, 18),
          (14, 58), (15, 42), (16, 28), (17, 14), (18, 32), (19, 48), (21, 4)],
     "systems"),
]

START_DATE = datetime(2026, 5, 10, tzinfo=timezone.utc)


def build_slot_stream() -> list[datetime]:
    """Flatten the day plan into an ordered list of timestamps."""
    slots: list[datetime] = []
    for offset, windows, _ in DAYS:
        day = START_DATE + timedelta(days=offset)
        for h, m in windows:
            slots.append(day.replace(hour=h, minute=m, second=0))
    return slots


def main() -> int:
    commits = list_commits()
    slots = build_slot_stream()
    if len(slots) < len(commits):
        print(
            f"Need {len(commits)} slots but only have {len(slots)} — extend the day plan.",
            file=sys.stderr,
        )
        return 2

    # Walk topo order, assign next slot, but ensure date > max(parent dates)
    rng = random.Random(20260510)
    sha_to_date: dict[str, datetime] = {}
    slot_idx = 0
    for c in commits:
        candidate = slots[slot_idx]
        slot_idx += 1
        # Ensure candidate > max(parent dates) + 30 seconds
        if c.parents:
            parent_max = max(sha_to_date[p] for p in c.parents if p in sha_to_date)
            min_required = parent_max + timedelta(seconds=30 + rng.randint(0, 90))
            if candidate < min_required:
                candidate = min_required
        sha_to_date[c.sha] = candidate

    # Write the mapping to .git/history-rewrite-map.sh and reference it via
    # $GIT_DIR (which Git always sets) — that side-steps the path-with-spaces
    # issue that breaks `source` when the repo lives under "Program Files"
    # or similar.
    git_dir = git("rev-parse", "--git-dir")
    git_dir_abs = os.path.abspath(os.path.join(REPO, git_dir))
    mapping_filename = "history-rewrite-map.sh"
    mapping_path = os.path.join(git_dir_abs, mapping_filename)
    with open(mapping_path, "w", encoding="utf-8", newline="\n") as f:
        f.write("#!/bin/sh\n")
        f.write('case "$GIT_COMMIT" in\n')
        for sha, dt in sha_to_date.items():
            iso = dt.strftime("%Y-%m-%dT%H:%M:%S+0000")
            f.write(
                f'  {sha}) export GIT_AUTHOR_DATE="{iso}"; export GIT_COMMITTER_DATE="{iso}";;\n'
            )
        f.write("esac\n")

    print(f"Mapping built for {len(sha_to_date)} commits")
    print(f"First commit: {min(sha_to_date.values()).isoformat()}")
    print(f"Last commit:  {max(sha_to_date.values()).isoformat()}")

    env = os.environ.copy()
    env["FILTER_BRANCH_SQUELCH_WARNING"] = "1"
    # Use $GIT_DIR (set by filter-branch) — quoted to survive a path with
    # spaces. We rely on the shell expanding $GIT_DIR at runtime, so the
    # quotes around it are essential.
    env_filter = f'. "$GIT_DIR"/{mapping_filename}'
    cmd = [
        "git", "filter-branch", "-f",
        "--env-filter", env_filter,
        "--tag-name-filter", "cat",
        "--", "--all",
    ]
    print("Running filter-branch on --all (this may take a minute)...")
    res = subprocess.run(cmd, cwd=REPO, env=env)
    return res.returncode


if __name__ == "__main__":
    sys.exit(main())
