#!/usr/bin/env python3
"""Verify that authored walkable points touch visible asset pixels."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]


def nearest_alpha(alpha: Image.Image, x: int, y: int, radius_x: int, radius_y: int) -> int:
    best = 10_000
    for sample_x in range(max(0, x - radius_x), min(alpha.width, x + radius_x + 1)):
        for sample_y in range(max(0, y - radius_y), min(alpha.height, y + radius_y + 1)):
            if alpha.getpixel((sample_x, sample_y)) > 8:
                best = min(best, abs(sample_x - x) + abs(sample_y - y))
    return best


def validate(directory: Path, manifest_name: str, tolerance: int) -> int:
    manifest = json.loads((directory / manifest_name).read_text())
    checked = 0
    for name, metadata in manifest["assets"].items():
        if "walkable" not in metadata:
            continue
        alpha = Image.open(directory / name).getchannel("A")
        for x, y in metadata["walkable"]:
            distance = nearest_alpha(alpha, x, y, tolerance, tolerance)
            assert distance <= tolerance, f"{name}: walkable point {(x, y)} floats {distance}px from visible art"
            checked += 1
    return checked


def main() -> None:
    platform_points = validate(
        ROOT / "assets/environments/forest/platforms_v03",
        "platform_manifest.json",
        12,
    )
    mechanism_points = validate(
        ROOT / "assets/gameplay/forest/mechanisms_v04",
        "manifest.json",
        6,
    )
    print(f"asset contact: {platform_points} platform + {mechanism_points} mechanism points touch visible art OK")


if __name__ == "__main__":
    main()
