# Shayna Dunkelman Portfolio — Technical Handoff

## Overview

Portfolio website for Shayna Dunkelman, avant-garde musician and percussionist based in Brooklyn. The site should communicate artistic credibility and sophistication while remaining functional for industry contacts.

**Live reference prototype:** `shayna-threshold-v5.html` (attached)

-----

## Design Direction

### Aesthetic: "Minimalist Noir"

- Dark, atmospheric, sophisticated
- Analog warmth (grain, texture) wrapping digital precision
- Subtle interactivity that rewards attention
- No decorative waveforms or literal music visuals — those are reserved for actual audio playback

### Visual Principles

- Darkness dominates — near-black backgrounds
- Text is the primary visual element
- Photo is atmospheric, not decorative
- Motion is subtle and purposeful
- Grain texture throughout (barely visible, adds warmth)

-----

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

-----

## Typography

**Font Stack:**

- Headlines/UI: `Space Grotesk` (weights: 300, 400, 500)
- Metadata/Labels: `Space Mono` (weight: 400)

**Scale:**

```css
/* Hero name */
.name-hero { font-size: clamp(32px, 8vw, 64px); font-weight: 300; }

/* Nav logo (locked state) */
.name-logo { font-size: 14px; font-weight: 400; }

/* Section headers */
h2 { font-size: clamp(24px, 4vw, 36px); font-weight: 300; }

/* Lead paragraph */
.lead { font-size: clamp(18px, 3vw, 24px); line-height: 1.6; }

/* Body text */
p { font-size: clamp(16px, 2.5vw, 19px); line-height: 1.8; }

/* Labels/metadata */
.label {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
```

-----

## Site Structure

```
Home (/)
├── Threshold (100vh hero with photo + name)
├── Bio (short intro)
├── Latest (single featured item — easy to update)
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

-----

## Threshold Behavior (Critical)

The homepage threshold is the signature interaction. One `<h1>` element transitions through three states:

### Phase 1: Hero (scroll 0 – 85vh)

- Name large, centered horizontally
- Positioned over photo
- Rises with scroll (parallax rate: 0.5x)
- Photo responds to cursor (desktop) / gyroscope (mobile)

### Phase 2: Transition (scroll 85vh – 140vh)

- Name shrinks from ~64px to 14px
- Moves from center to top-left nav position
- Easing: `ease-out-cubic`
- Transform origin shifts from center to left

### Phase 3: Locked (scroll 140vh+)

- Name fixed in nav position (top-left)
- Acts as logo/home link
- Nav links fade in
- Name stays fixed for rest of page

### Animation Values

```javascript
// Scroll thresholds
const PHASE1_END = window.innerHeight * 0.85;
const PHASE2_END = window.innerHeight * 1.4;

// Name properties
const NAME_START_SIZE = clamp(32, 8vw, 64); // px
const NAME_END_SIZE = 14; // px
const NAME_START_POSITION = { x: '50%', y: '50%' };
const NAME_END_POSITION = { x: '40px', y: '24px' };

// Easing
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
```

-----

## GSAP Implementation

### Setup (in base layout)

```astro
---
// src/layouts/BaseLayout.astro
---
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Shayna Dunkelman</title>
  </head>
  <body>
    <slot />

    <script>
      import { gsap } from 'gsap';
      import { ScrollTrigger } from 'gsap/ScrollTrigger';
      import Lenis from '@studio-freight/lenis';

      gsap.registerPlugin(ScrollTrigger);

      // Smooth scroll
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    </script>
  </body>
</html>
```

### Threshold: Name → Logo Transition

```astro
---
// src/components/Threshold.astro
---
<section class="threshold">
  <h1 id="name" class="name">Shayna Dunkelman</h1>

  <div id="photo-layer" class="photo-layer">
    <div class="photo-container">
      <div class="photo-frame">
        <img src="/images/shayna.jpg" alt="Shayna Dunkelman" class="photo" />
        <div class="photo-fade-top"></div>
        <div class="photo-fade-bottom"></div>
      </div>
    </div>
  </div>

  <div id="scroll-hint" class="scroll-hint">
    <span>Scroll</span>
    <div class="scroll-line">
      <div id="scroll-dot" class="scroll-dot"></div>
    </div>
  </div>
