---
name: coverflow
description: Use when implementing coverflow/carousel effects with 3D perspective. Applies CSS scroll-driven animations with graceful fallbacks for unsupported browsers.
version: "1.0.0"
---

# Coverflow Effect

Pure CSS coverflow pattern using scroll-driven animations. No JavaScript required.

**References:**
- [Addy Osmani: Coverflow](https://addyosmani.com/blog/coverflow/)
- [MDN: Scroll-driven Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)
- [Chrome Developers: Scroll-driven Animations](https://developer.chrome.com/docs/css-ui/scroll-driven-animations)

## Browser Support

| Browser | Status |
|---------|--------|
| Chrome/Edge 115+ | Full support |
| Safari 26+ | Full support |
| Firefox | Behind flag |

Always use `@supports` for progressive enhancement.

## Core Concept

Coverflow links CSS animations to an element's scroll position using view timelines:
1. Container scrolls horizontally with snap points
2. Each item gets a view timeline tracking its position in the viewport
3. Animation progress maps to how far the item is from center

## Key Properties

```css
/* Container */
scroll-snap-type: x mandatory;    /* Snap to items */
perspective: 40em;                /* 3D depth */

/* Items */
scroll-snap-align: center;        /* Center when snapped */
view-timeline-name: --item;       /* Name the timeline */
view-timeline-axis: inline;       /* Track horizontal position */
animation-timeline: --item;       /* Bind animation to timeline */
```

## Animation Keyframes

### Coverflow Rotation
```css
@keyframes coverflow {
  /* Far left: rotated, offset */
  0% {
    transform: translateX(-100%) rotateY(-45deg);
  }
  /* Approaching center: still rotated */
  35% {
    transform: translateX(0) rotateY(-45deg);
  }
  /* Center: face forward, pop out, scale up */
  50% {
    transform: rotateY(0deg) translateZ(1em) scale(1.5);
  }
  /* Leaving center: rotate opposite */
  65% {
    transform: translateX(0) rotateY(45deg);
  }
  /* Far right: rotated, offset */
  100% {
    transform: translateX(100%) rotateY(45deg);
  }
}
```

### Z-Index Layering
```css
@keyframes coverflow-z {
  0%, 100% {
    z-index: 1;
  }
  50% {
    z-index: 100;
  }
}
```

## Complete Pattern

```css
/* === Container === */
.coverflow {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  perspective: 40em;

  /* Hide scrollbar (optional) */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.coverflow::-webkit-scrollbar {
  display: none;
}

/* === Items === */
.coverflow-item {
  flex: 0 0 auto;
  scroll-snap-align: center;
  position: relative;
}

/* === Fallback: Simple scroll (all browsers) === */
.coverflow-item img {
  display: block;
  width: 200px;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 0.5rem;
}

/* === Enhanced: Coverflow (supported browsers) === */
@supports (animation-timeline: view()) {
  .coverflow-item {
    view-timeline-name: --item-in-view;
    view-timeline-axis: inline;
  }

  .coverflow-item img {
    animation:
      coverflow linear both,
      coverflow-z linear both;
    animation-timeline: --item-in-view;
  }
}
```

## HTML Structure

```html
<div class="coverflow">
  <div class="coverflow-item">
    <img src="album1.jpg" alt="Album 1" />
  </div>
  <div class="coverflow-item">
    <img src="album2.jpg" alt="Album 2" />
  </div>
  <!-- More items... -->
</div>
```

## Performance Rules

### Transform Inner Elements
```css
/* BAD: Animating the scroll container or list item */
.coverflow-item {
  animation: coverflow ...;  /* Breaks scroll metrics! */
}

/* GOOD: Animate the image inside */
.coverflow-item img {
  animation: coverflow ...;
}
```

Animating the scroll container or list items affects layout and breaks scroll calculations. Always transform a child element.

### GPU Acceleration
Stick to transform-only animations:
- `transform` (translate, rotate, scale)
- `opacity`

Avoid animating:
- `width`, `height`
- `margin`, `padding`
- `top`, `left`

### will-change
Use sparingly:
```css
.coverflow-item img {
  will-change: transform;
}
```

## Variations

### Subtler Rotation (30deg)
```css
@keyframes coverflow-subtle {
  0%   { transform: translateX(-100%) rotateY(-30deg); }
  35%  { transform: translateX(0) rotateY(-30deg); }
  50%  { transform: rotateY(0deg) translateZ(0.5em) scale(1.2); }
  65%  { transform: translateX(0) rotateY(30deg); }
  100% { transform: translateX(100%) rotateY(30deg); }
}
```

### With Opacity Fade
```css
@keyframes coverflow-fade {
  0%   { transform: translateX(-100%) rotateY(-45deg); opacity: 0.5; }
  35%  { transform: translateX(0) rotateY(-45deg); opacity: 0.7; }
  50%  { transform: rotateY(0deg) translateZ(1em) scale(1.5); opacity: 1; }
  65%  { transform: translateX(0) rotateY(45deg); opacity: 0.7; }
  100% { transform: translateX(100%) rotateY(45deg); opacity: 0.5; }
}
```

### Reflection Effect
```css
.coverflow-item img {
  -webkit-box-reflect: below 0.5em linear-gradient(
    transparent 60%,
    rgba(0, 0, 0, 0.3)
  );
}
```

## Fallback Strategies

### Feature Detection
```css
/* Base styles work everywhere */
.coverflow { /* horizontal scroll */ }

/* Enhanced only when supported */
@supports (animation-timeline: view()) {
  /* coverflow animations */
}
```

### JavaScript Polyfill (Optional)
For broader support, consider [scroll-timeline-polyfill](https://github.com/nicoffee/scroll-timeline-polyfill).

### Alternative: GSAP Fallback
If you need Firefox support now:
```javascript
// Check for native support
if (!CSS.supports('animation-timeline', 'view()')) {
  // Use GSAP ScrollTrigger instead
}
```

## Accessibility

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .coverflow-item img {
    animation: none;
    transform: none;
  }
}
```

### Keyboard Navigation
Ensure items are focusable:
```css
.coverflow-item:focus-within {
  outline: 2px solid var(--color-accent);
  outline-offset: 4px;
}
```

## Avoid

- Animating scroll containers (breaks scroll metrics)
- Forgetting `@supports` fallback
- Over-animating (keep rotation ≤45deg)
- Missing `prefers-reduced-motion` check
- Using JS when CSS suffices
