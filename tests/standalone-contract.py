#!/usr/bin/env python3
"""Verify that the offline playtest has no unresolved local dependencies."""

from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BUILD = ROOT / "dist/catpat-bolum-1-v05.html"


def window_asset_keys(html: str) -> str:
    start = html.index("window.__CATPAT_ASSETS = ")
    end = html.index(";\nwindow.__CATPAT_MANIFESTS", start)
    return html[start:end]

def main() -> None:
    html = BUILD.read_text(encoding="utf-8")
    assert html.startswith("<!doctype html>")
    assert "window.__CATPAT_ASSETS" in html
    assert "window.__CATPAT_MANIFESTS" in html
    assert "window.__CATPAT_ASSETS[path]" in html
    assert "BÖLÜM 1 · HİKÂYE GELİŞTİRME SÜRÜMÜ" in html
    assert 'id="story-dialogue"' in html
    for module in [
        "src/story/Story.js",
        "src/story/BookCanon.js",
        "src/story/BookStory.js",
        "src/game/BookBehaviourProgress.js",
        "src/game/BookMissionModel.js",
        "src/game/BookMissionBlueprints.js",
        "src/game/BookMissionArtGate.js",
        "src/game/BookMissionRuntime.js",
        "src/game/CompanionTrail.js",
        "src/game/ProductionBaseGame.js",
        "src/game/ProductionGame.js",
    ]:
        assert module in html, f"missing offline module: {module}"
    assert "new ProductionGame(canvas, input, ui)" in html
    assert "import(moduleUrls['src/main.js'])" in html
    assert '<script type="module" src=' not in html
    assert '<link rel="stylesheet"' not in html
    assert not re.findall(r'<img[^>]+src="\./', html), "unembedded HTML image"
    assert html.count("data:image/") >= 35, "production images were not embedded"
    for retired_asset in ["friend_porsuk_sheet.png", "friend_baykus_sheet.png", "friend_civciv_sheet.png", "tree_growth_sheet.png"]:
        assert retired_asset not in window_asset_keys(html), f"retired asset embedded: {retired_asset}"
    assert BUILD.stat().st_size < 15 * 1024 * 1024, "standalone build is unexpectedly large"
    print(f"standalone contract: full production runtime + offline dependencies embedded / {BUILD.stat().st_size / 1048576:.2f} MiB OK")


if __name__ == "__main__":
    main()
