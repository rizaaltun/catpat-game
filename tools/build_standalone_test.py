#!/usr/bin/env python3
"""Build a single-file offline playtest with embedded code and production art."""

from __future__ import annotations

import base64
import json
import mimetypes
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "dist"
OUTPUT = OUTPUT_DIR / "catpat-bolum-1-v05.html"

MODULES = (
    "src/core/Input.js",
    "src/core/Save.js",
    "src/game/Player.js",
    "src/game/levels.js",
    "src/game/LevelRuntime.js",
    "src/game/Mission.js",
    "src/game/Game.js",
    "src/ui/UI.js",
    "src/main.js",
)

MANIFESTS = (
    "assets/characters/catpat/animation_v03/animation_manifest.json",
    "assets/environments/forest/platforms_v03/platform_manifest.json",
    "assets/environments/forest/decorations_v02/manifest.json",
    "assets/gameplay/forest/objects_v03/manifest.json",
    "assets/gameplay/forest/mechanisms_v04/manifest.json",
    "assets/gameplay/forest/friends_v01/manifest.json",
    "assets/gameplay/forest/mission_props_v01/manifest.json",
)

ASSET_DIRECTORIES = (
    "assets/characters/catpat/animation_v03",
    "assets/environments/forest/platforms_v03",
    "assets/environments/forest/decorations_v02",
    "assets/environments/forest/backgrounds_v02",
    "assets/gameplay/forest/objects_v03",
    "assets/gameplay/forest/mechanisms_v04",
    "assets/gameplay/forest/friends_v01",
    "assets/gameplay/forest/mission_props_v01",
)

SOURCE_ONLY_ASSETS: set[str] = set()


def data_url(path: Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


def javascript_json(value: object) -> str:
    return json.dumps(value, ensure_ascii=False, separators=(",", ":")).replace("<", "\\u003c")


def main() -> None:
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    css = (ROOT / "src/styles.css").read_text(encoding="utf-8")
    html = re.sub(
        r'<link\s+rel="stylesheet"\s+href="\./src/styles\.css(?:\?[^\"]*)?"\s*/?>',
        f"<style>\n{css}\n</style>",
        html,
    )
    html = re.sub(r'\s*<script\s+type="module"\s+src="\./src/main\.js(?:\?[^\"]*)?"></script>', "", html)
    html = html.replace("<title>Çatpat — Bölüm 1 V05</title>", "<title>Çatpat — Bölüm 1 V05 Test Sürümü</title>")

    module_sources = {name: (ROOT / name).read_text(encoding="utf-8") for name in MODULES}
    game_path = "src/game/Game.js"
    module_sources[game_path] = module_sources[game_path].replace(
        "image.src = path;",
        "image.src = window.__CATPAT_ASSETS[path] || path;",
    )
    if "window.__CATPAT_ASSETS[path]" not in module_sources[game_path]:
        raise RuntimeError("Game image loader patch did not apply")

    manifests = {
        f"./{name}": json.loads((ROOT / name).read_text(encoding="utf-8"))
        for name in MANIFESTS
    }
    assets: dict[str, str] = {}
    for directory_name in ASSET_DIRECTORIES:
        directory = ROOT / directory_name
        for path in sorted(directory.rglob("*")):
            if path.suffix.lower() not in {".png", ".jpg", ".jpeg"}:
                continue
            relative = path.relative_to(ROOT).as_posix()
            if relative in SOURCE_ONLY_ASSETS:
                continue
            assets[f"./{relative}"] = data_url(path)

    ticket_source = "./assets/gameplay/forest/objects_v03/obj_ticket.png"
    html = html.replace(ticket_source, assets[ticket_source])

    boot = rf"""
<script>
window.__CATPAT_ASSETS = {javascript_json(assets)};
window.__CATPAT_MANIFESTS = {javascript_json(manifests)};
const nativeFetch = window.fetch.bind(window);
window.fetch = async input => {{
  const key = String(input);
  const manifest = window.__CATPAT_MANIFESTS[key];
  if (manifest) return {{ok: true, json: async () => manifest}};
  return nativeFetch(input);
}};

const moduleSources = {javascript_json(module_sources)};
const moduleOrder = {javascript_json(list(MODULES))};
const moduleUrls = {{}};

function resolveModule(importer, request) {{
  const parts = importer.split('/');
  parts.pop();
  for (const part of request.split('/')) {{
    if (!part || part === '.') continue;
    if (part === '..') parts.pop();
    else parts.push(part);
  }}
  return parts.join('/');
}}

for (const name of moduleOrder) {{
  const source = moduleSources[name].replace(
    /from\s+(['"])([^'"]+)\1/g,
    (full, quote, request) => {{
      const dependency = resolveModule(name, request);
      if (!moduleUrls[dependency]) throw new Error(`Modül sırası hatası: ${{name}} -> ${{dependency}}`);
      return `from ${{quote}}${{moduleUrls[dependency]}}${{quote}}`;
    }},
  );
  moduleUrls[name] = URL.createObjectURL(new Blob([source], {{type: 'text/javascript'}}));
}}

import(moduleUrls['src/main.js']).catch(error => {{
  console.error(error);
  const message = document.createElement('div');
  message.style.cssText = 'position:fixed;inset:20px;z-index:999;padding:24px;border-radius:18px;background:#fff7df;color:#8b2e2e;font:700 16px/1.5 system-ui';
  message.textContent = `Test sürümü açılamadı: ${{error.message}}`;
  document.body.append(message);
}});
</script>
"""
    html = html.replace("</body>", f"{boot}</body>")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(html, encoding="utf-8")

    expected_images = 50
    if len(assets) != expected_images:
        raise RuntimeError(f"expected {expected_images} embedded images, found {len(assets)}")
    print(
        f"standalone build: {OUTPUT.name} / {len(assets)} images / "
        f"{OUTPUT.stat().st_size / (1024 * 1024):.2f} MiB"
    )


if __name__ == "__main__":
    main()
