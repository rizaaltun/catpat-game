# V06 Mission Art Swap

This package replaces the procedural placeholders currently drawn by
`Game.drawFriend()` and `Game.drawMissionExtras()` on
`claude/v06-integration`.

## Required integration

- Load `mission_art_manifest.json` with the other V06 manifests.
- Draw the three friend sprite sheets instead of circles and facial arcs.
- Use frame 0 while a friend is waiting and frame 1 after that friend is
  helped. Preserve the existing floating interaction marker as UI, not art.
- Add a subtle pivot-locked idle motion only: at most 2 px vertical movement
  and at most 1.5% scale change. Never move the feet off the platform.
- Replace the procedural seed, soil patch, growing tree and basket rectangles
  in `drawMissionExtras()` with the supplied PNGs.
- Use the four tree frames in order. The final apple frame contains exactly
  five apples; do not draw extra procedural fruit over it.
- Treat every file as premultiplied-safe RGBA. Do not add a matte, background,
  glow, rectangle or checkerboard behind it.

## Source-of-truth art direction

- Porsuk follows the book artwork in `Çağrı IC.pdf`, page 4: black body,
  pale stripe along the pointed snout, one large white eye and coral cheek.
- Baykuş and Civciv use the same textured cut-paper/gouache visual language.
- No friend has clothing or an accessory.
- Character sheets are 1024x512 with two 512x512 frames.
- Tree sheet is 2048x512 with four 512x512 frames.
- Recommended pivots and render scales are in `mission_art_manifest.json`.

## Acceptance checks

1. No procedural circle friend remains visible.
2. No procedural seed ellipse, soil ellipse, trunk rectangle or basket
   rectangle remains visible.
3. Waiting and happy frames switch for all three friends.
4. The growth order is sprout -> sapling -> leafy tree -> five-apple tree.
5. Alpha edges remain clean over the forest background.
6. Friends' feet and every prop base align to the intended world coordinate.
7. Run the full existing test suite and capture desktop plus mobile screenshots
   before requesting review.

Do not merge to `main` and do not change Cloudflare, CNAME or domain settings
until visual review is approved.
