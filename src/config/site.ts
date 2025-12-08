/**
 * Site Configuration
 *
 * All visual effects and layout options are configurable here.
 * Build structure first, tune visuals later.
 */

export interface GrainConfig {
  enabled: boolean;
  density: number; // 0-1
  color: string; // hex
  ambientSpeed: number; // animation speed multiplier
}

export interface VibrationConfig {
  enabled: boolean;
  intensity: 0 | 1 | 2; // 0=off, 1=whisper, 2=murmur
  radius: number; // pixels
  recovery: number; // ms to return to rest
}

export interface ParallaxConfig {
  enabled: boolean;
  photoRate: number; // 0-0.3
  nameRate: number; // 0-0.3
}

export interface GlowConfig {
  enabled: boolean;
  color: string; // hex
  intensity: number; // 0-1
}

export interface HeroConfig {
  ratio: number; // left side percentage (desktop)
}

export interface InstagramConfig {
  username: string;
  accessToken: string | undefined;
  fallbackImages: string[];
}

export interface SiteConfig {
  // Content
  name: string;
  firstName: string;
  lastName: string;
  bio: string;
  description: string;

  // Instagram
  instagram: InstagramConfig;

  // Layout
  hero: HeroConfig;

  // Effects
  grain: GrainConfig;
  vibration: VibrationConfig;
  parallax: ParallaxConfig;
  glow: GlowConfig;
}

export const siteConfig: SiteConfig = {
  // Content
  name: 'Shayna Dunkelman',
  firstName: 'Shayna',
  lastName: 'Dunkelman',
  bio: 'Avant-garde musician and percussionist based in Brooklyn. Blending acoustic percussion with electronic textures, exploring the boundaries between rhythm and noise.',
  description: 'Shayna Dunkelman — Percussionist with electronic influence',

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

  // Effects — tune these after structure is built
  grain: {
    enabled: true,
    density: 0.5,
    color: '#6366f1', // indigo
    ambientSpeed: 0.5,
  },

  vibration: {
    enabled: true,
    intensity: 1, // whisper
    radius: 150,
    recovery: 400,
  },

  parallax: {
    enabled: true,
    photoRate: 0.05,
    nameRate: 0.1,
  },

  glow: {
    enabled: true,
    color: '#8b5cf6', // purple
    intensity: 0.3,
  },
};

// CSS custom property values derived from config
export function getConfigCSSProperties(): Record<string, string> {
  return {
    '--hero-ratio': `${siteConfig.hero.ratio}%`,
    '--grain-density': String(siteConfig.grain.density),
    '--grain-color': siteConfig.grain.color,
    '--vibration-radius': `${siteConfig.vibration.radius}px`,
    '--vibration-intensity': String(siteConfig.vibration.intensity),
    '--glow-color': siteConfig.glow.color,
    '--glow-intensity': String(siteConfig.glow.intensity),
    '--parallax-photo-rate': String(siteConfig.parallax.photoRate),
    '--parallax-name-rate': String(siteConfig.parallax.nameRate),
  };
}
