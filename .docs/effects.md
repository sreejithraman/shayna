# Effect Scripts

All effects in `src/scripts/` follow init/destroy lifecycle for SPA navigation.

## Initialization

Effects are initialized in `BaseLayout.astro`:
- Check `prefers-reduced-motion` before animating
- Store cleanup functions for view transition disposal
- GSAP plugins registered once in smooth-scroll.ts

## Effect Reference

### smooth-scroll.ts

Lenis smooth scroll with GSAP ScrollTrigger synchronization.

- **Purpose**: Smooth scrolling experience with ScrollTrigger sync
- **Init**: Must init before other scroll-based effects
- **Exports**: `initSmoothScroll()`, `destroySmoothScroll()`

### page-grain.ts

Full-viewport canvas noise overlay for film grain texture.

- **Purpose**: Organic texture without competing with content
- **Config**: `siteConfig.pageGrain` (opacity, density, animated, fps)
- **Data attr**: None (auto-applied to viewport)
- **Performance**:
  - Renders at 0.5 scale for performance
  - 8 FPS throttle by default
  - Uses `aria-hidden="true"` for accessibility
- **Exports**: `initPageGrain(options?)`, `destroyPageGrain()`

### parallax.ts

Scroll-based parallax on elements.

- **Purpose**: Create depth with scroll-linked movement
- **Data attr**: `data-parallax="0.5"` (speed multiplier 0-1)
  - 0.5 = moves at 50% of scroll speed (slower, appears further)
  - 1.0 = moves at 100% of scroll speed (normal)
- **Hero-specific**: Also applies parallax to `.hero-photo` (15%) and `.hero-name` (8%)
- **Exports**: `initParallax()`, `destroyParallax()`

### dramatic-reveal.ts

Multi-effect scroll reveals (rise + scale + fade + blur + parallax).

- **Purpose**: Dramatic scroll-driven reveal animations
- **Config**: `siteConfig.dramaticReveal` (rise, scale, blur, parallaxOffset, scrub)
- **Data attrs**:
  | Attribute | Effect |
  |-----------|--------|
  | `data-reveal` | Basic reveal (rise + scale + fade) |
  | `data-reveal-blur` | Image blur-to-clarity effect |
  | `data-reveal-parallax` | Image parallax (moves slower than container) |
  | `data-reveal-intensity` | Override intensity ("gentle" = 60%, "subtle" = 40%) |
- **Trigger points**: Start at 85% viewport, end at 35%
- **Exports**: `initDramaticReveal()`, `destroyDramaticReveal()`

### text-reveal.ts

Character-by-character text animation.

- **Purpose**: Staggered character reveal for headings
- **Data attr**: `data-text-reveal`
- **Behavior**:
  - Wraps each character in a span
  - Preserves line breaks with nested structure
  - Staggered fade-in animation
- **Exports**: `initTextReveal()`, `destroyTextReveal()`

### ken-burns.ts

Slow zoom effect (yoyo animation).

- **Purpose**: Ambient motion on images
- **Data attr**: `data-ken-burns`
- **Behavior**: 25s cycle, yoyo mode (zoom in/out)
- **Exports**: `initKenBurns()`, `destroyKenBurns()`

### horizontal-scroll.ts

Drag-to-scroll for horizontal containers.

- **Purpose**: Drag scrolling for Feed component
- **Target**: Elements with class `.feed-scroll`
- **Behavior**:
  - Desktop: 1.5x drag multiplier
  - Mobile: Native swipe (no drag handling)
  - Cursor changes to grab/grabbing
- **Exports**: `initHorizontalScroll()`, `destroyHorizontalScroll()`

## Usage Examples

### Basic reveal
```html
<section data-reveal>
  <h2>Section Title</h2>
  <p>Content reveals as you scroll</p>
</section>
```

### Image with blur and parallax
```html
<div data-reveal data-reveal-intensity="gentle">
  <img data-reveal-blur data-reveal-parallax src="..." alt="..." />
</div>
```

### Parallax element
```html
<div data-parallax="0.3">
  Moves at 30% scroll speed
</div>
```

### Ken Burns on image
```html
<img data-ken-burns src="..." alt="..." />
```

### Character reveal on heading
```html
<h1 data-text-reveal>SHAYNA DUNKELMAN</h1>
```
