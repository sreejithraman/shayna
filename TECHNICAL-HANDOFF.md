# Shayna Dunkelman Portfolio — Technical Handoff

## Overview

Portfolio website for Shayna Dunkelman, avant-garde musician and percussionist based in Brooklyn. The site communicates artistic credibility and sophistication while remaining functional for industry contacts.

**Domain:** shaynadunkelmanmusic.com
**Stack:** Astro + Tailwind + GSAP + Lenis
**Hosting:** Render (static site)
**Analytics:** Umami

---

## Design Direction

### Aesthetic: "Minimalist Noir"

- Dark, atmospheric, sophisticated
- Analog warmth (grain, texture) wrapping digital precision
- Subtle interactivity that rewards attention
- No decorative waveforms — reserved for actual audio playback only

### Visual Principles

- Darkness dominates — near-black backgrounds
- Text is the primary visual element
- Photo is atmospheric, not decorative
- Motion is subtle and purposeful
- Grain texture throughout (barely visible, adds warmth)

---

## Color Palette

```css
:root {
  /* Foundation */
  --bg-void: #0a0a0a;
  --bg-subtle: #0f0f0f;
  --bg-elevated: #161616;

  /* Text */
  --text-primary: #f5f5f5;
  --text-secondary: #999999;
  --text-muted: #555555;

  /* Accent */
  --accent-violet: #8b5cf6;
  --accent-blue: #3b82f6;
}
```

---

## Typography

**Font Stack:**
- Headlines/UI: `Space Grotesk` (weights: 300, 400, 500)
- Metadata/Labels: `Space Mono` (weight: 400)

**Scale:**

| Element | Size | Weight | Notes |
|---------|------|--------|-------|
| Hero name | `clamp(32px, 8vw, 64px)` | 300 | Light, large |
| Nav logo (locked) | `14px` | 400 | After scroll transition |
| Section headers | `clamp(24px, 4vw, 36px)` | 300 | |
| Lead paragraph | `clamp(18px, 3vw, 24px)` | 400 | `line-height: 1.6` |
| Body text | `clamp(16px, 2.5vw, 19px)` | 400 | `line-height: 1.8` |
| Labels/metadata | `10px` | 400 | Space Mono, uppercase, `letter-spacing: 0.1em` |

---

## Site Structure

```
Home (/)
├── Threshold (100vh hero with photo + name)
├── Bio (short intro)
├── Latest (single featured item)
├── Instagram Feed (embedded, styled to match)
└── Footer (contact form + social links)

Work (/work)
├── Header
├── Curated Projects (5-7 expandable items)
├── Divider
└── Archive (denser grid, all projects)

About (/about)
├── Photo + Extended Bio
├── Artist Statement
└── Background/Influences

Press (/press)
├── Header
└── Press Grid (logo + quote + link cards)
```

---

## Threshold Behavior (Critical)

The homepage threshold is the signature interaction. A single `<h1>` element transitions through three states based on scroll position.

### Phase 1: Hero (scroll 0–85vh)
- Name large, centered horizontally over photo
- Rises with scroll (parallax rate: 0.5x)
- Photo responds to cursor (desktop) / gyroscope (mobile)

### Phase 2: Transition (scroll 85vh–140vh)
- Name shrinks from ~64px → 14px
- Moves from center → top-left nav position
- Easing: `ease-out-cubic`
- Transform origin shifts from center to left

### Phase 3: Locked (scroll 140vh+)
- Name fixed in nav position (top-left)
- Acts as logo/home link
- Nav links fade in
- Stays fixed for rest of page

### Animation Constants

```javascript
const PHASE1_END = window.innerHeight * 0.85;
const PHASE2_END = window.innerHeight * 1.4;

const NAME_START_SIZE = 64; // px (clamped)
const NAME_END_SIZE = 14;   // px
const NAME_START_POSITION = { x: '50%', y: '50%' };
const NAME_END_POSITION = { x: '40px', y: '24px' };

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
```

---

## Photo Layer

### Behavior
- Fixed position, behind content
- Responds to cursor position (desktop) or device tilt (mobile)
- Parallax on scroll: moves at 0.4x speed, fades out into content
- Container: `min(400px, 80vw)` × `min(550px, 75vh)`

### Movement Values
```javascript
const PHOTO_MOVE = 25;           // px max offset from cursor/gyro
const PHOTO_SCROLL_PARALLAX = 0.4;
const FADE_START = window.innerHeight * 0.3;
const FADE_END = window.innerHeight * 1.2;
```

### Photo Treatment
```css
.photo {
  filter: grayscale(15%) contrast(1.05) brightness(0.9);
}

/* Bottom fade into void */
.photo-fade-bottom {
  background: linear-gradient(to top, var(--bg-void) 0%, transparent 100%);
  height: 60%;
}
```

### Photo Requirements (for Shayna)
- High resolution (minimum 1200px height)
- Subject centered with headroom above
- Dark or neutral background preferred
- Portrait orientation works best

