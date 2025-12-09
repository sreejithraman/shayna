/**
 * Ken Burns Effect
 *
 * Slow, subtle zoom animation on images.
 * Creates a gentle sense of life without being distracting.
 */

import { gsap } from 'gsap';

/**
 * Configuration options for Ken Burns zoom effect.
 * @property scale - Target scale factor (1.05 = 5% zoom). Should be > 1.0. Default: 1.05
 * @property duration - Duration of full zoom cycle in seconds. Default: 25
 */
interface KenBurnsOptions {
  scale?: number;
  duration?: number;
}

const defaults: Required<KenBurnsOptions> = {
  scale: 1.05,
  duration: 25,
};

export function initKenBurns(options: KenBurnsOptions = {}): void {
  const config = { ...defaults, ...options };
  const elements = document.querySelectorAll<HTMLElement>('[data-ken-burns]');

  if (elements.length === 0) return;

  elements.forEach((element) => {
    // Set initial state
    gsap.set(element, {
      scale: 1,
      force3D: true,
    });

    // Create the slow zoom animation
    gsap.to(element, {
      scale: config.scale,
      duration: config.duration,
      ease: 'none',
      repeat: -1,
      yoyo: true,
    });
  });
}

export function destroyKenBurns(): void {
  const elements = document.querySelectorAll<HTMLElement>('[data-ken-burns]');
  elements.forEach((element) => {
    gsap.killTweensOf(element);
    gsap.set(element, { scale: 1 });
  });
}
