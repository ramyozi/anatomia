#!/usr/bin/env python3
"""Inventory available BodyParts3D STL assets — cross-reference STL files
with parts_list_e.txt to print id, size and English name for each.
"""
from __future__ import annotations

import os
import sys

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
BP3D_ROOT = os.path.join(REPO_ROOT, "assets-source", "BodyParts3D", "assets", "BodyParts3D_data")


def main() -> int:
    stl_dir = os.path.join(BP3D_ROOT, "stl")
    parts_file = os.path.join(BP3D_ROOT, "parts_list_e.txt")
    if not os.path.isdir(stl_dir):
        print(f"STL dir not found: {stl_dir}", file=sys.stderr)
        return 1

    # Load name mapping
    names: dict[str, str] = {}
    with open(parts_file, encoding="utf-8") as f:
        next(f)  # header
        for line in f:
            parts = line.rstrip("\n").split("\t")
            if len(parts) >= 2:
                names[parts[0]] = parts[1]

    available_files = [n for n in os.listdir(stl_dir) if n.endswith(".stl")]
    rows: list[tuple[str, int, str]] = []
    for fn in available_files:
        sid = fn[:-4]
        size = os.path.getsize(os.path.join(stl_dir, fn))
        name = names.get(sid, "(unknown)")
        rows.append((sid, size, name))

    # Filter for major organ-like names
    keywords = sys.argv[1:] or [
        "brain", "heart", "lung", "liver", "kidney", "stomach", "skin",
        "spleen", "pancreas", "intestine", "bladder", "skull", "spine",
        "femur", "tibia", "fibula", "humerus", "ribs", "sternum",
        "cerebellum", "hippocampus", "thalamus", "hypothalamus",
        "frontal lobe", "parietal lobe", "temporal lobe", "occipital lobe",
        "trachea", "esophagus", "diaphragm", "thyroid", "pelvis",
        "eyeball", "tongue", "spinal cord", "skeleton",
    ]
    matches = [r for r in rows if any(k in r[2].lower() for k in keywords)]
    matches.sort(key=lambda r: r[1], reverse=True)

    print(f"{'FMA':<14} {'Size':>10}  Name")
    print("-" * 80)
    for sid, size, name in matches[:120]:
        print(f"{sid:<14} {size:>10}  {name}")
    print(f"\n{len(rows)} total STL files; {len(matches)} match keywords")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
