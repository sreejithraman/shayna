/**
 * Parallax Effects
 *
 * Applies scroll-based parallax to elements with data-parallax attribute.
 * The attribute value determines the scroll speed multiplier:
 * - 0.5 = moves at 50% of scroll speed (slower, appears further away)
 * - 1.0 = moves at 100% of scroll speed (normal)
 * - 1.5 = moves faster than scroll (appears closer)
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initParallax(): void {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return;
  }

  // Find all elements with data-parallax attribute
  const parallaxElements = document.querySelectorAll<HTMLElement>('[data-parallax]');

  parallaxElements.forEach((element) => {
    const speed = parseFloat(element.dataset.parallax || '0.5');

    // Calculate parallax distance based on speed
    // Lower speed = slower movement = appears further back
    const distance = (1 - speed) * 100;

    gsap.to(element, {
      scrollTrigger: {
        trigger: element.closest('section') || element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1, // Smooth 1-second catch-up
      },
      y: `${distance}%`,
      ease: 'none',
    });
  });

  // Hero-specific parallax
  const heroPhoto = document.querySelector<HTMLElement>('.hero-photo');
  const heroName = document.querySelector<HTMLElement>('.hero-name');

  if (heroPhoto) {
    gsap.to(heroPhoto, {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      y: '15%', // Photo moves slower (creates depth)
      ease: 'none',
    });
  }

  if (heroName) {
    gsap.to(heroName, {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      y: '8%', // Name moves a bit, less than photo
      ease: 'none',
    });
  }

  // Note: Featured Art now uses the dramatic-reveal system (data-reveal attributes)
  // No specific parallax needed here

  // Refresh ScrollTrigger after all animations are set up
  ScrollTrigger.refresh();
}

// Cleanup function for SPA navigation
export function destroyParallax(): void {
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.vars.trigger?.toString().includes('parallax') ||
        trigger.vars.trigger?.toString().includes('hero')) {
      trigger.kill();
    }
  });
}
