# skills.md
Hand Betting Game: UI, Motion, and Code Quality Skills Spec

## Role
You are implementing a polished, interactive UI for a web-based Mahjong Hand Betting Game.
Prioritize high-quality CSS, smooth transitions, and an intuitive UX.
The codebase must be feature-ready for onsite extensions. Do not change game rules beyond the provided specification.

## Evaluation Targets
### Polish
- High-quality CSS, consistent spacing, typography, visual hierarchy
- Smooth transitions and responsive microinteractions
- Clear feedback for betting, round results, tile evolution, reshuffles, and game over

### Scalability
- Architecture supports easy rule additions and UI expansion
- Game logic isolated from UI so rules can change without rewriting components
- Clear extension points for new tile types, scoring, end conditions, and UI widgets

### Code Quality
- Clean, modular, well-documented code
- Predictable state management
- Testable domain logic
- Maintainable styling strategy and component boundaries

## Hard Requirements (must be present)
### Landing page
- New Game entry point
- Leaderboard showing top 5 scores

### Gameplay UI
- Back to Landing button
- Bet Higher and Bet Lower actions
- Display current hand total and tile visuals
- Display Draw Pile and Discard Pile counts
- Display History view of previous hands as smaller tiles
- End-of-game screen displaying final score

## UI Layout Blueprint
### Gameplay Screen
Header
- Left: Back to Landing
- Center: Hand Betting Game title
- Right: Draw Pile count, Discard Pile count, optional Deck Cycle indicator (x/3)

Main Stage
- Current total (large numeric emphasis)
- Current hand tiles centered
- Bet buttons below (Higher, Lower)

Support Panel
- Optional compact score widget
- Optional Tile Heat widget (purely derived visualization of dynamic values)

Bottom
- History strip with last 5 hands (mini tiles + total)

### Landing Screen
- Primary CTA: New Game
- Top 5 Leaderboard
- Minimal layout, strong visual hierarchy

## Motion and Transition Goals
Animations must:
- Improve clarity of state transitions
- Create anticipation between bet and outcome
- Visually communicate tile evolution (+1 or -1 on Dragons/Winds)
- Stay smooth, consistent, and non-blocking

Avoid:
- Flashing effects
- Long delays that slow gameplay
- Animations that block input longer than 700ms

Respect:
- Reduced motion preference (prefers-reduced-motion)

## Required Microinteractions
1) Deal animation
- Tiles slide from the Draw Pile stack into the center
- Stagger 80 to 120ms per tile
- Spring settle on landing

2) Bet lock
- Selected button highlights and slightly scales (1.02 to 1.04)
- Other button dims and becomes disabled until outcome resolved
- Show a "Prediction locked" chip for 300 to 500ms

3) Reveal phase
- Reveal tiles first
- Animate total count-up over 400 to 700ms
- Then show Win or Lose banner

4) Tile value change (Dragons/Winds)
- Show +1 or -1 popover near each affected tile
- Flip the tile value badge from old to new (rotateY or equivalent)
- Use theme tokens for success and danger, avoid hardcoding colors

5) History transition
- Previous hand shrinks and slides into history strip
- Newest history item briefly pulses

6) Reshuffle event
- Display "RESHUFFLE" banner
- Animate discard tiles moving into draw stack
- Update deck cycle indicator (1/3, 2/3, 3/3)

7) Game-over emphasis
- If any Dragon/Wind value is within 1 of 0 or 10:
  - Add subtle warning ring or badge when visible
- On game over:
  - Fade gameplay area
  - Slide in summary card with final score and actions (New Game, Back to Landing)

## Styling and Polish Standards
- Use a consistent spacing scale (4, 8, 12, 16, 24, 32)
- Use a consistent radius scale and shadow scale
- Fixed tile dimensions to prevent layout shifts during animation
- Clear typography hierarchy:
  - Total is the hero element
  - Buttons are the next-most prominent
  - Supporting stats are quieter

CSS expectations:
- No inline styling for core layout and theming
- Use a clean strategy: CSS modules, Tailwind, or styled-components, but be consistent
- Use design tokens for spacing, colors, typography, radii, shadows
- Add hover, focus, and active states for all interactive elements
- Ensure accessible contrast and visible keyboard focus states

## Architecture and Scalability Requirements
### Strict separation of concerns
- Domain rules must not live inside UI components
- UI components should render state and dispatch intent only

Recommended layering:
- /engine: pure domain logic (no React imports)
- /state: reducer or state machine wiring (deterministic)
- /ui: presentational components
- /storage: leaderboard persistence and adapters

### Extension points
Define clear interfaces:
- Tile definitions and value strategy
- Hand evaluation and scoring
- End conditions
- Persistence (leaderboard storage)

Example patterns to follow:
- Strategy pattern for scoring and end conditions
- Reducer or state machine for game progression
- Event-driven updates (GameEvent) for clarity and auditability

### Deterministic flow
State transitions must be predictable:
- bet -> draw next hand -> resolve -> update tile values -> move to history -> check end -> next round

Avoid:
- scattered state across multiple React components
- hidden side effects in render paths
- mutation of arrays or tile objects in place

## State Management Standards
- Prefer useReducer or a small state machine model
- Keep a single source of truth for GameState
- Derive UI-only state (animations, highlights) from GameState + local transient UI state

State should include:
- drawPile
- discardPile
- currentHand
- history
- score
- reshuffleCount
- tileValueMap for Dragons/Winds (tile-id keyed)
- gameStatus (running, resolving, gameOver)

## Code Quality Standards
### Type safety
- Use TypeScript types for Tile, Hand, GameState, GameAction, GameEvent
- Avoid any and unknown unless justified and documented

### Modularity
- Components should be small and single-responsibility
- Prefer composition over large monolithic pages
- Reuse motion variants and UI primitives

### Documentation
- README includes setup steps and brief architecture explanation
- Inline comments explain why, not what
- JSDoc on key engine functions:
  - resolveBet
  - applyTileValueChanges
  - reshuffle
  - checkGameOver

### Testing
Minimum recommended:
- Unit tests for engine functions:
  - tile value increment and decrement rules
  - reshuffle behavior and cycle counting
  - game over triggers
  - hand total calculation
- Snapshot testing is optional, avoid excessive UI snapshots

### Error handling and guardrails
- Validate assumptions:
  - draw pile has enough tiles to draw a hand, or trigger reshuffle logic
  - prevent betting while resolution animation is in progress
- No uncaught exceptions from empty arrays or missing tile ids

### Performance
- Avoid unnecessary re-renders:
  - memoize tile components if needed
  - keep animation state local
- Use stable keys for tiles and history items
- Keep animations GPU-friendly (transform and opacity)

## Accessibility and UX
- Buttons must be large and thumb-friendly on mobile
- Keyboard support:
  - Tab navigable UI
  - Enter activates selected bet button when focused
- Add aria-labels where icons are used
- Respect prefers-reduced-motion

## Implementation Notes
- Use one animation library consistently (Framer Motion preferred in React)
- Define reusable motion variants:
  - tileDeal
  - tileSettle
  - bannerSlide
  - valueFlip
  - historySlide
- Ensure animations do not cause layout shift:
  - fixed tile size
  - stable containers

## Definition of Done
- Round loop feels smooth and satisfying:
  - bet -> reveal -> outcome -> history update in under 2 seconds
- Clear feedback for win/lose and tile value adjustments
- Reshuffle moment is obvious and polished
- Game over screen is clean and provides next actions
- Code is modular, readable, and feature-ready for onsite extension
