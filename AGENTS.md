# guessPrime - Developer Guide

Static HTML game - guess if displayed number is prime.

## Core Features
- **No Build Required**: Open `index.html` directly in any modern browser.
- **Accessibility (A11y)**: Uses `aria-live="polite"` and `aria-atomic="true"` to ensure screen readers announce game results (Correct/Wrong and factorizations).
- **Sensory Feedback**: 
  - **Audio**: Web Audio API for frequency-based feedback (High sine for correct, low sawtooth for wrong).
  - **Haptic**: Vibration API support for mobile devices.
  - **Visual**: CSS animations (`pop`, `shake`) and transitions.
- **High Precision**: Uses `BigInt` to support primality testing up to 64-bit numbers.

## Project Structure
- `index.html`: Game entry point and ARIA-enhanced DOM structure.
- `css/`: 
  - `uikit.min.css`: UI framework.
  - `style.css`: Custom game styling and animations.
- `js/`:
  - `game.js`: Core game loop, event listeners, and difficulty control.
  - `math-utils.js`: Mathematical engine (Miller-Rabin primality test, BigInt generation).
  - `particle-engine.js`: (Optional/Removed) Particle effects engine.

## Development Guidelines

### Number Generation Logic
- **Range**: $[2^{bits-1}, 2^{bits}-1]$, where $bits$ ranges from $8 \to 64$.
- **Distribution**: 
  - 50% probability: Prime number.
  - 50% probability: Semiprime ($p \times q$).
- **Difficulty Scaling**: 
  - Correct guess: `bits++` (Max 64).
  - Wrong guess: `bits--` (Min 8).

### Implementation Notes
- **Primality Test**: Always use the **Miller-Rabin** algorithm within `math-utils.js` for efficiency with large numbers.
- **Randomness**: Use `window.crypto.getRandomValues` via `math-utils.js` to ensure cryptographically strong random numbers.
- **Audio/UI Sync**: Ensure `AudioContext` is triggered via a user gesture (click/touch) to comply with browser autoplay policies.
- **CSS Reflow**: When triggering animations in `game.js`, use `void element.offsetWidth` to force a reflow.
