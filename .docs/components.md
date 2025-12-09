# Components

All components in `src/components/`.

## Hero.astro

Main hero section with photo and artist name.

**Layout**: 40/60 split on desktop (configurable via `heroConfig.ratio`), stacked on mobile.

**Effects used**:
- `data-ken-burns` on photo container
- `data-text-reveal` on name heading
- `data-parallax` on both photo (0.3) and name (0.15)

**CSS classes**:
- `.hero` — Main section container
- `.hero-photo` — Photo container (used by parallax.ts)
- `.hero-name` — Name container (used by parallax.ts)

**Image mask**: Linear gradient fade (to right on desktop, to bottom on mobile).

## Nav.astro

Fixed navigation with blur backdrop.

**Features**:
- Active link detection via `Astro.url.pathname`
- Donate button with external link (separate styling)
- View transition name preservation
- Blur backdrop with radial gradient mask (desktop only)

**Links**:
- Work (`/work`)
- Feed (`/feed`)
- About (`/about`)
- Contact (`/contact`)
- Donate (external, right-aligned)

## FeaturedArt.astro

Album/art reveal section (Nomon album feature).

**Effects used**:
- `data-reveal` on section
- `data-reveal-blur` on image
- `data-reveal-parallax` on image
- `data-reveal-intensity="gentle"` for softer animation

**Layout**: Side-by-side on desktop (image left, text right), stacked on mobile.

**Data source**: `siteConfig.featuredRelease`

## FeaturedWork.astro

Work grid with video lightbox support.

**Features**:
- 2-column grid on desktop with overlap/stagger
- Video lightbox for YouTube/Vimeo embeds
- Vimeo thumbnail fetching via oEmbed API
- Platform-agnostic video handling

**Data source**: `siteConfig.featuredWork` (from `featuredWork.json`)

**Grid mechanics**:
- `--overlap: -8rem` — Rows 3+ pull up
- `--stagger: 10rem` — Even items offset down
- Z-index layering (1-6) for proper stacking

**Video lightbox**:
- Click to open modal with iframe
- ESC or backdrop click to close
- Supports start time for both platforms

## Feed.astro

Horizontal scrolling gallery (Instagram-style feed).

**Features**:
- Drag scroll on desktop (via horizontal-scroll.ts)
- Native swipe on mobile
- Configurable card sizing (280px mobile → 400px desktop)
- Scrollbar hidden but functional

**CSS classes**:
- `.feed-scroll` — Scroll container (target for horizontal-scroll.ts)

**Data source**: `siteConfig.instagram.fallbackImages` (or live feed if token configured)

## Discography.astro

Album grid display.

**Layout**: Responsive grid (2 columns mobile, 3 columns tablet, 4-6 columns desktop).

**Data source**: `siteConfig.curatedAlbums`

**Features**:
- Album cover with hover effect
- Title and artist text
- Optional external link

## Unused Components

These exist but are not currently used in pages:

- **PressQuotes.astro** — Press quotes section
- **VideoGallery.astro** — Video gallery (functionality merged into FeaturedWork)
