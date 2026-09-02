#!/usr/bin/env python3
"""Validate the mobile HUD/control contract without requiring a browser."""

from __future__ import annotations

from collections import Counter
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class ContractParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.ids: list[str] = []
        self.inputs: set[str] = set()
        self.images: list[str] = []
        self.viewport = ""

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if values.get("id"):
            self.ids.append(values["id"])
        if values.get("data-input"):
            self.inputs.add(values["data-input"])
        if tag == "img" and values.get("src"):
            self.images.append(values["src"])
        if tag == "meta" and values.get("name") == "viewport":
            self.viewport = values.get("content", "")


def main() -> None:
    parser = ContractParser()
    parser.feed((ROOT / "index.html").read_text(encoding="utf-8"))
    duplicates = [name for name, count in Counter(parser.ids).items() if count > 1]
    assert not duplicates, f"duplicate DOM ids: {duplicates}"

    required_ids = {
        "app", "game", "hud", "objective", "ticket-count", "interaction-prompt",
        "dialogue", "speaker", "dialogue-text", "touch-controls",
    }
    assert required_ids <= set(parser.ids), f"missing DOM ids: {sorted(required_ids - set(parser.ids))}"
    assert parser.inputs == {"left", "right", "jump", "focus", "interact"}
    assert "viewport-fit=cover" in parser.viewport and "user-scalable=no" in parser.viewport

    for source in parser.images:
        path = ROOT / source.removeprefix("./")
        assert path.is_file(), f"missing HTML image: {source}"

    css = (ROOT / "src/styles.css").read_text(encoding="utf-8")
    assert "@media (pointer: coarse)" in css
    assert "safe-area-inset-bottom" in css
    assert ".dialogue[hidden]" in css
    print("DOM contract: unique ids / 5 controls / safe-area HUD / image paths OK")


if __name__ == "__main__":
    main()
