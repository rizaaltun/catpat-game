#!/usr/bin/env python3
"""Verify that the offline playtest has no unresolved local dependencies."""

from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BUILD = ROOT / "dist/catpat-bolum-1-v05.html"


def main() -> None:
    html = BUILD.read_text(encoding="utf-8")
    assert html.startswith("<!doctype html>")
    assert "window.__CATPAT_ASSETS" in html
    assert "window.__CATPAT_MANIFESTS" in html
    assert "window.__CATPAT_ASSETS[path]" in html
    assert "BÖLÜM 1 AKTİF · V05 · 15.2K" in html
    assert "import(moduleUrls['src/main.js'])" in html
    assert '<script type="module" src=' not in html
    assert '<link rel="stylesheet"' not in html
    assert not re.findall(r'<img[^>]+src="\./', html), "unembedded HTML image"
    assert html.count("data:image/") >= 40, "production images were not embedded"
    assert BUILD.stat().st_size < 15 * 1024 * 1024, "standalone build is unexpectedly large"
    print(f"standalone contract: offline dependencies embedded / {BUILD.stat().st_size / 1048576:.2f} MiB OK")


if __name__ == "__main__":
    main()
