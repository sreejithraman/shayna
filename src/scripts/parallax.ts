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
import { prefersReducedMotion } from '../lib/accessibility';

// Note: ScrollTrigger is registered in smooth-scroll.ts (loaded first)

// Store triggers for proper cleanup
let parallaxTriggers: ScrollTrigger[] = [];

export function initParallax(): void {
  if (prefersReducedMotion()) {
    return;
  }

  // Find all elements with data-parallax attribute
  const parallaxElements = document.querySelectorAll<HTMLElement>('[data-parallax]');

  parallaxElements.forEach((element) => {
    const parsedSpeed = parseFloat(element.dataset.parallax || '0.5');
    const speed = isNaN(parsedSpeed) ? 0.5 : parsedSpeed;

    // Calculate parallax distance based on speed
    // Lower speed = slower movement = appears further back
    const distance = (1 - speed) * 100;

    const tween = gsap.to(element, {
      scrollTrigger: {
        trigger: element.closest('section') || element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1, // Smooth 1-second catch-up
      },
      y: `${distance}%`,
      ease: 'none',
    });

    if (tween.scrollTrigger) {
      parallaxTriggers.push(tween.scrollTrigger);
    }
  });

  // Hero-specific parallax
  const heroPhoto = document.querySelector<HTMLElement>('.hero-photo');
  const heroName = document.querySelector<HTMLElement>('.hero-name');

  if (heroPhoto) {
    const photoTween = gsap.to(heroPhoto, {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      y: '15%', // Photo moves slower (creates depth)
      ease: 'none',
    });

    if (photoTween.scrollTrigger) {
      parallaxTriggers.push(photoTween.scrollTrigger);
    }
  }

  if (heroName) {
    const nameTween = gsap.to(heroName, {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      y: '8%', // Name moves a bit, less than photo
      ease: 'none',
    });

    if (nameTween.scrollTrigger) {
      parallaxTriggers.push(nameTween.scrollTrigger);
    }
  }

  // Refresh ScrollTrigger after all animations are set up
  ScrollTrigger.refresh();
}

// Cleanup function for SPA navigation
export function destroyParallax(): void {
  parallaxTriggers.forEach((trigger) => trigger.kill());
  parallaxTriggers = [];
}
