# PRD.md
Hand Betting Game (Mahjong Tiles)
Product Requirements Document

Source of truth: Technical Assessment brief. All requirements below are derived from that document and do not add backend dependencies. :contentReference[oaicite:0]{index=0}

## 1. Objective
Build a web-based Hand Betting Game using Mahjong tiles that demonstrates:
- High UI polish with smooth transitions
- Strong state management and deterministic game logic
- Feature-ready architecture for onsite extensions

## 2. In Scope
- Landing page with New Game and Top 5 Leaderboard
- Gameplay loop with betting Higher or Lower on the next hand’s total
- Mahjong tile set: Numbers, Dragons, Winds
- Dynamic tile value scaling for Dragons and Winds
- Deck management with draw pile, discard pile, reshuffle behavior
- Game-over rules
- History view of previous hands
- End-of-game score summary

## 3. Out of Scope
- Backend, authentication, accounts, cloud persistence
- Multiplayer
- Payments, monetization
- Complex analytics pipeline
- Social sharing

## 4. User Stories
### Landing
- As a player, I can start a new game from the landing page. :contentReference[oaicite:1]{index=1}
- As a player, I can see the top 5 high scores on the landing page. :contentReference[oaicite:2]{index=2}

### Gameplay
- As a player, I can see the current hand’s tiles and total value. :contentReference[oaicite:3]{index=3}
- As a player, I can bet Higher or Lower for the next hand. :contentReference[oaicite:4]{index=4}
- As a player, I can see the draw pile and discard pile counts at all times. :contentReference[oaicite:5]{index=5}
- As a player, I can see a history strip of prior hands (tiles and values). :contentReference[oaicite:6]{index=6}
- As a player, I can exit gameplay and return to the landing page. :contentReference[oaicite:7]{index=7}
- As a player, when the game ends, I see a final score summary screen. :contentReference[oaicite:8]{index=8}

## 5. Functional Requirements

### 5.1 Landing Page
1. New Game button
   - Starts a new game session.
2. Leaderboard
   - Displays top 5 high scores, sorted descending.
   - Storage: local browser persistence (localStorage) is allowed and recommended to meet leaderboard display without backend.

Acceptance criteria:
- Landing page includes New Game and top 5 high scores. :contentReference[oaicite:9]{index=9}

### 5.2 Tile Set and Values
Tiles include:
- Number tiles
- Dragons
- Winds :contentReference[oaicite:10]{index=10}

Tile values:
- Number tiles: value equals face value. :contentReference[oaicite:11]{index=11}
- Dragons and Winds: start at base value 5. :contentReference[oaicite:12]{index=12}
- Dynamic scaling is per tile instance:
  - If a Dragon or Wind tile is part of a winning hand, its value increases by 1.
  - If part of a losing hand, its value decreases by 1. :contentReference[oaicite:13]{index=13}

Important rule interpretation:
- “Specific to that tile” means each non-number tile has its own mutable value that persists across rounds and reshuffles.

Acceptance criteria:
- Non-number tile values change by outcome and persist. :contentReference[oaicite:14]{index=14}

### 5.3 Hands and Betting
- The game presents a current hand.
- Player chooses one action:
  - Bet Higher: predicts next hand total will be greater than current.
  - Bet Lower: predicts next hand total will be less than current. :contentReference[oaicite:15]{index=15}

Tie handling (when next total equals current total):
- Loss by default (simple, deterministic), unless specified otherwise during interview.
- This does not add new mechanics, it defines an edge case behavior.

Hand size:
- Not specified in the brief.
- Implement as a configurable constant (HAND_SIZE) with a sensible default (for example 3 or 4).
- Must be easy to change without refactoring UI or engine.

Acceptance criteria:
- Player can bet Higher or Lower each round. :contentReference[oaicite:16]{index=16}

### 5.4 Deck Management
Piles:
- Draw Pile: source for dealing hands
- Discard Pile: tiles from prior hands

UI must display counts:
- Remaining tiles in Draw Pile
- Remaining tiles in Discard Pile :contentReference[oaicite:17]{index=17}

Reshuffle rule:
- When Draw Pile is empty:
  1. Add a fresh deck worth of tiles
  2. Combine with Discard Pile
  3. Shuffle into a new Draw Pile :contentReference[oaicite:18]{index=18}

Reshuffle count:
- Track how many times the draw pile has run out.
- This is used for game-over.

Acceptance criteria:
- Counts are visible and reshuffle follows the rule. :contentReference[oaicite:19]{index=19}

### 5.5 Game Over
Game ends when any of the following occurs:
1. Any single tile value reaches 0
2. Any single tile value reaches 10
3. The Draw Pile runs out of tiles for the 3rd time :contentReference[oaicite:20]{index=20}

Acceptance criteria:
- Game ends immediately when any condition is met and shows final score screen. :contentReference[oaicite:21]{index=21}

### 5.6 History View
- Show a History view containing previous hands.
- History displays:
  - smaller versions of tiles
  - the values for those tiles :contentReference[oaicite:22]{index=22}

Requirements:
- Keep at least the last N hands (N configurable; default 5 for UI clarity).
- History entries must be immutable snapshots, not impacted by later tile value changes.

Acceptance criteria:
- History is visible and shows prior hands. :contentReference[oaicite:23]{index=23}

