# Production Risk Register

## R01 — Character identity drift
Severity: P1 / high probability if uncontrolled.
Risk: image generation can subtly alter face, tooth, crest, proportions or costume between frames.
Mitigation: Day 02 canonical reference lock; every frame compared against identity checklist; rejected variants never enter canonical runtime folders.
Trigger: any frame reads as a different character at thumbnail scale.
Owner response: reject and regenerate/redraw before integration.

## R02 — Sticker-like character placement
Severity: P1.
Risk: menu/story character looks pasted over a separately authored scene.
Mitigation: shared light direction, contact shadow, overlap/framing, perspective/scale check, scene composition designed around character positions rather than inserting characters afterward.
Trigger: character edge/lighting/depth feels independent of environment.

## R03 — Coded UI returns as final art
Severity: P1.
Risk: time pressure leads to CSS cards, generic rounded rectangles or canvas panels being treated as finished visuals.
Mitigation: every major screen has required image-asset matrix; code is limited to layout, semantics, input and dynamic values.
Trigger: visible UI shape could exist without an image asset.

## R04 — Turkish text baked incorrectly
Severity: P1 when navigation/meaning is affected, otherwise P2.
Risk: image-authored text may contain spelling/diacritic errors that are harder to fix than DOM text.
Mitigation: copy lock before generation; spelling pass; separate text-safe asset revision; never improvise final wording inside an image before copy is approved internally.
Trigger: typo, clipped diacritic, low readability, inconsistent wording.

## R05 — Animation quantity without real pose quality
Severity: P1.
Risk: 8–10 files exist but are duplicates or tiny transformations.
Mitigation: distinct-pose visual review; contact/down/passing/up requirements for gait; hash uniqueness is not enough.
Trigger: sequence looks like translated/scaled copies instead of animation.

## R06 — Running in air / poor state transitions
Severity: P1.
Risk: runtime selects run or static placeholder during jump/fall/land.
Mitigation: separate multi-frame state support already introduced; Day 05 velocity/event mapping; regression test for airborne state.
Trigger: feet cycle as if running while character is airborne.

## R07 — Floating feet / invisible collision
Severity: P1.
Risk: collider and painted platform top disagree.
Mitigation: authored surface metadata, fixed foot pivot, 2 px contact tolerance.
Trigger: visible gap or foot penetration at rest.

## R08 — Impossible mandatory obstacle
Severity: P0.
Risk: thorn/gap/wall is visually attractive but cannot be passed under real physics/touch controls.
Mitigation: Day 07 movement laboratory; green/amber/red feasibility bands; Day 09 hazard validation; Day 26 route replay.
Trigger: mandatory obstacle falls outside safe envelope or requires pixel-perfect input.

## R09 — Green-on-green readability
Severity: P1/P2.
Risk: Catpat disappears into foliage/platform colors.
Mitigation: warm/stone/water/ochre player-adjacent palette; green pushed to framing/depth; phone-scale readability gate.
Trigger: silhouette is unclear without outline hacks.

## R10 — Background repetition
Severity: P2.
Risk: long level feels like one repeated image.
Mitigation: six visual zones, landmarks, far/mid layers and transition areas.
Trigger: player cannot tell visually that progress has been made.

## R11 — Foreground art hides gameplay
Severity: P1.
Risk: pretty foliage hides platforms, hazards, companion or landing area.
Mitigation: foreground layers cannot cross mandatory information zones; occlusion QA at gameplay scale.
Trigger: hazard/landing edge becomes ambiguous during movement.

## R12 — Comic system becomes a book-page slideshow
Severity: P1.
Risk: story relies on full page crops rather than interactive dialogue staging.
Mitigation: dedicated left/right/two-character panels, portrait acting, balloon grammar and short dialogue beats.
Trigger: a story beat can be described as “show the book page and press next.”

## R13 — Comic readability on mobile
Severity: P1.
Risk: too much copy or balloons overlap faces/controls.
Mitigation: short dialogue beats, fixed portrait breathing zones, safe balloon regions, 844x390 QA.
Trigger: user must zoom or text competes with character expression.

## R14 — Asset bloat / mobile memory pressure
Severity: P1 if crash/stall; otherwise P2.
Risk: many large RGBA images and animation frames make startup or runtime heavy.
Mitigation: right-size assets for use, avoid giant transparent margins beyond canonical needs, load by scene/state when appropriate, review mobile footprint after major batches.
Trigger: startup stalls, jank, memory pressure or redundant large files.

## R15 — Local-only or blob-only delivery falsely reported
Severity: process P1.
Risk: asset is said to be complete but not actually connected to repo tree/manifest.
Mitigation: Definition of Done requires real GitHub path + manifest + runtime/QA where applicable.
Trigger: only prompt, concept, local file or unconnected blob exists.

## R16 — Style experimentation derails schedule
Severity: P2/high project risk.
Risk: repeated attempts at unrelated visual directions create revision churn.
Mitigation: Art Bible and change-control policy; experiments outside canonical path; new direction only for book fidelity, measured usability or correctness.
Trigger: proposal changes style without solving a documented defect.

## R17 — Companion animation behaves like Catpat incorrectly
Severity: P1/P2.
Risk: species-specific characters are forced into same gait/mechanics.
Mitigation: role/species-specific animation plans, especially Baykus flight/perch behavior.
Trigger: movement conflicts with character design or source material.

## R18 — Production schedule becomes documentation-only
Severity: project P0.
Risk: extensive planning happens without binary asset and runtime progress.
Mitigation: every gate requires production artifacts; reports cannot close a day with only planning unless that day is explicitly a foundation gate.
Trigger: two consecutive production gates close without canonical art/runtime output when such output was scheduled.
