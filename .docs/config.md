# Configuration

All configuration in `src/config/site.ts`.

## Structure

```typescript
export const siteConfig: SiteConfig = {
  // Content
  name: string,              // Full name
  firstName: string,
  lastName: string,
  bio: string,
  description: string,       // Meta description

  // Featured Release
  featuredRelease: FeaturedRelease,

  // Content Collections
  curatedAlbums: Album[],    // Discography items
  featuredWork: WorkItem[],  // Mixed media grid (from featuredWork.json)

  // Instagram
  instagram: InstagramConfig,

  // Layout
  hero: HeroConfig,

  // Effects
  pageGrain: PageGrainConfig,
  ambientGlow: AmbientGlowConfig,
  dramaticReveal: DramaticRevealConfig,
}
```

## Content Types

### FeaturedRelease
```typescript
interface FeaturedRelease {
  title: string;
  artist: string;
  albumArt: string;      // Path to image
  description: string;
  listenUrl: string;     // Streaming link
}
```

### Album
```typescript
interface Album {
  title: string;
  artist: string;
  coverArt: string;
  url?: string;          // Optional external link
  year?: string;
}
```

### WorkItem
```typescript
interface WorkItem {
  type: 'image' | 'video';
  title: string;
  artist?: string;
  year?: string;
  // For images
  src?: string;
  url?: string;          // External link (Spotify, Bandcamp)
  // For videos
  platform?: 'youtube' | 'vimeo';
  videoId?: string;
  startTime?: number;    // Seconds
  thumbnail?: string;    // Custom thumbnail (optional)
}
```

## Effect Configs

### pageGrain

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enabled` | boolean | true | Enable grain overlay |
| `opacity` | number | 0.15 | Grain visibility (0.03-0.08 recommended for subtle) |
| `density` | number | 0.45 | Grain density (0.3-0.5 recommended) |
| `animated` | boolean | true | Whether grain animates |
| `fps` | number | 8 | Animation frame rate (lower = subtler) |

### ambientGlow

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enabled` | boolean | true | Enable glow effect |
| `color` | string | rgba(30,58,95,0.12) | Glow color (rgba or hex) |

### dramaticReveal

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enabled` | boolean | true | Enable reveals |
| `rise` | number | 100 | Vertical travel distance (px) |
| `scale` | number | 0.85 | Start scale (0.85 = 85%) |
| `blur` | number | 8 | Image blur amount (px) |
| `parallaxOffset` | number | 10 | Image parallax travel (%) |
| `scrub` | number | 0.8 | Smoothness (0.5-2, higher = smoother) |

### hero

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `ratio` | number | 40 | Left side percentage on desktop (40 = 40% photo, 60% name) |

### instagram

| Property | Type | Description |
|----------|------|-------------|
| `username` | string | Instagram username |
| `accessToken` | string | Instagram API token (from `INSTAGRAM_TOKEN` env var) |
| `fallbackImages` | string[] | Placeholder images when no token |

## CSS Bridge

The `getConfigCSSProperties()` function converts config values to CSS custom properties:

```typescript
import { getConfigCSSProperties } from '@/config/site';

const cssProps = getConfigCSSProperties();
// Returns: {
//   '--hero-ratio': '40%',
//   '--grain-opacity': '0.15',
//   '--ambient-glow-color': 'rgba(30, 58, 95, 0.12)'
// }
```

Applied in `BaseLayout.astro` via style attribute on `<html>`:

```astro
<html lang="en" style={styleString}>
```

## Featured Work Data

Featured work items are stored in `src/config/featuredWork.json` and imported into `siteConfig`:

```json
{
  "work": [
    {
      "type": "video",
      "title": "Video Title",
      "platform": "vimeo",
      "videoId": "123456789",
      "startTime": 30
    },
    {
      "type": "image",
      "title": "Album Title",
      "artist": "Artist Name",
      "src": "/images/album.jpg",
      "url": "https://spotify.com/..."
    }
  ]
}
```

## Modifying Effects

To adjust effect intensity:

1. **Page grain**: Lower `opacity` (0.03-0.08) and `density` (0.3-0.4) for subtler grain
2. **Dramatic reveal**: Lower `rise` (50-80) and adjust `scale` closer to 1 for gentler reveals
3. **Disable entirely**: Set `enabled: false` on any effect config
