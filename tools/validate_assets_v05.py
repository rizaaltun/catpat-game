#!/usr/bin/env python3
"""Validate the complete V05 art package used by the game."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
CHARACTER = ROOT / "assets/characters/catpat/animation_v03"
PLATFORMS = ROOT / "assets/environments/forest/platforms_v03"
BACKGROUND = ROOT / "assets/environments/forest/backgrounds_v02/forest_valley.jpg"
DECORATIONS = ROOT / "assets/environments/forest/decorations_v02"
OBJECTS = ROOT / "assets/gameplay/forest/objects_v03"
MECHANISMS = ROOT / "assets/gameplay/forest/mechanisms_v04"


def assert_rgba(path: Path, size: tuple[int, int]) -> Image.Image:
    image = Image.open(path)
    assert image.mode == "RGBA", f"{path}: expected RGBA, got {image.mode}"
    assert image.size == size, f"{path}: expected {size}, got {image.size}"
    alpha = image.getchannel("A")
    width, height = size
    corners = [alpha.getpixel(point) for point in ((0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1))]
    assert corners == [0, 0, 0, 0], f"{path}: opaque corner {corners}"
    visible = alpha.point(lambda value: 255 if value >= 8 else 0).getbbox()
    assert visible, f"{path}: empty alpha"
    left, top, right, bottom = visible
    margins = (left, top, width - right, height - bottom)
    assert min(margins) >= 8, f"{path}: clipped/unsafe alpha margin {margins}"
    return image


def validate_character() -> int:
    manifest = json.loads((CHARACTER / "animation_manifest.json").read_text())
    frame_paths = {
        path
        for clip in manifest["clips"].values()
        for path in clip["frames"]
    }
    assert len(frame_paths) == 14
    for relative in sorted(frame_paths):
        image = assert_rgba(CHARACTER / relative, (512, 640))
        bbox = image.getchannel("A").point(lambda value: 255 if value >= 8 else 0).getbbox()
        assert bbox and bbox[3] == manifest["pivot"]["y"], f"{relative}: feet baseline is {bbox}"
    return len(frame_paths)


def validate_platforms() -> int:
    manifest = json.loads((PLATFORMS / "platform_manifest.json").read_text())
    for name, metadata in manifest["assets"].items():
        image = assert_rgba(PLATFORMS / name, (768, 512))
        alpha = image.getchannel("A")
        assert sum(alpha.histogram()[1:9]) == 0, f"{name}: low-alpha residue"
        assert len(metadata["walkable"]) >= 2, f"{name}: missing walkable surface"
    return len(manifest["assets"])


def validate_manifest_assets(directory: Path, expected_count: int) -> int:
    manifest = json.loads((directory / "manifest.json").read_text())
    assert manifest["version"] in {2, 3}
    assert manifest["canvas"] == {"width": 512, "height": 512}
    assert len(manifest["assets"]) == expected_count

    for name, metadata in manifest["assets"].items():
        image = assert_rgba(directory / name, (512, 512))
        alpha = image.getchannel("A")
        assert sum(alpha.histogram()[1:9]) == 0, f"{name}: low-alpha residue"
        assert list(alpha.getbbox()) == metadata["visibleBounds"], f"{name}: stale visible bounds"
        pivot_x, pivot_y = metadata["pivot"]
        assert 0 <= pivot_x <= 512 and 0 <= pivot_y <= 512, f"{name}: invalid pivot"
        assert 0 < metadata["renderScale"] <= 1, f"{name}: invalid render scale"
    return len(manifest["assets"])


def validate_mechanisms() -> int:
    manifest = json.loads((MECHANISMS / "manifest.json").read_text())
    assert manifest["version"] == 4
    assert len(manifest["assets"]) == 4
    for name, metadata in manifest["assets"].items():
        image = assert_rgba(MECHANISMS / name, tuple(metadata["canvas"]))
        assert image.getchannel("A").getbbox(), f"{name}: empty alpha"
        assert 0 < metadata["renderScale"] <= 1, f"{name}: invalid render scale"
    assert "vine_lift.png" not in manifest["assets"]
    assert "motionPivot" in manifest["assets"]["swing_platform.png"]
    assert manifest["assets"]["festival_gate_frame.png"]["solid"]["type"] == "rect"
    return len(manifest["assets"])


def validate_level01_art() -> tuple[int, int, int]:
    with Image.open(BACKGROUND) as background:
        assert background.mode == "RGB"
        assert background.size == (1920, 1080)

    decorations = validate_manifest_assets(DECORATIONS, 8)
    objects = validate_manifest_assets(OBJECTS, 8)

    decoration_manifest = json.loads((DECORATIONS / "manifest.json").read_text())
    assert decoration_manifest["assets"]["decor_sign.png"]["interaction"]["type"] == "repairable-sign"

    object_manifest = json.loads((OBJECTS / "manifest.json").read_text())
    assert len(object_manifest["assets"]["obj_cloud.png"]["walkable"]) >= 2
    assert object_manifest["assets"]["obj_crate.png"]["solid"]["type"] == "rect"
    assert object_manifest["assets"]["obj_mud.png"]["trigger"]["type"] == "ellipse"
    assert object_manifest["assets"]["obj_mushroom.png"]["role"] == "bounce-pad"
    assert object_manifest["assets"]["obj_crate.png"]["animation"]["pivotLocked"] is True
    assert object_manifest["assets"]["obj_mushroom.png"]["animation"]["pivotLocked"] is True
    mechanisms = validate_mechanisms()
    return decorations, objects, mechanisms


def main() -> None:
    characters = validate_character()
    platforms = validate_platforms()
    decorations, objects, mechanisms = validate_level01_art()
    print(
        "asset validation: "
        f"{characters} character frames / {platforms} platforms / "
        f"{decorations} decorations / {objects} gameplay objects / "
        f"{mechanisms} mechanisms / 1 background OK"
    )


if __name__ == "__main__":
    main()
