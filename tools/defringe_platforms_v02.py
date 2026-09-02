#!/usr/bin/env python3
"""Remove colored matte/halo pixels from the v02 forest platform exports.

The source art is preserved. Only RGB values in semi-transparent boundary
pixels are rebuilt from the nearest opaque pixel; alpha geometry stays intact
apart from discarding effectively invisible (<= 8) residue.
"""

from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
PLATFORMS = ROOT / "assets/environments/forest/platforms_v02"
ALPHA_CUTOFF = 8
OPAQUE_SEED = 220


def nearest_opaque_sources(alpha: np.ndarray, visible: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """Return source coordinates for a nearest sufficiently opaque pixel."""
    height, width = alpha.shape
    source_y = np.full((height, width), -1, dtype=np.int32)
    source_x = np.full((height, width), -1, dtype=np.int32)
    queued = np.zeros((height, width), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    seeds = np.argwhere(visible & (alpha >= OPAQUE_SEED))
    for y, x in seeds:
        source_y[y, x] = y
        source_x[y, x] = x
        queued[y, x] = True
        queue.append((int(y), int(x)))

    # Eight-neighbour propagation keeps curved outlines and thin details close
    # to their actual local colour instead of pulling colour across the asset.
    neighbours = ((-1, -1), (-1, 0), (-1, 1), (0, -1),
                  (0, 1), (1, -1), (1, 0), (1, 1))
    while queue:
        y, x = queue.popleft()
        for dy, dx in neighbours:
            ny, nx = y + dy, x + dx
            if not (0 <= ny < height and 0 <= nx < width):
                continue
            if not visible[ny, nx] or queued[ny, nx]:
                continue
            queued[ny, nx] = True
            source_y[ny, nx] = source_y[y, x]
            source_x[ny, nx] = source_x[y, x]
            queue.append((ny, nx))

    return source_y, source_x


def defringe(path: Path) -> dict[str, int]:
    image = Image.open(path).convert("RGBA")
    pixels = np.array(image)
    alpha = pixels[:, :, 3]
    visible = alpha > ALPHA_CUTOFF
    residue = (alpha > 0) & ~visible
    pixels[residue] = 0

    source_y, source_x = nearest_opaque_sources(alpha, visible)
    fringe = visible & (alpha < OPAQUE_SEED) & (source_y >= 0)
    pixels[fringe, :3] = pixels[source_y[fringe], source_x[fringe], :3]
    pixels[~visible] = 0

    Image.fromarray(pixels, "RGBA").save(path, optimize=True)
    return {
        "visible": int(visible.sum()),
        "defringed": int(fringe.sum()),
        "discarded": int(residue.sum()),
    }


def main() -> None:
    for path in sorted(PLATFORMS.glob("platform_*.png")):
        result = defringe(path)
        print(
            f"{path.name}: visible={result['visible']} "
            f"defringed={result['defringed']} discarded={result['discarded']}"
        )


if __name__ == "__main__":
    main()
