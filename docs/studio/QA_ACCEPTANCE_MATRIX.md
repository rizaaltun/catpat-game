# QA Acceptance Matrix

## Supported presentation targets
Primary QA targets:
- Desktop reference: 1280x720
- Landscape mobile reference: 844x390
- Portrait safety/orientation: 390x844

## Character QA
For every canonical character clip:
- silhouette matches character master,
- facial identity remains stable frame-to-frame,
- palette remains stable,
- no missing tooth/crest/boot/feature drift,
- transparent background is real alpha,
- no white/checkerboard halo,
- intended pivot is stable,
- grounded clips preserve foot baseline,
- no accidental crop at extremes,
- frame count contains genuinely distinct poses,
- loop closure is visually checked.

## Animation QA
### Idle
- feet planted,
- no whole-sprite bob used as primary acting,
- breath/eye/crest movement subtle and authored,
- loop does not visibly snap.

### Run
- no foot skating at target runtime speed,
- contact/down/passing/up phases read,
- body mass has consistent vertical arc,
- tail/arms follow through,
- first/last transition closes cleanly.

### Jump
- takeoff visibly leaves ground,
- rise pose differs from run,
- apex pose clearly reads,
- fall pose differs from rise,
- landing impact is authored,
- no airborne run loop,
- state transitions do not pop.

## UI QA
For every final screen:
- no visible CSS/canvas rectangle used as final artwork,
- title and fixed copy are integrated into authored images when practical,
- Turkish letters/diacritics correct,
- no clipping at 1280x720,
- no clipping at 844x390,
- touch targets remain usable even when visual art is irregular,
- visual hierarchy remains clear at thumbnail scale,
- character placement does not collide with text/button art,
- safe margins maintained around screen edges/notches,
- pressed/disabled states do not shift layout unexpectedly.

## Comic QA
- left/right speakers are visually unambiguous,
- balloon tail points to correct character,
- balloon never covers eyes/mouth/key gesture,
- reading order is obvious,
- line length is phone-readable,
- dialogue chunk remains short enough for a single beat,
- character crop/eye line remains consistent,
- comic scene does not resemble a scanned full book page,
- next/continue control is visually consistent.

## Environment QA
- Catpat remains readable against immediate background,
- playable lane not dominated by same-value green,
- platform top surfaces are visually obvious,
- foreground decoration never hides required landing/hazard information,
- background seams/repetition are not obvious during travel,
- landmarks communicate progression toward festival,
- lighting direction remains coherent inside hero scenes.

## Physical contact QA
For each platform:
- walkable surface metadata corresponds to painted top,
- foot pivot meets visible surface within 2 px in reference capture,
- slope collider follows painted slope,
- native aspect ratio is preserved,
- no fake/invisible ledges.

For each hazard:
- danger collider follows visible dangerous region,
- mandatory traversal lies within measured safe movement envelope,
- safe landing exists after the hazard,
- no unavoidable off-camera strike,
- mobile input tolerance included.

## Gameplay route QA
Every mandatory route must pass:
- standing-start feasibility where required,
- normal-run feasibility,
- mobile touch feasibility,
- no soft-lock after failed jump,
- checkpoint/respawn remains safe,
- collectible placement does not demand impossible recovery,
- optional hard path cannot block main progression.

## Performance QA
- startup completes without missing critical assets,
- no redundant giant transparent canvases where avoidable,
- image dimensions fit actual screen usage,
- animation state switches do not introduce obvious frame stalls,
- unused rejected art is not loaded by runtime,
- mobile memory footprint is reviewed after major asset batches.

## Regression gate by severity
P0 blockers: cannot start, impossible progression, broken save/restart, missing critical art.
P1 blockers: wrong character identity, running in air, floating character, unreadable comic/UI, code-drawn final UI, pasted-looking hero composition.
P2 polish: minor seams, secondary overlaps, subtle timing issues.
P3 backlog: optional flourishes.

A production milestone cannot close with P0 or P1 defects.