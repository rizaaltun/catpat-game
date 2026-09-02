#!/usr/bin/env python3
"""Audit extracted Level 1 raster assets and build visual QA sheets."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "source-assets/extracted_v01"
ALPHA_CUTOFF = 8


def checkerboard(size: tuple[int, int], tile: int = 16) -> Image.Image:
    width, height = size
    image = Image.new("RGB", size, "#e9edf1")
    draw = ImageDraw.Draw(image)
    for y in range(0, height, tile):
        for x in range(0, width, tile):
            if (x // tile + y // tile) % 2:
                draw.rectangle((x, y, x + tile - 1, y + tile - 1), fill="#cfd6dc")
    return image


def audit(path: Path) -> tuple[dict[str, object], Image.Image]:
    image = Image.open(path).convert("RGBA")
    alpha = np.asarray(image.getchannel("A"))
    visible = alpha > ALPHA_CUTOFF
    bbox = image.getchannel("A").point(lambda value: 255 if value > ALPHA_CUTOFF else 0).getbbox()

    labels, count = ndimage.label(visible, structure=np.ones((3, 3), dtype=np.uint8))
    components: list[dict[str, object]] = []
    for label in range(1, count + 1):
        ys, xs = np.where(labels == label)
        if len(xs) == 0:
            continue
        components.append(
            {
                "area": int(len(xs)),
                "bbox": [int(xs.min()), int(ys.min()), int(xs.max() + 1), int(ys.max() + 1)],
                "touchesEdge": bool(
                    xs.min() == 0 or ys.min() == 0 or xs.max() == image.width - 1 or ys.max() == image.height - 1
                ),
            }
        )
    components.sort(key=lambda component: int(component["area"]), reverse=True)

    corners = [
        int(alpha[0, 0]),
        int(alpha[0, -1]),
        int(alpha[-1, 0]),
        int(alpha[-1, -1]),
    ]
    record: dict[str, object] = {
        "mode": image.mode,
        "size": list(image.size),
        "visibleBounds": list(bbox) if bbox else None,
        "visiblePixels": int(visible.sum()),
        "lowAlphaResidue": int(((alpha > 0) & (alpha <= ALPHA_CUTOFF)).sum()),
        "cornerAlpha": corners,
        "componentCount": len(components),
        "components": components[:12],
    }
    return record, image


def fit(image: Image.Image, bounds: tuple[int, int]) -> Image.Image:
    result = image.copy()
    result.thumbnail(bounds, Image.Resampling.LANCZOS)
    return result


def build_cropped_sheet(
    records: list[tuple[str, dict[str, object], Image.Image]], output: Path
) -> None:
    cell_width, cell_height = 320, 340
    sheet = Image.new("RGB", (cell_width * 4, cell_height * 4), "#17202a")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default(size=16)

    for index, (name, record, image) in enumerate(records):
        col, row = index % 4, index // 4
        left, top = col * cell_width, row * cell_height
        panel = checkerboard((280, 280), 14)
        bbox = tuple(record["visibleBounds"]) if record["visibleBounds"] else (0, 0, image.width, image.height)
        cropped = fit(image.crop(bbox), (260, 260))
        panel_rgba = panel.convert("RGBA")
        panel_rgba.alpha_composite(cropped, ((280 - cropped.width) // 2, (280 - cropped.height) // 2))
        sheet.paste(panel_rgba.convert("RGB"), (left + 20, top + 12))
        draw.text((left + 20, top + 300), name, fill="#ffffff", font=font)
        draw.text(
            (left + 20, top + 320),
            f"parts {record['componentCount']}  residue {record['lowAlphaResidue']}",
            fill="#aeb8c2",
            font=ImageFont.load_default(size=12),
        )
    sheet.save(output, optimize=True)


def build_canvas_sheet(
    records: list[tuple[str, dict[str, object], Image.Image]], output: Path
) -> None:
    cell = 280
    label_height = 28
    sheet = Image.new("RGB", (cell * 4, (cell + label_height) * 4), "#17202a")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default(size=13)
    for index, (name, _record, image) in enumerate(records):
        col, row = index % 4, index // 4
        left, top = col * cell, row * (cell + label_height)
        panel = checkerboard((cell, cell), 14).convert("RGBA")
        full = image.resize((cell, cell), Image.Resampling.LANCZOS)
        panel.alpha_composite(full)
        sheet.paste(panel.convert("RGB"), (left, top))
        draw.text((left + 8, top + cell + 6), name, fill="#ffffff", font=font)
    sheet.save(output, optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("sources", nargs="*", type=Path, default=[SOURCE])
    parser.add_argument(
        "--output-prefix",
        type=Path,
        default=ROOT / "qa-level01-assets-source",
    )
    args = parser.parse_args()

    records: list[tuple[str, dict[str, object], Image.Image]] = []
    report: dict[str, object] = {}
    paths = sorted(path for directory in args.sources for path in directory.glob("*.png"))
    for path in paths:
        record, image = audit(path)
        report[path.name] = record
        records.append((path.stem, record, image))
        print(
            f"{path.name}: bbox={record['visibleBounds']} "
            f"parts={record['componentCount']} residue={record['lowAlphaResidue']}"
        )

    if len(records) != 16:
        raise SystemExit(f"expected 16 transparent assets, found {len(records)}")
    prefix = args.output_prefix.resolve()
    report_path = prefix.with_suffix(".json")
    cropped_path = prefix.with_suffix(".png")
    canvas_path = prefix.parent / f"{prefix.name}-canvas.png"
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    build_cropped_sheet(records, cropped_path)
    build_canvas_sheet(records, canvas_path)


if __name__ == "__main__":
    main()
