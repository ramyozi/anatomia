#!/usr/bin/env python3
"""Convert curated BodyParts3D STL meshes to compact GLB models.

Two output modes
================
- ``solo``   — one GLB per organ, recentered & rescaled to fit roughly
               inside a unit cube. Suited to single-organ viewers.
- ``frame``  — one GLB per assembly, keeping BodyParts3D world coordinates
               so the parts line up coherently. The whole assembly is
               then translated/scaled as a unit so the camera can zoom.

Pipeline (per mesh):
1. Load STL with ``trimesh``.
2. (BodyParts3D ships in millimetres with a head-up orientation; we leave
   that intact during merge and apply transforms at the very end.)
3. Decimate via ``fast_simplification`` to a per-spec triangle budget.
4. Recompute normals.
5. Export binary GLB (vertex-colored) with embedded buffers.
"""
from __future__ import annotations

import json
import os
import sys
from dataclasses import dataclass, field

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
    slug: str
    fma_id: str
    parts: list[str]
    target_triangles: int = 30_000
    color: str = "#c84545"
    label: str = ""
    keep_world_frame: bool = False  # used when this slug is part of a composite
    composite_with: list[str] = field(default_factory=list)  # other slugs to merge


# Curated solo organs (one GLB each, recentered + scaled to unit cube).
MODELS: list[ModelSpec] = [
    ModelSpec("coeur",     "FMA7274",  ["FMA7274"],                target_triangles=45_000, color="#c84545", label="Wall of heart"),
    ModelSpec("cervelet",  "FMA67944", ["FMA67944"],               target_triangles=40_000, color="#caa3c7", label="Cerebellum"),
    ModelSpec("hippocampe","FMA62493", ["FMA72713", "FMA72714"],   target_triangles=15_000, color="#e8c1ff", label="Hippocampus L+R"),
    ModelSpec("thalamus",  "FMA62007", ["FMA258714", "FMA258716"], target_triangles=15_000, color="#a78bfa", label="Thalamus L+R"),
    ModelSpec("hypothalamus","FMA62008",["FMA62008nsn"],           target_triangles=12_000, color="#fbbf77", label="Hypothalamus"),
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


# Composite assemblies — multiple BodyParts3D primitives merged in their
# native frame, then normalized as a unit. The slug names are used directly
# as GLB filenames.
@dataclass
class CompositeSpec:
    slug: str
    label: str
    parts: list[tuple[str, str, str]]  # (region_slug, fma_id, color)
    target_triangles_per_part: int = 18_000


COMPOSITES: list[CompositeSpec] = [
    CompositeSpec(
        slug="cerveau",
        label="Brain (cerebellum + midbrain + thalami + hippocampi)",
        # Anatomically-tuned palette: shades of pinkish-gray for cortical
        # tissue, slight color differentiation for sub-cortical regions.
        # No saturated rainbow.
        parts=[
            ("cervelet",    "FMA67944",  "#c2a09a"),  # cerebellum — pinkish gray
            ("midbrain",    "FMA61993nsn","#b48f8a"),  # midbrain — slightly darker
            ("thalamus-d",  "FMA258714", "#d8b4a8"),  # right thalamus — warm tan
            ("thalamus-g",  "FMA258716", "#d8b4a8"),  # left thalamus
            ("hippocampe-d","FMA72713",  "#a98273"),  # right hippocampus — deeper
            ("hippocampe-g","FMA72714",  "#a98273"),  # left hippocampus
            ("hypothalamus","FMA62008nsn","#cea38f"), # hypothalamus
            ("fornix",      "FMA61970",  "#bfa090"),  # commissure of fornix
            ("peduncle",    "FMA62394",  "#b89084"),  # peduncle of midbrain
        ],
        target_triangles_per_part=14_000,
    ),
    CompositeSpec(
        slug="thorax",
        label="Thoracic block (heart + lungs + diaphragm)",
        parts=[
            ("coeur",       "FMA7274",   "#c84545"),  # heart wall
            ("trachea",     "FMA7394",   "#9af2e4"),
            ("lung-up-r",   "FMA7333",   "#b76a78"),
            ("lung-mid-r",  "FMA7383",   "#b76a78"),
            ("lung-low-r",  "FMA7337",   "#b76a78"),
            ("lung-up-l",   "FMA7370",   "#b76a78"),
            ("lung-low-l",  "FMA7371",   "#b76a78"),
            ("diaphragm",   "FMA13295",  "#a83c3c"),
        ],
        target_triangles_per_part=12_000,
    ),
    CompositeSpec(
        slug="abdomen",
        label="Abdominal block (liver + stomach + spleen + kidneys + pancreas + gallbladder + bladder)",
        parts=[
            ("liver",       "FMA7197",   "#7a3a2a"),
            ("stomach",     "FMA7148",   "#c47a4a"),
            ("spleen",      "FMA7196",   "#7a3447"),
            ("kidney-r",    "FMA7204",   "#8a3636"),
            ("kidney-l",    "FMA7205",   "#8a3636"),
            ("pancreas",    "FMA7198nsn","#e9b87b"),
            ("gallbladder", "FMA7202",   "#2c8d4e"),
            ("bladder",     "FMA15900",  "#e9d6a8"),
            ("esophagus",   "FMA7131",   "#d99268"),
        ],
        target_triangles_per_part=14_000,
    ),
    CompositeSpec(
        slug="squelette",
        label="Skeleton (axial + appendicular major bones)",
        parts=[
            ("scapula-r",   "FMA13395",  "#efe7d4"),
            ("scapula-l",   "FMA13396",  "#efe7d4"),
            ("humerus-r",   "FMA23130",  "#efe7d4"),
            ("humerus-l",   "FMA23131",  "#efe7d4"),
            ("femur-r",     "FMA24474",  "#efe7d4"),
            ("femur-l",     "FMA24475",  "#efe7d4"),
            ("tibia-r",     "FMA24477",  "#efe7d4"),
            ("tibia-l",     "FMA24478",  "#efe7d4"),
            ("sacrum",      "FMA16202",  "#efe7d4"),
            ("mandible",    "FMA52748",  "#efe7d4"),
            ("sternum",     "FMA7487",   "#efe7d4"),
            ("vertebra-l1", "FMA13072",  "#efe7d4"),
            ("vertebra-l2", "FMA13073",  "#efe7d4"),
            ("vertebra-l3", "FMA13074",  "#efe7d4"),
            ("vertebra-l4", "FMA13075",  "#efe7d4"),
            ("vertebra-l5", "FMA13076",  "#efe7d4"),
        ],
        target_triangles_per_part=10_000,
    ),
    # The single source of truth for the whole-body view: every BP3D
    # primitive we ship, kept in BodyParts3D's native frame so they line up
    # anatomically. The whole assembly is normalized as ONE block at the
    # end, so the scale is unique across all parts. The frontend filters
    # which regions are visible per system, instead of stacking GLBs.
    CompositeSpec(
        slug="human-body",
        label="Whole-body anatomical assembly (all primitives in native frame)",
        parts=[
            # nervous (system="nervous")
            ("brain__cerebellum",    "FMA67944",   "#c2a09a"),
            ("brain__midbrain",      "FMA61993nsn","#b48f8a"),
            ("brain__thalamus-r",    "FMA258714",  "#d8b4a8"),
            ("brain__thalamus-l",    "FMA258716",  "#d8b4a8"),
            ("brain__hippocampus-r", "FMA72713",   "#a98273"),
            ("brain__hippocampus-l", "FMA72714",   "#a98273"),
            ("brain__hypothalamus",  "FMA62008nsn","#cea38f"),
            ("brain__fornix",        "FMA61970",   "#bfa090"),
            ("brain__peduncle",      "FMA62394",   "#b89084"),
            ("nervous__spinal-canal","FMA78497",   "#c4a4ff"),
            # cardiovascular
            ("cardio__heart",        "FMA7274",    "#a83c3c"),
            # respiratory
            ("respi__trachea",       "FMA7394",    "#7eb3b7"),
            ("respi__lung-up-r",     "FMA7333",    "#bf8590"),
            ("respi__lung-mid-r",    "FMA7383",    "#b87c87"),
            ("respi__lung-low-r",    "FMA7337",    "#a06b76"),
            ("respi__lung-up-l",     "FMA7370",    "#bf8590"),
            ("respi__lung-low-l",    "FMA7371",    "#a06b76"),
            ("respi__diaphragm",     "FMA13295",   "#aa4c4c"),
            # digestive
            ("digestive__esophagus", "FMA7131",    "#c89274"),
            ("digestive__stomach",   "FMA7148",    "#c47a4a"),
            ("digestive__liver",     "FMA7197",    "#7a3a2a"),
            ("digestive__gallbladder","FMA7202",   "#5a8a4a"),
            ("digestive__pancreas",  "FMA7198nsn", "#d6a878"),
            ("digestive__spleen",    "FMA7196",    "#7a3447"),
            # urinary
            ("urinary__kidney-r",    "FMA7204",    "#7a3a3a"),
            ("urinary__kidney-l",    "FMA7205",    "#7a3a3a"),
            ("urinary__bladder",     "FMA15900",   "#cfb78c"),
            # endocrine
            ("endocrine__thyroid-cart","FMA55099", "#e0bf8a"),
            # sensory
            ("sensory__eye",         "FMA12513",   "#9ab8b8"),
            # skeletal — we keep them under skeletal.* so the system filter
            # picks them up cleanly via the prefix.
            ("skeletal__scapula-r",  "FMA13395",   "#efe7d4"),
            ("skeletal__scapula-l",  "FMA13396",   "#efe7d4"),
            ("skeletal__humerus-r",  "FMA23130",   "#efe7d4"),
            ("skeletal__humerus-l",  "FMA23131",   "#efe7d4"),
            ("skeletal__femur-r",    "FMA24474",   "#efe7d4"),
            ("skeletal__femur-l",    "FMA24475",   "#efe7d4"),
            ("skeletal__tibia-r",    "FMA24477",   "#efe7d4"),
            ("skeletal__tibia-l",    "FMA24478",   "#efe7d4"),
            ("skeletal__sacrum",     "FMA16202",   "#efe7d4"),
            ("skeletal__mandible",   "FMA52748",   "#efe7d4"),
            ("skeletal__sternum",    "FMA7487",    "#efe7d4"),
            ("skeletal__vertebra-l1","FMA13072",   "#efe7d4"),
            ("skeletal__vertebra-l2","FMA13073",   "#efe7d4"),
            ("skeletal__vertebra-l3","FMA13074",   "#efe7d4"),
            ("skeletal__vertebra-l4","FMA13075",   "#efe7d4"),
            ("skeletal__vertebra-l5","FMA13076",   "#efe7d4"),
        ],
        target_triangles_per_part=8_000,
    ),
]


# ---------------------------- conversion core ---------------------------- #


def _load_stl(stem: str) -> trimesh.Trimesh:
    path = os.path.join(BP3D_STL_DIR, f"{stem}.stl")
    m = trimesh.load(path, force="mesh")
    if isinstance(m, trimesh.Scene):
        m = trimesh.util.concatenate(list(m.geometry.values()))
    return m


def _decimate(mesh: trimesh.Trimesh, target: int) -> trimesh.Trimesh:
    if len(mesh.faces) <= target:
        return mesh
    try:
        return mesh.simplify_quadric_decimation(face_count=target)
    except Exception as exc:  # noqa: BLE001
        print(
            f"  ! decimation skipped ({exc}); shipping {len(mesh.faces)} faces",
            file=sys.stderr,
        )
        return mesh


def _normalize_unit(mesh: trimesh.Trimesh) -> trimesh.Trimesh:
    """Recenter mesh on the origin and rescale so its largest dimension
    fits in [-1, 1] (i.e. bounding box ~ 2 units across).

    Crucial fix from the previous version: translation must happen on the
    raw vertices BEFORE the scale, so the centered mesh stays at origin.
    """
    bounds = mesh.bounds
    center = bounds.mean(axis=0)
    extent = float(np.max(bounds[1] - bounds[0]))
    if extent < 1e-6:
        return mesh
    mesh.apply_translation(-center)
    mesh.apply_scale(2.0 / extent)
    return mesh


def _color_mesh(mesh: trimesh.Trimesh, color_hex: str) -> None:
    color = trimesh.visual.color.hex_to_rgba(color_hex)
    mesh.visual = trimesh.visual.ColorVisuals(
        mesh, vertex_colors=np.tile(color, (len(mesh.vertices), 1))
    )


def _export_glb(mesh: trimesh.Trimesh, out_path: str) -> int:
    glb = mesh.export(file_type="glb")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "wb") as f:
        f.write(glb)
    return len(glb)


