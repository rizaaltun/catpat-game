# Asset & Animation Production Matrix

## Catpat — canonical gameplay package
Canvas: 512x640
Foot pivot: 256,620
Canonical direction: right-facing; mirror left unless a story-specific asymmetry requires separate art.

### Required clips
- idle: 8 unique frames
- walk: 8 unique frames
- run: 10 unique frames
- jump anticipation/takeoff: 3 frames
- jump rise: 4 frames
- apex: 2 frames
- fall: 4 frames
- land impact/recovery: 5 frames
- listen: 6 frames
- talk gesture A: 8 frames
- talk gesture B: 8 frames
- surprised reaction: 6 frames
- worried/thinking reaction: 6 frames
- happy nod: 6 frames
- celebrate: 10 frames

Target Catpat distinct gameplay/acting frames: 80+ before portrait-only variants.

### Frame acceptance
Every frame must preserve:
- head width/height envelope,
- eye size and spacing,
- muzzle shape,
- characteristic tooth,
- yellow crest rhythm,
- coral cheek/nose accent,
- peach belly shape,
- red boot design,
- childlike body proportions,
- tail mass and attachment,
- foot baseline where grounded.

No frame may be accepted solely because it 'looks cute'. Identity match is mandatory.

## Main companions
For Pitpit, Porsuk, Baykus and Civciv, required states are defined by actual gameplay role rather than copying Catpat mechanics blindly.

### Ground companion baseline
- idle 8
- move 8–10
- anticipation/jump/fall/land if the follow system visibly traverses gaps
- talk 6–8
- problem/sad reaction 6
- listening 6
- happy/thankful 6–8
- celebrate 8
- 4–6 comic portrait expressions

Target: 35–50 distinct gameplay frames/poses per principal ground companion.

### Flying/perching companion baseline
For Baykus:
- perch idle 8
- blink/head-turn micro acting 6
- takeoff 4
- hover/flap 8
- directional follow 8
- landing/perch recovery 4
- talk/react/happy 18+ combined
- comic portraits 4–6

## UI asset matrix
No finished visual is code-drawn.

### Main Menu
- background hero scene
- title/logo art
- primary button: normal, pressed, disabled
- chapters button: normal, pressed
- settings button: normal, pressed
- back/close icon family
- optional sound icon states
- safe-area/hit-map metadata

### Chapter Map
- map base plate
- route/path art
- level node active
- level node completed
- level node locked
- current-location marker
- festival destination marker
- fixed chapter labels integrated into art
- dynamic-only progress safe areas

### Pause / Settings
- pause plate
- resume/restart/menu button states
- settings plate
- slider track art
- slider thumb art
- toggle on/off art
- touch-control on/off art
- reduced-motion on/off art

### HUD
- objective frame
- collectible counter frame
- pause icon
- interaction prompt frame
- checkpoint feedback
- mission success feedback

### Results
- chapter complete art
- friend joined art
- reward/badge states if retained
- retry/fail visual if needed

## Comic asset matrix
- left-speaker panel frame
- right-speaker panel frame
- two-character panel frame
- environment establishing panel
- resolution panel
- left speech balloon
- right speech balloon
- thought balloon
- soft/whisper balloon
- excited/emphasis balloon
- narrator caption if used
- continue/next visual affordance

## Environment matrix — Chapter 1
At minimum six visual zones:
1. festival outskirts / warm forest
2. creek/river transition
3. stone/waterfall zone
4. quiet recovery grove
5. mission-focused transition area
6. festival approach/hilltop arrival

Each zone needs:
- far background
- midground
- safe foreground framing where useful
- platform/material compatibility
- landmark
- Catpat contrast check

## Physical-art matrix
Every platform/hazard/interactive object must record:
- native image size
- intended display scale
- pivot/anchor
- walkable surface or danger polygon
- visual contact edge
- allowed scaling range
- collision role
- mobile readability note
- QA status
