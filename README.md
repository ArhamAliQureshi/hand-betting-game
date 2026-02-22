# Hand Betting Game

Live Demo: https://hand-betting-game.vercel.app/

A casino themed, Mahjong inspired hand betting game. Each round shows a 4 tile hand and its total. You bet whether the next hand total will be higher or lower. Winds and Dragons have dynamic values that change over time, creating a risk curve and a clear game over state.

## Features
- Landing page
  - Player name input with validation
  - Persistent leaderboard (Top 5) stored in localStorage
  - Clear leaderboard with confirmation
- Gameplay
  - 4 tile hand with per tile value badges
  - Total calculation and Higher or Lower betting
  - Smooth deal and resolve transitions
  - History panel for previous hands
  - Draw and discard pile counts and reshuffle handling
- Game over
  - Triggers on dynamic tile value reaching 0 or 10
  - Triggers when draw pile exhaustion occurs 3 times
  - Automatically saves final score to leaderboard exactly once per game session
- Background polish
  - Animated Mahjong tile field background that stays behind the UI and does not block interactions
  - Respects prefers-reduced-motion

## Game rules summary
- Hand size: 4 tiles
- Bet Higher: next total must be strictly greater than current total
- Bet Lower: next total must be strictly less than current total
- Tie counts as loss
- Tile set used
  - Number tiles 1 to 9 in Characters, Bamboo, Dots
  - Winds: East, South, West, North
  - Dragons: Red, Green, White
- Values
  - Number tiles: fixed numeric value 1 to 9
  - Winds and Dragons: dynamic value per tile instance, starts at 5
- Dynamic updates after each round
  - Win: each Wind or Dragon in the resolved hand increases by 1
  - Loss: each Wind or Dragon in the resolved hand decreases by 1
- Reshuffle
  - When draw pile runs out, combine discard pile with a fresh restricted set deck and reshuffle
  - Count how many times this happens
- Game over
  - Any Wind or Dragon reaches 0 or 10
  - Draw pile runs out for the 3rd time

## Tech stack
- React + TypeScript
- Vite
- CSS (custom design system)
- Vitest (unit tests)
- Playwright (end to end tests)
- Deployed on Vercel

## Local setup
Prerequisites:
- Node.js 18 or newer

Install:
```bash
npm install
```

Run dev server:
```bash
npm run dev
```

Build:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Testing
Unit tests:
```bash
npm run test
```

End to end tests:
```bash
npx playwright install
npx playwright test
```

## Architecture
The codebase is organized to stay feature-ready and easy to extend.

- Engine (pure logic)
  - Deck building, dealing, totals, win or loss evaluation
  - Dynamic value updates and game over checks
  - Reshuffle procedure and exhaustion counter
- State layer (orchestration)
  - Round lifecycle, UI locking, animations timing hooks
  - Single point of persistence on game over with idempotency guard
- UI layer (presentation)
  - Panels, tile rendering, transitions and motion
  - Background layer mounted behind the UI and never intercepting pointer events
- Storage
  - Leaderboard and player name persistence via localStorage with schema guarding

This separation allows adding new features like different deck compositions, alternative scoring, difficulty modes, new panels, or extended animations without rewriting the engine or UI.

## Accessibility and UX
- Keyboard focus states for interactive controls
- prefers-reduced-motion support
- Background does not block clicks and is intentionally subtle to keep readability

## AI usage disclosure
I used AI as an assistant during development, primarily for:
- Initial scaffolding suggestions and iterative refactoring ideas
- Animation and UI polish ideas
- Writing and refining documentation text

Handwritten by me:
- Game engine rules and state transitions
- Persistence and leaderboard logic, including idempotent save behavior
- UI layout and CSS implementation
- Unit tests and Playwright tests
- Debugging and fixing production issues found during testing

Verification steps I used:
- Manual gameplay testing across many rounds to confirm stability and game over conditions
- Vitest unit tests for core rules and edge cases
- Playwright E2E tests that play the game like a real user and validate persistence and UI stability

## Deployment
Deployed on Vercel:
https://hand-betting-game.vercel.app/

## Notes for reviewers
- Leaderboard is localStorage-based by design, no backend is required.
- Game over saving is triggered exactly once per game session, guarded against duplicate writes.
- UI is designed for stability after many rounds, avoiding layout shift and uncontrolled growth.
