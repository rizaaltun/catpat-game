#!/usr/bin/env python3
"""Render mechanism assets over hostile colours to expose baked backgrounds."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
DIRECTORY = ROOT / "assets/gameplay/forest/mechanisms_v04"
OUTPUT = ROOT / "qa-mechanisms-alpha-v04.png"


def main() -> None:
    manifest = json.loads((DIRECTORY / "manifest.json").read_text())
    names = list(manifest["assets"])
    tile_width, tile_height = 420, 350
    sheet = Image.new("RGB", (tile_width * 3, tile_height * 2), "#17202a")
    draw = ImageDraw.Draw(sheet)

    for index, name in enumerate(names):
        image = Image.open(DIRECTORY / name).convert("RGBA")
        alpha = image.getchannel("A")
        assert alpha.getextrema()[0] == 0, f"{name}: no transparent pixels"
        assert all(alpha.getpixel(point) == 0 for point in (
            (0, 0), (image.width - 1, 0), (0, image.height - 1), (image.width - 1, image.height - 1)
        )), f"{name}: opaque corner"

        column = index % 3
        row = index // 3
        x0, y0 = column * tile_width, row * tile_height
        background = Image.new("RGB", (tile_width, tile_height), "#ff2b9b")
        background_draw = ImageDraw.Draw(background)
        background_draw.rectangle((tile_width // 2, 0, tile_width, tile_height), fill="#13b9ff")
        background_draw.rectangle((0, tile_height - 58, tile_width, tile_height), fill="#ffe34d")

        art = image.copy()
        art.thumbnail((tile_width - 28, tile_height - 52), Image.Resampling.LANCZOS)
        px = (tile_width - art.width) // 2
        py = tile_height - 38 - art.height
        background.paste(art, (px, py), art)
        sheet.paste(background, (x0, y0))
        draw.text((x0 + 12, y0 + tile_height - 28), name, fill="white", stroke_width=2, stroke_fill="#17202a")

    sheet.save(OUTPUT, optimize=True)
    print(f"mechanism alpha QA: {len(names)} runtime assets / transparent corners / hostile-background render OK")


if __name__ == "__main__":
    main()
