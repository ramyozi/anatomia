#!/usr/bin/env python3
"""Convert a curated set of BodyParts3D STL meshes to compact GLB models.

Pipeline
========
1. Load STL with ``trimesh``.
2. Apply quadric decimation if the mesh is heavier than a per-organ target
   triangle budget (so the web stays fast).
3. Welding & normal recompute for clean shading.
4. Re-center & rescale so each model fits within a unit-ish bounding box,
   keeping its original anatomical orientation (Z up in BodyParts3D).
5. Export as binary GLB with embedded buffers (no external .bin).
6. Optional Draco compression via ``gltf-transform`` if available.

Usage:
    python scripts/convert_bp3d_to_glb.py
"""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
from dataclasses import dataclass

import numpy as np
import trimesh

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
BP3D_STL_DIR = os.path.join(
    REPO_ROOT, "assets-source", "BodyParts3D", "assets", "BodyParts3D_data", "stl"
)
OUT_DIR = os.path.join(REPO_ROOT, "frontend", "public", "models", "anatomy")
META_FILE = os.path.join(REPO_ROOT, "frontend", "src", "data", "anatomy-models.json")


@dataclass
class ModelSpec:
    slug: str  # local organ slug
    fma_id: str  # FMA identifier
    parts: list[str]  # one or more STL file basenames (without .stl)
    target_triangles: int = 30_000
    color: str = "#c84545"  # default tissue color hint
    label: str = ""


# --------------------------- curated catalogue --------------------------- #
#
# Each spec maps a domain organ to one or several BP3D primitives. When more
# than one primitive is provided, they are merged into a single GLB. The
# triangle budget controls the post-decimation density — bigger organs get
# more triangles, accessories less.

