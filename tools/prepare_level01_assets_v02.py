#!/usr/bin/env python3
"""Prepare cleaned, manifest-driven Level 1 art from the extracted sources."""

from __future__ import annotations

import json
import shutil
from pathlib import Path

import numpy as np
from PIL import Image

from defringe_platforms_v02 import (
    ALPHA_CUTOFF,
    OPAQUE_SEED,
    nearest_opaque_sources,
)


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "source-assets/extracted_v01"
BACKGROUNDS = ROOT / "assets/environments/forest/backgrounds_v02"
DECORATIONS = ROOT / "assets/environments/forest/decorations_v02"
OBJECTS = ROOT / "assets/gameplay/forest/objects_v02"

# Rectangles are half-open pixel ranges. They target only verified foreign
# fragments that are spatially isolated from the intended illustration.
ARTIFACT_RECTS: dict[str, tuple[tuple[int, int, int, int], ...]] = {
    "decor_rocks.png": ((90, 0, 385, 70),),
    "decor_sign.png": ((0, 375, 80, 485),),
    "decor_tent.png": ((115, 0, 225, 42),),
    "obj_cloud.png": ((0, 315, 70, 400),),
    "obj_lantern.png": ((0, 175, 110, 340),),
}

DECORATION_SPECS: dict[str, dict[str, object]] = {
    "decor_bunting.png": {"pivot": [249, 488], "renderScale": 0.50, "layer": "back"},
    "decor_bush.png": {"pivot": [260, 491], "renderScale": 0.42, "layer": "back"},
    "decor_flowers.png": {"pivot": [251, 496], "renderScale": 0.32, "layer": "front"},
    "decor_grass.png": {"pivot": [255, 493], "renderScale": 0.28, "layer": "front"},
    "decor_rocks.png": {"pivot": [257, 490], "renderScale": 0.34, "layer": "front"},
    "decor_sign.png": {
        "pivot": [261, 481],
        "renderScale": 0.42,
        "layer": "front",
        "interaction": {"type": "repairable-sign", "radius": 96},
    },
    "decor_tent.png": {"pivot": [251, 491], "renderScale": 0.70, "layer": "back"},
    "decor_tree.png": {"pivot": [250, 496], "renderScale": 0.62, "layer": "back"},
}

OBJECT_SPECS: dict[str, dict[str, object]] = {
    "obj_apple.png": {
        "role": "collectible",
        "pivot": [268, 261],
        "renderScale": 0.20,
        "trigger": {"type": "circle", "center": [268, 261], "radius": 120},
    },
    "obj_cloud.png": {
        "role": "moving-platform",
        "pivot": [256, 388],
        "renderScale": 0.52,
        "walkable": [[90, 250], [130, 210], [184, 207], [215, 174], [258, 160], [300, 190], [340, 207], [386, 188], [445, 228]],
    },
    "obj_crate.png": {
        "role": "pushable-weight",
        "pivot": [259, 375],
        "renderScale": 0.30,
        "solid": {"type": "rect", "bounds": [116, 66, 402, 375]},
        "walkable": [[120, 66], [400, 66]],
    },
    "obj_lantern.png": {
        "role": "checkpoint",
        "pivot": [271, 455],
        "renderScale": 0.24,
        "trigger": {"type": "rect", "bounds": [145, 70, 405, 455]},
    },
    "obj_mud.png": {
        "role": "slow-hazard",
        "pivot": [264, 377],
        "renderScale": 0.30,
        "trigger": {"type": "ellipse", "center": [264, 304], "radius": [150, 67]},
    },
    "obj_mushroom.png": {
        "role": "bounce-pad",
        "pivot": [266, 490],
        "renderScale": 0.30,
        "trigger": {"type": "rect", "bounds": [105, 38, 425, 170]},
    },
    "obj_star.png": {
        "role": "optional-collectible",
        "pivot": [266, 262],
        "renderScale": 0.18,
        "trigger": {"type": "circle", "center": [266, 262], "radius": 122},
    },
    "obj_ticket.png": {
        "role": "festival-token",
        "pivot": [269, 258],
        "renderScale": 0.20,
        "trigger": {"type": "rect", "bounds": [115, 130, 425, 385]},
    },
}


def clean_rgba(source: Path, target: Path) -> list[int]:
    pixels = np.array(Image.open(source).convert("RGBA"))
    for left, top, right, bottom in ARTIFACT_RECTS.get(source.name, ()):
        pixels[top:bottom, left:right] = 0

    alpha = pixels[:, :, 3]
    visible = alpha > ALPHA_CUTOFF
    pixels[(alpha > 0) & ~visible] = 0
    source_y, source_x = nearest_opaque_sources(alpha, visible)
    fringe = visible & (alpha < OPAQUE_SEED) & (source_y >= 0)
    pixels[fringe, :3] = pixels[source_y[fringe], source_x[fringe], :3]
    pixels[~visible] = 0

    image = Image.fromarray(pixels, "RGBA")
    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target, optimize=True)
    bbox = image.getchannel("A").getbbox()
    if not bbox:
        raise ValueError(f"asset became empty: {source.name}")
    return list(bbox)


def build_manifest(directory: Path, specs: dict[str, dict[str, object]]) -> None:
    assets: dict[str, dict[str, object]] = {}
    for name, spec in specs.items():
        visible_bounds = clean_rgba(SOURCE / name, directory / name)
        assets[name] = {"visibleBounds": visible_bounds, **spec}
        print(f"{name}: visibleBounds={visible_bounds}")

    manifest = {
        "version": 2,
        "canvas": {"width": 512, "height": 512},
        "alphaCutoff": ALPHA_CUTOFF,
        "assets": assets,
    }
    (directory / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def main() -> None:
    BACKGROUNDS.mkdir(parents=True, exist_ok=True)
    background_target = BACKGROUNDS / "forest_valley.jpg"
    shutil.copy2(SOURCE / "bg_valley.jpg", background_target)
    with Image.open(background_target) as background:
        if background.mode != "RGB" or background.size != (1920, 1080):
            raise ValueError("forest background must be RGB 1920x1080")
    print("forest_valley.jpg: RGB 1920x1080")

    build_manifest(DECORATIONS, DECORATION_SPECS)
    build_manifest(OBJECTS, OBJECT_SPECS)


if __name__ == "__main__":
    main()
