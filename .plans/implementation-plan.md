# Shayna Dunkelman Portfolio — Implementation Plan

Single-page portfolio for percussionist with electronic influence. Dark, atmospheric, indigo/purple palette. Subtle interactive accents.

## Structure

```
┌─────────────────────────────────────────┐
│  [PHOTO]  │  SHAYNA DUNKELMAN           │  ← Hero (desktop: 40/60 split)
│           │  (grain + vibration)         │
└─────────────────────────────────────────┘
                    ↓ scroll
┌─────────────────────────────────────────┐
│  ◻︎ ◻︎ ◻︎ ◻︎ ◻︎ ◻︎ ◻︎ →→→                     │  ← Instagram feed (horizontal scroll)
└─────────────────────────────────────────┘
                    ↓ scroll
┌─────────────────────────────────────────┐
│  Bio text. Lorem ipsum...               │  ← Bio section (clean)
└─────────────────────────────────────────┘
```

Mobile: Stacked layout (photo → name → feed → bio)

---

## Tech Stack

- **Astro** — Static site, islands for interactive components
- **Tailwind CSS** — Styling, design tokens via config
- **GSAP + ScrollTrigger** — Parallax, horizontal scroll
- **Lenis** — Smooth scroll
- **TypeScript** — Type safety, config types
- **Canvas** — Grain effect rendering

---

## Design Tokens (Configurable)

### Colors
```css
--bg-void: #0a0a0a
--bg-subtle: #0f0f0f
--accent-indigo: #6366f1
--accent-purple: #8b5cf6
--glow-color: var(--accent-purple)
```

### Typography
- **Name**: Unbounded (bold, large)
- **Body**: Space Grotesk

### Effects
```css
--grain-density: 0.5          /* 0-1 */
--grain-color: var(--accent-indigo)
--vibration-intensity: 1      /* 0=off, 1=whisper, 2=murmur */
--vibration-radius: 150px
--glow-intensity: 0.3         /* 0-1 */
--parallax-rate: 0.1          /* 0-0.3 */
--hero-ratio: 40              /* left side percentage */
```

---

## Phase 1: Foundation

**Goal**: Clean slate, design tokens, fonts, config structure

### Tasks
- [ ] Clear existing page content (keep BaseLayout shell)
- [ ] Remove old components (Threshold, BackgroundTexture)
- [ ] Remove old scripts (threshold.ts, photo-interaction.ts)
- [ ] Set up design tokens in Tailwind config
- [ ] Add Unbounded font (Google Fonts or local)
- [ ] Create `src/config/site.ts` for effect configuration
- [ ] Create TypeScript types for config

### Deliverable
Empty page with fonts loading, tokens available, config structure in place

---

## Phase 2: Layout Shell

**Goal**: Responsive layout for all three sections, no effects

### Tasks
- [ ] Hero section: photo placeholder left, name right (desktop)
- [ ] Hero section: stacked layout (mobile)
- [ ] Configurable hero ratio via CSS custom property
- [ ] Feed section: placeholder area for horizontal scroll
- [ ] Bio section: text container with placeholder content
- [ ] Responsive breakpoints (mobile-first)
- [ ] Viewport height handling

### Deliverable
Three-section page, fully responsive, placeholder content

---

## Phase 3: Typography & Color

**Goal**: Visual identity in place

### Tasks
- [ ] Apply Unbounded to name (weight, size, responsive scaling)
- [ ] Apply Space Grotesk to body text
- [ ] Dark palette applied (backgrounds, text colors)
- [ ] Test color contrast for accessibility
- [ ] Add subtle glow to name (CSS, configurable)

### Deliverable
Page looks close to final visually (minus motion)

---

## Phase 4: Horizontal Feed

**Goal**: Working horizontal scroll for Instagram section

### Tasks
- [ ] Set up Instagram Basic Display API integration
- [ ] Create feed data fetching (build-time or client-side)
- [ ] Horizontal scroll container with GSAP ScrollTrigger
- [ ] Feed card component (image, link)
- [ ] Touch/swipe support for mobile
- [ ] Scroll indicators or hints
- [ ] Fallback for API failure (static images)

