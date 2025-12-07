---
phase: 2
title: "Navigation System"
status: draft
priority: P1
effort: medium
dependencies: [0, 1]
blockers: []
started: null
completed: null
owner: null
---

# Phase 2: Navigation System

Fixed navigation that emerges from the threshold transition.

## Objectives

- [ ] Create navigation component structure
- [ ] Integrate name element from threshold
- [ ] Implement nav links fade-in
- [ ] Add hover/focus states
- [ ] Handle mobile navigation

## Overview

The navigation is unique in that:
1. The "logo" IS the name `<h1>` from the threshold
2. Nav links are hidden until the name locks into position
3. It's always fixed to viewport after threshold completes
4. Mobile uses the same pattern (no hamburger needed due to minimal links)

## Tasks

### 1. Navigation Component

Create `src/components/Navigation.astro`:

```astro
---
// Navigation.astro
// Note: The h1 name element is rendered in Threshold component
// This component handles the nav links that appear alongside it
---

<nav class="fixed top-0 left-0 right-0 z-50 pointer-events-none" id="main-nav">
  <div class="flex items-center justify-between px-10 py-6">
    <!-- Name/logo space (controlled by Threshold) -->
    <div class="w-48" aria-hidden="true"></div>

    <!-- Nav links -->
    <div
      class="flex items-center gap-8 opacity-0 pointer-events-none transition-opacity duration-500"
      id="nav-links"
    >
      <a
        href="/work"
        class="nav-link font-mono text-[10px] uppercase tracking-[0.08em] text-secondary hover:text-primary transition-colors pointer-events-auto"
      >
        Work
      </a>
      <a
        href="/about"
        class="nav-link font-mono text-[10px] uppercase tracking-[0.08em] text-secondary hover:text-primary transition-colors pointer-events-auto"
      >
        About
      </a>
      <a
        href="/press"
        class="nav-link font-mono text-[10px] uppercase tracking-[0.08em] text-secondary hover:text-primary transition-colors pointer-events-auto"
      >
        Press
      </a>
      <a
        href="#contact"
        class="nav-link font-mono text-[10px] uppercase tracking-[0.08em] text-secondary hover:text-primary transition-colors pointer-events-auto"
      >
        Contact
      </a>
    </div>
  </div>
</nav>
```

### 2. Nav Links Visibility Control

```typescript
// src/scripts/navigation.ts

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initNavigation() {
  const navLinks = document.getElementById('nav-links');
  const thresholdName = document.getElementById('threshold-name');

  // Fade in nav links when name reaches nav position
  ScrollTrigger.create({
    trigger: '#threshold',
    start: '120% top', // Start fade at 120vh
    end: '140% top',   // Complete at 140vh
    onEnter: () => {
      gsap.to(navLinks, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      });
      navLinks?.classList.remove('pointer-events-none');
    },
    onLeaveBack: () => {
      gsap.to(navLinks, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      });
      navLinks?.classList.add('pointer-events-none');
    },
  });

  // Make name clickable (home link) after transition
  ScrollTrigger.create({
    trigger: '#threshold',
    start: '140% top',
    onEnter: () => {
      thresholdName?.classList.add('cursor-pointer');
      thresholdName?.setAttribute('role', 'link');
      thresholdName?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },
  });
}
```

### 3. Name Element Styling (Locked State)

```css
/* In global.css or component styles */

#threshold-name {
  /* Initial hero state */
  font-size: clamp(32px, 8vw, 64px);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  white-space: nowrap;
}

#threshold-name.locked {
  /* Final nav state (applied via GSAP) */
  font-size: 14px;
  top: 24px;
  left: 40px;
  transform: none;
}

#threshold-name.cursor-pointer {
  cursor: pointer;
}

#threshold-name.cursor-pointer:hover {
  color: var(--accent-violet);
}
```

### 4. Active State for Current Page

```typescript
// Highlight current page in nav
export function setActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '/' && href === '/')) {
      link.classList.add('text-primary');
      link.classList.remove('text-secondary');
    }
  });
}
```

### 5. Focus States & Accessibility

```css
/* Focus styles */
.nav-link:focus-visible {
  outline: 2px solid var(--accent-violet);
  outline-offset: 4px;
}

#threshold-name:focus-visible {
  outline: 2px solid var(--accent-violet);
  outline-offset: 4px;
}

/* Skip link */
.skip-link {
  position: absolute;
  top: -100%;
  left: 16px;
  padding: 8px 16px;
  background: var(--bg-elevated);
  color: var(--text-primary);
  z-index: 100;
  font-size: 14px;
}

.skip-link:focus {
  top: 16px;
}
```

### 6. Skip Link Component

Create `src/components/SkipLink.astro`:

```astro
---
// SkipLink.astro — Accessibility skip navigation
---

<a href="#main-content" class="skip-link">
  Skip to main content
</a>
```

### 7. Inner Page Navigation

For pages other than home, the navigation needs to render without the threshold:

```astro
---
// InnerNavigation.astro — For non-home pages
---

<nav class="fixed top-0 left-0 right-0 z-50" id="main-nav">
  <div class="flex items-center justify-between px-10 py-6">
    <a
      href="/"
      class="font-sans text-sm font-normal text-primary hover:text-violet transition-colors"
    >
      Shayna Dunkelman
    </a>

    <div class="flex items-center gap-8">
      <a href="/work" class="nav-link font-mono text-[10px] uppercase tracking-[0.08em] text-secondary hover:text-primary transition-colors">
        Work
      </a>
      <a href="/about" class="nav-link font-mono text-[10px] uppercase tracking-[0.08em] text-secondary hover:text-primary transition-colors">
        About
      </a>
      <a href="/press" class="nav-link font-mono text-[10px] uppercase tracking-[0.08em] text-secondary hover:text-primary transition-colors">
        Press
      </a>
      <a href="#contact" class="nav-link font-mono text-[10px] uppercase tracking-[0.08em] text-secondary hover:text-primary transition-colors">
        Contact
      </a>
    </div>
  </div>
</nav>
```

### 8. Mobile Considerations

Since there are only 4 nav links, no hamburger menu is needed. Adjust spacing:

```css
@media (max-width: 640px) {
  #main-nav .flex {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  #nav-links {
    gap: 16px;
    flex-wrap: wrap;
  }

  .nav-link {
    font-size: 11px;
  }
}

/* Or consider: horizontal scroll on very small screens */
@media (max-width: 400px) {
  #nav-links {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  #nav-links::-webkit-scrollbar {
    display: none;
  }
}
```

## Acceptance Criteria

- [ ] Nav links hidden on page load (home)
- [ ] Nav links fade in at 120vh scroll
- [ ] Name acts as home link after threshold
- [ ] Hover states work on all interactive elements
- [ ] Focus states visible for keyboard navigation
- [ ] Skip link works and is visible on focus
- [ ] Current page highlighted in nav
- [ ] Inner pages have immediate visible nav
- [ ] Mobile layout renders without overflow
- [ ] Reduced motion: instant transitions

## Technical Notes

- `pointer-events-none` on nav container prevents blocking clicks during threshold
- Individual links need `pointer-events-auto`
- Test scroll position persistence on back navigation
- Consider view transitions for page navigation

## Dependencies

- Phase 0: Base layout, design tokens
- Phase 1: Threshold name element and scroll behavior