</section>

<style>
  .threshold {
    height: 100vh;
    height: 100dvh;
    position: relative;
  }

  .name {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: clamp(32px, 8vw, 64px);
    font-weight: 300;
    z-index: 50;
    text-shadow: 0 4px 40px rgba(0,0,0,0.8);
  }

  .photo-layer {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .photo-container {
    width: min(400px, 80vw);
    height: min(550px, 75vh);
  }

  .photo-frame {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 3px;
    position: relative;
  }

  .photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(15%) contrast(1.05) brightness(0.9);
  }

  .photo-fade-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60%;
    background: linear-gradient(to top, #0a0a0a 0%, transparent 100%);
  }

  .photo-fade-top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 30%;
    background: linear-gradient(to bottom, rgba(10,10,10,0.4) 0%, transparent 100%);
  }

  .scroll-hint {
    position: fixed;
    bottom: 36px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    z-index: 50;
  }

  .scroll-hint span {
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #555;
  }

  .scroll-line {
    width: 1px;
    height: 36px;
    background: linear-gradient(180deg, #555 0%, transparent 100%);
    position: relative;
  }

  .scroll-dot {
    position: absolute;
    top: 0;
    left: -1.5px;
    width: 4px;
    height: 4px;
    background: #555;
    border-radius: 50%;
  }
</style>

<script>
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  const name = document.getElementById('name');
  const photoLayer = document.getElementById('photo-layer');
  const scrollHint = document.getElementById('scroll-hint');
  const scrollDot = document.getElementById('scroll-dot');
  const navLinks = document.getElementById('nav-links');

  const vh = window.innerHeight;

  // Name: Hero → Logo transition
  const nameTl = gsap.timeline({
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: '140vh top',
      scrub: 1.5,
    }
  });

  // Phase 1: Rise with scroll (0-85vh)
  nameTl.to(name, {
    y: '-35vh',
    duration: 0.6,
    ease: 'none'
  });

  // Phase 2: Transition to nav logo (85vh-140vh)
  nameTl.to(name, {
    fontSize: '14px',
    top: '24px',
    left: '40px',
    xPercent: 0,
    yPercent: 0,
    y: 0,
    textShadow: 'none',
    duration: 0.4,
    ease: 'power2.out'
  });

  // Photo: Parallax + Fade
  gsap.to(photoLayer, {
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: '120vh top',
      scrub: true,
    },
    y: '-40vh',
    scale: 0.9,
    opacity: 0,
    ease: 'none'
  });

  // Scroll hint: Fade out
  gsap.to(scrollHint, {
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: '20vh top',
      scrub: true,
    },
    opacity: 0,
    ease: 'none'
  });

  // Scroll dot: Pulse animation
  gsap.to(scrollDot, {
    y: 36,
    opacity: 0,
    duration: 2,
    ease: 'power1.inOut',
    repeat: -1,
  });

  // Nav links: Fade in
  gsap.to(navLinks, {
    scrollTrigger: {
      trigger: 'body',
      start: '120vh top',
      end: '140vh top',
      scrub: true,
    },
    opacity: 1,
    ease: 'none'
  });
</script>
```

### Photo: Cursor Parallax (Desktop)

```astro
---
// src/components/PhotoLayer.astro (alternative with parallax)
---
<script>
  import { gsap } from 'gsap';

  const photoLayer = document.getElementById('photo-layer');
  const noise = document.getElementById('noise');
  const wash = document.getElementById('wash');

  const PHOTO_MOVE = 25;
  const TEXTURE_MOVE = 12;

  let targetX = 0.5;
  let targetY = 0.5;
  let currentX = 0.5;
  let currentY = 0.5;

  // Mouse movement
  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX / window.innerWidth;
    targetY = e.clientY / window.innerHeight;
  });

  // Animation loop
  gsap.ticker.add(() => {
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;

    const offsetX = (currentX - 0.5) * 2;
    const offsetY = (currentY - 0.5) * 2;

    // Photo movement
    gsap.set(photoLayer, {
      x: offsetX * PHOTO_MOVE,
      y: offsetY * PHOTO_MOVE,
    });

    // Texture movement
    gsap.set(noise, {
      x: offsetX * TEXTURE_MOVE * 0.3,
      y: offsetY * TEXTURE_MOVE * 0.3,
    });

    gsap.set(wash, {
      x: offsetX * TEXTURE_MOVE,
      y: offsetY * TEXTURE_MOVE,
    });
  });
