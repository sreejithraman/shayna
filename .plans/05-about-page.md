---
phase: 5
title: "About Page"
status: draft
priority: P2
effort: small
dependencies: [0, 2]
blockers: []
started: null
completed: null
owner: null
---

# Phase 5: About Page

Extended biography and artist statement.

## Objectives

- [ ] Create photo + bio layout
- [ ] Add artist statement section
- [ ] Include background/influences section
- [ ] Style for readability

## Overview

The About page is the most straightforward — primarily text content with an optional photo. The focus is on readability and letting Shayna's story come through.

## Tasks

### 1. About Page Layout

Create `src/pages/about.astro`:

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import BackgroundTexture from '@/components/BackgroundTexture.astro';
import InnerNavigation from '@/components/InnerNavigation.astro';
import Footer from '@/components/Footer.astro';

// Bio content could come from markdown or JSON
const bio = {
  photo: '/images/shayna-about.jpg',
  intro: `Shayna Dunkelman is an avant-garde musician and percussionist...`,
  extended: `...`,
  statement: `...`,
  background: `...`,
};
---

<BaseLayout title="About — Shayna Dunkelman">
  <BackgroundTexture slot="background" />
  <InnerNavigation />

  <main id="main-content" class="pt-32 pb-16">
    <!-- Hero section with photo -->
    <section class="px-10 mb-24">
      <div class="max-w-5xl mx-auto grid md:grid-cols-5 gap-12 items-start">
        <!-- Photo -->
        <div class="md:col-span-2">
          <div class="aspect-[3/4] bg-subtle overflow-hidden sticky top-32">
            <img
              src={bio.photo}
              alt="Shayna Dunkelman"
              class="w-full h-full object-cover grayscale-[15%] contrast-105 brightness-90"
            />
          </div>
        </div>

        <!-- Bio text -->
        <div class="md:col-span-3">
          <h1 class="font-sans text-3xl md:text-4xl font-light text-primary mb-8">
            About
          </h1>

          <!-- Lead paragraph -->
          <p class="font-sans text-xl md:text-2xl font-light leading-relaxed text-primary mb-8">
            {bio.intro}
          </p>

          <!-- Extended bio -->
          <div class="prose prose-invert prose-lg max-w-none">
            <p class="font-sans text-base leading-relaxed text-secondary">
              {bio.extended}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Artist Statement -->
    <section class="px-10 mb-24">
      <div class="max-w-3xl mx-auto">
        <span class="font-mono text-[10px] uppercase tracking-[0.1em] text-muted block mb-6">
          Artist Statement
        </span>

        <blockquote class="border-l-2 border-violet pl-8">
          <p class="font-sans text-lg md:text-xl font-light leading-relaxed text-primary italic">
            {bio.statement}
          </p>
        </blockquote>
      </div>
    </section>

    <!-- Background / Influences -->
    <section class="px-10 mb-24">
      <div class="max-w-3xl mx-auto">
        <span class="font-mono text-[10px] uppercase tracking-[0.1em] text-muted block mb-6">
          Background
        </span>

        <div class="prose prose-invert max-w-none">
          <p class="font-sans text-base leading-relaxed text-secondary">
            {bio.background}
          </p>
        </div>
      </div>
    </section>

    <Footer />
  </main>
</BaseLayout>
```

### 2. Content from Markdown (Alternative)

Create `src/content/bio.md`:

```markdown
---
photo: /images/shayna-about.jpg
---

# About

Shayna Dunkelman is an avant-garde musician and percussionist based in Brooklyn...

## Artist Statement

> "My work explores the space between impulse and intention..."

## Background

Growing up in...
```

Then use Astro's content collections:

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const bio = defineCollection({
  type: 'content',
  schema: z.object({
    photo: z.string().optional(),
  }),
});

export const collections = { bio };
```

### 3. Prose Styling

Add to global CSS:

```css
/* Prose styles for long-form content */
.prose {
  max-width: 65ch;
}

.prose p {
  margin-bottom: 1.5em;
}

.prose p:last-child {
  margin-bottom: 0;
}

.prose-invert {
  color: var(--text-secondary);
}

.prose-invert strong {
  color: var(--text-primary);
}

.prose-lg {
  font-size: 1.125rem;
  line-height: 1.8;
}
```

### 4. Responsive Adjustments

```css
@media (max-width: 768px) {
  /* Stack photo above text on mobile */
  .about-grid {
    grid-template-columns: 1fr;
  }

  /* Photo not sticky on mobile */
  .about-photo {
    position: relative;
    top: auto;
    max-width: 300px;
    margin: 0 auto 2rem;
  }
}
```

### 5. Optional: Timeline/Milestones

If Shayna wants to highlight career milestones:

```astro
---
const milestones = [
  { year: 2008, event: 'Founded Buke and Gase' },
  { year: 2014, event: 'Debut solo album released' },
  // ...
];
---

<section class="px-10 mb-24">
  <div class="max-w-3xl mx-auto">
    <span class="font-mono text-[10px] uppercase tracking-[0.1em] text-muted block mb-6">
      Timeline
    </span>

    <ul class="space-y-4">
      {milestones.map((m) => (
        <li class="flex items-baseline gap-4">
          <span class="font-mono text-xs text-muted w-12">{m.year}</span>
          <span class="font-sans text-base text-secondary">{m.event}</span>
        </li>
      ))}
    </ul>
  </div>
</section>
```

## Acceptance Criteria

- [ ] Photo displays with proper aspect ratio
- [ ] Photo is sticky on desktop (follows scroll)
- [ ] Bio text is readable with proper line height
- [ ] Artist statement styled as blockquote
- [ ] Responsive layout works on mobile
- [ ] Accessible heading structure
- [ ] Links (if any) are properly styled

## Content Requirements

**From Shayna:**
- [ ] Extended bio (3-5 paragraphs)
- [ ] Artist statement (1-2 paragraphs, optional)
- [ ] Background/influences section (optional)
- [ ] About page photo (optional, can reuse hero)
- [ ] Career milestones (optional)

## Dependencies

- Phase 0: Design tokens, base layout
- Phase 2: Navigation component

## Technical Notes

- Consider using Astro content collections for easier editing
- Photo could use `loading="lazy"` if below fold
- Keep prose width limited for readability (65ch)
- Test with long-form content to ensure layout holds
