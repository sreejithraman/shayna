---
name: design-system
description: Use when implementing designs, building component libraries, or working with design tokens. Applies design system architecture, import order, and design-to-code translation patterns.
version: "1.2.0"
---

# Design System Best Practices

Apply when implementing designs or building component systems.

## Token Architecture

### Three-Tier Token System
```
Primitive → Semantic → Component
```

```css
:root {
  /* PRIMITIVE: Raw values, never use directly in components */
  --gray-900: #0a0a0a;
  --gray-800: #161616;
  --gray-100: #f5f5f5;
  --violet-500: #8b5cf6;

  /* SEMANTIC: Purpose-driven, use in components */
  --color-bg-base: var(--gray-900);
  --color-bg-elevated: var(--gray-800);
  --color-text-primary: var(--gray-100);
  --color-accent: var(--violet-500);

  /* COMPONENT: Scoped to specific components */
  --button-bg: var(--color-accent);
  --button-text: var(--color-text-primary);
  --card-bg: var(--color-bg-elevated);
}
```

### Token Naming Convention
```
--{category}-{property}-{variant}-{state}

Examples:
--color-bg-base
--color-text-secondary
--color-border-subtle
--space-page-padding
--font-size-heading-lg
--button-bg-hover
```

### CSS Import Order

Always import stylesheets in this order:

```html
<!-- 1. External fonts (Google Fonts, etc.) -->
<link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet" />

<!-- 2. Icon fonts -->
<link href="https://fonts.googleapis.com/.../Material+Symbols..." rel="stylesheet" />

<!-- 3. Design system tokens (MUST be first CSS) -->
<link rel="stylesheet" href="design-system.css" />

<!-- 4. Page-specific styles -->
<link rel="stylesheet" href="page.css" />
```

**Why order matters:**
- Design system defines CSS variables used by page styles
- Page CSS can override semantic aliases
- Later files can reference earlier variables

### Gray Scale Pattern

Define a comprehensive gray scale for subtle UI variations:

```css
:root {
  /* Full gray scale (dark → light) */
  --color-gray-950: #0d0e15;  /* Near black */
  --color-gray-900: #121212;
  --color-gray-850: #161616;
  --color-gray-800: #1a1a1a;
  --color-gray-750: #1e1e1e;
  --color-gray-700: #222222;
  --color-gray-650: #2a2a2a;
  --color-gray-600: #333333;
  --color-gray-550: #3d3d3d;
  --color-gray-500: #444444;  /* Mid gray */
  --color-gray-450: #555555;
  --color-gray-400: #666666;
  --color-gray-350: #777777;
  --color-gray-300: #888888;
  --color-gray-250: #999999;
  --color-gray-200: #aaaaaa;
  --color-gray-150: #cccccc;
  --color-gray-100: #e5e5e5;
  --color-gray-50: #f5f5f5;   /* Near white */
}
```

**Usage:**
- Backgrounds: 950-850 (dark themes)
- Borders: 700-500
- Muted text: 400-250
- Disabled states: 500-400

## Spacing System

### 4px/8px Base Grid
```css
:root {
  --space-unit: 0.25rem;  /* 4px */

  --space-1: calc(var(--space-unit) * 1);   /* 4px */
  --space-2: calc(var(--space-unit) * 2);   /* 8px */
  --space-3: calc(var(--space-unit) * 3);   /* 12px */
  --space-4: calc(var(--space-unit) * 4);   /* 16px */
  --space-6: calc(var(--space-unit) * 6);   /* 24px */
  --space-8: calc(var(--space-unit) * 8);   /* 32px */
  --space-12: calc(var(--space-unit) * 12); /* 48px */
  --space-16: calc(var(--space-unit) * 16); /* 64px */
}
```

### Semantic Spacing
```css
:root {
  /* Content spacing */
  --space-inline-xs: var(--space-1);   /* Between inline items */
  --space-inline-sm: var(--space-2);
  --space-inline-md: var(--space-4);

  /* Stack spacing */
  --space-stack-sm: var(--space-2);    /* Between stacked items */
  --space-stack-md: var(--space-4);
  --space-stack-lg: var(--space-8);

  /* Section spacing */
  --space-section: var(--space-16);    /* Between page sections */
}
```

## Typography Scale

### Modular Scale
```css
:root {
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 2rem;      /* 32px */
  --font-size-4xl: 2.5rem;    /* 40px */
  --font-size-5xl: 3.5rem;    /* 56px */

  /* Line heights */
  --leading-tight: 1.1;
  --leading-snug: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  /* Font weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}
```

