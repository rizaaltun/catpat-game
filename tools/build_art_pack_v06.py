#!/usr/bin/env python3
"""Build and validate Catpat Chapter 1 art-only production package V06.

The package deliberately contains no runtime code.  It reuses the approved clean
RGBA source art, creates pivot-locked sprite sheets, and renders two QA boards:
one for level readability and one for transparency inspection.
"""

from __future__ import annotations

import json
import math
import shutil
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "production_v06"
CELL = (512, 512)

FONT_REGULAR = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
FONT_BOLD = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT_BOLD if bold else FONT_REGULAR), size)


def rgba(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA")


def alpha_bbox(image: Image.Image) -> tuple[int, int, int, int]:
    bbox = image.getchannel("A").getbbox()
    if bbox is None:
        raise ValueError("Asset has no visible pixels")
    return bbox


def pivot_frame(
    source: Image.Image,
    source_pivot: tuple[float, float],
    target_pivot: tuple[float, float],
    scale_x: float,
    scale_y: float,
    angle_deg: float = 0,
) -> Image.Image:
    """Transform a source around its pivot into a fixed-size transparent cell."""
    theta = math.radians(angle_deg)
    cos_t = math.cos(theta)
    sin_t = math.sin(theta)
    px, py = source_pivot
    tx, ty = target_pivot

    # Pillow requests the inverse affine map: destination -> source.
    a = cos_t / scale_x
    b = sin_t / scale_x
    c = px - a * tx - b * ty
    d = -sin_t / scale_y
    e = cos_t / scale_y
    f = py - d * tx - e * ty

    return source.transform(
        CELL,
        Image.Transform.AFFINE,
        (a, b, c, d, e, f),
        resample=Image.Resampling.BICUBIC,
        fillcolor=(0, 0, 0, 0),
    )


def save_sheet(frames: list[Image.Image], destination: Path) -> None:
    sheet = Image.new("RGBA", (CELL[0] * len(frames), CELL[1]), (0, 0, 0, 0))
    for index, frame in enumerate(frames):
        sheet.alpha_composite(frame, (index * CELL[0], 0))
    destination.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(destination, optimize=True)


def copy_asset(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, destination)


def crop_visible(image: Image.Image) -> Image.Image:
    return image.crop(alpha_bbox(image))


def paste_visible(
    canvas: Image.Image,
    asset: Image.Image,
    width: int | None,
    height: int | None,
    center_x: int,
    bottom_y: int,
    opacity: float = 1.0,
) -> tuple[int, int, int, int]:
    visible = crop_visible(asset)
    ratio = visible.width / visible.height
    if width is None and height is None:
        raise ValueError("width or height is required")
    if width is None:
        width = max(1, round(height * ratio))
    if height is None:
        height = max(1, round(width / ratio))
    resized = visible.resize((width, height), Image.Resampling.LANCZOS)
    if opacity < 1:
        alpha = resized.getchannel("A").point(lambda value: round(value * opacity))
        resized.putalpha(alpha)
    x = center_x - width // 2
    y = bottom_y - height
    canvas.alpha_composite(resized, (x, y))
    return (x, y, x + width, y + height)


def cover(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    target_w, target_h = size
    ratio = max(target_w / image.width, target_h / image.height)
    resized = image.resize(
        (round(image.width * ratio), round(image.height * ratio)),
        Image.Resampling.LANCZOS,
    )
    x = (resized.width - target_w) // 2
    y = (resized.height - target_h) // 2
    return resized.crop((x, y, x + target_w, y + target_h)).convert("RGBA")


def arrow(draw: ImageDraw.ImageDraw, start: tuple[int, int], end: tuple[int, int], color: str) -> None:
    draw.line((start, end), fill=color, width=5)
    angle = math.atan2(end[1] - start[1], end[0] - start[0])
    length = 13
    for offset in (2.55, -2.55):
        point = (
            round(end[0] + math.cos(angle + offset) * length),
            round(end[1] + math.sin(angle + offset) * length),
        )
        draw.line((end, point), fill=color, width=5)


def panel_background(background: Image.Image, size: tuple[int, int]) -> Image.Image:
    panel = cover(background, size)
    tint = Image.new("RGBA", size, (14, 34, 43, 34))
    panel = Image.alpha_composite(panel, tint)
    return panel


def build_direction_board(package: dict[str, Image.Image]) -> Path:
    board = Image.new("RGBA", (1920, 1080), (19, 29, 35, 255))
    draw = ImageDraw.Draw(board)
    draw.text((64, 38), "CATPAT · BÖLÜM 1 / GÖRSEL YÖN V06", font=font(38, True), fill="#F8F2DB")
    draw.text(
        (64, 88),
        "Kod entegrasyonu değil — ferah ritim, gerçek düşüş boşlukları ve okunabilir neden-sonuç",
        font=font(21),
        fill="#BFD9D4",
    )

    margin_x, gap_x = 56, 24
    panel_w = (1920 - margin_x * 2 - gap_x * 3) // 4
    panel_h = 410
    top_rows = (142, 584)
    footer_h = 64
    labels = [
        ("01 · GÜVENLİ GİRİŞ", "Tek işaret, tek kısa öğretici sıçrama"),
        ("02 · GERÇEK BOŞLUK", "Taş dolgusu yok; iniş yüzeyi açıkça görülür"),
        ("03 · TAŞ ASANSÖR", "İpsiz/sarmaşıksız dikey hareket; boşluk korunur"),
        ("04 · DÜĞME + KAPI", "Bir ekranda tek neden-sonuç ilişkisi"),
        ("05 · SALINCAK GEÇİŞ", "Geniş boşlukta tek hareketli hedef"),
        ("06 · KUTU BULMACASI", "Kutuyu plakaya it → köprü açılsın"),
        ("07 · KÜÇÜK MANTAR", "Yalnız isteğe bağlı üst rota; karakterin yarı boyu"),
        ("08 · FESTİVAL FİNALİ", "Zorluk sonrası temiz, güvenli ödül alanı"),
    ]

    for index, (title, subtitle) in enumerate(labels):
        col, row = index % 4, index // 4
        x = margin_x + col * (panel_w + gap_x)
        y = top_rows[row]
        scene_h = panel_h - footer_h
        panel = panel_background(package["background"], (panel_w, scene_h))
        scene_draw = ImageDraw.Draw(panel)

        if index == 0:
            paste_visible(panel, package["long"], 320, None, 190, 326)
            paste_visible(panel, package["short"], 105, None, 387, 310)
            paste_visible(panel, package["sign"], None, 78, 95, 273)
            paste_visible(panel, package["cat"], None, 118, 225, 265)
            scene_draw.line((330, 277, 342, 277), fill="#FFE476", width=4)
        elif index == 1:
            paste_visible(panel, package["medium"], 205, None, 105, 324)
            paste_visible(panel, package["medium"], 205, None, 347, 302)
            paste_visible(panel, package["cat"], None, 105, 97, 251)
            scene_draw.line((199, 238, 257, 238), fill="#FFDF69", width=4)
            scene_draw.text((201, 208), "180 px", font=font(16, True), fill="#FFF7CC")
        elif index == 2:
            paste_visible(panel, package["medium"], 185, None, 92, 327)
            paste_visible(panel, package["medium"], 185, None, 368, 257)
            lift = paste_visible(panel, package["short"], 100, None, 230, 305)
            paste_visible(panel, package["cat"], None, 92, 230, lift[1] + 10)
            arrow(scene_draw, (230, 292), (230, 222), "#FFE476")
            scene_draw.text((189, 191), "hareket", font=font(16, True), fill="#FFF7CC")
        elif index == 3:
            paste_visible(panel, package["long"], 330, None, 180, 328)
            paste_visible(panel, package["button"], 100, None, 125, 257)
            paste_visible(panel, package["gate_frame"], None, 205, 350, 290)
            paste_visible(panel, package["gate_panel"], None, 205, 350, 290)
            paste_visible(panel, package["cat"], None, 103, 74, 265)
            arrow(scene_draw, (171, 214), (291, 177), "#FFE476")
        elif index == 4:
            paste_visible(panel, package["medium"], 190, None, 87, 326)
            paste_visible(panel, package["medium"], 190, None, 377, 326)
            paste_visible(panel, package["swing"], None, 250, 232, 310)
            paste_visible(panel, package["cat"], None, 96, 86, 253)
            scene_draw.text((190, 70), "tek hedef", font=font(17, True), fill="#FFF7CC")
        elif index == 5:
            paste_visible(panel, package["long"], 300, None, 140, 329)
            paste_visible(panel, package["medium"], 150, None, 392, 308)
            crate_box = paste_visible(panel, package["crate"], None, 74, 86, 255)
            plate_box = paste_visible(panel, package["button"], 92, None, 205, 257)
            paste_visible(panel, package["bridge"], 118, None, 303, 305, opacity=0.92)
            arrow(scene_draw, (crate_box[2] + 5, 224), (plate_box[0] + 15, 224), "#FFE476")
            arrow(scene_draw, (plate_box[2] - 5, 200), (285, 172), "#8DF4B5")
            scene_draw.text((253, 140), "köprü", font=font(15, True), fill="#D9FFE6")
        elif index == 6:
            paste_visible(panel, package["long"], 335, None, 190, 329)
            paste_visible(panel, package["mushroom"], None, 62, 175, 257)
            paste_visible(panel, package["cat"], None, 116, 85, 264)
            paste_visible(panel, package["ticket"], None, 50, 287, 131)
            arrow(scene_draw, (192, 199), (275, 145), "#FFE476")
        elif index == 7:
            paste_visible(panel, package["long"], 390, None, 230, 329)
            paste_visible(panel, package["tent"], None, 120, 95, 247)
            paste_visible(panel, package["gate_frame"], None, 210, 330, 290)
            paste_visible(panel, package["cat"], None, 110, 235, 266)
            paste_visible(panel, package["flowers"], None, 45, 169, 270)

        board.alpha_composite(panel, (x, y))
        draw.rounded_rectangle(
            (x, y + scene_h, x + panel_w, y + panel_h),
            radius=10,
            fill="#21343B",
        )
        draw.text((x + 16, y + scene_h + 9), title, font=font(17, True), fill="#FFE476")
        draw.text((x + 16, y + scene_h + 34), subtitle, font=font(12), fill="#D8E6E1")
        draw.rounded_rectangle((x, y, x + panel_w, y + panel_h), radius=12, outline="#57716F", width=2)

    path = OUT / "preview" / "chapter01_art_direction_v06.png"
    path.parent.mkdir(parents=True, exist_ok=True)
    board.convert("RGB").save(path, quality=95)
    return path


def hostile_pattern(size: tuple[int, int]) -> Image.Image:
    image = Image.new("RGBA", size, "#161922")
    draw = ImageDraw.Draw(image)
    colors = ("#E6007A", "#00D5E8", "#F3E600", "#2A1643")
    tile = 48
    for y in range(0, size[1], tile):
        for x in range(0, size[0], tile):
            draw.rectangle((x, y, x + tile, y + tile), fill=colors[(x // tile + y // tile) % len(colors)])
    veil = Image.new("RGBA", size, (8, 14, 21, 74))
    return Image.alpha_composite(image, veil)


def build_alpha_board(crate_sheet: Image.Image, mushroom_sheet: Image.Image, package: dict[str, Image.Image]) -> Path:
    board = hostile_pattern((1920, 1120))
    draw = ImageDraw.Draw(board)
    draw.rectangle((0, 0, 1920, 100), fill=(14, 22, 29, 242))
    draw.text((54, 25), "ALFA / KESİLME KONTROLÜ · V06", font=font(36, True), fill="#FFFFFF")
    draw.text((1345, 39), "Renkli zemin = şeffaflığı gösterir", font=font(18), fill="#E9F7F4")

    def frames_row(sheet: Image.Image, y: int, title: str) -> None:
        overlay = Image.new("RGBA", board.size, (0, 0, 0, 0))
        overlay_draw = ImageDraw.Draw(overlay)
        overlay_draw.rounded_rectangle((48, y - 48, 1872, y + 350), radius=18, fill=(7, 14, 20, 68), outline="#FFFFFF", width=2)
        board.alpha_composite(overlay)
        draw.text((72, y - 31), title, font=font(24, True), fill="#FFFFFF", stroke_width=3, stroke_fill="#091017")
        frame_w = 270
        gap = 28
        start_x = 85
        for index in range(6):
            cell = sheet.crop((index * 512, 0, (index + 1) * 512, 512))
            visible = crop_visible(cell)
            scale = min(frame_w / visible.width, 270 / visible.height)
            resized = visible.resize((round(visible.width * scale), round(visible.height * scale)), Image.Resampling.LANCZOS)
            x = start_x + index * (frame_w + gap) + (frame_w - resized.width) // 2
            board.alpha_composite(resized, (x, y + 20 + (270 - resized.height)))
            draw.text((start_x + index * (frame_w + gap) + 112, y + 301), str(index), font=font(18, True), fill="#FFFFFF", stroke_width=2, stroke_fill="#091017")

    frames_row(crate_sheet, 154, "KUTU · 6 kare · sabit taban pivotu")
    frames_row(mushroom_sheet, 585, "MANTAR · 6 kare · sabit taban pivotu")

    # Put two complex mechanism silhouettes at the bottom edge as an extra crop check.
    paste_visible(board, package["swing"], None, 215, 1570, 1080)
    paste_visible(board, package["gate_frame"], None, 205, 1765, 1080)
    path = OUT / "preview" / "alpha_qa_v06.jpg"
    path.parent.mkdir(parents=True, exist_ok=True)
    board.convert("RGB").save(path, format="JPEG", quality=94, subsampling=0)
    return path


def audit_png(path: Path, sheet_frames: int | None = None) -> dict[str, object]:
    image = Image.open(path)
    if image.mode != "RGBA":
        raise ValueError(f"{path}: expected RGBA, got {image.mode}")
    alpha = image.getchannel("A")
    corners = [alpha.getpixel((0, 0)), alpha.getpixel((image.width - 1, 0)), alpha.getpixel((0, image.height - 1)), alpha.getpixel((image.width - 1, image.height - 1))]
    if corners != [0, 0, 0, 0]:
        raise ValueError(f"{path}: opaque corner detected: {corners}")
    result: dict[str, object] = {"file": str(path.relative_to(ROOT)), "size": [image.width, image.height], "cornerAlpha": corners}
    if sheet_frames:
        if image.size != (CELL[0] * sheet_frames, CELL[1]):
            raise ValueError(f"{path}: unexpected sheet dimensions {image.size}")
        margins = []
        for index in range(sheet_frames):
            cell = image.crop((index * CELL[0], 0, (index + 1) * CELL[0], CELL[1]))
            left, top, right, bottom = alpha_bbox(cell)
            frame_margins = [left, top, CELL[0] - right, CELL[1] - bottom]
            if min(frame_margins) < 12:
                raise ValueError(f"{path}: frame {index} margin below 12 px: {frame_margins}")
            margins.append(frame_margins)
        result["frameMargins"] = margins
    else:
        result["visibleBounds"] = list(alpha_bbox(image))
    return result


def main() -> None:
    source = {
        "crate": ROOT / "assets/gameplay/forest/objects_v03/obj_crate.png",
        "mushroom": ROOT / "assets/gameplay/forest/objects_v03/obj_mushroom.png",
        "ticket": ROOT / "assets/gameplay/forest/objects_v03/obj_ticket.png",
        "button": ROOT / "assets/gameplay/forest/mechanisms_v04/pressure_button.png",
        "swing": ROOT / "assets/gameplay/forest/mechanisms_v04/swing_platform.png",
        "gate_frame": ROOT / "assets/gameplay/forest/mechanisms_v04/festival_gate_frame.png",
        "gate_panel": ROOT / "assets/gameplay/forest/mechanisms_v04/festival_gate_panel.png",
        "long": ROOT / "assets/environments/forest/platforms_v03/platform_long.png",
        "medium": ROOT / "assets/environments/forest/platforms_v03/platform_medium.png",
        "short": ROOT / "assets/environments/forest/platforms_v03/platform_short.png",
        "ramp": ROOT / "assets/environments/forest/platforms_v03/platform_ramp.png",
        "bridge": ROOT / "assets/environments/forest/platforms_v03/platform_bridge.png",
        "tree": ROOT / "assets/environments/forest/decorations_v02/decor_tree.png",
        "bush": ROOT / "assets/environments/forest/decorations_v02/decor_bush.png",
        "flowers": ROOT / "assets/environments/forest/decorations_v02/decor_flowers.png",
        "grass": ROOT / "assets/environments/forest/decorations_v02/decor_grass.png",
        "sign": ROOT / "assets/environments/forest/decorations_v02/decor_sign.png",
        "tent": ROOT / "assets/environments/forest/decorations_v02/decor_tent.png",
        "background": ROOT / "assets/environments/forest/backgrounds_v02/forest_valley.jpg",
        "cat": ROOT / "assets/characters/catpat/animation_v03/idle/catpat_idle_00.png",
    }
    missing = [str(path) for path in source.values() if not path.exists()]
    if missing:
        raise FileNotFoundError("Missing source assets:\n" + "\n".join(missing))

    copies = {
        "platforms/platform_long.png": source["long"],
        "platforms/platform_medium.png": source["medium"],
        "platforms/platform_short.png": source["short"],
        "platforms/platform_ramp.png": source["ramp"],
        "platforms/platform_bridge.png": source["bridge"],
        "mechanisms/crate_pressure_plate.png": source["button"],
        "mechanisms/swing_platform_complete.png": source["swing"],
        "mechanisms/festival_gate_frame.png": source["gate_frame"],
        "mechanisms/festival_gate_panel.png": source["gate_panel"],
        "decorations/decor_tree.png": source["tree"],
        "decorations/decor_bush.png": source["bush"],
        "decorations/decor_flowers.png": source["flowers"],
        "decorations/decor_grass.png": source["grass"],
        "decorations/decor_sign.png": source["sign"],
        "decorations/decor_tent.png": source["tent"],
        "backgrounds/forest_valley.jpg": source["background"],
    }
    for relative, input_path in copies.items():
        copy_asset(input_path, OUT / relative)

    crate_source = rgba(source["crate"])
    crate_specs = [
        (1.00, 1.00, 0.0),
        (1.01, 0.99, -4.0),
        (1.01, 0.99, 4.0),
        (1.00, 1.00, -2.0),
        (1.04, 0.94, 0.0),
        (1.00, 1.00, 0.0),
    ]
    crate_frames = [pivot_frame(crate_source, (259, 375), (256, 430), sx, sy, angle) for sx, sy, angle in crate_specs]
    crate_path = OUT / "sprites" / "crate_push_sheet.png"
    save_sheet(crate_frames, crate_path)

    mushroom_source = rgba(source["mushroom"])
    mushroom_specs = [
        (0.82, 0.82, 0.0),
        (0.82 * 1.05, 0.82 * 0.88, 0.0),
        (0.82 * 1.14, 0.82 * 0.68, 0.0),
        (0.82 * 0.93, 0.82 * 1.12, 0.0),
        (0.82 * 0.98, 0.82 * 1.04, 0.0),
        (0.82, 0.82, 0.0),
    ]
    mushroom_frames = [pivot_frame(mushroom_source, (266, 490), (256, 470), sx, sy, angle) for sx, sy, angle in mushroom_specs]
    mushroom_path = OUT / "sprites" / "mushroom_bounce_sheet.png"
    save_sheet(mushroom_frames, mushroom_path)

    package = {key: rgba(path) if path.suffix.lower() == ".png" else Image.open(path).convert("RGBA") for key, path in source.items()}
    direction_board = build_direction_board(package)
    alpha_board = build_alpha_board(rgba(crate_path), rgba(mushroom_path), package)

    audited = [audit_png(crate_path, 6), audit_png(mushroom_path, 6)]
    for relative in copies:
        if relative.endswith(".png"):
            audited.append(audit_png(OUT / relative))

    report = {
        "schemaVersion": 1,
        "package": "catpat-chapter01-art-v06",
        "result": "PASS",
        "rgbaAssetsAudited": len(audited),
        "checks": [
            "RGBA mode",
            "four transparent corners",
            "non-empty visible bounds",
            "sprite-frame margin >= 12 px",
            "fixed 512x512 sprite cells",
        ],
        "assets": audited,
        "previewFiles": [str(direction_board.relative_to(ROOT)), str(alpha_board.relative_to(ROOT))],
    }
    report_path = OUT / "qa_report.json"
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(json.dumps({"result": "PASS", "audited": len(audited), "output": str(OUT.relative_to(ROOT))}, ensure_ascii=False))


if __name__ == "__main__":
    main()
