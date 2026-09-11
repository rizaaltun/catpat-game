# Çatpat — 30-Day Professional Production Roadmap V0.7

This is not a one-hour-per-day checklist. Each day is a **full production block** with art, integration, QA and repository delivery.

## Working model for every day
Each day contains four mandatory passes:
1. **Art production** — image-first final assets, not placeholders.
2. **Technical integration** — wire authored assets into runtime without redrawing UI in code.
3. **QA** — desktop 1280×720 + landscape mobile target, plus physics/animation checks.
4. **Repository delivery** — assets, manifests, source changes and daily report committed.

## Phase A — Recovery and visual foundation

### Day 1 — Production reset and standards lock
- audit current v0.6 visual/technical defects
- lock book-faithful character identity
- lock image-only UI rule
- lock animation/pivot rules
- upgrade runtime to support rich jump/fall/land/celebrate sequences
- establish hazard feasibility gate
- create production branch and documentation
- define canonical asset directory plan
- finish with Day 1 report and Day 2 backlog

### Day 2 — Canonical Çatpat reference master
- compare first-approved Catpat against book references
- produce master silhouette/reference poses
- produce expression reference set
- establish canonical palette/feature checklist
- export transparent reference PNGs
- create identity QA contact sheet for internal review
- commit reference manifest and checks

### Day 3 — Çatpat idle + run production
- produce 8-frame idle
- produce 10-frame run-right
- normalize canvas, pivot, ground baseline and visible scale
- derive/test left-facing runtime mirror where appropriate
- test animation cadence in engine
- reject any frame with face/body drift

### Day 4 — Çatpat jump / apex / fall / land
- produce authored takeoff frames
- produce rise frames
- produce apex frames
- produce fall frames
- produce landing compression/recovery frames
- integrate new state arrays
- record frame timings in animation manifest
- verify no running-in-air behavior

### Day 5 — Çatpat celebrate / talk / react
- celebration 8–10 frames
- listening/talking/reacting sequences
- surprised, worried, thoughtful, happy reactions
- engine integration for story and gameplay triggers
- mobile readability QA

### Day 6 — Platform kit V0.7
- redesign short/medium/long/bridge/stump/step modules
- reduce green dominance
- strengthen readable walk surfaces
- author collider metadata together with art
- create seam-safe modules instead of stretching
- contact QA with Catpat foot pivot

### Day 7 — Hazard / collectible kit and measured gameplay envelope
- measured jump apex/reach test scene
- small/medium thorn sets sized to the measured envelope
- safe landing widths
- moving hazard visual language
- collectible/daisy/ticket/mission-object visual family
- hazard acceptance manifest

## Phase B — Image-only user interface

### Day 8 — Festival main-menu hero composition
- full festival environment plate
- integrate Catpat and all current story characters into one lighting/perspective system
- create depth layers where useful
- no sticker-like character placement
- no coded panel/card composition

### Day 9 — Main-menu typography and buttons as authored assets
- game title asset
- primary button normal/pressed/disabled states
- secondary buttons
- settings/back icons as illustrated assets
- Turkish spelling/overflow QA
- click regions mapped separately in code

### Day 10 — Chapter map full-art redesign
- map background
- route art
- stage plaques
- locked/active/completed markers
- static Turkish labels embedded in art
- safe mobile composition
- remove duplicate coded labels

### Day 11 — Pause / settings / utility UI art
- pause card image
- settings background image
- sliders/toggles as authored art pieces
- restart/menu/back buttons
- only truly dynamic values rendered by code

### Day 12 — Results / rewards / friend-joined UI
- chapter-complete art
- friend-joined-festival art
- stars/badges/reward effects
- image-based copy and titles
- transition integration

## Phase C — Comic dialogue system

### Day 13 — Comic dialogue visual system
- establish consistent frame geometry
- left/right character staging rules
- speech/thought balloon families
- speaker emphasis motifs
- next/continue affordance as visual asset
- no full book-page presentation

### Day 14 — Çatpat comic portrait set
- neutral
- happy
- surprised
- worried
- thoughtful
- determined
- grateful
- celebrating
- consistent crop/scale/palette

### Day 15 — Friend 01 full production
- book-faithful character lock
- idle/walk/talk/react/happy sprite sequences
- dialogue portraits
- mission-specific poses
- manifest + runtime integration

### Day 16 — Friend 02 full production
- same complete pipeline as Day 15

### Day 17 — Friend 03 full production
- same complete pipeline as Day 15

### Day 18 — Friend 04 full production
- same complete pipeline as Day 15

### Day 19 — Comic scene environments
- encounter backgrounds
- problem-state backgrounds
- resolution-state backgrounds
- festival transition backgrounds
- foreground framing layers

### Day 20 — Chapter 1 comic sequence
- encounter dialogue
- problem reveal
- Çatpat’s help decision
- gameplay objective handoff
- resolution
- thank-you
- friend joins journey
- integrate panel transitions and portrait reactions

## Phase D — Chapter 1 production-quality gameplay

### Day 21 — Chapter 1 background final
- warm/blue/ochre playable-lane contrast
- lower green density behind Catpat
- multiple background plates across the long world
- depth/parallax plan
- landmark progression toward festival

### Day 22 — Chapter 1 traversal and platform composition
- safe onboarding
- measured jump gaps
- height changes
- moving element
- alternate/optional route
- collectible routing
- no decorative fake platforms in collision space

### Day 23 — Mission interaction art
- task object states
- before/after environmental changes
- interaction cues as illustrated assets
- friend reaction states

### Day 24 — FX and feel pass
- landing dust
- jump puff
- pickup sparkle
- small impact cues
- celebration particles
- checkpoint/festival glow
- restrained and book-consistent

### Day 25 — Chapter 1 full QA and correction
- playthrough from start to finish
- collision visual alignment
- hazard feasibility
- mobile touch tolerance
- animation state validation
- UI clipping/text validation
- story/gameplay continuity

## Phase E — Chapter 2 and progression system

### Day 26 — Chapter 2 story/art lock
- mission theme
- friend/problem
- environment palette
- new traversal motif
- comic storyboard

### Day 27 — Chapter 2 environment + gameplay kit
- background plates
- platform variants
- chapter-specific obstacle/object assets
- integration

### Day 28 — Chapter 2 comic + friend animation completion
- dialogue portraits
- reaction sprites
- encounter/resolution panels
- integrate mission flow

### Day 29 — Festival progression hub
- visual state 0/1/2/… friends joined
- growing crowd/environment life
- reward feedback
- chapter-map/festival continuity

### Day 30 — Production milestone build
- final visual consistency pass
- menu/map/comic/gameplay audit
- chapter 1 polished
- chapter 2 first production slice
- mobile test build
- presentation screenshots
- repository cleanup
- next-month backlog and risk report

## Daily rejection criteria
A daily delivery is incomplete if any of these remain in the touched area:
- coded rectangle pretending to be finished UI
- character identity drift
- running pose reused as jump/fall
- floating feet / invisible surface mismatch
- unmeasured mandatory hazard
- green-on-green player readability failure
- stretched terrain art
- text overflow or duplicate labels
- story shown as a scanned/full book page instead of comic dialogue

## Repository cadence
Every production day ends with:
- canonical assets in runtime paths
- asset manifest updates
- QA result update
- source integration commit
- `docs/daily/DAY_XX_REPORT.md`
