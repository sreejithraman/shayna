---
phase: 4
title: "Work Page"
status: draft
priority: P1
effort: large
dependencies: [0, 2]
blockers: []
started: null
completed: null
owner: null
---

# Phase 4: Work Page

Curated projects with expandable details and archive section.

## Objectives

- [ ] Define project data structure
- [ ] Create project card component
- [ ] Implement expand/collapse behavior
- [ ] Build curated projects section
- [ ] Build archive section with denser layout
- [ ] Handle media embeds (audio/video)

## Overview

The Work page has two distinct sections:
1. **Curated** — 5-7 featured projects with rich expand behavior
2. **Archive** — All projects in a denser, scannable format

Both use the same expand-in-place interaction.

**Color Temperature:** Work page uses warmer accents (amethyst, ember). See moodboard for color shift guidance.

## Tasks

### 1. Project Data Structure

Create `src/content/projects.json`:

```json
{
  "projects": [
    {
      "id": "buke-and-gase-scholars",
      "title": "Scholars",
      "year": 2021,
      "role": "Percussion, Composition",
      "shortDescription": "Fourth studio album exploring rhythmic complexity and textural experimentation.",
      "fullDescription": "Scholars represents five years of sonic exploration...",
      "media": {
        "type": "audio",
        "url": "https://bukeandgase.bandcamp.com/album/scholars",
        "embed": "<iframe style=\"border: 0; width: 100%; height: 120px;\" src=\"https://bandcamp.com/EmbeddedPlayer/...\"></iframe>"
      },
      "credits": [
        "Arone Dyer — Buke, Vocals",
        "Shayna Dunkelman — Percussion",
        "Recorded at Studio G Brooklyn"
      ],
      "links": [
        { "label": "Bandcamp", "url": "https://..." },
        { "label": "Spotify", "url": "https://..." }
      ],
      "featured": true
    }
  ]
}
```

### 2. TypeScript Interfaces

Create `src/types/project.ts`:

```typescript
export interface ProjectMedia {
  type: 'audio' | 'video' | 'image';
  url: string;
  embed?: string;
  thumbnail?: string;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  year: number;
  role: string;
  shortDescription: string;
  fullDescription: string;
  media?: ProjectMedia;
  credits?: string[];
  links?: ProjectLink[];
  featured: boolean;
  tags?: string[];
}
```

### 3. Project Card Component

Create `src/components/ProjectCard.astro`:

```astro
---
import type { Project } from '@/types/project';

interface Props {
  project: Project;
  variant?: 'featured' | 'archive';
}

const { project, variant = 'featured' } = Astro.props;
const isFeatured = variant === 'featured';
---

<article
  class:list={[
    'project-card border-b border-elevated',
    isFeatured ? 'py-8' : 'py-4',
  ]}
  data-project-id={project.id}
>
  <!-- Collapsed state (always visible) -->
  <button
    class="w-full text-left flex items-start justify-between gap-4 group"
    aria-expanded="false"
    aria-controls={`project-${project.id}-details`}
  >
    <div class="flex-1">
      <div class="flex items-baseline gap-4 mb-1">
        <h3 class:list={[
          'font-sans font-light text-primary group-hover:text-violet transition-colors',
          isFeatured ? 'text-xl md:text-2xl' : 'text-base md:text-lg',
        ]}>
          {project.title}
        </h3>
        <span class="font-mono text-xs text-muted">
          {project.year}
        </span>
      </div>

      <p class="font-mono text-xs text-secondary mb-2">
        {project.role}
      </p>

      {isFeatured && (
        <p class="font-sans text-sm text-secondary max-w-xl">
          {project.shortDescription}
        </p>
      )}
    </div>

    <!-- Expand indicator -->
    <span class="text-muted group-hover:text-secondary transition-colors transform group-aria-expanded:rotate-45">
      +
    </span>
  </button>

  <!-- Expanded state (hidden by default) -->
  <div
    id={`project-${project.id}-details`}
    class="project-details hidden overflow-hidden"
    aria-hidden="true"
  >
    <div class="pt-6 pb-4 grid md:grid-cols-2 gap-8">
      <!-- Full description -->
      <div>
        <p class="font-sans text-base leading-relaxed text-secondary mb-6">
          {project.fullDescription}
        </p>

        {project.credits && project.credits.length > 0 && (
          <div>
            <span class="font-mono text-[10px] uppercase tracking-wider text-muted block mb-2">
              Credits
            </span>
            <ul class="space-y-1">
              {project.credits.map((credit) => (
                <li class="font-sans text-sm text-secondary">{credit}</li>
              ))}
            </ul>
          </div>
        )}

        {project.links && project.links.length > 0 && (
          <div class="mt-6 flex flex-wrap gap-4">
            {project.links.map((link) => (
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                class="font-mono text-xs uppercase tracking-wider text-muted hover:text-primary transition-colors"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        )}
      </div>

      <!-- Media embed -->
      {project.media && (
        <div class="media-embed">
          {project.media.embed ? (
            <div set:html={project.media.embed} class="embed-wrapper" />
          ) : project.media.type === 'image' && (
            <img
              src={project.media.url}
              alt={project.title}
              class="w-full grayscale-[15%] contrast-105"
            />
          )}
        </div>
      )}
    </div>
  </div>
</article>

<style>
  .embed-wrapper :global(iframe) {
    width: 100%;
    border: none;
    background: var(--bg-subtle);
  }
</style>
```

### 4. Expand/Collapse Interaction

Create `src/scripts/project-expand.ts`:

