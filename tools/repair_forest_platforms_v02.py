#!/usr/bin/env python3
"""Remove accidental neighboring fragments from the approved forest platform exports."""

from pathlib import Path

from PIL import Image, ImageFilter

from defringe_platforms_v02 import defringe


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "source-assets/oyun_ic_v2/OYUN İÇ DOSYALAR/catpat_full_environment_claude/platforms"
OUTPUT = ROOT / "package/assets/environments/forest/platforms_v02"
GENERATED_LONG = ROOT / "generated_images/exec-278c8b0e-334a-43ec-852d-c9a1ac56919b.png"

# Crop rectangles isolate the complete intended object and discard neighboring
# fragments accidentally baked into the source export.
REGIONS = {
    "platform_short.png": (270, 170, 465, 420),
    "platform_step_stone.png": (175, 210, 410, 400),
    "platform_rock.png": (55, 115, 380, 390),
    "platform_tall_pillar.png": (65, 15, 325, 410),
}


def cleaned_crop(image: Image.Image, region=None) -> Image.Image:
    image = image.convert("RGBA")
    if region:
        image = image.crop(region)
    alpha = image.getchannel("A")
    bbox = alpha.point(lambda value: 255 if value >= 8 else 0).getbbox()
    if not bbox:
        raise ValueError("No visible platform pixels")
    image = image.crop(bbox)
    alpha = image.getchannel("A").filter(ImageFilter.MinFilter(3))
    image.putalpha(alpha)
    bbox = alpha.point(lambda value: 255 if value >= 8 else 0).getbbox()
    return image.crop(bbox)


def save_on_canvas(sprite: Image.Image, destination: Path) -> None:
    maximum = (720, 472)
    scale = min(maximum[0] / sprite.width, maximum[1] / sprite.height, 1)
    if scale < 1:
        sprite = sprite.resize(
            (round(sprite.width * scale), round(sprite.height * scale)),
            Image.Resampling.LANCZOS,
        )
    canvas = Image.new("RGBA", (768, 512), (0, 0, 0, 0))
    canvas.alpha_composite(sprite, ((768 - sprite.width) // 2, 500 - sprite.height))
    destination.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(destination, optimize=True)


def main() -> None:
    for name, region in REGIONS.items():
        save_on_canvas(cleaned_crop(Image.open(SOURCE / name), region), OUTPUT / name)
    for name in ("platform_bridge.png", "platform_ramp.png"):
        save_on_canvas(cleaned_crop(Image.open(SOURCE / name)), OUTPUT / name)
    generated = cleaned_crop(Image.open(GENERATED_LONG))
    # The generated source is a complete 2.2:1 platform. Keep it undistorted
    # for medium and derive the intentionally shallower long gameplay variant.
    medium = generated.resize((540, round(540 / 2.2)), Image.Resampling.LANCZOS)
    save_on_canvas(medium, OUTPUT / "platform_medium.png")
    long_platform = generated.resize((720, round(720 / 3.5)), Image.Resampling.LANCZOS)
    save_on_canvas(long_platform, OUTPUT / "platform_long.png")
    for destination in sorted(OUTPUT.glob("platform_*.png")):
        defringe(destination)


if __name__ == "__main__":
    main()
