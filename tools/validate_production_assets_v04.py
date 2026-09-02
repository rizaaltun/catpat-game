#!/usr/bin/env python3
"""Validate the V04 production manifest and generated PNG groups.

Run during production:
    python tools/validate_production_assets_v04.py

Run as the final blocking gate:
    python tools/validate_production_assets_v04.py --require-complete

Validate only the manifest contract:
    python tools/validate_production_assets_v04.py --spec-only
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter
from pathlib import Path

from PIL import Image


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MANIFEST = PROJECT_ROOT / "assets/production_v04/asset_production_manifest.json"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--spec-only", action="store_true")
    parser.add_argument("--require-complete", action="store_true")
    return parser.parse_args()


def pattern_to_glob(pattern: str) -> str:
    return re.sub(r"\{[^}]+\}", "*", pattern)


def display_path(path: Path) -> str:
    try:
        return str(path.relative_to(PROJECT_ROOT))
    except ValueError:
        return str(path)


def load_manifest(path: Path) -> dict:
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def validate_spec(manifest: dict) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []
    groups = manifest.get("productionGroups", [])
    declared_total = manifest.get("expectedOutputImages")
    actual_total = sum(group.get("frameCount", 0) for group in groups)

    if manifest.get("schemaVersion") != 4:
        errors.append("schemaVersion must be 4")
    if not groups:
        errors.append("productionGroups is empty")
    if declared_total != actual_total:
        errors.append(
            f"expectedOutputImages={declared_total}, but production groups declare {actual_total}"
        )

    ids = [group.get("id") for group in groups]
    duplicates = sorted(name for name, count in Counter(ids).items() if count > 1)
    if duplicates:
        errors.append(f"duplicate group ids: {', '.join(duplicates)}")

    output_dirs = [group.get("outputDir") for group in groups]
    duplicate_dirs = sorted(
        name for name, count in Counter(output_dirs).items() if name and count > 1
    )
    if duplicate_dirs:
        errors.append(f"duplicate output directories: {', '.join(duplicate_dirs)}")

    rejected = set(manifest.get("rejectedAssets", []))
    for group in groups:
        group_id = group.get("id", "<missing-id>")
        required = ("category", "priority", "outputDir", "filenamePattern", "frameCount", "canvas", "pivot")
        for key in required:
            if key not in group:
                errors.append(f"{group_id}: missing {key}")

        count = group.get("frameCount")
        if not isinstance(count, int) or count < 1:
            errors.append(f"{group_id}: invalid frameCount {count!r}")

        canvas = group.get("canvas", [])
        pivot = group.get("pivot", [])
        if len(canvas) != 2 or any(not isinstance(value, int) or value <= 0 for value in canvas):
            errors.append(f"{group_id}: invalid canvas {canvas!r}")
        if len(pivot) != 2 or any(not isinstance(value, int) for value in pivot):
            errors.append(f"{group_id}: invalid pivot {pivot!r}")
        elif len(canvas) == 2 and not (0 <= pivot[0] < canvas[0] and 0 <= pivot[1] < canvas[1]):
            errors.append(f"{group_id}: pivot {pivot} lies outside canvas {canvas}")

        output_dir = group.get("outputDir", "")
        if not output_dir.startswith("assets/production_v04/"):
            errors.append(f"{group_id}: outputDir escapes production_v04")
        if output_dir in rejected:
            errors.append(f"{group_id}: outputDir points to a rejected asset")
        if "{" not in group.get("filenamePattern", ""):
            warnings.append(f"{group_id}: filenamePattern has no frame/variant token")

        event_frame = group.get("eventFrame")
        if event_frame is not None and isinstance(count, int):
            if not isinstance(event_frame, int) or not 0 <= event_frame < count:
                errors.append(f"{group_id}: eventFrame {event_frame!r} is outside 0..{count - 1}")

    return errors, warnings


def alpha_bounds(alpha: Image.Image, cutoff: int) -> tuple[int, int, int, int] | None:
    mask = alpha.point(lambda value: 255 if value > cutoff else 0)
    return mask.getbbox()


def validate_png(
    path: Path,
    canvas: list[int],
    minimum_margin: int,
    cutoff: int,
    corner_alpha: int,
) -> list[str]:
    errors: list[str] = []
    try:
        with Image.open(path) as image:
            image.load()
            if image.format != "PNG":
                errors.append(f"{display_path(path)}: format is {image.format}, expected PNG")
            if image.mode != "RGBA":
                errors.append(f"{display_path(path)}: mode is {image.mode}, expected RGBA")
                return errors
            if list(image.size) != canvas:
                errors.append(f"{display_path(path)}: size is {image.size}, expected {tuple(canvas)}")

            alpha = image.getchannel("A")
            width, height = image.size
            corners = (
                alpha.getpixel((0, 0)),
                alpha.getpixel((width - 1, 0)),
                alpha.getpixel((0, height - 1)),
                alpha.getpixel((width - 1, height - 1)),
            )
            if any(value != corner_alpha for value in corners):
                errors.append(f"{display_path(path)}: corner alpha values are {corners}, expected all {corner_alpha}")

            bounds = alpha_bounds(alpha, cutoff)
            if bounds is None:
                errors.append(f"{display_path(path)}: contains no visible pixels above alpha cutoff {cutoff}")
                return errors
            left, top, right, bottom = bounds
            margins = (left, top, width - right, height - bottom)
            if any(value == 0 for value in margins):
                errors.append(f"{display_path(path)}: visible pixels touch canvas edge; margins={margins}")
            if any(value < minimum_margin for value in margins):
                errors.append(
                    f"{display_path(path)}: transparent margins={margins}, minimum={minimum_margin}"
                )
    except Exception as exc:  # Pillow reports corrupt/truncated image details here.
        errors.append(f"{display_path(path)}: unreadable image: {type(exc).__name__}: {exc}")
    return errors


def validate_outputs(manifest: dict, require_complete: bool) -> tuple[list[str], list[str], int]:
    quality = manifest["globalQuality"]
    minimum_margin = quality["minimumTransparentMargin"]
    cutoff = quality["alphaCutoffForBounds"]
    corner_alpha = quality["cornerAlpha"]
    errors: list[str] = []
    warnings: list[str] = []
    checked_images = 0

    for group in manifest["productionGroups"]:
        output_dir = PROJECT_ROOT / group["outputDir"]
        glob_pattern = pattern_to_glob(group["filenamePattern"])
        files = sorted(output_dir.glob(glob_pattern)) if output_dir.is_dir() else []
        expected = group["frameCount"]
        if len(files) != expected:
            message = f"{group['id']}: found {len(files)} files, expected {expected} in {group['outputDir']}"
            if require_complete:
                errors.append(message)
            else:
                warnings.append(message)

        for path in files:
            checked_images += 1
            errors.extend(
                validate_png(path, group["canvas"], minimum_margin, cutoff, corner_alpha)
            )

    return errors, warnings, checked_images


def main() -> int:
    args = parse_args()
    manifest_path = args.manifest.resolve()
    try:
        manifest = load_manifest(manifest_path)
    except Exception as exc:
        print(f"ERROR: could not read manifest: {type(exc).__name__}: {exc}")
        return 2

    errors, warnings = validate_spec(manifest)
    checked_images = 0
    if not args.spec_only:
        output_errors, output_warnings, checked_images = validate_outputs(
            manifest, args.require_complete
        )
        errors.extend(output_errors)
        warnings.extend(output_warnings)

    print(
        f"V04 manifest: {len(manifest.get('productionGroups', []))} groups, "
        f"{manifest.get('expectedOutputImages')} expected images, {checked_images} checked"
    )
    for warning in warnings:
        print(f"WARN: {warning}")
    for error in errors:
        print(f"ERROR: {error}")
    print(f"RESULT: {'FAIL' if errors else 'PASS'} ({len(errors)} errors, {len(warnings)} warnings)")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())