### 5.7 Navigation
- Gameplay includes a clear button to exit to landing page. :contentReference[oaicite:24]{index=24}
- Exiting should reset the current session unless otherwise specified.

Acceptance criteria:
- Navigation exists and works. :contentReference[oaicite:25]{index=25}

### 5.8 Scoring
The brief requires a final score but does not define the scoring formula. :contentReference[oaicite:26]{index=26}

To keep scope deterministic and minimal, define:
- Score increments by +1 on correct bet
- Score does not change on incorrect bet

This choice:
- Avoids adding mechanics
- Is easy to explain and validate
- Keeps leaderboard meaningful

Acceptance criteria:
- Score is tracked and shown on game-over screen. :contentReference[oaicite:27]{index=27}

## 6. Non-Functional Requirements

### 6.1 Polish and UX
- Smooth transitions between phases: bet selection, reveal, outcome, history update
- Clear visual hierarchy: total is most prominent, bet actions next
- Responsive layout for mobile and desktop
- Input latency: button response within 100ms perceived
- Reduced motion support for accessibility

Evaluation alignment:
- High-quality CSS and intuitive UX are a major evaluation factor. :contentReference[oaicite:28]{index=28}

### 6.2 Scalability and Extensibility
Architecture must support easy future changes, such as:
- New tile types
- New scoring rules
- New end conditions
- Additional UI panels

Hard requirement:
- Keep game engine logic framework-agnostic (pure TypeScript modules).
- UI consumes state and dispatches actions only.

Evaluation alignment:
- Feature-ready code is a primary evaluation factor. :contentReference[oaicite:29]{index=29}

### 6.3 Code Quality
- Clean module boundaries
- Strong typing
- Minimal side effects
- Documented key functions and invariants
- Unit tests for engine logic

Evaluation alignment:
- Clean, modular, well-documented code. :contentReference[oaicite:30]{index=30}

## 7. UX Flow

### Landing
- Show New Game CTA
- Show top 5 scores
- Start new game

### Game Loop
1. Display current hand and total
2. Player selects Higher or Lower
3. Lock input
4. Deal next hand
5. Reveal total
6. Compute win or lose
7. Apply Dragon/Wind value updates for the resolved hand
8. Update score
9. Move previous hand to history and discard
10. Check game over conditions
11. Continue or end

### Game Over
- Show final score
- Provide actions: New Game, Back to Landing

## 8. State Model

### Entities
Tile
- id: unique stable identifier
- kind: number | dragon | wind
- suit: optional for numbers
- face: number for number tiles, name for dragon/wind
- value: current effective value
- baseValue: for reference, 5 for dragons/winds

Hand
- tiles: TileSnapshot[]
- total: number
- timestamp or sequence number

TileSnapshot
- tileId
- kind
- face
- valueAtThatTime

### GameState
- status: idle | running | resolving | gameOver
- drawPile: TileId[]
- discardPile: TileId[]
- tileValueById: Map<TileId, number> for dynamic tiles
- currentHand: Hand
- previousHand: Hand | null
- history: Hand[]
- score: number
- reshuffleCount: number

## 9. Rules Engine Interfaces (for feature readiness)
Provide clear extension points:
- computeTileValue(tileId, base, dynamicMap)
- resolveBet(previousTotal, nextTotal, bet): win | lose
- applyOutcomeToDynamicTiles(handTiles, outcome)
- checkGameOver(tileValueById, reshuffleCount)

## 10. Acceptance Criteria Checklist
Landing:
- New Game exists
- Leaderboard shows top 5 scores :contentReference[oaicite:31]{index=31}

Gameplay:
- Bet Higher and Bet Lower exist :contentReference[oaicite:32]{index=32}
- Current hand total and tiles visible :contentReference[oaicite:33]{index=33}
- History view visible with prior hands :contentReference[oaicite:34]{index=34}
- Draw pile and discard pile counts visible :contentReference[oaicite:35]{index=35}
- Reshuffle behavior correct when draw pile empty :contentReference[oaicite:36]{index=36}
- Game over triggers correctly on tile value 0 or 10 and on third draw pile exhaustion :contentReference[oaicite:37]{index=37}
- End screen shows final score :contentReference[oaicite:38]{index=38}

## 11. Delivery Requirements
- Public GitHub repository link :contentReference[oaicite:39]{index=39}
- README with setup instructions and note on handwritten vs AI utilized :contentReference[oaicite:40]{index=40}
- Short video walkthrough demonstrating gameplay and technical approach :contentReference[oaicite:41]{index=41}
- Submission within 4 days :contentReference[oaicite:42]{index=42}

## 12. Risks and Mitigations
- Risk: unclear hand size, tie behavior, scoring formula
  - Mitigation: implement as configurable constants and document decisions in README.
- Risk: dynamic tile values accidentally reset on reshuffle
  - Mitigation: store dynamic values by tile id and ensure reshuffle only changes pile composition, not tile state.
- Risk: UI animation causes state bugs
  - Mitigation: keep engine deterministic and treat animation as a presentation concern with a resolving phase.

## 13. Test Plan
Unit tests for engine:
- Dynamic tile increments and decrements per outcome
- Tile value bounds detection triggers game over at 0 and 10
- Reshuffle merges discard with fresh deck and increments reshuffleCount
- Third exhaustion triggers game over
- History snapshots remain stable even if tile values later change
