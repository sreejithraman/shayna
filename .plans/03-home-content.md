---
phase: 3
title: "Home Page Content"
status: draft
priority: P1
effort: medium
dependencies: [0, 1, 2]
blockers: []
started: null
completed: null
owner: null
---

# Phase 3: Home Page Content

Content sections that follow the threshold hero.

## Objectives

- [ ] Create bio section with intro text
- [ ] Build "Latest" featured item module
- [ ] Implement footer with contact form
- [ ] Add social links
- [ ] Style sections consistently with design system

## Overview

After the threshold hero (200vh), the home page continues with:
1. **Bio** — Short 2-3 paragraph introduction
2. **Latest** — Single featured item (album, show, press mention)
3. **Updates** — Instagram feed grid (2×4 layout per wireframes)
4. **Footer** — Contact form + social links

**Color Temperature:** Home uses cooler accents (violet, blue). See moodboard for details.

## Tasks

### 1. Home Page Structure

Update `src/pages/index.astro`:

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import BackgroundTexture from '@/components/BackgroundTexture.astro';
import Threshold from '@/components/Threshold.astro';
import Navigation from '@/components/Navigation.astro';
import Bio from '@/components/Bio.astro';
import Latest from '@/components/Latest.astro';
import Updates from '@/components/Updates.astro';
import Footer from '@/components/Footer.astro';
---

<BaseLayout title="Shayna Dunkelman — Musician & Percussionist">
  <BackgroundTexture slot="background" />
  <Navigation />
  <Threshold />

  <main id="main-content" class="relative z-30 bg-void">
    <Bio />
    <Latest />
    <Updates />
    <Footer />
  </main>
</BaseLayout>
```

### 2. Bio Section Component

Create `src/components/Bio.astro`:

```astro
---
// Bio.astro — Short introduction section
---

<section class="py-24 px-10 max-w-3xl mx-auto" id="bio">
  <p class="text-lg md:text-xl lg:text-2xl font-sans font-light leading-relaxed text-primary mb-8">
    Shayna Dunkelman is an avant-garde musician and percussionist based in Brooklyn.
    Her work spans experimental composition, improvisation, and collaboration with
    artists across disciplines.
  </p>

  <p class="text-base md:text-lg font-sans font-normal leading-relaxed text-secondary mb-8">
    As a founding member of Buke and Gase, she has toured internationally and
    released critically acclaimed albums. Her solo work explores the intersection
    of acoustic percussion and electronic manipulation.
  </p>

  <a
    href="/about"
    class="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted hover:text-primary transition-colors group"
  >
    Read more
    <span class="transform group-hover:translate-x-1 transition-transform">→</span>
  </a>
</section>
```

### 3. Latest/Featured Module

Create `src/components/Latest.astro`:

```astro
---
// Latest.astro — Single featured item
interface Props {
  type: 'album' | 'show' | 'press' | 'video';
  title: string;
  subtitle?: string;
  description: string;
  link?: string;
  image?: string;
  date?: string;
}

const { type, title, subtitle, description, link, image, date } = Astro.props;
---

