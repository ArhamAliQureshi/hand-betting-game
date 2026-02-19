# skills.md
Frontend UI Polish and Animation Skill for Agent

## Mission
Produce production-grade UI with stable layouts, premium CSS, and smooth animation.
Prioritize deterministic behavior, accessibility, and maintainability.
If requirements conflict, follow PRD.md first.

## Core Capabilities
### Layout and CSS Excellence
- Build stable layouts using CSS Grid and Flexbox with no layout drift over time
- Prevent CLS by using fixed dimensions for animated elements and predictable containers
- Use design tokens (CSS variables) for spacing, typography, radii, shadows, and colors
- Implement responsive design with breakpoints and container constraints
- Implement consistent focus states and accessible contrast
- Avoid ad-hoc inline styling for core layout and theming

### Animation and Motion Systems
- CSS animations: keyframes, transitions, timing functions, and reduced-motion support
- Motion libraries: Framer Motion or Motion (formerly Framer Motion) for:
  - spring-based interactions
  - staggered reveals
  - layout animations
  - gesture states (hover, tap)
- Ensure animation does not cause layout shift:
  - animate transform and opacity, not width/height
  - reserve space using fixed tile slots and stable containers
- Use motion variants and shared easing constants across components
- Respect prefers-reduced-motion:
  - disable or shorten complex transforms
  - keep critical feedback visible without motion dependency

### UI State and UX Feedback
- Clear affordances for clickable actions, disabled states, and async resolving states
- Microinteractions that support comprehension:
  - bet locking state, win/lose feedback, value change indicators (+1, -1)
- Never block input longer than necessary, target under 700ms perceived lock time
- Keep visual hierarchy consistent: primary action, current total, tiles, history, panels

### Performance and Stability
- Avoid unnecessary re-renders (memoize leaf components when needed)
- Use stable keys for lists and history
- Keep animation state local and derived, do not pollute domain state
- Optimize for Core Web Vitals: minimize layout shift, avoid expensive paints

### Testing and Verification
- Unit tests for domain logic with Vitest
- E2E tests with Playwright:
  - simulate real user play sessions
  - verify UI remains stable after many rounds
- Visual verification:
  - Playwright screenshots for round 1, mid-run, and post-run
- Accessibility checks:
  - keyboard navigation works
  - focus visible
  - reduced motion respected

## Non-Negotiable Engineering Rules
- Domain logic must remain framework-agnostic (no React imports in engine)
- Reducer or state machine owns transitions; UI only renders and dispatches intent
- No state injection or cheating in E2E tests unless a PRD-approved debug mode exists
- Document any edge-case decision in README if PRD is silent

## Animation Quality Checklist
- Use transform and opacity for motion
- Fixed tile slot sizes to prevent reflow
- Stagger timings consistent (80 to 120ms per tile)
- Single motion library used consistently
- Reduced motion path implemented and tested

## Output Expectations
When asked to change UI:
- Provide a plan
- Implement changes
- Add or update tests
- Capture screenshots as evidence
- Explain root cause for any UI drift and the concrete fix
