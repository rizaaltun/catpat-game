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
FRIENDS = ROOT / "assets/gameplay/forest/friends_v01"
MISSION_PROPS = ROOT / "assets/gameplay/forest/mission_props_v01"


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


def validate_sprite_sheets(directory: Path, manifest_name: str, expected_count: int) -> int:
    manifest = json.loads((directory / manifest_name).read_text())
    sheets = manifest.get("spriteSheets", {})
    assert len(sheets) == expected_count
    for name, metadata in sheets.items():
        frame_w, frame_h = metadata["frameSize"]
        frame_count = metadata["frameCount"]
        image = assert_rgba(directory / name, (frame_w * frame_count, frame_h))
        for index in range(frame_count):
            cell = image.crop((index * frame_w, 0, (index + 1) * frame_w, frame_h))
            bbox = cell.getchannel("A").point(lambda value: 255 if value >= 8 else 0).getbbox()
            assert bbox, f"{name}: frame {index} empty alpha"
            left, top, right, bottom = bbox
            margins = (left, top, frame_w - right, frame_h - bottom)
            assert min(margins) >= 12, f"{name}: frame {index} margin below 12px {margins}"
        pivot_x, pivot_y = metadata["pivot"]
        assert 0 <= pivot_x <= frame_w and 0 <= pivot_y <= frame_h, f"{name}: invalid pivot"
        assert 0 < metadata["renderScale"] <= 1, f"{name}: invalid render scale"
        assert len(metadata["sequence"]) == frame_count, f"{name}: sequence length mismatch"
    return len(sheets)


def validate_mechanisms() -> int:
    manifest = json.loads((MECHANISMS / "manifest.json").read_text())
    assert manifest["version"] == 4
    assert len(manifest["assets"]) == 4
    for name, metadata in manifest["assets"].items():
        image = assert_rgba(MECHANISMS / name, tuple(metadata["canvas"]))
        assert image.getchannel("A").getbbox(), f"{name}: empty alpha"
        assert 0 < metadata["renderScale"] <= 1, f"{name}: invalid render scale"
    assert "vine_lift.png" not in manifest["assets"]
    assert "pressure_button.png" not in manifest["assets"], "renamed to crate_pressure_plate.png in V06"
    assert "swing_platform.png" not in manifest["assets"], "renamed to swing_platform_complete.png in V06"
    assert "motionPivot" in manifest["assets"]["swing_platform_complete.png"]
    assert manifest["assets"]["festival_gate_frame.png"]["solid"]["type"] == "rect"
    return len(manifest["assets"])


def validate_friends() -> int:
    return validate_sprite_sheets(FRIENDS, "manifest.json", 3)


def validate_painted_assets(directory: Path, expected_count: int) -> int:
    """Like validate_manifest_assets, but for naturally anti-aliased art
    (externally illustrated, not the flat-cutout pipeline) — skips the
    zero-low-alpha-residue rule, since soft edges there are intentional."""
    manifest = json.loads((directory / "manifest.json").read_text())
    assert len(manifest["assets"]) == expected_count
    for name, metadata in manifest["assets"].items():
        image = assert_rgba(directory / name, (512, 512))
        visible = image.getchannel("A").point(lambda value: 255 if value >= 8 else 0).getbbox()
        assert list(visible) == metadata["visibleBounds"], f"{name}: stale visible bounds"
        pivot_x, pivot_y = metadata["pivot"]
        assert 0 <= pivot_x <= 512 and 0 <= pivot_y <= 512, f"{name}: invalid pivot"
        assert 0 < metadata["renderScale"] <= 1, f"{name}: invalid render scale"
    return len(manifest["assets"])


def validate_tree_growth_sheet() -> int:
    """The trunk deliberately touches the frame's bottom edge in every stage
    (pivot sits only 32px above it) so the tree plants exactly at the ground
    line with no floating gap — so unlike validate_sprite_sheets, the bottom
    margin is allowed down to 0; left/top/right still need real margin."""
    manifest = json.loads((MISSION_PROPS / "manifest.json").read_text())
    metadata = manifest["spriteSheets"]["tree_growth_sheet.png"]
    assert metadata["sequence"] == ["sprout", "sapling", "leafy", "apples"], "tree growth stages must be in order"
    frame_w, frame_h = metadata["frameSize"]
    frame_count = metadata["frameCount"]
    path = MISSION_PROPS / "tree_growth_sheet.png"
    image = Image.open(path)
    assert image.mode == "RGBA", f"{path}: expected RGBA, got {image.mode}"
    assert image.size == (frame_w * frame_count, frame_h), f"{path}: unexpected size {image.size}"
    alpha = image.getchannel("A")
    width, height = image.size
    corners = [alpha.getpixel(point) for point in ((0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1))]
    assert corners == [0, 0, 0, 0], f"{path}: opaque corner {corners}"
    for index in range(frame_count):
        cell = image.crop((index * frame_w, 0, (index + 1) * frame_w, frame_h))
        bbox = cell.getchannel("A").point(lambda value: 255 if value >= 8 else 0).getbbox()
        assert bbox, f"{path}: frame {index} empty alpha"
        left, top, right, bottom = bbox
        assert min(left, top, frame_w - right) >= 8, f"{path}: frame {index} side/top margin too tight {(left, top, frame_w - right)}"
    pivot_x, pivot_y = metadata["pivot"]
    assert 0 <= pivot_x <= frame_w and 0 <= pivot_y <= frame_h, f"{path}: invalid pivot"
    assert 0 < metadata["renderScale"] <= 1, f"{path}: invalid render scale"
    return 1


def validate_mission_props() -> int:
    props = validate_painted_assets(MISSION_PROPS, 3)
    sheets = validate_tree_growth_sheet()
    return props + sheets


def validate_level01_art() -> tuple[int, int, int]:
    with Image.open(BACKGROUND) as background:
        assert background.mode == "RGB"
        assert background.size == (1920, 1080)

    decorations = validate_manifest_assets(DECORATIONS, 8)
    objects = validate_manifest_assets(OBJECTS, 6)
    sheets = validate_sprite_sheets(OBJECTS, "manifest.json", 2)

    decoration_manifest = json.loads((DECORATIONS / "manifest.json").read_text())
    assert decoration_manifest["assets"]["decor_sign.png"]["interaction"]["type"] == "repairable-sign"

    object_manifest = json.loads((OBJECTS / "manifest.json").read_text())
    assert len(object_manifest["assets"]["obj_cloud.png"]["walkable"]) >= 2
    assert object_manifest["assets"]["obj_mud.png"]["trigger"]["type"] == "ellipse"
    assert object_manifest["spriteSheets"]["crate_push_sheet.png"]["solid"]["type"] == "rect"
    assert object_manifest["spriteSheets"]["mushroom_bounce_sheet.png"]["role"] == "bounce-pad"
    mechanisms = validate_mechanisms()
    return decorations, objects + sheets, mechanisms


def main() -> None:
    characters = validate_character()
    platforms = validate_platforms()
    decorations, objects, mechanisms = validate_level01_art()
    friends = validate_friends()
    mission_props = validate_mission_props()
    print(
        "asset validation: "
        f"{characters} character frames / {platforms} platforms / "
        f"{decorations} decorations / {objects} gameplay objects (incl. 2 sprite sheets) / "
        f"{mechanisms} mechanisms / {friends} friend sheets / {mission_props} mission props "
        "/ 1 background OK"
    )


if __name__ == "__main__":
    main()
