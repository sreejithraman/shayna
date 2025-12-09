/**
 * Text Reveal Animation
 *
 * Elegant character-by-character reveal on page load.
 * Wraps each character in a span and animates them sequentially.
 */

import { gsap } from 'gsap';

/**
 * Configuration options for text reveal animation.
 * @property stagger - Delay between character animations in seconds (default: 0.03)
 * @property duration - Duration of each character animation in seconds (default: 0.6)
 * @property y - Initial Y offset in pixels (default: 20)
 * @property delay - Initial delay before animation starts in seconds (default: 0.2)
 */
interface TextRevealOptions {
  stagger?: number;
  duration?: number;
  y?: number;
  delay?: number;
}

const defaults: Required<TextRevealOptions> = {
  stagger: 0.03,
  duration: 0.6,
  y: 20,
  delay: 0.2,
};

/**
 * Wrap each character in a span for animation.
 * Preserves word structure with nested spans.
 */
function splitText(element: HTMLElement): HTMLSpanElement[] {
  const chars: HTMLSpanElement[] = [];

  // Process each child node (name-first, name-last spans)
  Array.from(element.children).forEach((child) => {
    if (!(child instanceof HTMLElement)) return;

    const text = child.textContent || '';
    child.textContent = '';
    child.style.display = 'block';
    child.style.overflow = 'hidden';

    // Create wrapper for the line
    const lineWrapper = document.createElement('span');
    lineWrapper.style.display = 'block';

    // Split into characters
    text.split('').forEach((char) => {
      const charSpan = document.createElement('span');
      charSpan.textContent = char === ' ' ? '\u00A0' : char; // Preserve spaces
      charSpan.style.display = 'inline-block';
      charSpan.style.willChange = 'transform, opacity';
      lineWrapper.appendChild(charSpan);
      chars.push(charSpan);
    });

    child.appendChild(lineWrapper);
  });

  return chars;
}

export function initTextReveal(options: TextRevealOptions = {}): void {
  const config = { ...defaults, ...options };
  const elements = document.querySelectorAll<HTMLElement>('[data-text-reveal]');

  if (elements.length === 0) return;

  elements.forEach((element) => {
    const chars = splitText(element);

    if (chars.length === 0) return;

    // Set initial state
    gsap.set(chars, {
      opacity: 0,
      y: config.y,
    });

    // Animate in
    gsap.to(chars, {
      opacity: 1,
      y: 0,
      duration: config.duration,
      stagger: config.stagger,
      delay: config.delay,
      ease: 'power2.out',
    });
  });
}

export function destroyTextReveal(): void {
  // Text reveal is a one-time animation, no cleanup needed
  // If we need to re-run, the page would reload anyway
}