```typescript
import { gsap } from 'gsap';

export function initProjectExpand() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach((card) => {
    const button = card.querySelector('button');
    const details = card.querySelector('.project-details');

    if (!button || !details) return;

    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        collapse(button, details as HTMLElement);
      } else {
        // Collapse any other open cards first
        collapseAll();
        expand(button, details as HTMLElement);
      }
    });
  });
}

function expand(button: Element, details: HTMLElement) {
  button.setAttribute('aria-expanded', 'true');
  details.setAttribute('aria-hidden', 'false');
  details.classList.remove('hidden');

  // Animate height
  gsap.fromTo(details,
    { height: 0, opacity: 0 },
    {
      height: 'auto',
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out',
    }
  );
}

function collapse(button: Element, details: HTMLElement) {
  button.setAttribute('aria-expanded', 'false');
  details.setAttribute('aria-hidden', 'true');

  gsap.to(details, {
    height: 0,
    opacity: 0,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: () => {
      details.classList.add('hidden');
    },
  });
}

function collapseAll() {
  document.querySelectorAll('.project-card').forEach((card) => {
    const button = card.querySelector('button');
    const details = card.querySelector('.project-details');

    if (button?.getAttribute('aria-expanded') === 'true' && details) {
      collapse(button, details as HTMLElement);
    }
  });
}
```

### 5. Work Page Layout

Create `src/pages/work.astro`:

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import BackgroundTexture from '@/components/BackgroundTexture.astro';
import InnerNavigation from '@/components/InnerNavigation.astro';
import ProjectCard from '@/components/ProjectCard.astro';
import Footer from '@/components/Footer.astro';
import projectsData from '@/content/projects.json';

const featured = projectsData.projects.filter(p => p.featured);
const archive = projectsData.projects.filter(p => !p.featured);
---

<BaseLayout title="Work — Shayna Dunkelman">
  <BackgroundTexture slot="background" />
  <InnerNavigation />

  <main id="main-content" class="pt-32 pb-16">
    <!-- Page header -->
    <header class="px-10 mb-16 max-w-4xl mx-auto">
      <h1 class="font-sans text-3xl md:text-4xl font-light text-primary mb-4">
        Work
      </h1>
      <p class="font-sans text-base text-secondary max-w-xl">
        Selected projects spanning studio albums, live performance,
        collaboration, and solo exploration.
      </p>
    </header>

    <!-- Curated projects -->
    <section class="px-10 max-w-4xl mx-auto mb-24">
      <span class="font-mono text-[10px] uppercase tracking-[0.1em] text-muted block mb-6">
        Selected
      </span>

      <div class="divide-y divide-elevated">
        {featured.map((project) => (
          <ProjectCard project={project} variant="featured" />
        ))}
      </div>
    </section>

    <!-- Divider -->
    <div class="px-10 max-w-4xl mx-auto mb-24">
      <hr class="border-elevated" />
    </div>

    <!-- Archive -->
    <section class="px-10 max-w-4xl mx-auto">
      <span class="font-mono text-[10px] uppercase tracking-[0.1em] text-muted block mb-6">
        Archive
      </span>

      <div class="divide-y divide-subtle">
        {archive.map((project) => (
          <ProjectCard project={project} variant="archive" />
        ))}
      </div>
    </section>

    <Footer />
  </main>
</BaseLayout>

<script>
  import { initProjectExpand } from '@/scripts/project-expand';
  initProjectExpand();
</script>
```

### 6. Media Embed Styling

```css
/* Global styles for embeds */
.embed-wrapper {
  background: var(--bg-subtle);
  border-radius: 2px;
  overflow: hidden;
}

/* Bandcamp */
.embed-wrapper iframe[src*="bandcamp"] {
  height: 120px;
}

/* YouTube */
.embed-wrapper iframe[src*="youtube"] {
  aspect-ratio: 16/9;
  height: auto;
}

/* SoundCloud */
.embed-wrapper iframe[src*="soundcloud"] {
  height: 166px;
}
```

### 7. Keyboard Navigation

```typescript
// Add to project-expand.ts

export function initKeyboardNav() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach((card, index) => {
    const button = card.querySelector('button');

    button?.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = cards[index + 1]?.querySelector('button');
        (next as HTMLElement)?.focus();
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = cards[index - 1]?.querySelector('button');
        (prev as HTMLElement)?.focus();
      }
    });
  });
}
```

## Acceptance Criteria

- [ ] Featured projects display with full info
- [ ] Archive projects display in compact format
- [ ] Click to expand shows details + media
- [ ] Only one project expanded at a time
- [ ] Smooth expand/collapse animation
- [ ] Media embeds render correctly
- [ ] External links open in new tabs
- [ ] Keyboard navigation works (arrow keys, enter)
- [ ] Screen reader announces expand state
- [ ] Responsive layout on all breakpoints

## Content Requirements

**From Shayna:**
- [ ] List of 5-7 featured projects
- [ ] Full project archive
- [ ] For each project:
  - Title, year, role
  - Short description (1-2 sentences)
  - Full description (1-2 paragraphs)
  - Credits (optional)
  - Media embed codes (Bandcamp, YouTube, etc.)
  - Related links

## Dependencies

- Phase 0: Design tokens, base layout
- Phase 2: Navigation component

## Technical Notes

- Use `aria-expanded` and `aria-controls` for accessibility
- Consider lazy-loading media embeds until expanded
- Test embed security (sanitize if using set:html)
- Archive could be paginated if list grows large
