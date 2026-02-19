# Hand Betting Game

A high-stakes Mahjong prediction game built with React, Vite, TypeScript, and Framer Motion. This project fully implements all the requirements and rules specified in the Product Requirements Document (PRD) and Design Guide.

## Core Features

- **Pure TypeScript Engine:** The core rules, including Mahjong tile deck creation, Fisher-Yates shuffling, total calculation, tie resolution, and dynamic tile manipulation (Winds/Dragons), are implemented in a standalone, unit-testable module.
- **State Orchestration Reducer:** A deterministic React state machine using `useReducer` that orchestrates all transitions between `idle`, `playing`, `resolving`, and `gameOver` states, effectively locking user input during animations and resolving rounds asynchronously.
- **Framer Motion Integration:** Premium, smooth animations driving the layout utilizing `staggerChildren`, `AnimatePresence`, and spring physics to give the application a premium feel. Respects `prefers-reduced-motion: user`.
- **Custom SVG Mahjong Generation:** Visually renders all Mahjong tile subsets dynamically using complex DOM SVG techniques representing characters, bamboo, dots, and honors, perfectly capturing the casino neon aesthetics.
- **Persistent Storage:** `localStorage` is utilized directly safely for tracking Leaderboard history (top 5 sorted by score) and remembering previous player names with tie breaking by timestamp logic correctly resolved.
- **Vite Setup:** Speedy development environment with all standard code quality tools configured correctly out of the gate.

## Getting Started

### Development

Install the dependencies:
```bash
npm install
```

Run the development server natively:
```bash
npm run dev
```

### Testing

This project incorporates comprehensive verification combining unit testing via Vitest and end-to-end testing via Playwright.

**To run the unit tests (Engine & Storage logic):**
```bash
npm run test
```

**To run the End-to-End tests (DOM Interaction & Scenarios):**
*Note: Make sure Playwright browsers are installed: `npx playwright install chromium`*
```bash
npm run test:e2e
```

## Engineering Rules Adhered To

- **Strict Types & Error Handling:** TypeScript strict mode is enabled. Edge cases throughout storage handling have fail-safe `try/catch` wrappers.
- **Stable Layouts:** No Cumulative Layout Shift (CLS). The UI structure creates reserved placeholders with predictable skeleton widths. Game history pushes rather than shifting core layouts.
- **Dependency Minimization:** Built heavily using zero-dependency strategies. Even the complex tile visual representations are drawn mathematically using basic SVGs rather than requiring asset loading.
- **Deterministic Action Management:** Buttons appropriately respond to `disabled={isResolving || isGameOver}` ensuring asynchronous action cascades cannot occur via spam clicking.
