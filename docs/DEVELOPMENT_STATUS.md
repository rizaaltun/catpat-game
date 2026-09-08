# STORY-01 - First integrated narrative milestone

## Scope

This is a development milestone, not the finished game or a final art signoff.
ChatGPT is the active implementation owner. Claude must only resume when the
user explicitly asks. Branch: `claude/v06-integration`. No main merge or
deployment changes are authorized.

Implemented:
- An illustrated menu composed from actual repository artwork.
- A five-page introductory story explaining helping friends and the festival.
- Character-portrait conversations before and after all three missions.
- Manual advance, keyboard support, focus confinement and conversation skip.
- Simulation pause during conversations (player, hazards and mission timers).
- Single-owner animation scheduling; repeated resume cannot double the loop.
- Recruitment after the mission's closing conversation; recruited friends
  follow recorded player route samples instead of staying at their old spot.
- Grounded trail samples remain attached to moving platform coordinates.
- Teleports/respawns clear unsafe route interpolation without losing friends.
- Three friends and three tickets required for the festival conclusion.
- A shared festival dialogue and end-of-chapter result screen.
- Reduced-motion/touch-control settings applied; storage failures do not crash
  completion. Starting again clears the previous mission state.

## Verification

Local checks passed before submission: npm test, test:assets, test:budget and
build:test. Browser checks and runtime visual rendering run in the development
CI workflow and are authoritative only when that exact run reports success.
`tests/story-browser.py` captures desktop 1280x720 and mobile 844x390 screens.
It exercises real UI/event wiring with scripted mission-completion/arrival
setup; it is NOT a claim of a full human playthrough. Mission mechanics and
24 platform jumps have separate smoke/reachability checks.

## Known limitations - do not hide or mark complete

1. Selected new Civciv PNGs are still absent from GitHub. The old runtime design
   is still in use; the manifest-only handoff was not a real binary delivery.
2. The supplied `catpat-v06-civciv-8frame-v03.zip` was inspected locally: both
   eight-file clips contain only FIVE unique file hashes. This satisfies
   neither eight distinct poses nor a final animation quality signoff.
3. Companion route-following is implemented, but dedicated walking/air/landing
   animation art is not delivered. Current poses are a functional integration
   stage, not final animated character movement.
4. The lost-ball mission still uses the old star placeholder until the actual
   approved ball PNG is uploaded and its runtime integration is validated.
5. Music/SFX are not yet implemented. Two later chapters remain unimplemented.
6. No Cloudflare, domain, CNAME, production deployment or main merge was done.

## Next development priorities (ChatGPT, not delegated)

A. Transfer verified real Civciv/ball binaries; replace missing-file contracts
   with measured QA and at least eight distinct, foot-locked frames per clip.
B. Create matching gait/air/landing cycles for all companions and validate
   jumping/platform alignment in desktop and mobile captures.
C. Improve mission art, night atmosphere, sound, checkpoint saves and the
   festival staging, then iterate on the full end-to-end playthrough.

Canonical communication paths remain CLAUDE.md, ASSET-REQUESTS.md,
docs/CLAUDE_HANDOFF_V06_ART.md and the production README/manifest files.
