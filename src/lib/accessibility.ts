/**
 * Accessibility Utilities
 *
 * Shared accessibility helpers for effect modules.
 */

/**
 * Check if user prefers reduced motion.
 * @returns true if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