</script>
```

### Photo: Gyroscope Parallax (Mobile)

```html
<script>
  // Add to the parallax script above

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  let gyroEnabled = false;

  function handleOrientation(e) {
    const gamma = e.gamma || 0;
    const beta = e.beta || 0;

    targetX = Math.max(0, Math.min(1, 0.5 + (gamma / 40)));
    targetY = Math.max(0, Math.min(1, 0.5 + ((beta - 40) / 40)));
  }

  async function requestGyro() {
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
          gyroEnabled = true;
        }
      } catch (e) {
        console.log('Gyroscope permission denied');
      }
    } else if ('DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation);
      gyroEnabled = true;
    }
  }

  // Trigger on first touch (iOS requires user gesture)
  if (isMobile) {
    document.addEventListener('touchstart', requestGyro, { once: true });
  }

  // Touch fallback if no gyro
  document.addEventListener('touchmove', (e) => {
    if (gyroEnabled) return;
    const touch = e.touches[0];
    targetX = touch.clientX / window.innerWidth;
    targetY = touch.clientY / window.innerHeight;
  }, { passive: true });

  document.addEventListener('touchend', () => {
    if (gyroEnabled) return;
    targetX = 0.5;
    targetY = 0.5;
  }, { passive: true });
</script>
```

### Background Texture

```astro
---
// src/components/BackgroundTexture.astro
---
<div class="texture-layer">
  <div id="noise" class="noise"></div>
  <div id="wash" class="wash"></div>
</div>

<style>
  .texture-layer {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 1;
  }

  .noise {
    position: absolute;
    inset: -20%;
    width: 140%;
    height: 140%;
    opacity: 0.06;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  .wash {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse 80% 60% at 50% 30%,
      rgba(139, 92, 246, 0.04) 0%,
      transparent 70%
    );
  }
</style>
```

### Navigation

```astro
---
// src/components/Navigation.astro
---
<nav>
  <!-- Name element moves here via GSAP, this is just the container -->
  <div id="nav-links" class="nav-links">
    <a href="/work">Work</a>
    <a href="/about">About</a>
    <a href="/press">Press</a>
    <a href="#contact">Contact</a>
  </div>
</nav>

<style>
  nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 24px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 100;
  }

  .nav-links {
    display: flex;
    gap: 32px;
    margin-left: auto;
    opacity: 0; /* Fades in via GSAP */
  }

  .nav-links a {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #999;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .nav-links a:hover {
    color: #f5f5f5;
  }
</style>
```

### Work Page: Project Expand/Collapse

```astro
---
// src/components/ProjectCard.astro
const { project } = Astro.props;
---
<article class="project-card" data-project-id={project.id}>
  <button class="project-header">
    <h3>{project.title}</h3>
    <span class="year">{project.year}</span>
  </button>

  <div class="project-content">
    <div class="project-inner">
      <p>{project.fullDescription}</p>
      {project.embedUrl && (
        <div class="embed-container">
          <iframe src={project.embedUrl} frameborder="0" allowfullscreen></iframe>
        </div>
      )}
    </div>
  </div>
</article>

