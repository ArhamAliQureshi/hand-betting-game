# PRD
Hand Betting Game (Mahjong Tiles)

## 1. Overview
A single-player hand betting game using Mahjong tiles. The player predicts whether the next hand total will be higher or lower than the current hand total. The game emphasizes polish: premium casino UI, smooth motion, stable layout, and feature-ready architecture.

## 2. Goals
- Deliver a fully playable game with correct rules, scoring, and game-over conditions.
- Premium UI/UX quality: stable layout after many rounds, clear hierarchy, tactile tiles, smooth transitions.
- Scalable, modular code that supports future rules or UI expansion.
- Strong verification: unit tests for engine/state and Playwright E2E tests that reach game-over through real gameplay.

## 3. Non-goals
- No backend.
- No accounts, login, or server-side leaderboard.
- No multiplayer.
- No real money or payments.

## 4. Key screens
1) Landing
2) Gameplay
3) Game Over

## 5. Player flow
1) Landing: player enters name, reviews leaderboard, starts a new game.
2) Gameplay: player sees current hand, total, and chooses Higher or Lower.
3) After each bet, the next hand is dealt and outcome is shown. Score updates.
4) Game ends when a game-over condition occurs.
5) Game Over screen shows final score. Score is saved to leaderboard with player name. Player can start a new game or return to landing.

## 6. Core game rules

### 6.1 Hand size
- Each hand contains exactly 4 tiles.

### 6.2 Hand total
- Hand total is the sum of the tile values in the hand at that moment.

### 6.3 Bet types
- Bet Higher: predict next hand total will be strictly higher than current total.
- Bet Lower: predict next hand total will be strictly lower than current total.
- Tie handling: if next total equals current total, the bet is treated as a loss.

### 6.4 Tile categories and values
The game uses Mahjong tiles, rendered as real Mahjong faces.

#### Numeric suit tiles
- Suits: Characters (Wan), Bamboo (Sou), Dots (Pin)
- Values: 1 to 9
- Base value equals the number shown on tile
- Numeric tiles never change value during the game

#### Honor tiles
- Winds: East, South, West, North
- Dragons: Red, Green, White
- Each wind tile and each dragon tile has its own dynamic value that can change over time
- Dynamic values are per tile instance, tracked by unique tileId

### 6.5 Dynamic value update rule
After each round resolves:
- If player wins:
  - For every Wind tile in the current hand: its dynamic value increases by 1
  - For every Dragon tile in the current hand: its dynamic value increases by 1
- If player loses:
  - For every Wind tile in the current hand: its dynamic value decreases by 1
  - For every Dragon tile in the current hand: its dynamic value decreases by 1
- Numeric suit tiles do not change

Important: dynamic values persist across reshuffles and across the whole game, until game over.

### 6.6 Deck and piles
- The game has:
  - Draw Pile (face down)
  - Discard Pile (face down)
- Dealing:
  - Each round draws 4 tiles from the Draw Pile to form the next hand.
- Discarding:
  - After a hand is used, its 4 tiles are moved to the Discard Pile.

### 6.7 Reshuffle rule (draw pile exhaustion)
When the Draw Pile runs out of tiles:
1) Add a fresh full deck worth of tiles (new tile instances with new tileIds) to the game.
2) Combine that fresh deck with the Discard Pile.
3) Shuffle the combined set to become the new Draw Pile.
4) Empty the Discard Pile.
5) Increment the draw pile exhaustion counter by 1.

Clarification:
- This exhaustion counter tracks how many times the draw pile has run out and required the reshuffle procedure above.

### 6.8 Game over conditions
The game ends immediately when any of the following occurs:
1) Any single dynamic tile value reaches 0 or 10:
   - If any Wind tile dynamic value becomes 0 or lower, game over.
   - If any Wind tile dynamic value becomes 10 or higher, game over.
   - Same for Dragon tiles.
2) The Draw Pile runs out of tiles for the 3rd time:
   - When the exhaustion counter reaches 3, game over.

Game over triggers must be checked after applying value updates and after any reshuffle increment.

### 6.9 Scoring
- Score starts at 0.
- Each correct bet adds +1.
- Incorrect bet adds +0.
- Score is final score on game over.

## 7. UI requirements

### 7.1 General UI requirements
- Must follow DESIGN_GUIDE.md and mock.png as visual targets.
- Dark casino theme with purple glow, magenta accents, gold highlights.
- Layout must be stable after many rounds:
  - Current hand tiles never wrap
  - History is bounded and scrollable horizontally
  - No UI drift, overlap, or uncontrolled growth

