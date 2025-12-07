---
name: tailwind
description: Use when writing Tailwind CSS classes or styling with Tailwind. Applies Tailwind best practices for utility classes, responsive design, and maintainable styling.
version: "1.1.0"
---

# Tailwind CSS Best Practices

Apply when styling with Tailwind CSS.

**Documentation:** https://tailwindcss.com/docs

## Core Philosophy
- **Utility-first**: Compose styles from utility classes
- **Component extraction**: Extract repeated patterns into components
- **Design tokens**: Use config for consistent values

## Class Organization

Use consistent ordering (Prettier plugin recommended):
1. Layout (display, position, flex, grid)
2. Spacing (margin, padding)
3. Sizing (width, height)
4. Typography (font, text, leading)
5. Visual (bg, border, shadow)
6. Interactive (hover, focus, transition)

```html
<!-- Good: Logical grouping -->
<div class="flex items-center gap-4 p-4 w-full text-sm bg-gray-100 rounded-lg hover:bg-gray-200">

<!-- Avoid: Random order -->
<div class="hover:bg-gray-200 p-4 flex bg-gray-100 text-sm w-full rounded-lg items-center gap-4">
```

## Component Patterns

### Extract Repeated Patterns
When you repeat the same classes 3+ times, extract into a component:

```astro
<!-- Instead of repeating this everywhere -->
<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">

<!-- Create a component -->
<Button variant="primary">Click me</Button>
```

### Use @apply Sparingly
Only for truly atomic patterns that can't be components:

```css
/* Acceptable: Base prose styling */
.prose-custom {
  @apply text-gray-700 leading-relaxed;
}

/* Avoid: Complex component styles */
.btn-primary {
  @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2;
}
```

## Configuration

### Design Tokens in tailwind.config.js
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#8b5cf6',
        'bg-void': '#0a0a0a',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
    },
  },
};
```

### Semantic Names
- Use `text-primary` not `text-purple-500`
- Use `bg-surface` not `bg-gray-100`

## Responsive Design

### Mobile-First
Base styles for mobile, breakpoints for larger:

```html
<!-- Mobile: stack, Desktop: side-by-side -->
<div class="flex flex-col md:flex-row gap-4">
```

### Breakpoints
- `sm:` — 640px+
- `md:` — 768px+
- `lg:` — 1024px+
- `xl:` — 1280px+
- `2xl:` — 1536px+

## Dark Mode

```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

Configure in tailwind.config.js:
```javascript
module.exports = {
  darkMode: 'class', // or 'media'
};
```

## Performance

### PurgeCSS (Automatic in Production)
- Unused classes are removed automatically
- **Don't construct classes dynamically**:

```javascript
// BAD: Won't be purged correctly
const color = 'blue';
className={`bg-${color}-500`}

// GOOD: Full class names
const bgColor = isActive ? 'bg-blue-500' : 'bg-gray-500';
className={bgColor}
```

## Avoid
- Long unreadable class strings without component extraction
- Inline styles when Tailwind utilities exist
- `!important` (use proper specificity)
- Dynamic class construction
- Overriding Tailwind with custom CSS
