#!/usr/bin/env python3
"""Render three deterministic Level 1 composition checks from production art."""

from __future__ import annotations

import json
import math
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
LAYOUT = ROOT / "qa-level01-layout.json"
OUTPUT = ROOT / "qa-level01-scenes.png"
PLATFORMS = ROOT / "assets/environments/forest/platforms_v02"
DECORATIONS = ROOT / "assets/environments/forest/decorations_v02"
OBJECTS = ROOT / "assets/gameplay/forest/objects_v02"
CHARACTER = ROOT / "assets/characters/catpat/animation_v02"
BACKGROUND = ROOT / "assets/environments/forest/backgrounds_v02/forest_valley.jpg"
VIEW = (1280, 720)

SCENES = (
    {"name": "Başlangıç / etki", "camera": 0, "player": [410, 610], "frame": "idle/catpat_idle_00.png", "turnSign": True},
    {"name": "Hareketli bulut / köprü", "camera": 1320, "player": [1810, 345], "frame": "jump/catpat_jump_air_00.png"},
    {"name": "Çamur / sandık / mantar", "camera": 3000, "player": [3610, 610], "frame": "run/catpat_run_02.png", "raiseBridge": True, "placeCrate": True},
    {"name": "Festival varışı", "camera": 3720, "player": [4570, 500], "frame": "celebrate/catpat_celebrate_00.png", "raiseBridge": True, "placeCrate": True},
)


def load_rgba(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA")


def resized(image: Image.Image, scale: float) -> Image.Image:
    return image.resize(
        (max(1, round(image.width * scale)), max(1, round(image.height * scale))),
        Image.Resampling.LANCZOS,
    )


def paste_origin(canvas: Image.Image, image: Image.Image, x: float, y: float, scale: float) -> None:
    asset = resized(image, scale)
    canvas.alpha_composite(asset, (round(x), round(y)))


def paste_pivot(
    canvas: Image.Image,
    image: Image.Image,
    x: float,
    y: float,
    pivot: list[float],
    scale: float,
    rotation: float = 0,
) -> None:
    asset = resized(image, scale)
    left = round(x - pivot[0] * scale)
    top = round(y - pivot[1] * scale)
    if not rotation:
        canvas.alpha_composite(asset, (left, top))
        return
    layer = Image.new("RGBA", canvas.size)
    layer.alpha_composite(asset, (left, top))
    layer = layer.rotate(
        math.degrees(-rotation),
        resample=Image.Resampling.BICUBIC,
        center=(round(x), round(y)),
    )
    canvas.alpha_composite(layer)


def draw_background(canvas: Image.Image, camera_x: float) -> None:
    background = Image.open(BACKGROUND).convert("RGB")
    scale = max(VIEW[0] / background.width, VIEW[1] / background.height) * 1.08
    asset = background.resize((round(background.width * scale), round(background.height * scale)), Image.Resampling.LANCZOS)
    max_shift = max(0, asset.width - VIEW[0])
    shift = min(max_shift, round(camera_x * 0.06))
    canvas.alpha_composite(asset.convert("RGBA"), (-shift, VIEW[1] - asset.height))


def render_scene(layout: dict[str, object], scene: dict[str, object]) -> Image.Image:
    camera_x = float(scene["camera"])
    canvas = Image.new("RGBA", VIEW)
    draw_background(canvas, camera_x)

    def decoration_layer(layer: str) -> None:
        for item in layout["decorations"]:
            if item["layer"] != layer:
                continue
            rotation = -0.23 if scene.get("turnSign") and item["id"] == "repairable-sign" else 0
            paste_pivot(
                canvas,
                load_rgba(DECORATIONS / item["asset"]),
                item["x"] - camera_x,
                item["y"],
                item["pivot"],
                item["scale"],
                rotation,
            )

    decoration_layer("back")
    for item in layout["platforms"]:
        y = item["baseY"] if scene.get("raiseBridge") and item.get("mechanism") else item["y"]
        paste_origin(canvas, load_rgba(PLATFORMS / item["asset"]), item["x"] - camera_x, y, item["scale"])

    for item in layout["objects"]:
        if item["kind"] in ("ticket", "star"):
            continue
        x = 3755 if scene.get("placeCrate") and item["kind"] == "crate" else item["x"]
        image = load_rgba(OBJECTS / item["asset"])
        if item["kind"] == "moving-platform":
            paste_origin(canvas, image, x - camera_x, item["y"], item["scale"])
        else:
            paste_pivot(canvas, image, x - camera_x, item["y"], item["pivot"], item["scale"])

    character_manifest = json.loads((CHARACTER / "animation_manifest.json").read_text())
    frame = load_rgba(CHARACTER / scene["frame"])
    paste_pivot(
        canvas,
        frame,
        scene["player"][0] - camera_x,
        scene["player"][1],
        [character_manifest["pivot"]["x"], character_manifest["pivot"]["y"]],
        character_manifest["displayScale"],
    )
    decoration_layer("front")

    for item in layout["objects"]:
        if item["kind"] not in ("ticket", "star"):
            continue
        paste_pivot(
            canvas,
            load_rgba(OBJECTS / item["asset"]),
            item["x"] - camera_x,
            item["y"],
            item["pivot"],
            item["scale"],
        )
    return canvas.convert("RGB")


def main() -> None:
    subprocess.run(
        ["node", str(ROOT / "tools/export_level01_layout.mjs"), str(LAYOUT)],
        check=True,
    )
    layout = json.loads(LAYOUT.read_text())
    scenes = [render_scene(layout, scene) for scene in SCENES]
    panel_width, panel_height, label_height = 640, 360, 42
    sheet = Image.new("RGB", (panel_width * len(scenes), panel_height + label_height), "#17202a")
    draw = ImageDraw.Draw(sheet)
    font_path = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")
    font = ImageFont.truetype(font_path, 17) if font_path.exists() else ImageFont.load_default(size=17)
    for index, (scene, image) in enumerate(zip(SCENES, scenes, strict=True)):
        preview = image.resize((panel_width, panel_height), Image.Resampling.LANCZOS)
        left = index * panel_width
        sheet.paste(preview, (left, 0))
        draw.text((left + 14, panel_height + 12), scene["name"], fill="white", font=font)
        image.save(ROOT / f"qa-level01-scene-{index + 1}.png", optimize=True)
    sheet.save(OUTPUT, optimize=True)
    print(f"visual QA: {len(scenes)} scenes -> {OUTPUT.name}")


if __name__ == "__main__":
    main()
