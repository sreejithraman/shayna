# Shayna Dunkelman Portfolio

## Overview

Multi-page portfolio for Shayna Dunkelman, percussionist with electronic influence. Dark, atmospheric, indigo/purple palette. Subtle interactive accents.

## Stack

- **Astro** — Static site generator
- **Tailwind CSS** — Utility-first styling, design tokens via config
- **GSAP + ScrollTrigger** — Parallax, horizontal scroll
- **Lenis** — Smooth scroll
- **TypeScript** — Type safety, config types
- **Canvas** — Grain effect rendering

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
| Canvas grain, noise, particles | `canvas-effects` |
| Cursor proximity, touch reactivity | `cursor-reactivity` |
| All code changes | `software-engineering` |

## Structure

```
/pages
├── index.astro      — Hero + FeaturedArt + Feed + FeaturedWork
├── work.astro       — Full work gallery
├── feed.astro       — Instagram feed
├── about.astro      — About page
└── contact.astro    — Contact page

/components
├── Hero.astro           — Name reveal, parallax photo, ken-burns
├── Nav.astro            — Navigation, donate button
├── FeaturedArt.astro    — Album reveal with scroll effects
├── FeaturedWork.astro   — Work grid + video lightbox
├── Feed.astro           — Horizontal scroll gallery
└── Discography.astro    — Album grid

/scripts (effect modules)
├── smooth-scroll.ts     — Lenis + ScrollTrigger sync
├── page-grain.ts        — Canvas noise overlay
├── parallax.ts          — Scroll-based parallax
├── dramatic-reveal.ts   — Scroll reveal animations
├── text-reveal.ts       — Character-level animation
├── ken-burns.ts         — Slow zoom effect
└── horizontal-scroll.ts — Drag scroll for feed
```

## Design Tokens

```css
/* Colors */
--bg-void: #0a0a0a
--bg-subtle: #0f0f0f
--accent-indigo: #6366f1
--accent-purple: #8b5cf6
--glow-color: var(--accent-purple)
--text-primary: #f5f5f5
--text-secondary: #999999

/* Effects (configurable in src/config/site.ts) */
--grain-density: 0.5
--vibration-intensity: 1
--glow-intensity: 0.3
--parallax-rate: 0.1
--hero-ratio: 40
```

## Typography

- **Name**: Unbounded (bold, large)
- **Body**: Space Grotesk

## Key Interactions

### Name Grain Effect
- Canvas-rendered grain texture inside letterforms
- Ambient motion: slow drift always active
- Cursor proximity (desktop): intensifies grain
- Touch (mobile): tap triggers intensity burst

### Parallax
- Photo and name scroll at different rates
- Subtle depth, configurable via config

### Horizontal Feed
- Instagram feed scrolls horizontally
- Touch/swipe on mobile, drag/scroll on desktop

## Data Attributes

Effects are applied via data attributes:

| Attribute | Effect |
|-----------|--------|
| `data-parallax="0.5"` | Parallax at 50% speed |
| `data-reveal` | Scroll reveal animation |
| `data-reveal-blur` | Add blur to reveal |
| `data-reveal-parallax` | Add parallax to reveal |
| `data-reveal-intensity="gentle"` | Softer animation (gentle/subtle) |
| `data-ken-burns` | Slow zoom effect |
| `data-text-reveal` | Character animation |

See `.docs/effects.md` for full documentation.

## Documentation

Detailed documentation in `.docs/`:
- `effects.md` — Effect scripts and data attributes
- `components.md` — Component inventory and props
- `config.md` — site.ts configuration reference

## Configuration

All effects are configurable via `src/config/site.ts`. Build structure first, tune visuals later.

## Reference

The `.plans/references/` folder contains:
- **Moodboard** — Color palette, typography, motion principles

See `.plans/implementation-plan.md` for phased build plan.

## Do Not

- Autoplay any audio/video
- Skip accessibility (semantic HTML, alt text, focus states, reduced motion)
- Make cursor the visual subject (elements react to cursor, cursor stays clean)
- Over-animate (effects are accents, not the show)
