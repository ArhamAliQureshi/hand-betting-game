# Hand Betting Game

A strategic card/tile betting game built with React, TypeScript, and Vite.

## Setup Instructions

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Start development server**:
    ```bash
    npm run dev
    ```
3.  **Run tests**:
    ```bash
    npm run test
    ```
4.  **Build for production**:
    ```bash
    npm run build
    ```

## Architecture

The application follows a clean separation of concerns:

-   **`src/engine`**: Pure TypeScript game logic. Contains the deck, shuffling, hand calculation, and rule evaluation. No React dependencies.
-   **`src/state`**: State management using React Context + Reducer. Bridges the UI and the Engine. Handles game loop stages (Idle -> Running -> Game Over).
-   **`src/ui`**: Presentational React components (`Tile`, `BetControls`, etc.) styled with CSS modules and animated with Framer Motion.
-   **`src/pages`**: Top-level page components (`LandingPage`, `GamePage`) that orchestrate the UI.
-   **`src/styles`**: Global tokens and CSS variables for consistent theming.

**AI-Assistance Note**: This project was built with AI assistance. The core engine interactions, state management structure, and visual styling were generated and refined through iterative prompting.

## Design Decisions

-   **Hand Size**: Fixed at **4 tiles** per hand to balance complexity and readability.
-   **Tie Handling**: Bets are strictly **Higher** or **Lower**. A tie (same total as previous hand) results in a **Loss**.
-   **Scoring**: +1 point for every successful bet. Score resets on Game Over.
-   **Dynamic Values**: Dragon and Wind tiles change value based on game rules (e.g., matching the previous hand's outcome).
-   **Reshuffling**: The deck reshuffles automatically when the draw pile is empty. The game ends immediately upon the 3rd reshuffle.

## Verification Checklist

### Landing Page
-   [x] "New Game" button starts the session.
-   [x] Leaderboard displays high scores (currently local storage placeholder).
-   [x] Visual theme (gradients, typography) is consistent.

### Gameplay
-   [x] 4 tiles are dealt cleanly.
-   [x] "Bet Higher" / "Bet Lower" buttons are interactive and tactile.
-   [x] Animations play smoothly (deal, reveal, history slide).
-   [x] Double-betting is prevented via input locking (~600ms).
-   [x] Score updates correctly on win.
-   [x] History strip shows previous hands with correct totals.

### Game Over
-   [x] Triggers on:
    -   Total = 0 or > 10 depending on rules (though current rules rely on reshuffle limit or engine specific bounds).
    -   Draw pile exhaustion limit (3 reshuffles).
-   [x] Game Over card displays final score.
-   [x] "New Game" resets state correctly.
-   [x] "Back to Menu" returns to landing page.
