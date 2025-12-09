---
name: css
description: Use when writing CSS styles. Applies layout patterns, ITCSS architecture, BEM naming, responsive design, and modern CSS features.
version: "1.3.0"
---

# CSS Best Practices

Apply when writing CSS. Complements Tailwind skill with vanilla CSS patterns.

**Documentation:** https://developer.mozilla.org/en-US/docs/Web/CSS

## Layout Decision Framework

### Flexbox vs Grid
| Use Flexbox | Use Grid |
|-------------|----------|
| One-dimensional (row OR column) | Two-dimensional (rows AND columns) |
| Content-driven sizing | Container-driven sizing |
| Navbar, button groups | Page layouts, card grids |
| Unknown/dynamic item count | Defined structure |

```css
/* Flexbox: Navigation */
.nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* Grid: Card layout */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
```

### Centering Patterns
```css
/* Flexbox centering (most common) */
.center-flex {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Grid centering (simpler) */
.center-grid {
  display: grid;
  place-items: center;
}

/* Absolute centering */
.center-absolute {
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
}
```

## Positioning

### Position Types
| Value | Behavior |
|-------|----------|
| `static` | Default flow |
| `relative` | Offset from normal position, creates stacking context |
| `absolute` | Removed from flow, relative to positioned ancestor |
| `fixed` | Relative to viewport |
| `sticky` | Hybrid: normal until threshold, then fixed |

### Common Patterns
```css
/* Dropdown positioned relative to parent */
.dropdown-wrapper {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
}

/* Sticky header */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
}

/* Full-screen overlay */
.overlay {
  position: fixed;
  inset: 0; /* top: 0; right: 0; bottom: 0; left: 0; */
}
```

## Custom Properties (CSS Variables)

### Define at Root
```css
:root {
  /* Colors - semantic names */
  --color-primary: #3b82f6;
  --color-bg: #ffffff;
  --color-text: #1f2937;

  /* Spacing scale (4px base) */
  --space-xs: 0.25rem;   /* 4px */
  --space-sm: 0.5rem;    /* 8px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 2rem;      /* 32px */
  --space-xl: 4rem;      /* 64px */

  /* Typography */
  --font-sans: system-ui, sans-serif;
  --font-mono: ui-monospace, monospace;
}
```

### Use with Fallbacks
```css
.element {
  color: var(--color-text, #ffffff);
  padding: var(--space-md);
}
```

### Scoped Overrides
```css
/* Dark mode via class */
.dark {
  --color-bg: #0a0a0a;
  --color-text: #f5f5f5;
}

/* Component-scoped variables */
.card {
  --card-padding: var(--space-md);
  padding: var(--card-padding);
}

.card.compact {
  --card-padding: var(--space-sm);
}
```

## Specificity & Cascade

### Specificity Hierarchy (low to high)
1. Type selectors: `div`, `p` (0-0-1)
2. Class selectors: `.card`, `[type="text"]` (0-1-0)
3. ID selectors: `#header` (1-0-0)
4. Inline styles: `style=""` (overrides all)
5. `!important` (nuclear option, avoid)

### Keep Specificity Low
```css
/* BAD: High specificity, hard to override */
#sidebar .nav ul li a.active { }

/* GOOD: Single class */
.nav-link--active { }
```

### Use Cascade Layers
```css
@layer reset, base, components, utilities;

@layer reset {
  * { margin: 0; box-sizing: border-box; }
}

@layer components {
  .button { /* ... */ }
}

@layer utilities {
  .hidden { display: none; }
}
```

## Architecture

### ITCSS (Inverted Triangle CSS)

Organize styles from generic to specific. Lower layers have higher specificity:

```css
/* Layer order (import in this sequence) */
@layer settings,    /* @property, CSS variables, config */
       generic,     /* Resets, normalize, base elements */
       components,  /* UI components, feature-specific */
       utilities;   /* Atomic helpers, overrides */
```

```
settings.css     → :root variables, @property
generic.css      → *, html, body, a, p, h1-h6
components.css   → .card, .button, .modal
utilities.css    → .hidden, .sr-only, .flex
```

### BEM (Block Element Modifier)

Naming convention for component CSS:

```css
/* Block: Standalone component */
.card { }

/* Element: Part of block (double underscore) */
.card__header { }
.card__body { }
.card__footer { }

/* Modifier: Variation (double hyphen) */
.card--featured { }
.card--compact { }

/* Element + Modifier */
.card__header--sticky { }
```

**State classes** use `is-*` / `has-*` (controlled by JS):

```css
/* State classes (not BEM modifiers) */
.menu.is-open { }
.input.is-invalid { }
.card.has-image { }
```

### Transparent Colors with Tokens

Use `color-mix()` to create transparent variants from tokens:

