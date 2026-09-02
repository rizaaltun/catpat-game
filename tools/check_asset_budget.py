#!/usr/bin/env python3
"""Check the encoded download and decoded texture budget for the vertical slice."""

from __future__ import annotations

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
CATEGORIES = {
    "character": ROOT / "assets/characters/catpat/animation_v02",
    "platforms": ROOT / "assets/environments/forest/platforms_v02",
    "decorations": ROOT / "assets/environments/forest/decorations_v02",
    "objects": ROOT / "assets/gameplay/forest/objects_v02",
    "mechanisms": ROOT / "assets/gameplay/forest/mechanisms_v03",
    "background": ROOT / "assets/environments/forest/backgrounds_v02",
}
MIB = 1024 * 1024
MAX_ENCODED = 12 * MIB
MAX_DECODED = 72 * MIB
SOURCE_ONLY_ASSETS = {"festival_gate.png"}


def image_cost(path: Path) -> tuple[int, int]:
    with Image.open(path) as image:
        channels = 4 if "A" in image.mode else 3
        return path.stat().st_size, image.width * image.height * channels


def main() -> None:
    total_count = 0
    total_encoded = 0
    total_decoded = 0
    for category, directory in CATEGORIES.items():
        files = sorted(
            path for path in (*directory.rglob("*.png"), *directory.rglob("*.jpg"))
            if not (category == "mechanisms" and path.name in SOURCE_ONLY_ASSETS)
        )
        encoded = decoded = 0
        for path in files:
            file_encoded, file_decoded = image_cost(path)
            encoded += file_encoded
            decoded += file_decoded
        total_count += len(files)
        total_encoded += encoded
        total_decoded += decoded
        print(
            f"{category}: {len(files)} images / "
            f"{encoded / MIB:.2f} MiB encoded / {decoded / MIB:.2f} MiB decoded"
        )

    assert total_count == 44, f"expected 44 production images, found {total_count}"
    assert total_encoded <= MAX_ENCODED, f"encoded asset budget exceeded: {total_encoded / MIB:.2f} MiB"
    assert total_decoded <= MAX_DECODED, f"decoded texture budget exceeded: {total_decoded / MIB:.2f} MiB"
    print(
        f"asset budget: {total_count} images / {total_encoded / MIB:.2f} MiB encoded / "
        f"{total_decoded / MIB:.2f} MiB decoded OK"
    )


if __name__ == "__main__":
    main()
