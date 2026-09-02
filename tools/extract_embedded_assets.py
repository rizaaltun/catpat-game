#!/usr/bin/env python3
"""Extract the original raster assets embedded in the standalone prototype.

The standalone file is treated as a source archive. This tool deliberately
extracts only the Level 1 decoration and gameplay-object keys; character and
platform production assets already have a validated v02 pipeline.
"""

from __future__ import annotations

import argparse
import base64
import re
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = ROOT.parent / "library-downloads/catpat_festival_kosusu_standalone.html"
DEFAULT_OUTPUT = ROOT / "source-assets/extracted_v01"

ASSET_KEYS = (
    "bg_valley",
    "decor_tree",
    "decor_sign",
    "decor_bunting",
    "decor_bush",
    "decor_rocks",
    "decor_flowers",
    "decor_tent",
    "decor_grass",
    "obj_cloud",
    "obj_apple",
    "obj_mud",
    "obj_mushroom",
    "obj_crate",
    "obj_lantern",
    "obj_ticket",
    "obj_star",
)


def extract(source: Path, output: Path) -> None:
    html = source.read_text(encoding="utf-8")
    output.mkdir(parents=True, exist_ok=True)

    missing: list[str] = []
    for key in ASSET_KEYS:
        pattern = (
            rf'(?:["\'])?{re.escape(key)}(?:["\'])?\s*:\s*'
            rf'["\']data:image/(png|jpeg);base64,([^"\']+)["\']'
        )
        match = re.search(pattern, html)
        if not match:
            missing.append(key)
            continue

        extension = ".jpg" if match.group(1) == "jpeg" else ".png"
        path = output / f"{key}{extension}"
        path.write_bytes(base64.b64decode(match.group(2), validate=True))
        with Image.open(path) as image:
            print(f"{key}: {image.mode} {image.width}x{image.height}")

    if missing:
        raise SystemExit(f"missing embedded assets: {', '.join(missing)}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", nargs="?", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()
    extract(args.source.resolve(), args.output.resolve())


if __name__ == "__main__":
    main()