---

## Background Texture

### Grain
- SVG noise pattern, fixed position
- Opacity: 6%
- Subtle movement on cursor/gyro (0.3x photo movement)

### Color Wash
- Radial gradient with subtle violet
- Fixed, moves slightly with interaction

```css
.wash {
  background: radial-gradient(
    ellipse 80% 60% at 50% 30%,
    rgba(139, 92, 246, 0.04) 0%,
    transparent 70%
  );
}
```

---

## Mobile / Gyroscope

### Detection
```javascript
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
```

### Gyroscope Activation
- No visible button — enable on first touch
- iOS 13+ requires `DeviceOrientationEvent.requestPermission()`
- Fallback: touch-drag controls photo position

### Gyro Mapping
```javascript
// Map ±40° to 0-1 range, offset beta for natural phone hold
targetX = clamp(0, 1, 0.5 + (gamma / 40));
targetY = clamp(0, 1, 0.5 + ((beta - 40) / 40));
```

---

## Navigation

### Structure
```html
<nav>
  <h1 class="name">Shayna Dunkelman</h1>
  <div class="nav-links">
    <a href="/work">Work</a>
    <a href="/about">About</a>
    <a href="/press">Press</a>
    <a href="#contact">Contact</a>
  </div>
</nav>
```

### Behavior
- Nav links hidden initially (opacity: 0)
- Fade in at scroll > 120vh
- Name element IS the logo (no separate logo image)

### Styling
- Nav padding: `24px 40px`
- Links: Space Mono, 10px, uppercase, `letter-spacing: 0.08em`
- Link color: `--text-secondary` → `--text-primary` on hover

---

## Work Page

### Curated Section (5-7 projects)
- Each item: Title, year, role, one-line description
- Click to expand in-page (no page transition)
- Expanded: full description, media embed, credits

### Archive Section
- Divider line separating from curated
- Denser layout (smaller cards or list)
- All projects, same expand behavior

### Project Data Structure
```typescript
interface Project {
  id: string;
  title: string;
  year: number;
  role: string;
  shortDescription: string;
  fullDescription: string;
  media?: {
    type: 'audio' | 'video' | 'image';
    url: string;
    embed?: string;
  };
  credits?: string[];
  featured: boolean;
}
```

---

## Audio/Video Embeds

- No autoplay
- No decorative waveforms (only for actual playback)
- Embedded players (Bandcamp, YouTube, SoundCloud) styled dark/minimal
- Custom wrapper to control appearance

---

## Instagram Integration

### Location
- Home page, below Latest module

### Implementation
- Options: Native oEmbed, API feed with token, or third-party (Curator.io, Juicer)
- Layout: 4×2 grid desktop, 2×4 mobile
- Styling: Desaturated slightly to match site palette

---

## Contact / Footer

### Contact Form
- Fields: Name, Email, Message (minimal)
- Backend: TBD

### Footer Content
- Social links (Instagram, Bandcamp, etc.)
- Donate link (subtle)
- Copyright

---

## Performance

- CSS animations where possible (GPU accelerated)
- `will-change: transform` on animated layers
- Passive event listeners for scroll/touch
- Lazy load images below fold
- Respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Accessibility

- Semantic HTML (`<nav>`, `<main>`, `<section>`, `<footer>`)
- Skip link to main content
- Focus states on all interactive elements
- Alt text on images
- Reduced motion support

---

## File Structure

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
│   ├── Threshold.astro
│   ├── PhotoLayer.astro
│   ├── BackgroundTexture.astro
│   ├── Navigation.astro
│   ├── ScrollHint.astro
│   ├── ProjectCard.astro
│   ├── ProjectList.astro
│   ├── PressCard.astro
│   ├── ContactForm.astro
│   └── Footer.astro
├── content/
│   ├── projects.json
│   ├── press.json
│   └── bio.md
├── styles/
│   └── global.css
└── public/
    └── images/
```

---

## Content Needed from Shayna

### Required
- [ ] Hero photo (high-res, portrait orientation)
- [ ] Short bio (2-3 paragraphs)
- [ ] Project list with descriptions
- [ ] Press quotes with source attribution
- [ ] Social media links
- [ ] Contact email

### Optional
- [ ] Extended bio / artist statement
- [ ] Additional photos for About page
- [ ] Audio/video embeds (Bandcamp, YouTube links)
- [ ] Donate link/platform

---

## Implementation Priority

1. **Threshold + Home** — The signature interaction
2. **Navigation** — Name-to-logo transition
3. **Work page** — Core content, expandable projects
4. **About page** — Straightforward layout
5. **Press page** — Grid of cards
6. **Contact form** — Integration TBD
7. **Instagram feed** — Add last

---

## Deployment

### Render Static Site

1. Push code to GitHub
2. Create new **Static Site** on Render
3. Build settings:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
4. Custom domain: Add in Settings → Custom Domains
   - Apex domain: `A` record → Render IP
   - Subdomain: `CNAME` → Render URL
