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

## Verification - 2026-09-08

Verified source commit: `40d27a221653ed1250ab3e007bff40792adbf93e`.
GitHub Actions run `34206464467` completed successfully, including:
`npm test`, `test:assets`, `test:budget`, `test:visual`, `build:test` and
`test:browser`. The exact run and artifact identifiers, coverage boundaries
and SHA256 of the offline HTML are recorded in `qa/STORY-01.json`.

The first layout-check run caught portrait overflow; it was fixed rather than
removing the assertion. Current checks cover desktop 1280x720, landscape
mobile 844x390, portrait rotation 390x844 and standalone `file://` startup.
Fifteen actual browser screenshots were retained in the run's browser
artifact. Menu composition, dialogue and mobile result layouts were visually
inspected; new character animations are NOT included in this signoff.

Browser scenarios exercise UI/event wiring using scripted mission-completion
and festival-arrival setup. This is NOT a complete human playthrough or a
performance certification on physical Mac/Windows/mobile devices. Mission
mechanics, 24 jumps and the mushroom route have separate tests.

The non-deploying development workflow now retains browser evidence and a
verified offline HTML playtest on each successful integration-branch run.
Artifacts expire after seven days; source and the test instructions remain
in Git so they can be regenerated. Source snapshots expire after three days.

## Known limitations - do not hide or mark complete

1. Selected new Civciv PNGs are still absent from GitHub. The old runtime design
   is still in use; the manifest-only handoff was not a real binary delivery.
2. The supplied `catpat-v06-civciv-8frame-v03.zip` was inspected locally: both
   eight-file clips contain only FIVE unique file hashes. This satisfies
   neither eight distinct poses nor a final animation quality signoff.
3. Companion route-following is implemented, but dedicated walking/air/landing
   animation art is not delivered. Current poses are a functional integration
   stage, not final animated character movement. Foreground scenery can still
   occlude a follower near the sign; staging needs another visual pass.
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