<section class="py-24 px-10" id="latest">
  <div class="max-w-4xl mx-auto">
    <!-- Section label -->
    <span class="font-mono text-[10px] uppercase tracking-[0.1em] text-muted block mb-8">
      Latest
    </span>

    <div class="grid md:grid-cols-2 gap-12 items-start">
      <!-- Image (if provided) -->
      {image && (
        <div class="aspect-square bg-subtle overflow-hidden">
          <img
            src={image}
            alt={title}
            class="w-full h-full object-cover grayscale-[15%] contrast-105 brightness-90"
          />
        </div>
      )}

      <!-- Content -->
      <div class={image ? '' : 'md:col-span-2'}>
        {date && (
          <span class="font-mono text-xs text-muted block mb-2">
            {date}
          </span>
        )}

        <h2 class="font-sans text-2xl md:text-3xl font-light text-primary mb-2">
          {title}
        </h2>

        {subtitle && (
          <p class="font-sans text-lg text-secondary mb-4">
            {subtitle}
          </p>
        )}

        <p class="font-sans text-base leading-relaxed text-secondary mb-6">
          {description}
        </p>

        {link && (
          <a
            href={link}
            class="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted hover:text-primary transition-colors group"
            target={link.startsWith('http') ? '_blank' : undefined}
            rel={link.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {type === 'album' && 'Listen'}
            {type === 'show' && 'Details'}
            {type === 'press' && 'Read'}
            {type === 'video' && 'Watch'}
            <span class="transform group-hover:translate-x-1 transition-transform">→</span>
          </a>
        )}
      </div>
    </div>
  </div>
</section>
```

### 4. Footer Component

Create `src/components/Footer.astro`:

```astro
---
// Footer.astro — Contact form + social links
import ContactForm from '@/components/ContactForm.astro';
import SocialLinks from '@/components/SocialLinks.astro';
---

<footer class="py-24 px-10 border-t border-elevated" id="contact">
  <div class="max-w-4xl mx-auto">
    <div class="grid md:grid-cols-2 gap-16">
      <!-- Contact Form -->
      <div>
        <h2 class="font-sans text-xl font-light text-primary mb-8">
          Get in Touch
        </h2>
        <ContactForm />
      </div>

      <!-- Links & Info -->
      <div>
        <h2 class="font-sans text-xl font-light text-primary mb-8">
          Connect
        </h2>
        <SocialLinks />

        <div class="mt-12">
          <p class="font-mono text-xs text-muted">
            For booking inquiries:
          </p>
          <a
            href="mailto:booking@shaynadunkelman.com"
            class="font-mono text-xs text-secondary hover:text-primary transition-colors"
          >
            booking@shaynadunkelman.com
          </a>
        </div>
      </div>
    </div>

    <!-- Copyright -->
    <div class="mt-24 pt-8 border-t border-subtle">
      <p class="font-mono text-[10px] uppercase tracking-wider text-muted">
        © {new Date().getFullYear()} Shayna Dunkelman. All rights reserved.
      </p>
    </div>
  </div>
</footer>
```

### 5. Contact Form Component

Create `src/components/ContactForm.astro`:

```astro
---
// ContactForm.astro — Minimal contact form
---

<form
  id="contact-form"
  class="space-y-6"
  action="/api/contact"
  method="POST"
>
  <div>
    <label for="name" class="sr-only">Name</label>
    <input
      type="text"
      id="name"
      name="name"
      placeholder="Name"
      required
      class="w-full bg-transparent border-b border-elevated focus:border-secondary outline-none py-3 font-sans text-base text-primary placeholder:text-muted transition-colors"
    />
  </div>

  <div>
    <label for="email" class="sr-only">Email</label>
    <input
      type="email"
      id="email"
      name="email"
      placeholder="Email"
      required
      class="w-full bg-transparent border-b border-elevated focus:border-secondary outline-none py-3 font-sans text-base text-primary placeholder:text-muted transition-colors"
    />
  </div>

  <div>
    <label for="message" class="sr-only">Message</label>
    <textarea
      id="message"
      name="message"
      placeholder="Message"
      rows="4"
      required
      class="w-full bg-transparent border-b border-elevated focus:border-secondary outline-none py-3 font-sans text-base text-primary placeholder:text-muted resize-none transition-colors"
    ></textarea>
  </div>

  <button
    type="submit"
    class="font-mono text-xs uppercase tracking-wider text-secondary hover:text-primary border border-elevated hover:border-secondary px-6 py-3 transition-colors"
  >
    Send Message
  </button>
</form>

<script>
  // Form handling will be added when backend is determined
  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted');
  });
</script>
```

### 6. Social Links Component

Create `src/components/SocialLinks.astro`:

```astro
---
// SocialLinks.astro — Social media links
interface SocialLink {
  name: string;
  url: string;
  icon?: string;
}

const links: SocialLink[] = [
  { name: 'Instagram', url: 'https://instagram.com/shaynadunkelman' },
  { name: 'Bandcamp', url: 'https://shaynadunkelman.bandcamp.com' },
  { name: 'Spotify', url: 'https://open.spotify.com/artist/...' },
  { name: 'YouTube', url: 'https://youtube.com/@shaynadunkelman' },
];
---

<ul class="space-y-3">
  {links.map((link) => (
    <li>
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        class="font-mono text-xs uppercase tracking-wider text-secondary hover:text-primary transition-colors inline-flex items-center gap-2 group"
      >
        {link.name}
        <span class="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
      </a>
    </li>
  ))}
</ul>
```

### 7. Section Transitions (Scroll Animations)

```typescript
// src/scripts/section-animations.ts

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initSectionAnimations() {
  // Fade in sections on scroll
  gsap.utils.toArray('section').forEach((section: Element) => {
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power2.out',
    });
  });
}
```

## Acceptance Criteria

- [ ] Bio section renders with proper typography
- [ ] Latest module displays featured content
- [ ] Footer contains working form structure
- [ ] Social links open in new tabs
- [ ] Email link uses mailto:
- [ ] Sections fade in on scroll
- [ ] Responsive layout on all breakpoints
- [ ] Form has proper labels (sr-only for visual hiding)
- [ ] Focus states on all interactive elements

## Content Requirements

**From Shayna:**
- [ ] Short bio (2-3 paragraphs)
- [ ] Featured item for "Latest" module
- [ ] Social media URLs
- [ ] Contact/booking email
- [ ] Any additional links (donate, newsletter, etc.)

## Dependencies

- Phase 0: Design tokens, base layout
- Phase 1: Threshold (for page structure)
- Phase 2: Navigation (for consistent header)

## Notes

- Contact form backend TBD (options: Formspree, Netlify Forms, custom API)
- Updates section displays Instagram feed in 2×4 grid (8 items)
- Consider adding a "Donate" or "Support" link if needed
