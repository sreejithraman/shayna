---
phase: 6
title: "Press Page"
status: draft
priority: P2
effort: medium
dependencies: [0, 2]
blockers: []
started: null
completed: null
owner: null
---

# Phase 6: Press Page

Grid of press mentions with quotes and links.

## Objectives

- [ ] Define press item data structure
- [ ] Create press card component
- [ ] Build responsive grid layout
- [ ] Handle publication logos (optional)

## Overview

The Press page showcases reviews, features, and mentions from publications. Each item displays:
- Publication name/logo
- Pull quote
- Link to full article
- Optional date

**Color Temperature:** Press page uses warmer accents (amethyst, ember range). See moodboard for color guidance.

## Tasks

### 1. Press Data Structure

Create `src/content/press.json`:

```json
{
  "press": [
    {
      "id": "pitchfork-scholars",
      "publication": "Pitchfork",
      "logo": "/images/press/pitchfork.svg",
      "quote": "Scholars is a masterclass in rhythmic complexity, building intricate patterns that somehow feel both chaotic and precisely controlled.",
      "url": "https://pitchfork.com/reviews/...",
      "date": "2021-03-15",
      "rating": "8.2",
      "type": "review"
    },
    {
      "id": "nyt-feature",
      "publication": "The New York Times",
      "logo": "/images/press/nyt.svg",
      "quote": "Dunkelman's percussion work defies easy categorization, drawing from jazz, noise, and classical traditions.",
      "url": "https://nytimes.com/...",
      "date": "2020-11-22",
      "type": "feature"
    }
  ]
}
```

### 2. TypeScript Interface

Create `src/types/press.ts`:

```typescript
export interface PressItem {
  id: string;
  publication: string;
  logo?: string;
  quote: string;
  url: string;
  date?: string;
  rating?: string;
  type: 'review' | 'feature' | 'interview' | 'mention';
}
```

### 3. Press Card Component

Create `src/components/PressCard.astro`:

```astro
---
import type { PressItem } from '@/types/press';

interface Props {
  item: PressItem;
}

const { item } = Astro.props;

// Format date if provided
const formattedDate = item.date
  ? new Date(item.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  : null;
---

<article class="press-card group">
  <a
    href={item.url}
    target="_blank"
    rel="noopener noreferrer"
    class="block p-6 bg-subtle hover:bg-elevated transition-colors h-full"
  >
    <!-- Publication header -->
    <div class="flex items-center justify-between mb-4">
      {item.logo ? (
        <img
          src={item.logo}
          alt={item.publication}
          class="h-4 w-auto opacity-60 group-hover:opacity-100 transition-opacity"
        />
      ) : (
        <span class="font-mono text-xs uppercase tracking-wider text-muted group-hover:text-secondary transition-colors">
          {item.publication}
        </span>
      )}

      {item.rating && (
        <span class="font-mono text-xs text-violet">
          {item.rating}
        </span>
      )}
    </div>

    <!-- Quote -->
    <blockquote class="mb-4">
      <p class="font-sans text-base leading-relaxed text-secondary group-hover:text-primary transition-colors">
        "{item.quote}"
      </p>
    </blockquote>

    <!-- Footer -->
    <div class="flex items-center justify-between mt-auto pt-4 border-t border-elevated">
      {formattedDate && (
        <span class="font-mono text-[10px] text-muted">
          {formattedDate}
        </span>
      )}

      <span class="font-mono text-[10px] uppercase tracking-wider text-muted group-hover:text-secondary transition-colors flex items-center gap-1">
        Read
        <span class="transform group-hover:translate-x-1 transition-transform">↗</span>
      </span>
    </div>
  </a>
</article>
```

### 4. Press Page Layout

Create `src/pages/press.astro`:

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import BackgroundTexture from '@/components/BackgroundTexture.astro';
import InnerNavigation from '@/components/InnerNavigation.astro';
import PressCard from '@/components/PressCard.astro';
import Footer from '@/components/Footer.astro';
import pressData from '@/content/press.json';

