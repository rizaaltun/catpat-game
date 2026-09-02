#!/usr/bin/env python3
"""Normalize generated forest mechanism art into runtime-ready transparent PNGs."""

from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
GENERATED = ROOT.parent / "generated_images"
OUTPUT = ROOT / "assets" / "gameplay" / "forest" / "mechanisms_v03"

SOURCES = {
    "pressure_button.png": GENERATED / "exec-286bac94-ba03-44a9-a9cb-6306f88fb6b1.png",
    "vine_lift.png": GENERATED / "exec-fa1ee77f-5525-4e00-9de3-9bf92441b0f0.png",
    "swing_platform.png": GENERATED / "exec-d59e348a-fdf1-40a4-ad62-5d2e05725878.png",
    "festival_gate.png": GENERATED / "exec-f8b0bafa-e4ef-4cd6-94ce-9f0fa9d63819.png",
}


def remove_connected_light_background(image: Image.Image, remove_enclosed: bool = False) -> Image.Image:
    """Remove only pale neutral pixels connected to the canvas edge.

    The generator baked its transparency checkerboard into two RGB assets.  A
    flood fill protects similarly coloured highlights inside the illustration.
    """
    rgba = image.convert("RGBA")
    width, height = rgba.size
    pixels = rgba.load()
    background = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()

    def candidate(x: int, y: int) -> bool:
        r, g, b, _ = pixels[x, y]
        return min(r, g, b) >= 226 and max(r, g, b) - min(r, g, b) <= 18

    def add(x: int, y: int) -> None:
        index = y * width + x
        if not background[index] and candidate(x, y):
            background[index] = 1
            queue.append((x, y))

    for x in range(width):
        add(x, 0)
        add(x, height - 1)
    for y in range(height):
        add(0, y)
        add(width - 1, y)

    while queue:
        x, y = queue.popleft()
        if x > 0:
            add(x - 1, y)
        if x + 1 < width:
            add(x + 1, y)
        if y > 0:
            add(x, y - 1)
        if y + 1 < height:
            add(x, y + 1)

    if remove_enclosed:
        for y in range(height):
            for x in range(width):
                if candidate(x, y):
                    background[y * width + x] = 1

    for y in range(height):
        for x in range(width):
            if background[y * width + x]:
                r, g, b, _ = pixels[x, y]
                pixels[x, y] = (r, g, b, 0)
    return rgba


def normalize(source: Path, target: Path, remove_enclosed: bool = False) -> tuple[int, int]:
    image = Image.open(source)
    if image.mode != "RGBA" or image.getchannel("A").getextrema() == (255, 255):
        image = remove_connected_light_background(image, remove_enclosed)
    else:
        image = image.convert("RGBA")

    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if not bbox:
        raise RuntimeError(f"Asset has no visible pixels: {source}")

    padding = 18
    left = max(0, bbox[0] - padding)
    top = max(0, bbox[1] - padding)
    right = min(image.width, bbox[2] + padding)
    bottom = min(image.height, bbox[3] + padding)
    image = image.crop((left, top, right, bottom))

    max_dimension = 768
    scale = min(1.0, max_dimension / max(image.size))
    if scale < 1:
        image = image.resize(
            (round(image.width * scale), round(image.height * scale)),
            Image.Resampling.LANCZOS,
        )

    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target, optimize=True)
    return image.size


def split_gate() -> tuple[tuple[int, int], tuple[int, int]]:
    gate_path = OUTPUT / "festival_gate.png"
    gate = Image.open(gate_path).convert("RGBA")
    panel_box = (205, 278, 563, 604)

    panel = Image.new("RGBA", gate.size, (0, 0, 0, 0))
    panel.alpha_composite(gate.crop(panel_box), (panel_box[0], panel_box[1]))

    frame = gate.copy()
    frame_pixels = frame.load()
    for y in range(panel_box[1], panel_box[3]):
        for x in range(panel_box[0], panel_box[2]):
            frame_pixels[x, y] = (0, 0, 0, 0)

    frame.save(OUTPUT / "festival_gate_frame.png", optimize=True)
    panel.save(OUTPUT / "festival_gate_panel.png", optimize=True)
    return frame.size, panel.size


def main() -> None:
    for name, source in SOURCES.items():
        if not source.exists():
            raise FileNotFoundError(source)
        size = normalize(source, OUTPUT / name, remove_enclosed=name == "vine_lift.png")
        print(f"{name}: {size[0]}x{size[1]}")
    frame_size, panel_size = split_gate()
    print(f"festival_gate_frame.png: {frame_size[0]}x{frame_size[1]}")
    print(f"festival_gate_panel.png: {panel_size[0]}x{panel_size[1]}")


if __name__ == "__main__":
    main()
