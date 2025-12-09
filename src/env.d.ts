/// <reference types="astro/client" />

import type { PageGrainConfig, DramaticRevealConfig } from './config/site';

declare global {
  interface Window {
    __EFFECT_CONFIG__?: {
      pageGrain: PageGrainConfig;
      dramaticReveal: DramaticRevealConfig;
    };
  }
}
