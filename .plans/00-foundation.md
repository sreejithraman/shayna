---
phase: 0
title: "Foundation & Infrastructure"
status: complete
priority: P0
effort: medium
dependencies: []
blockers: []
started: 2025-12-07
completed: 2025-12-07
owner: null
---

# Phase 0: Foundation & Infrastructure

Project setup, design tokens, and base layout scaffolding.

## Objectives

- [ ] Initialize Astro project with TypeScript
- [ ] Configure Tailwind CSS with custom design tokens
- [ ] Set up GSAP and Lenis smooth scroll
- [ ] Create base layout component
- [ ] Implement background texture (grain + color wash)

## Tasks

### 1. Project Initialization

```bash
npm create astro@latest shayna-portfolio -- --template minimal --typescript strict
cd shayna-portfolio
npm install
```

**Configuration:**
- Enable TypeScript strict mode
- Set up path aliases (`@/` → `src/`)
- Configure VS Code settings

### 2. Install Dependencies

```bash
npm install gsap @studio-freight/lenis
npm install -D tailwindcss @astrojs/tailwind
npx astro add tailwind
```

### 3. Design Tokens (Tailwind Config)

Extend `tailwind.config.mjs` with:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        void: '#0a0a0a',
        subtle: '#0f0f0f',
        elevated: '#161616',
        smoke: '#2a2a2a',       // borders, dividers
        primary: '#f5f5f5',
        secondary: '#999999',
        muted: '#555555',
        violet: '#8b5cf6',      // cool accent (Home)
        blue: '#3b82f6',        // secondary cool
        amethyst: '#a855f7',    // warm accent
        ember: '#dc2626',       // warm accent (Work/Press)
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
      },
    },
  },
}
```

### 4. Global Styles

Create `src/styles/global.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500&family=Space+Mono&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-void: #0a0a0a;
  --bg-subtle: #0f0f0f;
  --bg-elevated: #161616;
  --bg-smoke: #2a2a2a;
  --text-primary: #f5f5f5;
  --text-secondary: #999999;
  --text-muted: #555555;
  --accent-violet: #8b5cf6;
  --accent-blue: #3b82f6;
  --accent-amethyst: #a855f7;
  --accent-ember: #dc2626;
}

html {
  background-color: var(--bg-void);
  color: var(--text-primary);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 5. Base Layout Component

Create `src/layouts/BaseLayout.astro`:

```astro
---
interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Shayna Dunkelman — Avant-garde musician and percussionist' } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body class="bg-void text-primary antialiased">
    <slot name="background" />
    <slot />
  </body>
</html>
```

### 6. Background Texture Component

Create `src/components/BackgroundTexture.astro`:

**Requirements:**
- SVG noise pattern at 3% opacity (per moodboard reference)
- Fixed position, covers viewport
- Subtle radial violet wash
- Responds to cursor/gyro (0.3x movement)

```astro
---
// BackgroundTexture.astro
---

<div class="fixed inset-0 pointer-events-none z-0" id="bg-texture">
  <!-- Grain layer (3% opacity) -->
  <div class="absolute inset-0 opacity-[0.03]" id="grain"></div>

  <!-- Color wash -->
  <div
    class="absolute inset-0"
    style="background: radial-gradient(ellipse 80% 60% at 50% 30%, rgba(139, 92, 246, 0.04) 0%, transparent 70%);"
    id="wash"
  ></div>
</div>

<script>
  // Grain SVG generation and interaction will be added in threshold phase
</script>
```

### 7. Lenis Smooth Scroll Setup

Create `src/scripts/smooth-scroll.ts`:

```typescript
import Lenis from '@studio-freight/lenis';

export function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  return lenis;
}
```

### 8. File Structure

Create the directory scaffold:

```
src/
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   ├── index.astro
│   ├── work.astro
│   ├── about.astro
│   └── press.astro
├── components/
│   └── BackgroundTexture.astro
├── content/
│   └── (placeholder)
├── styles/
│   └── global.css
└── scripts/
    └── smooth-scroll.ts
```

## Acceptance Criteria

- [ ] `npm run dev` starts without errors
- [ ] Design tokens accessible via Tailwind classes
- [ ] Space Grotesk and Space Mono fonts load correctly
- [ ] Background has subtle grain texture
- [ ] Smooth scroll working on page load
- [ ] Reduced motion preference respected
- [ ] Base layout renders with proper meta tags

## Technical Notes

- Use `@astrojs/tailwind` integration for optimal bundling
- Lenis should integrate with GSAP ScrollTrigger (set up in Phase 1)
- Grain texture should be performant (GPU-accelerated, minimal repaints)

## Dependencies

None — this is the foundation phase.

## Blocks

- Phase 1 (Threshold) depends on background texture
- Phase 2 (Navigation) depends on base layout
- All subsequent phases depend on design tokens
