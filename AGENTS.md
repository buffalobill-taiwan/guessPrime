# guessPrime
Static HTML game - guess if displayed number is prime.
- Open index.html directly in browser (no build needed)
- File structure: index.html, css/ (uikit, style), js/ (game.js, math-utils.js)
- Use UIKit CSS framework for layout
- Mobile fixed portrait mode
- Features: Audio feedback (Audio API), animations and CSS transitions
- Number generation: 50% prime, 50% semiprime (p×q)
  - For n bits: p = 50% floor(n/2), 50% floor(n/2)-1 bits; q = matching length
  - Validate result falls in [2^(bits-1), 2^bits-1], regenerate if not
- Number range: [2^(bits-1), 2^bits-1], bits: 8→64
- Right: bits+1 (max 64); Wrong: bits-1 (min 8)
- Use BigInt + Miller-Rabin for primality test
- Flow: Show number → Guess → Show result + p×q (sorted smallest to largest, if semiprime) + Next button
