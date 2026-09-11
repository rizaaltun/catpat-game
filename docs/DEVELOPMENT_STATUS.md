# Çatpat development status

## V0.7 professional production reset — Day 1 started

Active developer: **ChatGPT**.
Active branch: `chatgpt/month-01`.
Baseline: `claude/v06-integration` was used only as the source snapshot; Claude is not an active developer and must not resume unless the user explicitly asks.

No main merge, deployment, Cloudflare/domain change, or production publish is authorized.

## Direction lock

The project now follows `docs/ART_BIBLE_V07.md` and `docs/PRODUCTION_ROADMAP_30_DAYS_V07.md`.

Non-negotiable rules:
- finished visible UI is image-authored, not CSS/canvas boxes
- static Turkish titles/buttons/labels are authored into image assets
- book + first-approved Catpat are the character source of truth
- sprites are separate transparent PNG frames with locked pivot/scale
- jump/fall/land are authored animations; run frames may not be reused in air
- green-on-green playable-lane composition is rejected
- platform colliders must match the painted walkable surface
- mandatory hazards require measured feasibility and mobile tolerance
- story is delivered through a consistent comic-dialogue system, not full book pages

## Day 1 corrective implementation

`src/game/Player.js` has been upgraded so the runtime can consume rich multi-frame sequences for:
- run/walk
- jump
- fall
- land
- celebrate
- optional idle sequence

Jump/fall/land sequences are non-looping where appropriate, so the runtime no longer forces the future animation package into a running-in-air look. Legacy single-frame fields remain supported while new art is produced.

## Hazard finding

A repository search of the current baseline did not find a named `thorn`, `spike`, `diken` or generic hazard entry in the active level source. Therefore no speculative coordinate-only hazard deletion was made. From V0.7 onward, any mandatory hazard must be registered in the production manifest and pass the measured feasibility gate before runtime use.

## Canonical V0.7 production package

`assets/production_v07/manifest.json` now records:
- image-only finished UI policy
- character identity policy
- target animation richness
- platform/contact requirements
- hazard feasibility requirements
- target production package layout

## Current known visual defects carried from V0.6

These remain open until their scheduled production days:
1. main-menu Catpat can read as a separately placed layer rather than part of the festival scene
2. menu/map/pause screens still contain coded UI/text patterns that are not acceptable as final art
3. companion animation richness is insufficient
4. final Catpat jump/fall/land/celebrate art is not yet delivered
5. story presentation still needs the image-first comic dialogue system
6. some background/platform combinations are too green for strong Catpat readability
7. all mandatory obstacles must be revalidated against the final movement envelope before signoff

## Immediate next production target

Day 2: canonical Catpat reference master.
The first-approved Catpat will be checked against book identity and converted into a locked production reference for all future sprite, portrait, menu and comic work.

Daily reports live in `docs/daily/`.
