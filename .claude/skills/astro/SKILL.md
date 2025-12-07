---
name: astro
description: Use when working with Astro framework projects, .astro files, or Astro configuration. Applies Astro best practices for components, islands architecture, and performance.
version: "1.2.0"
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
├── pages/          # File-based routing (each file = route)
├── layouts/        # Reusable page layouts
├── components/     # UI components
│   ├── ui/         # Generic reusable (Button, Card, Modal)
│   ├── sections/   # Page sections (Hero, Footer, Nav)
│   └── [feature]/  # Feature-specific (ProjectCard, AudioPlayer)
├── content/        # Content Collections (type-safe markdown/data)
├── styles/         # Global styles
├── lib/            # Utilities, helpers, constants
└── types/          # Shared TypeScript types
public/             # Static assets (unprocessed, copied as-is)
```

### Component Organization

**By type (smaller projects):**
```
components/
├── Button.astro
├── Card.astro
├── Hero.astro
└── Nav.astro
```

**By category (larger projects):**
```
components/
├── ui/           # Primitive, reusable
│   ├── Button.astro
│   └── Card.astro
├── sections/     # Page-level sections
│   ├── Hero.astro
│   └── Footer.astro
└── features/     # Domain-specific
    └── ProjectCard.astro
```

### Naming Conventions
- **Components:** PascalCase (`ProjectCard.astro`, `HeroSection.astro`)
- **Pages:** kebab-case (`about.astro`, `work/[slug].astro`)
- **Layouts:** PascalCase with "Layout" suffix (`BaseLayout.astro`)
- **Utilities:** camelCase (`formatDate.ts`, `getProjects.ts`)

### When to Use Each Directory

| Directory | Use For |
|-----------|---------|
| `pages/` | Route endpoints, minimal logic, imports layout |
| `layouts/` | Shared page wrappers (head, nav, footer) |
| `components/` | Reusable UI pieces |
| `content/` | Markdown/MDX with frontmatter, type-safe collections |
| `lib/` | Utilities, API clients, shared logic |
| `public/` | Favicons, robots.txt, files needing exact paths |

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