def convert_solo(spec: ModelSpec) -> dict | None:
    out_path = os.path.join(OUT_DIR, f"{spec.slug}.glb")
    meshes = []
    for stem in spec.parts:
        try:
            meshes.append(_load_stl(stem))
        except FileNotFoundError as exc:
            print(f"  ! {spec.slug}: missing {stem}: {exc}")
            return None
    mesh = meshes[0] if len(meshes) == 1 else trimesh.util.concatenate(meshes)

    before = len(mesh.faces)
    mesh = _decimate(mesh, spec.target_triangles)
    mesh = _normalize_unit(mesh)
    try:
        mesh.fix_normals()
    except Exception:  # noqa: BLE001
        pass
    _color_mesh(mesh, spec.color)
    size = _export_glb(mesh, out_path)
    return {
        "slug": spec.slug,
        "kind": "solo",
        "fmaId": spec.fma_id,
        "label": spec.label,
        "color": spec.color,
        "facesAfter": int(len(mesh.faces)),
        "facesBefore": int(before),
        "byteSize": size,
        "path": f"/models/anatomy/{spec.slug}.glb",
        "parts": spec.parts,
        "license": "CC BY-SA 2.1 JP — BodyParts3D, DBCLS",
    }


def convert_composite(spec: CompositeSpec) -> dict | None:
    """Build a multi-region assembly that keeps each part's native frame.

    We export a glTF scene with one node per region so the frontend can
    show / hide / highlight individual regions. The whole assembly is
    centered + rescaled as a single unit so it fits the camera.
    """
    out_path = os.path.join(OUT_DIR, f"{spec.slug}.glb")
    scene = trimesh.Scene()
    parts_meta: list[dict] = []

    # Pass 1 — load + decimate, accumulate to compute global bbox
    loaded: list[tuple[str, str, str, trimesh.Trimesh, int]] = []
    for region_slug, fma, color in spec.parts:
        try:
            m = _load_stl(fma)
        except FileNotFoundError as exc:
            print(f"  ! {spec.slug}: missing {fma}: {exc}")
            continue
        before = len(m.faces)
        m = _decimate(m, spec.target_triangles_per_part)
        try:
            m.fix_normals()
        except Exception:
            pass
        loaded.append((region_slug, fma, color, m, before))

    if not loaded:
        return None

    # Compute global bbox in BodyParts3D world coords
    all_bounds = np.array([m.bounds for *_, m, _ in loaded])
    global_min = all_bounds[:, 0, :].min(axis=0)
    global_max = all_bounds[:, 1, :].max(axis=0)
    center = (global_min + global_max) / 2.0
    extent = float(np.max(global_max - global_min))
    scale = 2.0 / extent if extent > 1e-6 else 1.0

    # Pass 2 — apply the same global transform to every part, color, attach
    for region_slug, fma, color, m, before in loaded:
        m.apply_translation(-center)
        m.apply_scale(scale)
        _color_mesh(m, color)
        scene.add_geometry(m, node_name=region_slug)
        parts_meta.append(
            {
                "regionSlug": region_slug,
                "fmaId": fma,
                "color": color,
                "facesAfter": int(len(m.faces)),
                "facesBefore": int(before),
            }
        )

    glb = scene.export(file_type="glb")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "wb") as f:
        f.write(glb)

    return {
        "slug": spec.slug,
        "kind": "composite",
        "fmaId": "composite",
        "label": spec.label,
        "color": "#7ee0d2",
        "facesAfter": sum(p["facesAfter"] for p in parts_meta),
        "facesBefore": sum(p["facesBefore"] for p in parts_meta),
        "byteSize": len(glb),
        "path": f"/models/anatomy/{spec.slug}.glb",
        "parts": [p["fmaId"] for p in parts_meta],
        "regions": parts_meta,
        "license": "CC BY-SA 2.1 JP — BodyParts3D, DBCLS",
    }


# --------------------------------- main --------------------------------- #


def main() -> int:
    if not os.path.isdir(BP3D_STL_DIR):
        print(f"BP3D STL dir not found: {BP3D_STL_DIR}", file=sys.stderr)
        return 1

    os.makedirs(OUT_DIR, exist_ok=True)
    registry: list[dict] = []
    total = 0

    for spec in MODELS:
        info = convert_solo(spec)
        if info:
            registry.append(info)
            total += info["byteSize"]
            print(
                f"  + solo {spec.slug:<14} {info['facesAfter']:>7} faces  {info['byteSize']/1024:.1f} KB"
            )

    for cspec in COMPOSITES:
        info = convert_composite(cspec)
        if info:
            registry.append(info)
            total += info["byteSize"]
            print(
                f"  + comp {cspec.slug:<14} {info['facesAfter']:>7} faces  {info['byteSize']/1024:.1f} KB ({len(info['regions'])} regions)"
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

    print(f"\nWrote {len(registry)} entries, total {total/1024/1024:.2f} MB")
    print(f"Registry: {META_FILE}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
