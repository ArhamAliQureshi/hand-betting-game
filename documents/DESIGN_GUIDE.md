# Design Guide
Hand Betting Game UI (Casino Neon, Purple Glow)

This guide is the visual source of truth. Build the UI to match the reference screenshot exactly in layout, hierarchy, and vibe.

## Core vibe
- Casino neon atmosphere with purple glow
- Dark, cinematic background with blurred bokeh lights
- Gold highlights and warm edge glows
- Premium, tactile tiles and glossy buttons
- Everything sits inside glowing framed panels

## Layout requirements (desktop first)
Overall structure:
- Full screen background with neon casino ambience
- A centered “frame” container holding all UI panels
- Header row at top inside the frame:
  - Left: Back to Landing button
  - Center: Title “Hand Betting Game”
  - Right: Draw Pile and Discard Pile counts with small icons

Main grid inside frame:
- Two columns
  - Left column (primary):
    - Current Hand panel (top, largest)
    - History panel (bottom, wide strip)
  - Right column (secondary):
    - Leaderboard panel (top)
    - Scores panel (bottom)

Spacing:
- Consistent gutters between panels, 16 to 24px
- Panels have thick rounded borders plus an outer glow

## Panels
All panels share:
- Rounded corners 18 to 24px
- Border gradient or gold outline feel
- Inner surface is dark translucent purple
- Outer glow halo around borders

### Current Hand panel
Must include:
- TOTAL label and a large number centered or near center-top
- 4 tiles centered in a row
- Bet buttons centered under tiles:
  - Left: BET HIGHER (red)
  - Right: BET LOWER (blue)
- Panel background can have subtle inner bokeh overlay

### History panel
Must include:
- Title “History”
- A single horizontal strip of previous hands:
  - Smaller tiles with fixed size
  - A total number shown below each mini-hand
- Must be bounded in height and horizontally scrollable if needed
- Never wraps into multiple lines

### Leaderboard panel
Must include:
- Title “Leaderboard”
- List of top 5 rows with:
  - rank
  - small icon
  - player name
  - score number aligned right
- Row 1 can have a subtle highlight

### Scores panel
Must include:
- Title “Scores”
- 3 compact entries stacked:
  - mini tiles
  - a gold score badge on the right (rounded capsule)
This panel must not duplicate History in size. It stays compact.

## Tile design
Tile visual:
- White tile face with soft bevel
- Strong shadow beneath
- Slightly rounded corners
- Crisp iconography
- Top-right number badge (for dynamic values)

Sizing:
- Current hand tiles: fixed width and height, no wrap
- History tiles: smaller fixed size
- Score tiles: similar to history size or slightly smaller

Rules:
- Never animate width or height of tiles
- Reserve fixed slots for the 4 current tiles to prevent layout shift

## Button design
### Back button
- Gold outline
- Left arrow icon
- Dark fill with glow
- Large enough to feel clickable

### Bet buttons
- BET HIGHER: red glossy button with subtle inner highlight
- BET LOWER: blue glossy button with subtle inner highlight
- Hover: slight lift + stronger glow
- Active: pressed down 1 to 2px
- Disabled: desaturate and reduce glow, keep readable

## Background
- Use a full-screen background image or procedural gradient + bokeh overlay
- Do not let background reduce readability
- Add a vignette to focus attention toward the frame container

Recommended technique:
- Background layer: image or gradient
- Overlay layer: radial gradients for bokeh spots with low opacity
- Frame container: dark translucent surface with border glow

## Color system (tokens)
Use CSS variables. Suggested starting values:

Background:
- --bg-0: #07040F
- --bg-1: #14082A
- --bokeh-pink: rgba(255, 80, 170, 0.18)
- --bokeh-gold: rgba(255, 200, 80, 0.16)

Surfaces:
- --surface-0: rgba(22, 10, 40, 0.78)
- --surface-1: rgba(30, 14, 56, 0.75)

Borders and glow:
- --border: rgba(255, 200, 100, 0.35)
- --glow-purple: rgba(160, 90, 255, 0.35)
- --glow-gold: rgba(255, 200, 90, 0.30)

Text:
- --text: #F3F1FF
- --muted: rgba(243, 241, 255, 0.72)

Accents:
- --purple: #8F4BFF
- --magenta: #FF3FA6
- --gold: #FFC24B
- --bet-red: #C8132C
- --bet-blue: #1B4CFF

Shadows:
- --shadow-tile: 0 18px 40px rgba(0, 0, 0, 0.45)
- --shadow-card: 0 24px 70px rgba(0, 0, 0, 0.40)

## Typography
- Title: bold, large, slightly spaced
- Total number: very large, bold, gold
- Panel titles: bold, white
- Labels: muted uppercase for TOTAL, pile labels

Font suggestion:
- Use a clean sans-serif with good legibility.
- Avoid overly playful fonts.

## Motion and microinteractions
Keep motion smooth and casino-like:
- Easing: cubic-bezier(0.2, 0.8, 0.2, 1) or spring
- Duration:
  - micro: 120 to 180ms
  - panel transitions: 220 to 320ms
- Respect prefers-reduced-motion

Required:
1) Deal: tiles slide up slightly with stagger
2) Bet lock: selected button glow intensifies, other dims
3) Reveal: total count-up after tiles settle
4) Outcome: banner toast or glow pulse on the current hand panel
5) History: newest entry slides in and briefly pulses
6) Reshuffle: small banner or toast near pile counters
7) Game over: dim background and show a modal card with gold border

Never:
- animate layout properties (width, height, top, left) for core elements
- allow tiles to wrap
- let history grow vertically

## Responsiveness
Mobile layout:
- Keep the same hierarchy
- Stack right column panels below the current hand
- History remains horizontal scroll
- Buttons remain large and centered

## Implementation rules
- Use a max-width frame container centered
- Use CSS Grid for the two-column layout
- Set fixed slot sizes for the current hand tile row
- History and Scores must be bounded and never push the main panel around
- Use data-testid attributes for Playwright stability

## Visual verification
Playwright screenshots required:
- round 1
- round 20
- round 40
Screens must show:
- Current hand stays centered
- Bet buttons remain under tiles
- Right column stays aligned
- History stays one-row and bounded
- No overlap, no drift, no layout shifts
