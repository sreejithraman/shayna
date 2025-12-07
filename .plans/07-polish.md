---
phase: 7
title: "Polish & Deployment"
status: draft
priority: P2
effort: large
dependencies: [0, 1, 2, 3, 4, 5, 6]
blockers: []
started: null
completed: null
owner: null
---

# Phase 7: Polish & Deployment

Final refinements, performance optimization, and production deployment.

## Objectives

- [ ] Add Instagram feed integration
- [ ] Implement contact form backend
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Analytics setup
- [ ] Deploy to Render

## Tasks

### 1. Instagram Feed Integration

**Options:**
1. **Curator.io** — Third-party service, easy setup
2. **Behold.so** — Instagram widget service
3. **Custom API** — Use Instagram Basic Display API (requires app review)

Create `src/components/InstagramFeed.astro`:

```astro
---
// Using Behold.so as example
const feedId = import.meta.env.PUBLIC_BEHOLD_FEED_ID;
---

<section class="py-24 px-10" id="instagram">
  <div class="max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <span class="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
        Instagram
      </span>
      <a
        href="https://instagram.com/shaynadunkelman"
        target="_blank"
        rel="noopener noreferrer"
        class="font-mono text-xs text-muted hover:text-primary transition-colors"
      >
        @shaynadunkelman ↗
      </a>
    </div>

    <!-- Feed widget -->
    <div
      id="behold-feed"
      data-behold-id={feedId}
      class="grid grid-cols-4 md:grid-cols-8 gap-2"
    ></div>
  </div>
</section>

<script src="https://w.behold.so/widget.js" async></script>

<style>
  /* Style Instagram feed to match site */
  #behold-feed img {
    filter: grayscale(20%) contrast(1.05);
    transition: filter 0.2s;
  }

  #behold-feed img:hover {
    filter: grayscale(0%) contrast(1);
  }
</style>
```

### 2. Contact Form Backend

**Option A: Formspree**

```astro
<form
  action="https://formspree.io/f/{form_id}"
  method="POST"
  class="space-y-6"
>
  <!-- form fields -->
</form>
```

**Option B: Netlify Forms (if using Netlify)**

```astro
<form
  name="contact"
  method="POST"
  data-netlify="true"
  netlify-honeypot="bot-field"
>
  <input type="hidden" name="form-name" value="contact" />
  <input type="hidden" name="bot-field" />
  <!-- form fields -->
</form>
```

**Option C: Custom API endpoint**

```typescript
// src/pages/api/contact.ts (if using Astro SSR)
export async function POST({ request }) {
  const data = await request.formData();

  // Send email via SendGrid, Resend, etc.
  await sendEmail({
    to: 'shayna@example.com',
    from: data.get('email'),
    subject: `Contact from ${data.get('name')}`,
    body: data.get('message'),
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
  });
}
```

### 3. Performance Optimization

#### Image Optimization

```astro
---
import { Image } from 'astro:assets';
import heroImage from '@/assets/shayna-hero.jpg';
---

<Image
  src={heroImage}
  alt="Shayna Dunkelman"
  widths={[400, 800, 1200]}
  sizes="(max-width: 640px) 100vw, 800px"
  loading="eager"
  decoding="async"
/>
```

#### Lazy Loading

```typescript
// Lazy load below-fold images
const images = document.querySelectorAll('img[data-src]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target as HTMLImageElement;
      img.src = img.dataset.src!;
      observer.unobserve(img);
    }
  });
});

images.forEach((img) => observer.observe(img));
```

#### Critical CSS

Astro handles this automatically with scoped styles. For global critical CSS:

```astro
<style is:inline>
  /* Critical above-fold styles */
  body { background: #0a0a0a; color: #f5f5f5; }
</style>
```

#### Performance Checklist

- [ ] Images optimized and properly sized
- [ ] Lazy loading for below-fold content
- [ ] Fonts preloaded
- [ ] Minimal JavaScript shipped
- [ ] CSS is scoped/minimal
- [ ] `will-change` used sparingly
- [ ] Animations use transform/opacity only
- [ ] Passive event listeners

### 4. Accessibility Audit

#### Automated Testing

```bash
# Install axe-core for testing
npm install -D @axe-core/cli

# Run audit
npx axe http://localhost:4321
```

#### Manual Checklist

- [ ] Keyboard navigation works throughout
- [ ] Focus states visible on all interactive elements
- [ ] Skip link present and functional
- [ ] Images have alt text
- [ ] Color contrast meets WCAG AA
- [ ] Form labels properly associated
- [ ] ARIA attributes correct
- [ ] `prefers-reduced-motion` respected
- [ ] Screen reader tested (VoiceOver, NVDA)

#### Reduced Motion

```typescript
// Check preference in JavaScript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Disable or simplify animations
  gsap.globalTimeline.timeScale(100); // Instant animations
}
```

### 5. Analytics Setup (Umami)

```astro
---
// In BaseLayout.astro head
---
<script
  async
  src="https://analytics.example.com/script.js"
  data-website-id="your-website-id"
></script>
```

For self-hosted Umami:
1. Deploy Umami to a server (Vercel, Railway, etc.)
2. Create website in Umami dashboard
3. Add tracking script to layout

### 6. SEO & Meta Tags

```astro
---
// BaseLayout.astro
interface Props {
  title: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
}

const {
  title,
  description = 'Shayna Dunkelman — Avant-garde musician and percussionist',
  image = '/images/og-default.jpg',
  type = 'website'
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content={description} />

  <!-- Open Graph -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />
  <meta property="og:type" content={type} />
  <meta property="og:url" content={canonicalURL} />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />

  <link rel="canonical" href={canonicalURL} />
  <title>{title}</title>
</head>
```

### 7. Deployment to Render

1. **Create Static Site on Render**
   - Connect GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Environment Variables**
   - `PUBLIC_BEHOLD_FEED_ID` (if using Behold)
   - `FORMSPREE_ID` (if using Formspree)

3. **Custom Domain Setup**
   - Add domain in Render dashboard
   - Configure DNS:
     - Apex domain: `A` record → Render IP
     - www subdomain: `CNAME` → Render URL

4. **SSL**
   - Render provides automatic SSL via Let's Encrypt

### 8. Pre-Launch Checklist

#### Content
- [ ] All placeholder content replaced
- [ ] Images are production quality
- [ ] Links tested and working
- [ ] Contact form tested
- [ ] Social links correct

#### Technical
- [ ] Build passes without errors
- [ ] No console errors in production
- [ ] 404 page exists
- [ ] Sitemap generated
- [ ] robots.txt configured
- [ ] Favicon set

#### Performance
- [ ] Lighthouse score > 90 (all categories)
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Total bundle size < 200KB

#### Legal
- [ ] Privacy policy (if collecting data)
- [ ] Cookie notice (if using analytics)

## Acceptance Criteria

- [ ] Instagram feed displays recent posts
- [ ] Contact form sends messages
- [ ] Site loads fast (Lighthouse 90+)
- [ ] Passes accessibility audit
- [ ] Analytics tracking working
- [ ] Deployed and accessible via custom domain
- [ ] SSL certificate active
- [ ] All pages render correctly in production

## Dependencies

- All previous phases must be complete
- Content finalized from Shayna
- Domain DNS access
- Render account

## Technical Notes

- Test production build locally: `npm run build && npm run preview`
- Use Lighthouse CI for automated performance testing
- Consider adding error tracking (Sentry)
- Set up uptime monitoring (e.g., UptimeRobot)
