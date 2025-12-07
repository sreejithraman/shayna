/**
 * threshold.ts — Scroll-driven name transition animation
 *
 * Three phases:
 * 1. Hero (0-85vh): Name parallaxes slowly, photo responds to cursor
 * 2. Transition (85vh-140vh): Name shrinks and moves to nav position
 * 3. Locked (140vh+): Name fixed as nav logo, photo faded out
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Ensure ScrollTrigger is registered (should already be done in smooth-scroll.ts)
gsap.registerPlugin(ScrollTrigger);

let isInitialized = false;

export function initThreshold(): void {
  if (isInitialized) return;

  const nameEl = document.getElementById('threshold-name');
  const photoContainer = document.getElementById('photo-container');
  const scrollHint = document.getElementById('scroll-hint');
  const threshold = document.getElementById('threshold');

  if (!nameEl || !photoContainer || !threshold) {
    console.warn('Threshold elements not found');
    return;
  }

  isInitialized = true;

  // Store initial computed values
  const viewportHeight = window.innerHeight;
  const PHASE1_END = viewportHeight * 0.85;
  const PHASE2_END = viewportHeight * 1.4;

  // Calculate target nav position
  const NAV_TOP = 24;
  const NAV_LEFT = 40;
  const NAV_FONT_SIZE = 14;

  // Create main timeline for name transition
  const nameTl = gsap.timeline({
    scrollTrigger: {
      trigger: threshold,
      start: 'top top',
      end: `${PHASE2_END}px top`,
      scrub: 0.5,
      // markers: true, // Uncomment for debugging
    },
  });

  // Phase 1 (0 - 85vh): Subtle parallax on name
  nameTl.to(
    nameEl,
    {
      y: -PHASE1_END * 0.3, // Name rises at 0.3x scroll rate
      duration: 0.6, // Relative duration within timeline
      ease: 'none',
    },
    0
  );

  // Phase 2 (85vh - 140vh): Name shrinks and moves to nav position
  nameTl.to(
    nameEl,
    {
      fontSize: `${NAV_FONT_SIZE}px`,
      top: `${NAV_TOP}px`,
      left: `${NAV_LEFT}px`,
      xPercent: 0,
      yPercent: 0,
      x: 0,
      y: 0,
      duration: 0.4, // Relative duration within timeline
      ease: 'power2.out',
    },
    0.6 // Start at 60% through the timeline (after Phase 1)
  );

  // Photo parallax and fade timeline
  gsap.to(photoContainer, {
    scrollTrigger: {
      trigger: threshold,
      start: 'top top',
      end: `${viewportHeight * 1.2}px top`,
      scrub: 0.5, // Smooth catch-up (prevents jitter on iOS momentum scroll)
    },
    y: viewportHeight * -0.4, // Parallax up at 0.4x rate
    opacity: 0,
    ease: 'none',
  });

  // Scroll hint fade out
  if (scrollHint) {
    gsap.to(scrollHint, {
      scrollTrigger: {
        trigger: threshold,
        start: '5% top',
        end: '15% top',
        scrub: 0.5,
      },
      opacity: 0,
      y: -20,
      ease: 'none',
    });
  }

  // Refresh ScrollTrigger after setup
  ScrollTrigger.refresh();

  // Handle resize
  let resizeTimeout: ReturnType<typeof setTimeout>;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  });
}

export function destroyThreshold(): void {
  // Kill all ScrollTriggers associated with threshold
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.vars.trigger === '#threshold') {
      trigger.kill();
    }
  });

  gsap.killTweensOf('#threshold-name');
  gsap.killTweensOf('#photo-container');
  gsap.killTweensOf('#scroll-hint');

  isInitialized = false;
}
