/**
 * Page Grain Effect
 *
 * Full-viewport canvas grain overlay.
 * Very subtle, monochromatic film grain texture.
 * Adds organic texture without competing with content.
 */

import { prefersReducedMotion } from '../lib/accessibility';

interface GrainConfig {
  opacity: number; // Overall opacity (0.03-0.08 recommended)
  density: number; // Grain density (0.3-0.5 recommended)
  animated: boolean; // Whether grain should slowly animate
  fps: number; // Animation frame rate (lower = subtler)
}

interface GrainState {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  config: GrainConfig;
  animationId: number | null;
  lastFrame: number;
  frameInterval: number;
}

const defaults: GrainConfig = {
  opacity: 0.15, // Visible but not overpowering
  density: 0.45,
  animated: true,
  fps: 8, // Low FPS for subtle grain movement
};

/**
 * Create the grain canvas element.
 * @returns Configured canvas element for grain rendering
 */
function createCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.id = 'page-grain';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: var(--z-overlay, 9999);
    opacity: var(--grain-opacity, ${defaults.opacity});
  `;
  return canvas;
}

function resizeCanvas(state: GrainState): void {
  // Use lower resolution for performance (grain doesn't need to be crisp)
  const scale = 0.5;
  state.canvas.width = window.innerWidth * scale;
  state.canvas.height = window.innerHeight * scale;
}

function renderGrain(state: GrainState): void {
  const { ctx, canvas, config } = state;
  const width = canvas.width;
  const height = canvas.height;

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    if (Math.random() > config.density) {
      // Transparent pixel
      data[i + 3] = 0;
    } else {
      // Monochromatic grain (white with varying alpha)
      const value = Math.random() * 255;
      data[i] = value; // R
      data[i + 1] = value; // G
      data[i + 2] = value; // B
      data[i + 3] = Math.random() * 80 + 20; // A (subtle variation)
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function animate(state: GrainState, timestamp: number): void {
  if (!state.config.animated) return;

  // Throttle to target FPS
  const elapsed = timestamp - state.lastFrame;
  if (elapsed < state.frameInterval) {
    state.animationId = requestAnimationFrame((t) => animate(state, t));
    return;
  }

  state.lastFrame = timestamp;
  renderGrain(state);
  state.animationId = requestAnimationFrame((t) => animate(state, t));
}

let grainState: GrainState | null = null;
let resizeHandler: (() => void) | null = null;

export function initPageGrain(options: Partial<GrainConfig> = {}): void {
  // Check for reduced motion preference
  if (prefersReducedMotion()) {
    return;
  }

  // Don't initialize twice
  if (grainState) return;

  const config = { ...defaults, ...options };
  const canvas = createCanvas();
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  document.body.appendChild(canvas);

  grainState = {
    canvas,
    ctx,
    config,
    animationId: null,
    lastFrame: 0,
    frameInterval: 1000 / config.fps,
  };

  // Initial render
  resizeCanvas(grainState);
  renderGrain(grainState);

  // Start animation if enabled
  if (config.animated) {
    grainState.animationId = requestAnimationFrame((t) => animate(grainState!, t));
  }

  // Handle resize - store reference for cleanup
  resizeHandler = () => {
    if (grainState) {
      resizeCanvas(grainState);
      renderGrain(grainState);
    }
  };
  window.addEventListener('resize', resizeHandler);
}

export function destroyPageGrain(): void {
  if (!grainState) return;

  if (grainState.animationId) {
    cancelAnimationFrame(grainState.animationId);
  }

  // Remove resize listener to prevent memory leaks
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
  }

  grainState.canvas.remove();
  grainState = null;
}
