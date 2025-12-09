/**
 * Site Configuration
 *
 * All visual effects and layout options are configurable here.
 */

import featuredWorkData from './featuredWork.json';

export interface HeroConfig {
  ratio: number; // left side percentage (desktop)
}

export interface PageGrainConfig {
  enabled: boolean;
  opacity: number; // 0.03-0.08 recommended
  density: number; // 0.3-0.5 recommended
  animated: boolean;
}

export interface AmbientGlowConfig {
  enabled: boolean;
  color: string; // rgba or hex
}

export interface DramaticRevealConfig {
  enabled: boolean;
  rise: number; // pixels - vertical travel distance
  scale: number; // start scale (0.85 = 85%)
  blur: number; // pixels - image blur amount
  parallaxOffset: number; // percent - image parallax travel
  scrub: number; // smoothness (0.5-2, higher = smoother)
}

export interface InstagramConfig {
  username: string;
  accessToken: string | undefined;
  fallbackImages: string[];
}

export interface FeaturedRelease {
  title: string;
  artist: string;
  albumArt: string;
  description: string;
  listenUrl: string;
}

export interface Album {
  title: string;
  artist: string;
  coverArt: string;
  url?: string;
  year?: string;
}

export interface WorkItem {
  type: 'image' | 'video';
  title: string;
  artist?: string;
  year?: string;
  // For images
  src?: string;
  url?: string; // External link (e.g., Spotify, Bandcamp)
  // For videos
  platform?: 'youtube' | 'vimeo';
  videoId?: string;
  startTime?: number; // seconds
  thumbnail?: string; // Custom thumbnail (optional)
}

export interface SiteConfig {
  // Content
  name: string;
  firstName: string;
  lastName: string;
  bio: string;
  description: string;

  // Featured Release
  featuredRelease: FeaturedRelease;

  // Curated Discography (homepage) - legacy
  curatedAlbums: Album[];

  // Featured Work (mixed media grid)
  featuredWork: WorkItem[];

  // Instagram
  instagram: InstagramConfig;

  // Layout
  hero: HeroConfig;

  // Effects
  pageGrain: PageGrainConfig;
  ambientGlow: AmbientGlowConfig;
  dramaticReveal: DramaticRevealConfig;
}

export const siteConfig: SiteConfig = {
  // Content
  name: 'Shayna Dunkelman',
  firstName: 'Shayna',
  lastName: 'Dunkelman',
  bio: 'Avant-garde musician and percussionist based in Brooklyn. Blending acoustic percussion with electronic textures, exploring the boundaries between rhythm and noise.',
  description: 'Shayna Dunkelman — Percussionist with electronic influence',

  // Featured Release (Nomon album)
  featuredRelease: {
    title: 'Echoes of Breakage',
    artist: 'Nomon',
    albumArt: '/images/NOMON - Cover Artwork by Kris Chau.jpg',
    description: 'The latest album from Nomon, a percussion duo featuring Shayna and Nava Dunkelman. Exploring the boundaries between acoustic and electronic soundscapes.',
    listenUrl: '#', // TODO: Add actual streaming link
  },

  // Curated Discography (homepage selection)
  curatedAlbums: [
    {
      title: 'Echoes of Breakage',
      artist: 'Nomon',
      coverArt: '/images/NOMON - Cover Artwork by Kris Chau.jpg',
      year: '2024',
    },
    {
      title: 'Prisma Tropical',
      artist: 'Balún',
      coverArt: '/images/feed-placeholder-1.svg', // TODO: Replace with actual art
      year: '2018',
    },
    {
      title: 'Islet',
      artist: 'Peptalk',
      coverArt: '/images/feed-placeholder-2.svg', // TODO: Replace with actual art
      year: '2015',
    },
    {
      title: 'Plays the Music of Twin Peaks',
      artist: 'Xiu Xiu',
      coverArt: '/images/feed-placeholder-3.svg', // TODO: Replace with actual art
      year: '2016',
    },
    {
      title: 'Divergence',
      artist: 'Shayna Dunkelman',
      coverArt: '/images/feed-placeholder-4.svg', // TODO: Replace with actual art
      year: '2016',
    },
    {
      title: 'Femina',
      artist: 'John Zorn',
      coverArt: '/images/feed-placeholder-5.svg', // TODO: Replace with actual art
    },
  ],

  // Featured Work (mixed media grid)
  // Configured via src/config/featuredWork.json
  featuredWork: featuredWorkData.work as WorkItem[],

  // Instagram
  instagram: {
    username: '',
    accessToken: import.meta.env.INSTAGRAM_TOKEN,
    fallbackImages: [
      '/images/feed-placeholder-1.svg',
      '/images/feed-placeholder-2.svg',
      '/images/feed-placeholder-3.svg',
      '/images/feed-placeholder-4.svg',
      '/images/feed-placeholder-5.svg',
      '/images/feed-placeholder-6.svg',
    ],
  },

  // Layout
  hero: {
    ratio: 40, // 40% photo, 60% name on desktop
  },

  // Effects
  pageGrain: {
    enabled: true,
    opacity: 0.15,
    density: 0.45,
    animated: true,
  },

  ambientGlow: {
    enabled: true,
    color: 'rgba(30, 58, 95, 0.12)', // Blue pulled from photo
  },

  dramaticReveal: {
    enabled: true,
    rise: 100, // pixels
    scale: 0.85, // start at 85%
    blur: 8, // pixels
    parallaxOffset: 10, // percent
    scrub: 0.8, // smooth but responsive
  },
};

// CSS custom property values derived from config
export function getConfigCSSProperties(): Record<string, string> {
  return {
    '--hero-ratio': `${siteConfig.hero.ratio}%`,
    '--grain-opacity': String(siteConfig.pageGrain.opacity),
    '--ambient-glow-color': siteConfig.ambientGlow.color,
  };
}