MODELS: list[ModelSpec] = [
    ModelSpec("coeur",     "FMA7274",  ["FMA7274"],                target_triangles=45_000, color="#c84545", label="Wall of heart"),
    ModelSpec("cerveau",   "FMA67944", ["FMA67944"],               target_triangles=40_000, color="#caa3c7", label="Cerebellum"),
    ModelSpec("hippocampe","FMA62493", ["FMA72713", "FMA72714"],   target_triangles=15_000, color="#e8c1ff", label="Hippocampus L+R"),
    ModelSpec("thalamus",  "FMA62007", ["FMA258714", "FMA258716"], target_triangles=15_000, color="#a78bfa", label="Thalamus L+R"),
    ModelSpec("hypothalamus","FMA62008","FMA62008nsn".split(),     target_triangles=12_000, color="#fbbf77", label="Hypothalamus"),
    ModelSpec("midbrain",  "FMA61993", ["FMA61993nsn"],            target_triangles=20_000, color="#caa3c7", label="Midbrain"),
    ModelSpec("poumons",   "FMA7195",  ["FMA7333", "FMA7383", "FMA7337", "FMA7370", "FMA7371"],
              target_triangles=50_000, color="#b76a78", label="Lungs (5 lobes)"),
    ModelSpec("foie",      "FMA7197",  ["FMA7197"],                target_triangles=25_000, color="#7a3a2a", label="Liver"),
    ModelSpec("estomac",   "FMA7148",  ["FMA7148"],                target_triangles=20_000, color="#c47a4a", label="Stomach"),
    ModelSpec("rate",      "FMA7196",  ["FMA7196"],                target_triangles=18_000, color="#7a3447", label="Spleen"),
    ModelSpec("reins",     "FMA7203",  ["FMA7204", "FMA7205"],     target_triangles=22_000, color="#8a3636", label="Kidneys L+R"),
    ModelSpec("vessie",    "FMA15900", ["FMA15900"],               target_triangles=12_000, color="#e9d6a8", label="Urinary bladder"),
    ModelSpec("oeil",      "FMA12513", ["FMA12513"],               target_triangles=20_000, color="#7ee0d2", label="Eyeball"),
    ModelSpec("pancreas",  "FMA7198",  ["FMA7198nsn"],             target_triangles=15_000, color="#e9b87b", label="Pancreas"),
    ModelSpec("vesicule",  "FMA7202",  ["FMA7202"],                target_triangles=10_000, color="#2c8d4e", label="Gallbladder"),
    ModelSpec("trachee",   "FMA7394",  ["FMA7394"],                target_triangles=15_000, color="#9af2e4", label="Trachea"),
    ModelSpec("oesophage", "FMA7131",  ["FMA7131"],                target_triangles=12_000, color="#d99268", label="Esophagus"),
    ModelSpec("diaphragme","FMA13295", ["FMA13295"],               target_triangles=35_000, color="#a83c3c", label="Diaphragm"),
    ModelSpec("femur-d",   "FMA24474", ["FMA24474"],               target_triangles=25_000, color="#e9e2cf", label="Right femur"),
    ModelSpec("femur-g",   "FMA24475", ["FMA24475"],               target_triangles=25_000, color="#e9e2cf", label="Left femur"),
    ModelSpec("tibia-d",   "FMA24477", ["FMA24477"],               target_triangles=20_000, color="#e9e2cf", label="Right tibia"),
    ModelSpec("tibia-g",   "FMA24478", ["FMA24478"],               target_triangles=20_000, color="#e9e2cf", label="Left tibia"),
    ModelSpec("humerus-d", "FMA23130", ["FMA23130"],               target_triangles=22_000, color="#e9e2cf", label="Right humerus"),
    ModelSpec("humerus-g", "FMA23131", ["FMA23131"],               target_triangles=22_000, color="#e9e2cf", label="Left humerus"),
    ModelSpec("scapula-d", "FMA13395", ["FMA13395"],               target_triangles=25_000, color="#e9e2cf", label="Right scapula"),
    ModelSpec("scapula-g", "FMA13396", ["FMA13396"],               target_triangles=25_000, color="#e9e2cf", label="Left scapula"),
    ModelSpec("sacrum",    "FMA16202", ["FMA16202"],               target_triangles=20_000, color="#e9e2cf", label="Sacrum"),
    ModelSpec("mandibule", "FMA52748", ["FMA52748"],               target_triangles=20_000, color="#e9e2cf", label="Mandible"),
    ModelSpec("sternum",   "FMA7487",  ["FMA7487"],                target_triangles=15_000, color="#e9e2cf", label="Body of sternum"),
    ModelSpec("thyroide",  "FMA55099", ["FMA55099"],               target_triangles=15_000, color="#e9c46a", label="Thyroid cartilage"),
    ModelSpec("vertebres", "FMA13076", ["FMA13076", "FMA13075", "FMA13074", "FMA13073", "FMA13072"],
              target_triangles=40_000, color="#e9e2cf", label="Lumbar vertebrae"),
]


# ---------------------------- conversion core ---------------------------- #


def load_and_merge(part_files: list[str]) -> trimesh.Trimesh:
    meshes: list[trimesh.Trimesh] = []
    for stem in part_files:
        path = os.path.join(BP3D_STL_DIR, f"{stem}.stl")
        m = trimesh.load(path, force="mesh")
        if isinstance(m, trimesh.Scene):
            m = trimesh.util.concatenate(list(m.geometry.values()))
        meshes.append(m)
    if len(meshes) == 1:
        return meshes[0]
    return trimesh.util.concatenate(meshes)


def decimate(mesh: trimesh.Trimesh, target: int) -> trimesh.Trimesh:
    if len(mesh.faces) <= target:
        return mesh
    # trimesh wraps the open3d / vtk decimator if either is installed; we
    # fall back to a pure-Python edge-collapse via .simplify_quadric_decimation
    # which is bundled when fast_simplification is available. If not, return
    # the mesh untouched but warn loudly.
    try:
        return mesh.simplify_quadric_decimation(face_count=target)
    except Exception as exc:  # noqa: BLE001
        print(
            f"  ! decimation skipped ({exc}); shipping {len(mesh.faces)} faces",
            file=sys.stderr,
        )
        return mesh


