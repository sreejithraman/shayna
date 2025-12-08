/**
 * Grain Effect
 *
 * Canvas-based animated grain texture that renders inside text.
 * Features:
 * - Ambient slow drift animation
 * - Cursor proximity intensifies grain
 * - Touch tap triggers intensity burst on mobile
 * - Respects reduced motion preference
 */

interface GrainConfig {
  density: number;
  color: string;
  ambientSpeed: number;
  vibrationRadius: number;
  vibrationIntensity: number;
  recovery: number;
}

interface GrainState {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  textElement: HTMLElement;
  config: GrainConfig;
  animationId: number | null;
  cursorInfluence: number;
  targetInfluence: number;
  lastTime: number;
  offset: number;
  isVisible: boolean;
  prefersReducedMotion: boolean;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 99, g: 102, b: 241 }; // fallback indigo
}

function createGrainState(textElement: HTMLElement, canvas: HTMLCanvasElement): GrainState | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const computedStyle = getComputedStyle(document.documentElement);

  const config: GrainConfig = {
    density: parseFloat(computedStyle.getPropertyValue('--grain-density')) || 0.5,
    color: computedStyle.getPropertyValue('--grain-color').trim() || '#6366f1',
    ambientSpeed: 0.5,
    vibrationRadius: parseFloat(computedStyle.getPropertyValue('--vibration-radius')) || 150,
    vibrationIntensity: parseFloat(computedStyle.getPropertyValue('--vibration-intensity')) || 1,
    recovery: 400,
  };

  return {
    canvas,
    ctx,
    textElement,
    config,
    animationId: null,
    cursorInfluence: 0,
    targetInfluence: 0,
    lastTime: 0,
    offset: 0,
    isVisible: true,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  };
}

function resizeCanvas(state: GrainState): void {
  const rect = state.textElement.getBoundingClientRect();
  // Use lower DPR for grain - doesn't need to be crisp
  const dpr = Math.min(window.devicePixelRatio, 1.5);

  state.canvas.width = rect.width * dpr;
  state.canvas.height = rect.height * dpr;
  state.canvas.style.width = `${rect.width}px`;
  state.canvas.style.height = `${rect.height}px`;
  state.ctx.scale(dpr, dpr);
}

function renderGrain(state: GrainState, timestamp: number): void {
  const { ctx, canvas, config, prefersReducedMotion } = state;
  const width = canvas.width / (window.devicePixelRatio || 1);
  const height = canvas.height / (window.devicePixelRatio || 1);

  // Clear
  ctx.clearRect(0, 0, width, height);

  // Update offset for ambient motion
  if (!prefersReducedMotion) {
    const delta = timestamp - state.lastTime;
    state.offset += delta * config.ambientSpeed * 0.001;
  }
  state.lastTime = timestamp;

  // Smooth influence transition
  const influenceDelta = state.targetInfluence - state.cursorInfluence;
  state.cursorInfluence += influenceDelta * 0.1;

  // Calculate effective density based on cursor influence
  const baseDensity = config.density;
  const effectiveDensity = baseDensity + state.cursorInfluence * 0.3;

  // Get color components
  const { r, g, b } = hexToRgb(config.color);

  // Create grain pattern
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  const time = state.offset;

  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      // Noise with time-based variation
      const noise = Math.random();

      // Skip pixels based on density
      if (noise > effectiveDensity) continue;

      // Add time-based shimmer
      const shimmer = prefersReducedMotion ? 1 : Math.sin(time + x * 0.1 + y * 0.1) * 0.5 + 0.5;
      const alpha = (30 + state.cursorInfluence * 40) * shimmer;

      const idx = (y * width + x) * 4;
      data[idx] = r + (Math.random() - 0.5) * 30;
      data[idx + 1] = g + (Math.random() - 0.5) * 30;
      data[idx + 2] = b + (Math.random() - 0.5) * 30;
      data[idx + 3] = alpha;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function animate(state: GrainState): void {
  if (!state.isVisible) return;

  const loop = (timestamp: number) => {
    renderGrain(state, timestamp);

    // Throttle to ~30fps for grain effect
    state.animationId = requestAnimationFrame(loop);
  };

  state.animationId = requestAnimationFrame(loop);
}

function stopAnimation(state: GrainState): void {
  if (state.animationId) {
    cancelAnimationFrame(state.animationId);
    state.animationId = null;
  }
}

function handleMouseMove(state: GrainState, e: MouseEvent): void {
  const rect = state.textElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
  const maxDistance = state.config.vibrationRadius;

  if (distance < maxDistance) {
    // Exponential falloff
    const normalized = 1 - distance / maxDistance;
    state.targetInfluence = Math.pow(normalized, 2) * state.config.vibrationIntensity;
  } else {
    state.targetInfluence = 0;
  }
}

function handleTouchStart(state: GrainState): void {
  // Burst of intensity on tap
  state.targetInfluence = state.config.vibrationIntensity;

  // Decay after recovery time
  setTimeout(() => {
    state.targetInfluence = 0;
  }, state.config.recovery);
}

export function initGrainEffect(): void {
  const textElement = document.querySelector<HTMLElement>('[data-grain-target]');
  if (!textElement) return;

  // Create canvas overlay
  const canvas = document.createElement('canvas');
  canvas.className = 'grain-canvas';
  canvas.setAttribute('aria-hidden', 'true');

  // Position canvas over text
  const wrapper = document.createElement('div');
  wrapper.className = 'grain-wrapper';
  wrapper.style.cssText = 'position: relative; display: inline-block;';

  textElement.parentNode?.insertBefore(wrapper, textElement);
  wrapper.appendChild(textElement);
  wrapper.appendChild(canvas);

  // Style canvas
  canvas.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    mix-blend-mode: overlay;
    opacity: 0.8;
  `;

  const state = createGrainState(textElement, canvas);
  if (!state) return;

  // Initial resize
  resizeCanvas(state);

  // Handle resize
  const resizeObserver = new ResizeObserver(() => {
    resizeCanvas(state);
  });
  resizeObserver.observe(textElement);

  // Handle visibility
  const intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      state.isVisible = entry.isIntersecting;
      if (state.isVisible && !state.animationId) {
        animate(state);
      } else if (!state.isVisible) {
        stopAnimation(state);
      }
    },
    { threshold: 0 }
  );
  intersectionObserver.observe(textElement);

  // Mouse/cursor tracking (desktop)
  if (!('ontouchstart' in window)) {
    window.addEventListener('mousemove', (e) => handleMouseMove(state, e), { passive: true });
  }

  // Touch handling (mobile)
  textElement.addEventListener('touchstart', () => handleTouchStart(state), { passive: true });

  // Start animation if reduced motion is not preferred
  if (!state.prefersReducedMotion) {
    animate(state);
  } else {
    // Render single static frame
    renderGrain(state, 0);
  }

  // Cleanup on page navigation
  document.addEventListener('astro:before-swap', () => {
    stopAnimation(state);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
  });
}

export function destroyGrainEffect(): void {
  const canvas = document.querySelector('.grain-canvas');
  const wrapper = document.querySelector('.grain-wrapper');
  if (canvas) canvas.remove();
  if (wrapper) {
    const textElement = wrapper.querySelector('[data-grain-target]');
    if (textElement) {
      wrapper.parentNode?.insertBefore(textElement, wrapper);
    }
    wrapper.remove();
  }
}