<style>
  .project-card {
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .project-header {
    width: 100%;
    padding: 24px 0;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
  }

  .project-header h3 {
    font-size: 24px;
    font-weight: 300;
    color: #f5f5f5;
  }

  .year {
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    color: #555;
  }

  .project-content {
    height: 0;
    overflow: hidden;
  }

  .project-inner {
    padding-bottom: 32px;
  }

  .project-inner p {
    color: #999;
    line-height: 1.8;
    margin-bottom: 24px;
  }

  .embed-container {
    aspect-ratio: 16/9;
    background: rgba(255,255,255,0.05);
    border-radius: 4px;
  }
</style>

<script>
  import { gsap } from 'gsap';

  document.querySelectorAll('.project-card').forEach(card => {
    const header = card.querySelector('.project-header');
    const content = card.querySelector('.project-content');
    const inner = card.querySelector('.project-inner');
    let isOpen = false;

    header.addEventListener('click', () => {
      if (isOpen) {
        gsap.to(content, {
          height: 0,
          duration: 0.4,
          ease: 'power2.inOut'
        });
      } else {
        const height = inner.offsetHeight;
        gsap.to(content, {
          height: height,
          duration: 0.5,
          ease: 'power2.out'
        });
      }
      isOpen = !isOpen;
    });
  });
</script>
```

-----

## Photo Layer

### Behavior

- Fixed position, behind content
- Responds to cursor position (desktop)
- Responds to device tilt via gyroscope (mobile)
- Parallax on scroll: moves at 0.4x scroll speed (falls behind)
- Fades out as user scrolls into content

### Movement Values

```javascript
const PHOTO_MOVE = 25; // px max offset from cursor/gyro
const PHOTO_SCROLL_PARALLAX = 0.4; // multiplier

// Fade
const FADE_START = window.innerHeight * 0.3;
const FADE_END = window.innerHeight * 1.2;
```

### Photo Treatment (CSS)

```css
.photo {
  filter: grayscale(15%) contrast(1.05) brightness(0.9);
}

.photo-fade-bottom {
  /* Gradient from transparent to void, covers bottom 60% */
  background: linear-gradient(to top, var(--bg-void) 0%, transparent 100%);
  height: 60%;
}
```

### Photo Requirements (for Shayna)

- High resolution (minimum 1200px height)
- Subject centered with headroom above
- Dark or neutral background preferred
- Portrait orientation works best
- Will be cropped to ~400x550px container

-----

## Background Texture

### Grain

- SVG noise pattern, fixed position
- Opacity: 6%
- Subtle movement on cursor/gyro (0.3x photo movement)

```css
.noise {
  opacity: 0.06;
  background-image: url("data:image/svg+xml,..."); /* fractalNoise SVG */
}
```

### Color Wash

- Radial gradient, very subtle violet
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

-----

## Mobile / Gyroscope

### Detection

```javascript
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
```

### Gyroscope Activation

- No visible button — enable on first touch
- iOS 13+ requires `DeviceOrientationEvent.requestPermission()`
- Trigger permission request on first `touchstart` or `click`
- Fallback: touch-drag controls photo position

### Gyro Mapping

```javascript
function handleOrientation(e) {
  const beta = e.beta || 0;   // front-back tilt
  const gamma = e.gamma || 0; // left-right tilt

  // Map ±40° to 0-1 range, offset beta for natural phone hold
  targetX = clamp(0, 1, 0.5 + (gamma / 40));
  targetY = clamp(0, 1, 0.5 + ((beta - 40) / 40));
}
```

-----

## Navigation

### Structure

```html
<nav>
  <h1 class="name">Shayna Dunkelman</h1> <!-- Animated element -->
  <div class="nav-links">
    <a href="/work">Work</a>
    <a href="/about">About</a>
    <a href="/press">Press</a>
    <a href="#contact">Contact</a>
  </div>
</nav>
```

### Behavior

- Nav links hidden initially
- Fade in at scroll > 120vh
- Name element IS the logo (no separate logo)

### Styling

```css
nav {
  position: fixed;
  top: 0;
  padding: 24px 40px;
  z-index: 100;
}

.nav-links a {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary);
}
```

-----

## Work Page

### Curated Section

- 5-7 featured projects
- Each item: Title, year, role, one-line description
- Click to expand in-page (no page transition)
- Expanded state shows: full description, media embed (audio/video), credits

### Archive Section

- Divider line separating from curated
- Denser layout (smaller cards or list)
- All projects, chronological or categorical
- Same expand behavior

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
    embed?: string; // for Bandcamp, YouTube, etc.
  };
  credits?: string[];
  featured: boolean;
}
```

-----

## Audio/Video Embeds

### Principle

- No autoplay ever
- No decorative waveforms
- Waveforms only appear for actual audio playback (functional)
- Embedded players (Bandcamp, YouTube, SoundCloud) styled to match site

### Implementation

- Use native embeds where possible
- Custom wrapper to control appearance
- Dark theme / minimal chrome preferred

-----

## Instagram Integration