```css
/* BAD: Hardcoded rgba (breaks theming) */
.overlay {
  background: rgba(0, 0, 0, 0.6);
}

/* GOOD: Derive from token */
.overlay {
  background: color-mix(in srgb, var(--color-black) 60%, transparent);
}

/* Works with any color token */
.glow {
  box-shadow: 0 0 20px color-mix(in srgb, var(--color-accent) 40%, transparent);
}
```

## Mobile & Accessibility

### Safe Area (Notched Devices)

Handle iPhone notch, Dynamic Island, etc:

```html
<!-- Required in HTML -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

```css
/* Use env() with fallback */
.footer {
  padding-bottom: max(var(--space-md), env(safe-area-inset-bottom));
  padding-left: max(var(--space-md), env(safe-area-inset-left));
  padding-right: max(var(--space-md), env(safe-area-inset-right));
}
```

### Touch vs Hover

Only apply hover effects on devices that support it:

```css
/* Hover only on devices with hover capability */
@media (hover: hover) {
  .button:hover {
    background: var(--color-accent-hover);
  }
}

/* Coarse pointer (touch) - no hover, larger targets */
@media (pointer: coarse) {
  .button {
    cursor: default;
    min-height: 44px;  /* Apple HIG minimum */
  }
}
```

### Touch Targets

Minimum 44x44px for interactive elements (Apple HIG):

```css
.button, .link, .icon-button {
  min-width: 2.75rem;   /* 44px */
  min-height: 2.75rem;
}
```

### Prevent iOS Zoom on Inputs

Inputs below 16px trigger auto-zoom on iOS:

```css
input, select, textarea {
  font-size: 1rem;  /* 16px prevents zoom */
}
```

### Focus Indicators

Keyboard-visible focus with `:focus-visible`:

```css
/* Visible focus ring for keyboard users */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* Remove default ring (replaced above) */
:focus:not(:focus-visible) {
  outline: none;
}
```

## Responsive Design

### Mobile-First
```css
/* Base: Mobile */
.container {
  padding: 1rem;
}

/* Scale up */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 4rem;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### Common Breakpoints
```css
/* Small phones */   @media (min-width: 480px) { }
/* Large phones */   @media (min-width: 640px) { }
/* Tablets */        @media (min-width: 768px) { }
/* Laptops */        @media (min-width: 1024px) { }
/* Desktops */       @media (min-width: 1280px) { }
```

### Container Queries
```css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: flex;
    gap: 1rem;
  }
}
```

### Fluid Typography
```css
/* Scales between 16px (320px viewport) and 20px (1200px viewport) */
:root {
  --fluid-text: clamp(1rem, 0.5rem + 1vw, 1.25rem);
}

h1 {
  font-size: clamp(2rem, 1rem + 3vw, 4rem);
}
```

## Performance

### GPU-Accelerated Properties
Prefer animating:
- `transform` (translate, scale, rotate)
- `opacity`
- `filter`

Avoid animating (triggers layout):
- `width`, `height`
- `top`, `left`, `margin`, `padding`
- `font-size`

```css
/* GOOD: GPU-accelerated */
.animate {
  transition: transform 0.3s, opacity 0.3s;
}

.animate:hover {
  transform: translateY(-4px);
  opacity: 0.9;
}

/* Hint to browser */
.will-animate {
  will-change: transform;
}
```

### Reduce Layout Thrashing
```css
/* Use contain for isolated components */
.card {
  contain: layout style;
}

/* Avoid expensive selectors */
/* BAD */ * + * { }
/* BAD */ .parent > * > * { }
```

## Logical Properties

Use logical properties for better internationalization:

```css
/* Physical (avoid) → Logical (prefer) */
margin-left    → margin-inline-start
margin-right   → margin-inline-end
padding-top    → padding-block-start
padding-bottom → padding-block-end
text-align: left → text-align: start

.element {
  margin-inline: auto;      /* horizontal centering */
  padding-block: 1rem;      /* vertical padding */
  border-inline-start: 2px solid;
}
```

## Modern CSS Features

### :has() Selector
```css
/* Style parent based on child */
.card:has(img) {
  padding: 0;
}

/* Style sibling */
label:has(+ input:invalid) {
  color: red;
}
```

### :is() and :where()
```css
/* Grouping with maintained specificity */
:is(h1, h2, h3) {
  font-weight: 500;
}

/* Zero specificity (easily overridable) */
:where(h1, h2, h3) {
  margin-block: 0.5em;
}
```

### Aspect Ratio
```css
.video-container {
  aspect-ratio: 16 / 9;
}

.square {
  aspect-ratio: 1;
}
```

## Avoid
- `!important` (fix specificity instead)
- ID selectors for styling
- Overly specific selectors
- Animating layout properties (width, height, top, left)
- Magic numbers without comments
- Deep nesting (max 3 levels)
- Undoing styles (sign of wrong approach)
- `float` for layout (use flexbox/grid)