### 7.2 Landing screen requirements
Must include:
- Player Name input:
  - Required
  - Trim whitespace
  - 2 to 16 characters
  - Allowed characters: letters, numbers, space, underscore, hyphen
  - Prefill from last saved name in localStorage if available
- New Game button:
  - Starts game and routes to Gameplay
- Leaderboard (Top 5):
  - Shows rank, player name, score
  - Sorted by score desc
  - Tie-breaker: earliest timestamp first
- Clear Leaderboard button:
  - Must show confirmation before clearing
  - Clears leaderboard localStorage and updates UI instantly

### 7.3 Gameplay screen requirements
Must include:
- Back to Landing
- Draw Pile count and Discard Pile count
- Current hand:
  - 4 Mahjong tiles with real faces
  - Total displayed prominently
- Bet buttons:
  - Bet Higher
  - Bet Lower
  - Disabled while resolving and after game over
- History view:
  - Shows previous hands with smaller tiles and totals
  - Bounded height
  - Horizontal scroll
- Optional score recap panel is allowed but must not replace required History

### 7.4 Game Over screen requirements
Must include:
- Final score
- Player name displayed
- Save score to leaderboard automatically when game over occurs
- Actions:
  - New Game
  - Back to Landing

## 8. Mahjong tile rendering requirements
- Use real Mahjong symbols, not abbreviations.
- Tile faces must be created in-repo as SVG (preferred) or generated assets.
- Do not download or embed external copyrighted tile images.

Tile faces must cover:
- Characters 1 to 9 (Chinese numerals plus 萬)
- Bamboo 1 to 9 (bamboo sticks, with a distinct 1-bamboo bird if desired but optional)
- Dots 1 to 9 (pip patterns)
- Winds: 東 南 西 北
- Dragons:
  - Red: 中
  - Green: 發
  - White: framed blank

Dynamic value badge for Winds and Dragons:
- Rendered as a UI badge on top-right, not embedded in SVG.

## 9. Animations and motion requirements
Follow DESIGN_GUIDE.md. Must include:
- Deal stagger for tiles
- Bet lock glow and dim
- Reveal sequence: tiles settle, total counts up, outcome feedback
- +1 or -1 popovers for wind and dragon value changes
- History slide-in and pulse for newest entry
- Reshuffle toast near pile counters
- Game over modal transition

Constraints:
- Do not animate layout properties that cause layout shift.
- Use transform and opacity.
- Respect prefers-reduced-motion.

## 10. Data and persistence

### 10.1 Leaderboard storage model
- Store entries as:
  - { name: string, score: number, ts: number }
- Keep only top 5 entries by score desc.
- Tie-breaker: earliest ts first.
- Provide clear function to wipe leaderboard.

### 10.2 Player name persistence
- Store last used player name in localStorage.
- Prefill input from last used name.

## 11. Testing and verification

### 11.1 Unit tests (Vitest)
Engine tests must cover:
- Correct hand totals
- Win and lose update rules for winds and dragons
- Numeric tiles do not change
- Game over at 0 and 10
- Reshuffle procedure and exhaustion counter increments
- Third exhaustion triggers game over
- History snapshots are immutable

State tests must cover:
- Round lifecycle
- Input locking during resolving and after game over
- Leaderboard save called on game over
- Clear leaderboard function works

### 11.2 E2E tests (Playwright)
- Must play like a real user with real clicks.
- No state injection, no forced triggers, no debug controls that modify state.
- Test must reach game over naturally via gameplay within a reasonable cap (default 500 rounds).
- Capture screenshots at rounds 1, 20, 40, and game over.
- Produce JSON run report including per-round totals, bet choice, outcome, draw/discard counts.
- Separate test verifies layout stability after 40 rounds.

## 12. Acceptance criteria checklist
- Landing has player name input, New Game, leaderboard top 5, and clear leaderboard with confirmation.
- Gameplay displays: back, draw/discard counts, 4 Mahjong tiles, total, bet buttons, history.
- Game over triggers correctly:
  - any wind or dragon reaches 0 or 10
  - draw pile exhaustion counter reaches 3
- Game over reached naturally in Playwright agent test.
- UI matches mock.png and DESIGN_GUIDE.md theme and layout, no drift after many rounds.
- All scripts pass: lint, test, build, Playwright.
