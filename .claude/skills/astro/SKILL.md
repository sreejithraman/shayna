---
name: astro
description: Use when working with Astro framework projects, .astro files, or Astro configuration. Applies Astro best practices for components, islands architecture, and performance.
version: "1.1.0"
---

# Astro Framework Best Practices

Apply when working with Astro projects.

**Documentation:** https://docs.astro.build

## Core Philosophy
- **Zero JS by default** — Ship HTML/CSS unless interactivity is needed
- **Islands Architecture** — Hydrate only interactive components
- **Content-first** — Optimized for content-driven sites

## Component Guidelines

### Use .astro for Static Content
```astro
---
// Runs at build time only
const data = await fetchData();
---
<article>{data.content}</article>
```

### Use Framework Components for Interactivity
- React, Vue, Svelte, etc. for interactive islands
- Prefer Astro components when possible (smaller output)

## Hydration Directives

Choose the right directive for the use case:

| Directive | When to Use |
|-----------|-------------|
| `client:load` | Critical, above-fold interactive elements |
| `client:idle` | Lower-priority interactivity |
| `client:visible` | Below-fold content (lazy hydration) |
| `client:media="(min-width: 768px)"` | Desktop-only interactivity |
| `client:only="react"` | Client-only, skip SSR |

**Default to `client:visible`** unless immediate interactivity is required.

## Performance

### Images
- Use built-in `<Image>` component for automatic optimization
- Import images for processing: `import hero from './hero.jpg'`
- Set explicit `width` and `height` to prevent layout shift

### CSS
- Scoped by default in `.astro` files
- Automatic bundling and minification
- Use `is:global` sparingly

### Scripts
- Scripts are bundled and deduplicated automatically
- Use `<script>` for component-scoped JS
- Use `is:inline` only when necessary (bypasses processing)

### Prefetching
- Enable view transitions for smooth navigation
- Use `prefetch` for intelligent link prefetching

## File Structure

```
src/
├── pages/        # File-based routing
├── layouts/      # Reusable page layouts
├── components/   # UI components
├── content/      # Content Collections (type-safe)
└── styles/       # Global styles
public/           # Static assets (unprocessed)
```

## Content Collections

Use for type-safe content:
```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
  }),
});

export const collections = { blog };
```

## Common Patterns

### Layout Pattern
```astro
---
// src/layouts/Base.astro
const { title } = Astro.props;
---
<html>
  <head><title>{title}</title></head>
  <body><slot /></body>
</html>
```

### Data Fetching
```astro
---
// Runs at build time (SSG) or request time (SSR)
const response = await fetch('https://api.example.com/data');
const data = await response.json();
---
```

## Avoid
- Unnecessary `client:load` on static content
- Default exports in components (use named exports)
- Heavy framework components when Astro suffices
- `is:inline` unless you need unbundled scripts
