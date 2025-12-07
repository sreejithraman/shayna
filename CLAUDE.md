# Shayna Dunkelman Portfolio

## Overview

Portfolio website for Shayna Dunkelman, avant-garde musician and percussionist based in Brooklyn. Dark, atmospheric, sophisticated aesthetic.

## Stack

- **Astro** — Static site generator
- **Tailwind CSS** — Utility-first styling
- **GSAP + ScrollTrigger** — Scroll-linked animations
- **Lenis** — Smooth scroll
- **TypeScript** — Type safety

## Commands

- `npm install` — Install dependencies
- `npm run dev` — Start development server
- `npm run build` — Production build

## Skills

Invoke these skills when entering their domains:

| Context | Skill |
|---------|-------|
| TypeScript code | `typescript` |
| .astro files, components | `astro` |
| Tailwind classes | `tailwind` |
| CSS, layout, animations | `css` |
| GSAP, ScrollTrigger | `gsap` |
| Lenis smooth scroll | `lenis` |
| Design specs, tokens | `design-system` |
| All code changes | `software-engineering` |

## Key Features

### Threshold Animation (Critical)
The homepage hero where the name transitions from large centered text to small nav logo on scroll. This is the signature interaction.

### Photo Parallax
Hero photo responds to cursor (desktop) or gyroscope (mobile).

### Expandable Projects
Work page has project cards that expand in-place to show details.

## Design Tokens

```css
--bg-void: #0a0a0a       /* Near-black background */
--bg-subtle: #0f0f0f
--bg-elevated: #161616
--text-primary: #f5f5f5
--text-secondary: #999999
--text-muted: #555555
--accent-violet: #8b5cf6
```

## Typography

- Headlines: Space Grotesk (300, 400, 500)
- Labels: Space Mono (monospace)

## Reference

See `TECHNICAL-HANDOFF.md` for detailed specs on animations, layout, and implementation.

## Do Not

- Autoplay any audio/video
- Add decorative waveforms (reserved for actual audio playback)
- Skip accessibility (semantic HTML, alt text, focus states, reduced motion)
- Use heavy JS when Astro static rendering suffices
