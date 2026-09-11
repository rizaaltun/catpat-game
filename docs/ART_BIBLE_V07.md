# Çatpat — Art Bible V0.7

Status: **locked production direction**
Active developer: **ChatGPT**
Target: professional landscape mobile platform-adventure, book-faithful, image-first.

## 1. Non-negotiable visual identity

The book is the source of truth. Every new asset must preserve the approved character identity rather than reinterpret it.

### Çatpat identity lock
- emerald green body
- coral cheek/nose accents
- peach belly
- yellow crest
- red boots
- large expressive eyes
- characteristic protruding tooth
- childlike proportions and soft storybook silhouette
- no dog/raccoon/acorn/hedgehog-like substitutions
- no glossy 3D/plastic rendering

### Rendering language
- handmade children’s-book illustration
- gouache / soft paint / cut-paper feeling
- warm, tactile, gentle edge treatment
- readable silhouettes at mobile scale
- professional game-art cleanup, not raw concept-board output

## 2. Image-first UI rule

**No visible menu, panel, button, plaque, dialogue frame, title card, level marker, pause card, result card or decorative text container may be drawn as a CSS/canvas rectangle.**

Code may only:
- position an authored image asset
- define click/touch hit areas
- switch states
- animate assets
- render truly dynamic values (e.g. 7/12, timer, accessibility setting value)

Static copy belongs inside authored image assets whenever the wording is fixed.

### Text-in-image rule
Static Turkish text must be generated/designed as part of the image asset and checked for:
- correct spelling and diacritics
- safe margins
- no clipping
- no overflow
- consistent typographic hierarchy
- landscape-mobile readability

Dynamic text is allowed only when content cannot be baked, and must sit inside a pre-authored visual frame with measured safe bounds.

## 3. Character / environment integration

Characters may not look pasted onto a background.

For every hero/menu/story composition:
- match local light direction and warmth
- add authored contact shadow where feet meet ground
- maintain consistent perspective and scale
- place foreground/midground elements around the character to embed them in the scene
- avoid halo cutout edges unless stylistically intentional

## 4. Color separation

Çatpat is green, therefore the playable lane must not be dominated by same-value green.

Preferred player-adjacent colors:
- warm ochre earth
- pale stone
- honey wood
- cream paper
- turquoise / pale blue water
- lavender / warm sunset accents

Green is reserved for framing foliage, distant masses, and controlled accents rather than the entire walking surface.

Acceptance check: Çatpat must remain readable at thumbnail/mobile scale without outline hacks.

## 5. Platform art and collision contract

Every traversable platform must have:
- a visually obvious walkable top
- a documented `surface_y` or polygon
- a contact shadow / edge cue
- collider aligned to the painted surface
- native aspect ratio (never stretch art to make a longer platform)

The player foot pivot must visually meet the authored walkable surface within 2 px in QA captures.

Complex ramps/slopes require compound/slope collider support before they can be used as mandatory traversal.

## 6. Hazard contract

A hazard is rejected if it is visually attractive but not physically fair.

Before inclusion, every mandatory hazard must pass:
- measured player jump apex
- horizontal reach at normal run speed
- landing-space requirement
- mobile-control tolerance
- no unavoidable damage state
- no soft lock

No mandatory hazard is added to a chapter before feasibility QA.

## 7. Animation standard

Canonical production source: separate transparent PNG frames with fixed canvas/pivot.

Minimum target richness:
- idle: 8 frames
- run: 8–10 frames
- jump rise: 4–6 frames
- apex: 2–3 frames
- fall: 4–6 frames
- land: 3–5 frames
- celebrate: 8–10 frames
- talk/react: 6–8 frames per important emotional beat

Jump/fall/land are authored states. Reusing run frames in air is prohibited.

For left/right movement, identity and scale must not drift. Mirroring is preferred when the design permits it.

## 8. Dialogue / comic language

Story delivery is **comic dialogue**, not a full scanned book page.

Core composition:
- left character portrait/pose
- right character portrait/pose
- authored speech balloon(s)
- consistent comic frame/background system
- expressive reactions between lines
- short readable dialogue chunks

Each mission follows:
1. encounter
2. friend problem
3. Çatpat reaction
4. promise/help decision
5. playable objective
6. resolution
7. thank-you beat
8. friend joins festival journey

## 9. Main menu direction

The main menu is a real festival scene with all currently relevant book-faithful characters integrated into one composition.

Requirements:
- Çatpat is part of the scene, not a sticker layered on top
- festival lighting ties all characters together
- title and static button text are authored image assets
- visual hierarchy: title → hero cast → primary action
- no HTML card look

## 10. Quality gate

An asset is not production-ready until it passes:
- character identity
- transparency/margins
- pivot/ground contact
- mobile readability
- scene integration
- contrast
- text safety
- native aspect ratio
- collision correspondence (if physical)
- naming/manifest completeness

Rejected/generated experiments remain outside canonical runtime paths.
