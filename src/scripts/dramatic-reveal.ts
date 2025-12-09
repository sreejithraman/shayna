/**
 * Dramatic Reveal System
 *
 * Scroll-driven reveal animations for content sections.
 * Elements rise up with scale, fade, and optional blur/parallax.
 *
 * Data attributes:
 * - data-reveal: Basic reveal (rise + scale + fade)
 * - data-reveal-blur: Image blur-to-clarity effect
 * - data-reveal-parallax: Image parallax (moves slower than container)
 * - data-reveal-intensity: Override intensity ("gentle" | "subtle" | default)
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Config defaults (can be overridden via site.ts)
const config = {
  rise: 100, // pixels
  scale: 0.85, // start scale
  blur: 8, // pixels
  parallaxOffset: 10, // percent
  scrub: 0.8, // smoothness
};

// Intensity multipliers for softer reveals
const intensityMultipliers: Record<string, number> = {
  gentle: 0.6, // 60% of default values
  subtle: 0.4, // 40% of default values
};

// Get intensity-adjusted config for an element
function getIntensityConfig(element: HTMLElement) {
  const intensity = element.dataset.revealIntensity;
  const multiplier = intensity ? (intensityMultipliers[intensity] ?? 1) : 1;

  return {
    rise: config.rise * multiplier,
    scale: config.scale + (1 - config.scale) * (1 - multiplier), // Closer to 1 for gentler
    blur: config.blur * multiplier,
  };
}

let triggers: ScrollTrigger[] = [];

export function initDramaticReveal(): void {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    // Show all elements immediately
    document
      .querySelectorAll<HTMLElement>('[data-reveal]')
      .forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    document
      .querySelectorAll<HTMLElement>('[data-reveal-blur]')
      .forEach((el) => {
        el.style.filter = 'none';
      });
    return;
  }

  // Main reveal animation (rise + scale + fade)
  const revealElements = document.querySelectorAll<HTMLElement>('[data-reveal]');

  revealElements.forEach((element) => {
    const elementConfig = getIntensityConfig(element);

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top 85%', // Start when top of element hits 85% down viewport
      end: 'top 35%', // End when top hits 35% (middle-ish)
      scrub: config.scrub,
      onUpdate: (self) => {
        const progress = self.progress;

        // Interpolate values using element-specific intensity
        const y = elementConfig.rise * (1 - progress);
        const scale = elementConfig.scale + (1 - elementConfig.scale) * progress;
        const opacity = progress;

        element.style.transform = `translateY(${y}px) scale(${scale})`;
        element.style.opacity = String(opacity);
      },
    });

    triggers.push(trigger);
  });

  // Blur-to-clarity for images
  const blurElements = document.querySelectorAll<HTMLElement>('[data-reveal-blur]');

  blurElements.forEach((element) => {
    // Find the parent reveal element to sync timing and inherit intensity
    const parentReveal = element.closest<HTMLElement>('[data-reveal]');
    const triggerEl = parentReveal || element;
    const elementConfig = parentReveal
      ? getIntensityConfig(parentReveal)
      : { blur: config.blur };

    const trigger = ScrollTrigger.create({
      trigger: triggerEl,
      start: 'top 85%',
      end: 'top 35%',
      scrub: config.scrub,
      onUpdate: (self) => {
        const blur = elementConfig.blur * (1 - self.progress);
        element.style.filter = `blur(${blur}px)`;
      },
    });

    triggers.push(trigger);
  });

  // Image parallax (moves slower than container)
  const parallaxElements = document.querySelectorAll<HTMLElement>('[data-reveal-parallax]');

  parallaxElements.forEach((element) => {
    // Parallax runs through the full scroll past the element
    const trigger = ScrollTrigger.create({
      trigger: element.closest('[data-reveal]') || element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1, // Smooth parallax
      onUpdate: (self) => {
        // Move from +offset% to -offset% as you scroll past
        // No scale - just vertical movement for depth
        const offset = config.parallaxOffset;
        const y = offset - offset * 2 * self.progress;
        element.style.transform = `translateY(${y}%)`;
      },
    });

    triggers.push(trigger);
  });

  // Refresh after setup
  ScrollTrigger.refresh();
}

// Cleanup for SPA navigation
export function destroyDramaticReveal(): void {
  triggers.forEach((trigger) => trigger.kill());
  triggers = [];
}
