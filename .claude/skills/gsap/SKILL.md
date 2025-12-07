---
name: gsap
description: Use when implementing GSAP animations, ScrollTrigger, or scroll-linked animations. Applies GSAP best practices for performance and cleanup.
version: "1.3.0"
---

# GSAP & ScrollTrigger Best Practices

Apply when implementing GSAP animations.

**Documentation:** https://gsap.com/docs/v3/

## Setup

### Register Plugins Once
```javascript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
```

Centralize in one file—don't import and register in every component.

### Refresh After Initialization
```javascript
// After all animations are set up:
ScrollTrigger.refresh();
```

## Animation Methods

| Method | Use Case |
|--------|----------|
| `gsap.to()` | Most animations (animate TO these values) |
| `gsap.from()` | Use sparingly (can cause FOUC) |
| `gsap.fromTo()` | Explicit start/end control |
| `gsap.set()` | Initial states (no animation) |

```javascript
// Preferred: explicit control
gsap.fromTo('.element',
  { opacity: 0, y: 50 },    // from
  { opacity: 1, y: 0 }      // to
);
```

## ScrollTrigger

### Basic Setup
```javascript
gsap.to('.element', {
  scrollTrigger: {
    trigger: '.container',
    start: 'top center',    // trigger top hits viewport center
    end: 'bottom center',   // trigger bottom hits viewport center
    scrub: 1,               // smooth 1-second catch-up
    markers: true,          // DEBUG ONLY - remove in production
  },
  y: 100,
  opacity: 0.5,
});
```

### Scrub Options
| Value | Behavior |
|-------|----------|
| `true` | Instant 1:1 with scroll |
| `0.5` | 0.5s catch-up delay (smooth) |
| `1` | 1s catch-up delay (very smooth) |
| `2` | 2s catch-up (cinematic) |

**Mobile:** Avoid `scrub: true` — iOS momentum scroll fires rapid events, causing jitter. Use `scrub: 0.5` or higher for smooth animations on touch devices.

### Timeline with ScrollTrigger
```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.section',
    start: 'top top',
    end: '+=200%',
    scrub: 1,
    pin: true,
  }
});

tl.to('.element1', { x: 100 })
  .to('.element2', { opacity: 0 }, '<')  // same start time
  .to('.element3', { scale: 1.5 }, '>'); // after previous
```

## Pinning

### Don't Animate Pinned Elements
```javascript
// BAD: Animating the pinned element
gsap.to('.pinned', {
  scrollTrigger: { pin: true },
  x: 100  // Don't do this!
});

// GOOD: Pin a wrapper, animate children
gsap.to('.pinned-child', {
  scrollTrigger: {
    trigger: '.wrapper',
    pin: '.wrapper',
  },
  x: 100,
});
```

## Performance

### GPU-Accelerated Properties
Prefer these (GPU-composited):
- `transform` (x, y, scale, rotation)
- `opacity`

Avoid animating:
- `width`, `height`
- `top`, `left`, `right`, `bottom`
- `margin`, `padding`

### Force GPU Acceleration
```javascript
gsap.to('.element', {
  x: 100,
  force3D: true,  // Forces GPU layer
});
```

### will-change
```css
.animated-element {
  will-change: transform, opacity;
}
```

### Custom Animation Loops

When building custom loops (cursor follow, parallax, gyroscope):

#### Use GSAP Ticker (Not Separate rAF)
```javascript
// BAD: Competing animation loops cause frame contention
function animate() {
  // ...
  requestAnimationFrame(animate);
}

// GOOD: Single unified loop with GSAP
gsap.ticker.add(animate);
// Cleanup:
gsap.ticker.remove(animate);
```

#### Cache DOM References
```javascript
// BAD: DOM query every frame (~60/sec)
function animate() {
  document.getElementById('el').style.transform = ...
}

// GOOD: Cache once at init
const el = document.getElementById('el');
function animate() {
  gsap.set(el, { x, y });
}
```

#### Idle Detection
```javascript
const IDLE_THRESHOLD = 0.0001;

function animate() {
  const delta = target - current;

  // Pause when converged
  if (Math.abs(delta) < IDLE_THRESHOLD) {
    gsap.ticker.remove(animate);
    return;
  }

  current += delta * LERP;
  gsap.set(el, { x: current });
}

// Wake on input
element.addEventListener('mousemove', () => {
  gsap.ticker.add(animate);
}, { passive: true });
```

#### Use gsap.set() for Batching
Prefer `gsap.set()` over direct `style.transform` assignment—GSAP batches these with other animations for fewer reflows.

## Debugging

Always use markers during development:
```javascript
scrollTrigger: {
  markers: true,  // Shows start/end markers
}
```

Remove before production.

## Cleanup (Critical for SPAs/Frameworks)

```javascript
// In component unmount/cleanup:
useEffect(() => {
  const ctx = gsap.context(() => {
    // All animations here
  });

  return () => ctx.revert();  // Cleanup
}, []);

// Or manual cleanup:
ScrollTrigger.getAll().forEach(t => t.kill());
gsap.killTweensOf('.animated-elements');
```

## Common Patterns

### Fade In on Scroll
```javascript
gsap.from('.fade-in', {
  scrollTrigger: {
    trigger: '.fade-in',
    start: 'top 80%',
  },
  opacity: 0,
  y: 30,
  duration: 0.6,
});
```

### Parallax
```javascript
gsap.to('.parallax-bg', {
  scrollTrigger: {
    scrub: true,
  },
  y: '-30%',
  ease: 'none',
});
```

## Avoid
- Animating pinned elements directly
- Forgetting cleanup in SPAs
- Using `from()` without `immediateRender: false`
- Markers in production
- Importing GSAP in every file (centralize)