### Deliverable
Scrollable Instagram feed, works on desktop and mobile

---

## Phase 5: Parallax

**Goal**: Subtle depth on scroll

### Tasks
- [ ] Photo parallax (slight lag on scroll)
- [ ] Name parallax (different rate than photo)
- [ ] Configurable parallax rate via CSS/JS config
- [ ] Respect reduced motion preference
- [ ] Test performance on mobile

### Deliverable
Hero has subtle parallax depth, configurable

---

## Phase 6: Grain Effect

**Goal**: Animated grain texture in name letterforms

### Tasks
- [ ] Create Canvas grain component
- [ ] Grain renders inside name text (mask/clip)
- [ ] Ambient motion: slow drift always active
- [ ] Configurable: density, color, speed
- [ ] Performance optimization (requestAnimationFrame, throttle)
- [ ] Mobile: ensure smooth 60fps

### Deliverable
Name has living grain texture, ambient motion

---

## Phase 7: Cursor & Touch Reactivity

**Goal**: Grain responds to interaction

### Tasks
- [ ] Desktop: cursor position affects grain intensity
- [ ] Proximity-based: closer to name = more intensity
- [ ] Configurable: vibration radius, intensity scale
- [ ] Mobile: tap on name triggers intensity burst
- [ ] Settle animation: grain calms after interaction ends
- [ ] Respect reduced motion preference

### Deliverable
Interactive grain effect, works on both platforms

---

## Phase 8: Glow Effects

**Goal**: Subtle glow accents

### Tasks
- [ ] Name glow: soft purple/indigo halo
- [ ] Glow responds to grain intensity (optional)
- [ ] Configurable: color, intensity, blur radius
- [ ] Performance check (box-shadow vs filter vs pseudo-element)

### Deliverable
Glow effect enhances name presence

---

## Phase 9: Polish

**Goal**: Production-ready

### Tasks
- [ ] Reduced motion: disable grain animation, parallax
- [ ] Loading states for feed
- [ ] Error handling for Instagram API
- [ ] SEO: meta tags, Open Graph
- [ ] Accessibility audit: focus states, semantic HTML, alt text
- [ ] Performance audit: Lighthouse score
- [ ] Cross-browser testing
- [ ] Final config tuning

### Deliverable
Production-ready single page

---

## Config Structure

```typescript
// src/config/site.ts
export const siteConfig = {
  // Content
  name: "Shayna Dunkelman",
  bio: "...",
  instagram: {
    username: "...",
    accessToken: process.env.INSTAGRAM_TOKEN,
  },

  // Layout
  hero: {
    ratio: 40, // left side percentage
  },

  // Effects
  grain: {
    enabled: true,
    density: 0.5,
    color: "#6366f1",
    ambientSpeed: 0.5,
  },

  vibration: {
    enabled: true,
    intensity: 1, // 0=off, 1=whisper, 2=murmur
    radius: 150,
    recovery: 400, // ms
  },

  parallax: {
    enabled: true,
    photoRate: 0.05,
    nameRate: 0.1,
  },

  glow: {
    enabled: true,
    color: "#8b5cf6",
    intensity: 0.3,
  },
};
```

---

## File Structure (Target)

```
src/
├── config/
│   └── site.ts              # Centralized config
├── components/
│   ├── Hero.astro           # Photo + Name section
│   ├── GrainText.astro      # Name with canvas grain
│   ├── GrainCanvas.ts       # Canvas grain logic
│   ├── Feed.astro           # Instagram horizontal scroll
│   ├── FeedCard.astro       # Individual feed item
│   └── Bio.astro            # Bio section
├── layouts/
│   └── BaseLayout.astro     # Shell, fonts, global styles
├── pages/
│   └── index.astro          # Single page
├── styles/
│   └── tokens.css           # CSS custom properties
└── scripts/
    ├── smooth-scroll.ts     # Lenis setup
    ├── parallax.ts          # GSAP parallax
    └── horizontal-scroll.ts # Feed scroll logic
```
