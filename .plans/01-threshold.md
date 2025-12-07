---
phase: 1
title: "Threshold + Hero"
status: draft
priority: P0
effort: large
dependencies: [0]
blockers: []
started: null
completed: null
owner: null
---

# Phase 1: Threshold + Hero

The signature homepage interaction — name transitions from hero to navigation on scroll.

## Objectives

- [ ] Create hero section with centered name
- [ ] Implement photo layer with parallax
- [ ] Build three-phase scroll transition
- [ ] Add cursor/gyroscope interaction
- [ ] Integrate GSAP ScrollTrigger with Lenis

## Overview

The threshold is a full-viewport hero where:
1. The name "Shayna Dunkelman" starts large and centered
2. A photo sits behind, responding to cursor/device tilt
3. On scroll, the name shrinks and moves to become the nav logo
4. The photo parallaxes and fades into the void background

## Tasks

### 1. Threshold Component Structure

Create `src/components/Threshold.astro`:

```astro
---
// Threshold.astro — Hero section container
---

<section class="relative h-[200vh]" id="threshold">
  <!-- Photo layer (fixed, behind content) -->
  <div class="fixed inset-0 flex items-center justify-center pointer-events-none z-10" id="photo-container">
    <div class="relative" id="photo-wrapper">
      <img
        src="/images/shayna-hero.jpg"
        alt="Shayna Dunkelman"
        class="object-cover"
        id="hero-photo"
      />
      <!-- Bottom fade gradient -->
      <div class="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-void to-transparent"></div>
    </div>
  </div>

  <!-- Name element (the h1 that transitions) -->
  <h1
    class="fixed z-20 font-sans font-light text-primary"
    id="threshold-name"
  >
    Shayna Dunkelman
  </h1>

  <!-- Scroll hint -->
  <div class="fixed bottom-8 left-1/2 -translate-x-1/2 z-20" id="scroll-hint">
    <span class="font-mono text-[10px] uppercase tracking-wider text-muted">
      Scroll
    </span>
  </div>
</section>
```

### 2. Scroll Phases Definition

```typescript
// src/scripts/threshold.ts

interface ThresholdConfig {
  PHASE1_END: number;      // End of hero state (0.85vh)
  PHASE2_END: number;      // End of transition (1.4vh)
  NAME_START_SIZE: number; // 64px (clamped)
  NAME_END_SIZE: number;   // 14px
  PHOTO_PARALLAX: number;  // 0.4x scroll rate
  PHOTO_MOVE: number;      // 25px cursor offset
}

const config: ThresholdConfig = {
  PHASE1_END: window.innerHeight * 0.85,
  PHASE2_END: window.innerHeight * 1.4,
  NAME_START_SIZE: 64,
  NAME_END_SIZE: 14,
  PHOTO_PARALLAX: 0.4,
  PHOTO_MOVE: 25,
};
```

### 3. Phase 1: Hero State (0 – 85vh)

**Name behavior:**
- Size: `clamp(32px, 8vw, 64px)`
- Position: Centered horizontally, ~40% from top
- Parallax: Rises at 0.5x scroll rate

**Photo behavior:**
- Fixed position, centered in viewport
- Size: `min(400px, 80vw)` × `min(550px, 75vh)`
- Responds to cursor position (desktop) or gyroscope (mobile)
- Filter: `grayscale(15%) contrast(1.05) brightness(0.9)`

### 4. Phase 2: Transition State (85vh – 140vh)

**Name behavior:**
- Shrinks from ~64px → 14px
- Moves from center → top-left (40px, 24px)
- Easing: `ease-out-cubic` (1 - Math.pow(1 - t, 3))
- Transform origin shifts from center to left

**Photo behavior:**
- Continues parallax (0.4x rate)
- Fades out (opacity 1 → 0)
- Fade range: 0.3vh → 1.2vh

### 5. Phase 3: Locked State (140vh+)

**Name behavior:**
- Fixed at nav position (top: 24px, left: 40px)
- Size: 14px
- Acts as home link
- Nav links fade in beside it

**Photo behavior:**
- Fully faded out
- No longer rendered (or display: none for performance)

### 6. GSAP ScrollTrigger Integration

```typescript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initThreshold(lenis: Lenis) {
  // Sync Lenis with ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Name transition timeline
  const nameEl = document.getElementById('threshold-name');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#threshold',
      start: 'top top',
      end: '140% top',
      scrub: 0.5,
    },
  });

  // Phase 1 → Phase 2: Name shrink & move
  tl.to(nameEl, {
    fontSize: '14px',
    top: '24px',
    left: '40px',
    xPercent: 0,
    yPercent: 0,
    ease: 'power2.out',
  });
}
```

