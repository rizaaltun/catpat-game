# Çatpat development status

## V0.7 professional production — canonical runtime migration active

Active developer: **ChatGPT**.
Active runtime production branch: `chatgpt/month-01`.
Baseline history may remain in the repository for migration evidence, but it is not production authority.

No main merge, deployment, Cloudflare/domain change, or production publish is authorized.

## Canonical source lock

The project follows `docs/ART_BIBLE_V07.md`, `docs/PRODUCTION_ROADMAP_30_DAYS_V07.md`, the complete **Çatpat Nezaketi Öğreniyor** book evidence registry, and the first-approved Çatpat gameplay family.

Book-verified mission events currently modeled for production are:
- Maymun + Porsuk branch-game invitation
- forest-market queue
- Pıtpıt daisy garden

Baykuş, Civciv, `apple-garden`, `dark-lanterns`, and `lost-toy` remain replacement-required migration content and may not surface in the production runtime.

## Roadmap gate status

Day 02 canonical Çatpat audit is accepted as the technical baseline: one idle frame plus eight unique run frames on a 512×640 canvas with ground pivot 256,620 and a shared visible-bottom contact at y=620.

Day 03 is the next unfinished visual gate. It is **not complete**: the roadmap requires eight genuinely authored idle poses and ten run-right frames. Duplicate frames, synthetic code motion, character drift, or unverified derived poses do not qualify. No false canonical promotion has been made.

## Current production runtime protection

The production runtime now has a defensive canon lock around the still-migrating V0.6 base game:
- friend encounters tied to legacy invented missions are removed before they can be used as production encounters
- friend encounters backed only by sprite-sheet runtime art are withheld from production
- legacy `enter-mission` events are blocked before they can reach the old mission runtime
- canonical `enter-book-mission` events remain governed by the existing character + scene readiness gate
- when legacy friends are withheld, the active objective falls back to traversal and the existing three-ticket gameplay instead of asking the player to complete invented friend missions

No character or scene `runtimeReady` flag was promoted by this change.

Transactional evidence is recorded in `qa/production-canon-lock-v01.json`; branch CI remains the final repository-level verification after commit.

## Hard art blockers carried forward

The following canonical production art is still unavailable for promotion and must remain gated:
1. Day 03 authored Çatpat idle/run completion.
2. Final individual transparent Maymun animation assets.
3. Final Porsuk animation upgrade beyond the book-faithful two-pose legacy sheet.
4. Pıtpıt verified master binary promotion to Git plus final animation package.
5. Final individual transparent forest-market cashier assets.
6. Final branch-course, market-queue, and daisy-garden scene packages.
7. Conversion of remaining active gameplay sprite-sheet art (notably crate/mushroom) to individual transparent PNG frames before final-art signoff.

The repository must continue to reject concept/sprite-sheet boards as final runtime sources, duplicate animation frames, floating contact, unmeasured mandatory hazards, green-on-green readability failures, and coded finished UI.

## Next unblocked technical target

Keep shrinking the legacy production dependency surface without promoting missing art: stop ProductionGame from loading unused legacy friend/mission binary sheets, then migrate production encounter triggers to canonical book-event IDs only. The book-story audit stays non-blocking until replacement-required active-runtime tokens reach zero for real behavior, not by renaming alone.