// Sort by date, most recent first
const sortedPress = pressData.press.sort((a, b) => {
  if (!a.date || !b.date) return 0;
  return new Date(b.date).getTime() - new Date(a.date).getTime();
});

// Group by type (optional)
const reviews = sortedPress.filter(p => p.type === 'review');
const features = sortedPress.filter(p => p.type === 'feature');
const other = sortedPress.filter(p => !['review', 'feature'].includes(p.type));
---

<BaseLayout title="Press — Shayna Dunkelman">
  <BackgroundTexture slot="background" />
  <InnerNavigation />

  <main id="main-content" class="pt-32 pb-16">
    <!-- Page header -->
    <header class="px-10 mb-16 max-w-6xl mx-auto">
      <h1 class="font-sans text-3xl md:text-4xl font-light text-primary mb-4">
        Press
      </h1>
      <p class="font-sans text-base text-secondary max-w-xl">
        Selected reviews, features, and interviews.
      </p>
    </header>

    <!-- Press grid -->
    <section class="px-10 max-w-6xl mx-auto mb-24">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedPress.map((item) => (
          <PressCard item={item} />
        ))}
      </div>
    </section>

    <!-- Optional: Press kit download -->
    <section class="px-10 max-w-6xl mx-auto mb-24">
      <div class="bg-subtle p-8 text-center">
        <p class="font-sans text-base text-secondary mb-4">
          Need press materials?
        </p>
        <a
          href="/press-kit.zip"
          class="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted hover:text-primary transition-colors"
        >
          Download Press Kit
          <span>↓</span>
        </a>
      </div>
    </section>

    <Footer />
  </main>
</BaseLayout>
```

### 5. Grid Layout Variations

```css
/* Equal height cards */
.press-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.press-card {
  display: flex;
  flex-direction: column;
}

.press-card a {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Masonry-style (if quotes vary significantly in length) */
@supports (grid-template-rows: masonry) {
  .press-grid {
    grid-template-rows: masonry;
  }
}
```

### 6. Publication Logos

For consistent appearance:

```css
.press-logo {
  max-height: 16px;
  max-width: 100px;
  filter: grayscale(100%) brightness(0.6);
  transition: filter 0.2s;
}

.press-card:hover .press-logo {
  filter: grayscale(100%) brightness(1);
}
```

Logo requirements:
- SVG format preferred
- White or light gray for dark background
- Consistent height (16px display)

### 7. Filtering by Type (Optional Enhancement)

```astro
---
// Add filter buttons
const types = ['all', 'review', 'feature', 'interview'];
---

<div class="flex gap-4 mb-8">
  {types.map((type) => (
    <button
      class="filter-btn font-mono text-xs uppercase tracking-wider text-muted hover:text-primary data-[active]:text-primary"
      data-filter={type}
    >
      {type === 'all' ? 'All' : type}
    </button>
  ))}
</div>

<script>
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.press-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.removeAttribute('data-active'));
      btn.setAttribute('data-active', '');

      cards.forEach((card) => {
        const type = card.dataset.type;
        if (filter === 'all' || type === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
</script>
```

## Acceptance Criteria

- [ ] Press cards display in responsive grid
- [ ] Cards link to external articles
- [ ] Publication name/logo visible
- [ ] Quotes are readable
- [ ] Dates formatted consistently
- [ ] Hover states work on cards
- [ ] Cards are same height in rows
- [ ] Mobile layout stacks to single column
- [ ] External links open in new tab

## Content Requirements

**From Shayna:**
- [ ] List of press mentions with:
  - Publication name
  - Pull quote
  - Article URL
  - Date (optional)
  - Rating (if applicable)
- [ ] Publication logos (optional, SVG preferred)
- [ ] Press kit materials (optional)

## Dependencies

- Phase 0: Design tokens, base layout
- Phase 2: Navigation component

## Technical Notes

- Keep quotes concise (2-3 sentences max)
- Truncate long quotes with ellipsis if needed
- Consider lazy loading images for logos
- Test with varying quote lengths
- Ensure external links have `rel="noopener noreferrer"`