### Text Presets
```css
.text-heading-xl {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-normal);
  line-height: var(--leading-tight);
  letter-spacing: -0.02em;
}

.text-body {
  font-size: var(--font-size-base);
  line-height: var(--leading-normal);
}

.text-label {
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
```

## Color System

### Semantic Color Roles
```css
:root {
  /* Backgrounds (dark theme) */
  --color-bg-base: #0a0a0a;       /* Page background */
  --color-bg-subtle: #0f0f0f;     /* Slightly elevated */
  --color-bg-elevated: #161616;   /* Cards, modals */
  --color-bg-overlay: rgba(0, 0, 0, 0.8);

  /* Text */
  --color-text-primary: #f5f5f5;   /* Main content */
  --color-text-secondary: #999999; /* Supporting text */
  --color-text-muted: #555555;     /* Disabled, hints */

  /* Borders */
  --color-border-subtle: #222222;
  --color-border-default: #333333;
  --color-border-strong: #444444;

  /* Interactive */
  --color-accent: #8b5cf6;
  --color-accent-hover: #7c4deb;
  --color-accent-active: #6d3de0;

  /* Feedback */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
}
```

### Accessibility: Contrast Ratios
| Text Type | Minimum Ratio | Check Against |
|-----------|---------------|---------------|
| Body text | 4.5:1 | Background |
| Large text (24px+) | 3:1 | Background |
| UI components | 3:1 | Adjacent colors |

## Component API Design

### Props Structure
```typescript
interface ButtonProps {
  // Variant: Visual style
  variant: 'primary' | 'secondary' | 'ghost';

  // Size: Consistent scale
  size: 'sm' | 'md' | 'lg';

  // State: Boolean modifiers
  disabled?: boolean;
  loading?: boolean;

  // Composition: Allow extension
  className?: string;
  children: React.ReactNode;
}
```

### Variant Patterns
```css
/* Base styles */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-medium);
  transition: all 0.2s;
}

/* Size variants */
.button--sm { padding: var(--space-1) var(--space-3); font-size: var(--font-size-sm); }
.button--md { padding: var(--space-2) var(--space-4); font-size: var(--font-size-base); }
.button--lg { padding: var(--space-3) var(--space-6); font-size: var(--font-size-lg); }

/* Style variants */
.button--primary {
  background: var(--color-accent);
  color: white;
}

.button--ghost {
  background: transparent;
  color: var(--color-text-primary);
}
```

## Design-to-Code Translation

### Interpreting Design Specs
1. **Extract tokens first**: Identify colors, spacing, typography from the design
2. **Map to existing tokens**: Use design system values, not pixel-perfect
3. **Question inconsistencies**: If spacing is 17px, ask—probably should be 16px
4. **Identify patterns**: Same card used 3 times? Make it a component

### Figma-to-CSS Mapping
| Figma | CSS |
|-------|-----|
| Auto Layout | Flexbox/Grid |
| Gap | gap property |
| Padding | padding |
| Fill: Hug | width: fit-content |
| Fill: Fixed | width: [value] |
| Fill: Fill | flex: 1 |
| Constraints | position + inset |

### Handling Design Ambiguity
```
Designer shows: Card with ~16px padding
Your options:
1. Use --space-4 (16px) ✓
2. Ask designer to confirm
3. Never use 17px, 15px, 19px (not on grid)
```

## Responsive Components

### Container-Based Breakpoints
```css
/* Component adapts to its container, not viewport */
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    flex-direction: row;
  }
}
```

### Responsive Token Overrides
```css
:root {
  --page-padding: var(--space-4);
}

@media (min-width: 768px) {
  :root {
    --page-padding: var(--space-8);
  }
}

@media (min-width: 1024px) {
  :root {
    --page-padding: var(--space-12);
  }
}
```

## Accessibility Integration

### Focus States
```css
/* Visible focus for keyboard users */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* Remove default focus ring (replaced above) */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Touch Targets
```css
/* Minimum 44x44px for touch */
.button, .link, .interactive {
  min-height: 44px;
  min-width: 44px;
}
```

## Avoid
- Using raw color values (always use tokens)
- Spacing values not on the grid (17px, 23px)
- Inconsistent component APIs across similar components
- Skipping semantic token layer (primitive → component)
- Fixed pixel values for typography (use rem)
- Ignoring focus states
- Hard-coding breakpoints in components (use tokens)
- Creating new tokens when existing ones work
