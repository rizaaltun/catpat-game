# V06 Mission Art Integration

Bu dosya `claude/v06-integration` dalındaki görev görsellerinin entegrasyon sözleşmesidir.

## Kaynak ve iletişim sırası

- Claude → ChatGPT görsel talepleri: `ASSET-REQUESTS.md`
- ChatGPT → Claude teslim/devir: `docs/CLAUDE_HANDOFF_V06_ART.md`
- Teknik kare/FPS/pivot/path sözleşmesi: `mission_art_manifest.json`
- Ana çalışma kuralları: kök `CLAUDE.md`

## Required integration

- Load `mission_art_manifest.json` with the other V06 manifests.
- Porsuk and Baykuş remain on their existing approved mission-art contracts unless a later `ASSET-REQUESTS.md` item explicitly replaces them.
- Civciv is upgraded to the selected large-eyed yellow design and now uses two **8-frame** clips rather than the old two-frame state sheet:
  - `waiting`: 8 individual 512x512 RGBA frames, 8 FPS loop.
  - `happy`: 8 individual 512x512 RGBA frames, 8 FPS loop.
  - pivot `[256,480]`, renderScale `0.18`.
- The individual Civciv PNG frames are the source of truth. If runtime architecture prefers a sheet, derive it deterministically from those frames; do not use an AI-generated presentation board as a sheet.
- In the `lost-toy` mission replace the temporary `obj_star.png` with the separate static `missions/lost_toy/obj_ball.png` asset.
- Civciv must show `waiting` before completion and switch to `happy` after the ball is collected / the mission finishes.
- Preserve the existing floating interaction marker as UI, not character art.
- Replace the procedural seed, soil patch, growing tree and basket rectangles in `drawMissionExtras()` with the supplied apple-garden PNGs.
- Use the four tree frames in order. The final apple frame contains exactly five apples; do not draw extra procedural fruit over it.
- Treat every file as premultiplied-safe RGBA. Do not add a matte, background, glow, rectangle or checkerboard behind it.

## Source-of-truth art direction

- Porsuk follows the book artwork in `Çağrı IC.pdf`, page 4: black body, pale stripe along the pointed snout, one large white eye and coral cheek.
- Baykuş and Civciv use the same textured cut-paper/gouache visual language.
- No friend has clothing or an accessory.
- New Civciv design: fluffy warm-yellow body, large glossy dark eyes, rosy cheeks, orange beak/feet; face, feather structure and body proportions must remain consistent across every frame.
- Civciv animation is subtle and pivot-locked. Waiting is a small breathing/sway loop; happy is a restrained celebratory sway/pulse.
- Recommended pivots, paths, frame ordering and render scales are in `mission_art_manifest.json`.

## Acceptance checks

1. No procedural circle friend remains visible.
2. No procedural seed ellipse, soil ellipse, trunk rectangle or basket rectangle remains visible.
3. Porsuk/Baykuş state switching still works.
4. Civciv uses 8-frame waiting / 8-frame happy clips and no old Civciv visual remains concurrently.
5. `lost-toy` displays a real ball, never `obj_star.png`.
6. The growth order is sprout -> sapling -> leafy tree -> five-apple tree.
7. Alpha edges remain clean over the forest background; all corners are transparent where required.
8. Friends' feet and every prop base align to intended world coordinates; Civciv pivot is `[256,480]`.
9. Collider geometry is not inferred from alpha bounds.
10. Run the full existing test suite and capture desktop plus horizontal-mobile screenshots before requesting review.

Do not merge to `main` and do not change Cloudflare, CNAME or domain settings until visual review is approved.
