# Çatpat — Master Production System

Production window: 11 Sep 2026 – 10 Oct 2026
Branch: `chatgpt/month-01`
Owner: ChatGPT
Target: professional landscape mobile platform-adventure based on the book world.

## Product promise
The game must feel like an interactive extension of the book, not a browser prototype decorated with assets.

The player must immediately perceive:
- book-faithful characters,
- image-authored interface,
- rich character animation,
- believable physical contact,
- readable and fair platforming,
- comic-dialogue storytelling,
- visible progression toward the festival,
- landscape-mobile-first composition.

## Non-negotiable rules
1. No finished menu, panel, button, plaque, card or decorative container may be a CSS/canvas rectangle.
2. Fixed UI wording is authored as part of image assets where possible.
3. Dynamic text may appear only inside an authored image frame with measured safe bounds.
4. Catpat and companions must preserve approved book identity frame-to-frame.
5. Airborne animation is separately authored. Run frames cannot represent jumping/falling.
6. Traversable surfaces and collider metadata are authored together.
7. Mandatory hazards require jump-envelope validation before integration.
8. Green Catpat must remain readable at phone scale; playable lanes may not be same-value green.
9. Story delivery is comic dialogue, not a full/scanned book page.
10. An asset is not delivered until the actual binary is in GitHub, referenced by the manifest, integrated, and QA-checked.

## Studio disciplines
Work is executed by one production owner but reviewed as separate disciplines:
- Art Direction: identity, palette, material, light, scene cohesion.
- Character Art: canon, silhouettes, proportions, expressions, portraits, sprite frames.
- Animation: key poses, timing, arcs, pivots, state transitions.
- Environment Art: backgrounds, platforms, props, hazards, collectibles, landmarks.
- UI/UX Art: menu, title, buttons, map, pause, settings, HUD, result screens.
- Comic Direction: left/right staging, balloons, emotional beats, panel continuity.
- Game Design: traversal, difficulty, missions, collectibles, progression.
- Technical Art: alpha, size, pivot, metadata, loading, file budgets.
- Engineering: state logic, physics, input, transitions, save/progression.
- QA: mobile/desktop layout, animation, physics, collision, text, regression.

## Daily production cycle
Every production day follows six mandatory passes:
A. Reference/design lock — inspect sources, list defects, define dimensions/states/gates.
B. Image production — create final-use artwork, not concept-only boards.
C. Technical preparation — normalize alpha/canvas/pivot/surfaces/naming/manifest.
D. Runtime integration — wire art without recreating it in code.
E. QA — desktop 1280x720, landscape mobile 844x390, interaction, animation, text and physics checks.
F. Repo closeout — assets + code + manifests + QA + daily report committed.

## Definition of Ready
Before an asset is generated as final production art, these must be known:
- purpose and screen/state,
- source reference,
- output dimensions/usage range,
- required state variants,
- file path/name,
- runtime interaction/collision requirement,
- acceptance criteria.

## Definition of Done
An asset is complete only if:
- final binary exists in canonical repo path,
- dimensions/alpha/margins pass,
- character identity passes where relevant,
- pivot/surface metadata passes where relevant,
- runtime points to the canonical asset,
- 1280x720 and 844x390 QA pass,
- manifest is current,
- rejected experiments are not referenced,
- daily report records delivery truthfully.

## Severity model
P0: game cannot start, progression soft-lock, impossible mandatory traversal, missing critical asset.
P1: character identity drift, running-in-air, floating feet, major clipping, coded placeholder final UI, unreadable comic, pasted-looking hero character.
P2: polish issue such as minor seam/timing/overlap.
P3: optional future enhancement.

Milestone target: P0=0 and P1=0.

## Change control
The visual direction is stable. Changes are allowed only when book fidelity, measured gameplay fairness, mobile constraints, or runtime correctness require them. We do not change style merely to try alternatives. Experiments stay outside canonical runtime paths until proven better and compatible.