### Location

- Home page, below Latest module
- Section title: "Updates" or simply unlabeled

### Implementation Options

1. **Native embed** — Instagram's oEmbed (limited styling)
1. **API feed** — More control, requires token refresh
1. **Third-party** — Curator.io, Juicer, etc.

### Styling

- 4×2 grid on desktop, 2×4 on mobile
- Desaturated slightly to match site palette
- Optional: grain overlay on hover

-----

## Contact / Footer

### Contact Form

- Ultra-minimal: Name, Email, Message
- No phone, no subject dropdown
- Submit sends email to Shayna

### Footer Content

- Social links (Instagram, Bandcamp, etc.)
- Donate link (subtle but present)
- Copyright

-----

## Performance Requirements

- CSS animations where possible (GPU accelerated)
- `will-change: transform` on animated layers
- Passive event listeners for scroll/touch
- Respect `prefers-reduced-motion`
- No heavy JS libraries required (vanilla JS sufficient)
- Lazy load images below fold

-----

## Accessibility

- Semantic HTML (`<nav>`, `<main>`, `<section>`, `<footer>`)
- Skip link to main content
- Focus states on all interactive elements
- Alt text on images
- Reduced motion support:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

-----

## Platform Recommendation

### Recommended Stack: Astro + Tailwind + GSAP + Lenis

**Astro**

- Zero JS by default — ships pure HTML/CSS
- "Islands" architecture — JS only where needed
- Perfect for content/portfolio sites
- Fast builds, great DX
- Deploy anywhere (Vercel, Netlify, Cloudflare)

**Tailwind CSS**

- Utility-first, fast styling
- Easy dark theme, responsive design
- Works great with Astro

**GSAP + ScrollTrigger**

- Industry standard for scroll-linked animations
- Handles the threshold name→logo transition
- Works perfectly with vanilla JS (no React needed)

**Lenis**

- Smooth scroll library
- Premium feel
- Lightweight (~10kb)

### Why Not Next.js?

- Ships ~80-100kb React runtime you don't need
- Hydration overhead on every page
- Overkill for a content site
- The only interactivity is threshold + project expand — vanilla JS handles that fine

### Install

```bash
npm create astro@latest shayna-portfolio
cd shayna-portfolio
npx astro add tailwind
npm install gsap @studio-freight/lenis
```

### Avoid

- Squarespace — insufficient flexibility
- WordPress — unnecessary complexity
- Next.js — overkill for static content
- Framer — limited custom code control

-----

## File Structure (Astro)

```
src/
├── layouts/
│   └── BaseLayout.astro    # Root layout, Lenis + GSAP init
├── pages/
│   ├── index.astro         # Home
│   ├── work.astro
│   ├── about.astro
│   └── press.astro
├── components/
│   ├── Threshold.astro     # Hero photo + name animation
│   ├── PhotoLayer.astro    # Parallax photo
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

### Key Differences from React/Next.js

- No hooks — vanilla JS in `<script>` tags
- No state management library needed
- Scripts are scoped to components by default
- Use `document.querySelector` instead of refs
- GSAP works identically, just without React wrappers

-----

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

-----

## Reference Files

- `shayna-threshold-v5.html` — Working prototype of threshold interaction
- `shayna-dunkelman-wireframes.html` — Page structure wireframes
- `shayna-dunkelman-moodboard.html` — Visual references and color palette

-----

## Implementation Priority

1. **Threshold + Home** — The signature interaction, nail this first
1. **Navigation** — Name-to-logo transition
1. **Work page** — Core content, expandable projects
1. **About page** — Straightforward layout
1. **Press page** — Grid of cards
1. **Contact form** — Simple integration
1. **Instagram feed** — Can be added last

-----

## Questions for Build

- Domain: Keep `shaynadunkelmanmusic.com` or shorten to `shaynadunkelman.com`?
- Hosting: Vercel, Netlify, or Cloudflare Pages? (all work great with Astro)
- Contact form: Formspree, Netlify Forms, or custom?
- Analytics: Plausible, Fathom, or none?

-----

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Deploy dist/ folder
```

### Build Output

Astro outputs static HTML/CSS/JS to `dist/`. No server required. Can be hosted anywhere that serves static files.
