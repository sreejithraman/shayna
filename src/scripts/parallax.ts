/**
 * Parallax Effects
 *
 * Subtle depth on scroll using GSAP ScrollTrigger.
 * Photo and name move at different rates for depth perception.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Note: ScrollTrigger is registered in smooth-scroll.ts which loads first

export function initParallax(): void {
  const container = document.querySelector('[data-parallax-container]');
  if (!container) return;

  const photoElement = container.querySelector('[data-parallax="photo"]');
  const nameElement = container.querySelector('[data-parallax="name"]');

  // Get rates from CSS custom properties
  const computedStyle = getComputedStyle(document.documentElement);
  const photoRate = parseFloat(computedStyle.getPropertyValue('--parallax-photo-rate')) || 0.05;
  const nameRate = parseFloat(computedStyle.getPropertyValue('--parallax-name-rate')) || 0.1;

  // Photo parallax - moves slower (appears further back)
  if (photoElement) {
    gsap.to(photoElement, {
      y: () => window.innerHeight * photoRate,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }

  // Name parallax - moves slightly faster (appears closer)
  if (nameElement) {
    gsap.to(nameElement, {
      y: () => -window.innerHeight * nameRate,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }

  // Refresh ScrollTrigger after setup
  ScrollTrigger.refresh();
}

export function destroyParallax(): void {
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.vars.trigger === document.querySelector('[data-parallax-container]')) {
      trigger.kill();
    }
  });
}