def normalize(mesh: trimesh.Trimesh) -> trimesh.Trimesh:
    """Center on origin, scale to unit-ish bounds, but keep aspect ratio.

    BodyParts3D models share a global coordinate frame so we keep the
    relative position when merging multiple parts. For a single-organ
    export we re-center to the origin so the viewer can zoom-fit easily.
    """
    bounds = mesh.bounds  # 2x3
    center = bounds.mean(axis=0)
    scale = float(np.linalg.norm(bounds[1] - bounds[0]))
    if scale < 1e-6:
        return mesh
    transform = np.eye(4)
    transform[:3, 3] = -center
    transform[:3, :3] /= scale / 2.0
    mesh.apply_transform(transform)
    return mesh


def export_glb(mesh: trimesh.Trimesh, out_path: str, color_hex: str) -> int:
    color = trimesh.visual.color.hex_to_rgba(color_hex)
    mesh.visual = trimesh.visual.ColorVisuals(
        mesh, vertex_colors=np.tile(color, (len(mesh.vertices), 1))
    )
    glb = mesh.export(file_type="glb")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "wb") as f:
        f.write(glb)
    return len(glb)


def maybe_draco(out_path: str) -> int | None:
    """Optional Draco compression via gltf-transform CLI (npx)."""
    if not shutil.which("npx"):
        return None
    compressed = out_path.replace(".glb", ".draco.glb")
    try:
        subprocess.run(
            ["npx", "--yes", "@gltf-transform/cli", "draco", out_path, compressed],
            check=True,
            capture_output=True,
        )
        size = os.path.getsize(compressed)
        os.replace(compressed, out_path)
        return size
    except Exception:
        return None


# --------------------------------- main --------------------------------- #


def main() -> int:
    if not os.path.isdir(BP3D_STL_DIR):
        print(f"BP3D STL dir not found: {BP3D_STL_DIR}", file=sys.stderr)
        return 1

    os.makedirs(OUT_DIR, exist_ok=True)
    registry: list[dict] = []
    total = 0

    for spec in MODELS:
        out_path = os.path.join(OUT_DIR, f"{spec.slug}.glb")
        try:
            mesh = load_and_merge(spec.parts)
        except FileNotFoundError as e:
            print(f"  - skip {spec.slug}: {e}")
            continue

        before_faces = len(mesh.faces)
        mesh = decimate(mesh, spec.target_triangles)
        mesh = normalize(mesh)
        # Some BP3D meshes have inconsistent winding; fix normals
        try:
            mesh.fix_normals()
        except Exception:
            pass

        size = export_glb(mesh, out_path, spec.color)
        total += size
        registry.append(
            {
                "slug": spec.slug,
                "fmaId": spec.fma_id,
                "label": spec.label,
                "color": spec.color,
                "facesAfter": int(len(mesh.faces)),
                "facesBefore": int(before_faces),
                "byteSize": size,
                "path": f"/models/anatomy/{spec.slug}.glb",
                "parts": spec.parts,
                "license": "CC BY-SA 2.1 JP — BodyParts3D, DBCLS",
            }
        )
        print(
            f"  + {spec.slug:<14} {len(mesh.faces):>7} faces  {size/1024:.1f} KB"
        )

    os.makedirs(os.path.dirname(META_FILE), exist_ok=True)
    with open(META_FILE, "w", encoding="utf-8") as f:
        json.dump(
            {
                "source": "BodyParts3D / Anatomography",
                "license": "CC BY-SA 2.1 JP",
                "citation": (
                    "Mitsuhashi N, Fujieda K, Tamura T, Kawamoto S, Takagi T, "
                    "Okubo K. BodyParts3D: 3D structure database for anatomical "
                    "concepts. Nucleic Acids Res. 2009;37(D782-5)."
                ),
                "models": registry,
            },
            f,
            ensure_ascii=False,
            indent=2,
        )

    print(f"\nWrote {len(registry)} models, total {total/1024/1024:.2f} MB")
    print(f"Registry: {META_FILE}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