### 7. Cursor/Gyroscope Interaction

```typescript
// src/scripts/photo-interaction.ts

export function initPhotoInteraction() {
  const photoWrapper = document.getElementById('photo-wrapper');
  const grain = document.getElementById('grain');
  const wash = document.getElementById('wash');

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  let targetX = 0.5;
  let targetY = 0.5;
  let currentX = 0.5;
  let currentY = 0.5;

  const PHOTO_MOVE = 25;
  const GRAIN_MOVE = PHOTO_MOVE * 0.3;
  const LERP = 0.08;

  if (isMobile) {
    initGyroscope();
  } else {
    initCursor();
  }

  function initCursor() {
    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX / window.innerWidth;
      targetY = e.clientY / window.innerHeight;
    });
  }

  function initGyroscope() {
    // iOS 13+ permission request
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      document.body.addEventListener('click', async () => {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          enableGyro();
        }
      }, { once: true });
    } else {
      enableGyro();
    }
  }

  function enableGyro() {
    window.addEventListener('deviceorientation', (e) => {
      const gamma = e.gamma || 0; // Left/right tilt (-90 to 90)
      const beta = e.beta || 0;   // Front/back tilt (-180 to 180)

      // Map ±40° to 0-1, offset beta for natural hold angle
      targetX = clamp(0, 1, 0.5 + (gamma / 40));
      targetY = clamp(0, 1, 0.5 + ((beta - 40) / 40));
    });
  }

  // Animation loop
  function animate() {
    currentX += (targetX - currentX) * LERP;
    currentY += (targetY - currentY) * LERP;

    const offsetX = (currentX - 0.5) * PHOTO_MOVE;
    const offsetY = (currentY - 0.5) * PHOTO_MOVE;
    const grainOffsetX = (currentX - 0.5) * GRAIN_MOVE;
    const grainOffsetY = (currentY - 0.5) * GRAIN_MOVE;

    if (photoWrapper) {
      photoWrapper.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }

    if (grain) {
      grain.style.transform = `translate(${grainOffsetX}px, ${grainOffsetY}px)`;
    }

    requestAnimationFrame(animate);
  }

  animate();
}

function clamp(min: number, max: number, value: number) {
  return Math.min(max, Math.max(min, value));
}
```

### 8. Photo Scroll Parallax & Fade

```typescript
// Part of threshold.ts

function initPhotoScroll() {
  const photoContainer = document.getElementById('photo-container');
  const FADE_START = window.innerHeight * 0.3;
  const FADE_END = window.innerHeight * 1.2;

  gsap.to(photoContainer, {
    scrollTrigger: {
      trigger: '#threshold',
      start: 'top top',
      end: '120% top',
      scrub: true,
    },
    y: () => window.innerHeight * 0.4 * -1, // Parallax up
    opacity: 0,
    ease: 'none',
  });
}
```

### 9. Scroll Hint Animation

```typescript
// Fade out scroll hint as user scrolls
gsap.to('#scroll-hint', {
  scrollTrigger: {
    trigger: '#threshold',
    start: '5% top',
    end: '15% top',
    scrub: true,
  },
  opacity: 0,
  y: -20,
});
```

## Acceptance Criteria

- [ ] Hero displays with centered name over photo
- [ ] Photo responds to cursor movement on desktop
- [ ] Photo responds to device tilt on mobile (after permission)
- [ ] Scrolling triggers smooth name transition
- [ ] Name ends up fixed in nav position (top-left)
- [ ] Photo parallaxes up and fades to void
- [ ] Scroll hint visible initially, fades on scroll
- [ ] Respects `prefers-reduced-motion`
- [ ] No jank or layout shift during transition
- [ ] Works across Chrome, Firefox, Safari

## Technical Notes

- Use `will-change: transform, opacity` on animated elements
- Passive event listeners for scroll/touch
- RequestAnimationFrame for cursor/gyro updates
- Debounce resize handlers
- Test on various viewport sizes

## Content Requirements

**From Shayna:**
- [ ] Hero photo (high-res, minimum 1200px height)
- [ ] Portrait orientation preferred
- [ ] Dark/neutral background
- [ ] Subject centered with headroom

## Dependencies

- Phase 0: Design tokens, base layout, Lenis setup
