# Catpat Canonical Identity Specification V0.1

Status: **DAY 02 GATE PASSED**
Purpose: immutable character-identity gate for all future gameplay sprites, portraits, menu art and comic art.

## Canonical sources
Priority order:
1. The book artwork from *Catpat Nezaketi Ogreniyor*.
2. The first-approved Catpat gameplay package already used as the accepted game character family.
3. Later generated reinterpretations are reference-only and cannot override 1 or 2.

Accepted gameplay source inventory:
- `assets/characters/catpat/animation_v03/idle/catpat_idle_00.png`
- `assets/characters/catpat/animation_v03/run/catpat_run_00.png` through `catpat_run_07.png`
- canvas `512x640`
- foot pivot `(256,620)`

Measured geometry is stored in `docs/studio/CATPAT_DAY02_MEASUREMENTS.json`.

## Measured geometry lock
The accepted idle and all eight accepted run frames were measured directly from the canonical PNG files.

Locked observations:
- every frame is `512x640`
- every accepted frame has visible top `y=214`
- every accepted frame has visible bottom/contact `y=620`
- visible character height is `406 px`
- visible center X stays between `255.5` and `256.5`
- all four canvas corners are transparent
- all eight run files are distinct files/poses

New grounded production frames must preserve this baseline unless an explicitly documented pose requires a lifted body while the contact foot still resolves to the same ground pivot.

## Silhouette lock
Catpat is a small child crocodile/dinosaur-like character with a soft rounded silhouette.

Mandatory silhouette features:
- large rounded head relative to torso
- long but friendly rounded muzzle, never sharp or predatory
- compact childlike torso
- short rounded arms
- short sturdy legs
- thick low tail tapering softly
- rounded dorsal/crest rhythm along head/back
- overall mass reads soft, playful and young

Reject if:
- body becomes tall/slender
- muzzle becomes narrow/fox-like/dog-like
- head shrinks toward realistic crocodile proportions
- tail becomes thin/whip-like
- hands/feet become anatomically realistic or claw-heavy

## Face lock
Mandatory features:
- very large white eyes with large black pupils
- eyes capable of strong directional acting
- dark green eyebrow/upper-eye accents where present in source style
- coral/pink circular cheek accents
- coral/pink nose/muzzle accent where shown
- friendly asymmetric mouth line
- one characteristic visible protruding white tooth
- nostril dots remain small and graphic

Reject if:
- tooth disappears in poses where mouth design should reveal it
- multiple large teeth are added
- pupils become tiny/realistic
- cheeks disappear or move inconsistently
- mouth becomes generic mascot smile
- eyelashes/eyebrows change identity from frame to frame

## Color lock
Core color family:
- emerald/forest green body
- darker green shadow/texture accents
- peach/light coral belly
- coral/pink cheeks and muzzle accents
- warm yellow crest accent
- saturated red boots in the gameplay model
- black/white high-contrast eyes

Background art must not use the same value/saturation green immediately behind Catpat's main silhouette.

## Belly lock
- single large soft oval/rounded peach belly patch
- vertically centered on torso
- shape may compress with acting but must remain recognizably the same design element
- no segmented reptile belly plates

## Crest / dorsal lock
- warm yellow crest is a signature gameplay identifier
- soft rounded lobes rather than spikes
- dorsal shapes on the back remain rounded and child-friendly
- spacing/count may be occluded by pose but cannot randomly redesign between frames

## Gameplay costume lock
- red boots are part of the accepted gameplay identity
- simple rounded childlike boot form
- no laces, buckles, realistic soles or fashion redesign
- boot contact defines the grounded baseline

## Texture / rendering lock
- handmade children's-book finish
- gouache / soft paint / cut-paper feeling
- subtle pigment/brush texture allowed
- clean silhouette for game readability
- no glossy 3D, plastic shading, airbrushed mascot rendering or photoreal scales

## Proportion continuity
Across animation frames:
- head width/height stays inside a tight visual envelope
- eye scale and spacing do not drift
- muzzle length does not visibly grow/shrink
- belly patch stays tied to torso mass
- boots stay consistent in size
- tail root stays attached to the same body region
- crest stays attached to skull/back rather than floating

## Grounded pivot rules
Canvas: `512x640`.
Foot pivot: `x=256, y=620`.

For grounded states:
- active boot contact resolves to `y=620`
- left/right foot may lift during gait but the active contact foot owns the baseline
- global image translation may not fake body bounce
- bounce/weight change comes from the authored pose

## Animation acting rules
### Idle
Breathing, blink, tiny head/crest follow-through; feet remain planted. Target: 8 genuinely authored frames.

### Run
Readable contact/down/passing/up phases; tail and arms counterbalance; face remains stable. Current accepted legacy set: 8 frames. Future upgrade target: 10 only if it improves motion without identity drift.

### Jump
Takeoff, rise, apex, fall and landing are distinct authored poses. No run pose may be reused in air.

### Talk/react
Expressions change through eyes, mouth, head tilt, arms and posture while preserving facial construction.

## Comic portrait rules
- portraits may crop closer than gameplay sprites
- eye line remains consistent inside dialogue templates
- face proportions cannot be exaggerated beyond the book style
- emotion comes from pose/expression, not redesigning features

## Menu integration rules
Catpat cannot be pasted onto a finished background after the scene is designed.
Menu composition must reserve Catpat's physical place before final environment rendering, with:
- shared light direction
- contact shadow
- foreground/midground overlap
- matching scale/perspective
- local color bounce/temperature consistent with scene

## Measurable checks for new gameplay PNGs
- frame dimensions `512x640`
- true alpha background
- transparent corners
- grounded contact `y=620`
- center drift no more than 1 px from canonical center unless pose-specific motion is documented
- file exists in GitHub canonical path
- manifest records clip/frame order
- duplicate or transformed files cannot fake frame richness

## Visual rejection checklist
Reject immediately when any answer is YES:
1. Does this look like a different green mascot rather than Catpat?
2. Did the muzzle, eyes, tooth, cheeks, crest or belly noticeably change design?
3. Did childlike proportions become more realistic or generic?
4. Does the frame rely on scaling/warping instead of a true authored pose?
5. Is Catpat visually detached from scene lighting/perspective?
6. Is the silhouette hard to read at landscape-mobile size?
7. Is a running pose being used for an airborne state?
8. Are grounded feet floating above or sinking into the authored surface?

## Day 02 exit result
PASS.

The accepted reference family is now measured and documented. New Catpat art must be judged against this specification before it can enter runtime.

## Day 03 production gate
Produce the final 8-frame authored idle cycle from this identity lock:
- feet planted
- subtle body breathing through drawing, not code scaling
- blink/eye acting
- small hand/head/crest follow-through
- fixed 512x640 canvas
- fixed y=620 ground contact
- no identity drift
- integrate only frames that pass QA
