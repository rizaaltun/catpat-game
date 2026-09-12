# Çatpat development status

## V0.7 professional production — active state

Active developer: **ChatGPT**.  
Active runtime production branch: `chatgpt/month-01`.  
Source baseline: `claude/v06-integration` is historical input only; it is not an active production branch.

No main merge, deployment, Cloudflare/domain change, or production publish is authorized.

## Direction lock

The project follows `docs/ART_BIBLE_V07.md`, `docs/PRODUCTION_ROADMAP_30_DAYS_V07.md`, the complete *Çatpat Nezaketi Öğreniyor* book review, and the first-approved Çatpat gameplay family.

Non-negotiable production rules:
- finished visible UI is image-authored, not coded finished UI
- static Turkish titles/buttons/labels are authored into image assets
- book + first-approved Çatpat are the character source of truth
- final runtime art uses individual transparent PNG assets; sprite/source boards are not runtime art
- duplicate frames and transform-only fake animation do not count as authored frames
- grounded character frames preserve measured foot contact; floating/sinking contact is rejected
- jump/fall/land are authored animations; run frames may not be reused in air
- green-on-green playable-lane composition is rejected
- platform colliders match the painted walkable surface
- mandatory hazards require measured feasibility and mobile tolerance
- story uses book-verified characters/events through the comic-dialogue path
- every canonical promotion is transactional: QA first, commit only verified work

## Canon migration gate — PASSED

The old invented mission family (`apple-garden`, `dark-lanterns`, `lost-toy`) and replacement-required characters are retired from active production execution. The blocking book-story audit is at zero legacy runtime tokens.

Production runtime additionally suppresses traversal dialogue/zones that are not sourced through canonical book story data. Neutral gameplay objectives/prompts remain available without inventing story characters.

Canonical book events prepared in runtime:
- `branch-game-invitation` — Maymun + Porsuk
- `market-queue` — market cashier
- `pitpit-daisy-garden` — Pıtpıt

These missions remain art-gated and cannot become runtime-ready until their canonical character and scene packages pass promotion QA.

## Production promotion gate — ACTIVE

`qa/production_promotion_gate.py` now fails closed for any future `runtimeReady: true` book package unless committed evidence proves:
- individual PNG runtime assets (no sprite sheets/source boards/concept sheets)
- no duplicate frame files
- alpha/transparency requirements
- book-fidelity QA
- technical QA
- mobile visual QA
- scene contact QA where applicable
- green-on-green readability QA where applicable
- measured feasibility for every mandatory hazard

Current book packages are intentionally blocked rather than falsely promoted.

## Day 1 — standards/runtime foundation

PASS for the runtime/QA foundation. Player state selection supports authored animation sequences and the production manifest locks image-first, canon, contact, readability, and hazard requirements.

## Day 2 — canonical Çatpat reference master

**PASS.**

Canonical identity and geometry are locked in:
- `docs/studio/CATPAT_CANON_SPEC_V01.md`
- `docs/studio/CATPAT_DAY02_MEASUREMENTS.json`
- `docs/studio/DAY02_AUDIT.md`

Accepted baseline: 512×640 canvas, pivot `(256,620)`, visible ground contact `y=620`, transparent corners, tight horizontal center lock, one accepted idle frame and eight distinct accepted run frames.

## Day 3 — Çatpat idle + run production

**PENDING — binary art promotion blocker.**

`qa/catpat_day03_readiness.py` measures the current canonical package against the roadmap target:
- idle: **1/8** unique authored frames
- run: **8/10** unique authored frames
- technical failures: **0**

Procedural Catpat idle breathing, run weight-shift, and landing squash fallbacks are disabled. Missing animation must remain visibly incomplete rather than being faked with runtime scale/bob transforms.

The next canonical Day-3 promotion requires exact verified PNG binaries, then a fresh transactional run of the Day-3 gate before commit.

## Binary art promotion blocker

`qa/runtime-art-binary-blocker-v01.json` records the current hard blocker: the connected repository write interface exposes text/Git-object writes but no local binary-file upload action. Base64/text substitutes are forbidden because final runtime art must remain real PNG files.

Verified but unpromoted local work includes unique transparent crate/mushroom frame extraction with duplicate source frames rejected. It is not canonical and is not referenced by runtime until the exact PNG binaries can be committed and revalidated.

The same binary limitation blocks promotion of the verified local Pıtpıt master and new Day-3 Çatpat frames.

## Hazard state

No mandatory damage hazard is currently registered in active production traversal. `qa/hazard-feasibility-v01.json` therefore passes with zero mandatory hazards. Any future mandatory hazard must include measured geometry, timing/speed feasibility, margin, mobile tolerance, unavoidable-damage proof, and a passing runtime test before promotion.

## Known remaining production gaps

1. Day 3 authored idle/run target is incomplete.
2. Day 4 jump/apex/fall/land richness is incomplete.
3. Day 5 celebrate/talk/react richness is incomplete.
4. Porsuk needs final animation richness; Maymun, Pıtpıt promotion, and market cashier final art remain incomplete/blocked.
5. Branch, market, and daisy mission scene packages remain image-art incomplete.
6. Final image-authored menu/map/pause/settings/results/dialogue packages remain incomplete.
7. Active legacy gameplay object sprite sheets (crate/mushroom) must be replaced by the already-verified individual-frame plan once binary promotion is possible.
8. Final mobile visual/readability/contact QA must be rerun after every promoted art batch.

## Immediate next production gate

Resume Day 3 binary art production/promotion as soon as exact PNG upload is available. Until then, continue only unblocked runtime/QA preparation that cannot falsely promote missing art.
