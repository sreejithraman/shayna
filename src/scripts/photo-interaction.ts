/**
 * photo-interaction.ts — Cursor/gyroscope parallax for hero photo
 *
 * Desktop: Photo follows cursor position with smooth lerp
 * Mobile: Photo responds to device orientation (gyroscope)
 */

import { gsap } from 'gsap';

// Configuration
const CONFIG = {
  PHOTO_MOVE: 25, // Max pixels photo moves
  GRAIN_MOVE: 7.5, // Grain moves at 0.3x (25 * 0.3)
  LERP: 0.08, // Smoothing factor (lower = smoother)
  GYRO_RANGE: 40, // Degrees of tilt for full movement
  GYRO_BETA_OFFSET: 40, // Natural phone holding angle offset
  IDLE_THRESHOLD: 0.0001, // Stop animating when delta is below this
};

// State
let targetX = 0.5;
let targetY = 0.5;
let currentX = 0.5;
let currentY = 0.5;
let isAnimating = false;
let isInitialized = false;

// Cached DOM elements
let photoWrapper: HTMLElement | null = null;
let grainEl: HTMLElement | null = null;

// Check for mobile device
function isMobileDevice(): boolean {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

// Clamp value between min and max
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// Initialize cursor tracking (desktop)
function initCursor(): void {
  document.addEventListener(
    'mousemove',
    (e) => {
      targetX = e.clientX / window.innerWidth;
      targetY = e.clientY / window.innerHeight;
      startAnimation(); // Wake up animation on input
    },
    { passive: true }
  );
}

// Initialize gyroscope tracking (mobile)
function initGyroscope(): void {
  // Check if DeviceOrientationEvent is available
  if (!('DeviceOrientationEvent' in window)) {
    console.warn('DeviceOrientationEvent not supported');
    return;
  }

  // iOS 13+ requires permission request
  const DeviceOrientationEventTyped = DeviceOrientationEvent as typeof DeviceOrientationEvent & {
    requestPermission?: () => Promise<PermissionState>;
  };

  const requestPermissionFn = DeviceOrientationEventTyped.requestPermission;
  if (typeof requestPermissionFn === 'function') {
    // Add one-time click listener to request permission
    const requestPermission = async () => {
      try {
        const permission = await requestPermissionFn();
        if (permission === 'granted') {
          enableGyro();
        }
      } catch (err) {
        console.warn('Gyroscope permission denied:', err);
      }
    };

    // Attach to first user interaction
    document.body.addEventListener('click', requestPermission, { once: true });
    document.body.addEventListener('touchstart', requestPermission, { once: true, passive: true });
  } else {
    // Non-iOS or older iOS - enable directly
    enableGyro();
  }
}

// Enable gyroscope event listener
function enableGyro(): void {
  window.addEventListener(
    'deviceorientation',
    (e) => {
      const gamma = e.gamma || 0; // Left/right tilt (-90 to 90)
      const beta = e.beta || 0; // Front/back tilt (-180 to 180)

      // Map tilt to 0-1 range, accounting for natural hold angle
      targetX = clamp(0.5 + gamma / CONFIG.GYRO_RANGE, 0, 1);
      targetY = clamp(0.5 + (beta - CONFIG.GYRO_BETA_OFFSET) / CONFIG.GYRO_RANGE, 0, 1);
      startAnimation(); // Wake up animation on input
    },
    { passive: true }
  );
}

// Start animation if not already running
function startAnimation(): void {
  if (isAnimating) return;
  isAnimating = true;
  gsap.ticker.add(animate);
}

// Stop animation when idle
function stopAnimation(): void {
  if (!isAnimating) return;
  isAnimating = false;
  gsap.ticker.remove(animate);
}

// Animation tick (runs on GSAP ticker, synced with other animations)
function animate(): void {
  // Calculate deltas
  const deltaX = targetX - currentX;
  const deltaY = targetY - currentY;

  // Check if converged (idle detection)
  if (Math.abs(deltaX) < CONFIG.IDLE_THRESHOLD && Math.abs(deltaY) < CONFIG.IDLE_THRESHOLD) {
    currentX = targetX;
    currentY = targetY;
    stopAnimation();
    return;
  }

  // Lerp current position towards target
  currentX += deltaX * CONFIG.LERP;
  currentY += deltaY * CONFIG.LERP;

  // Calculate offsets (centered at 0.5, so subtract 0.5)
  const offsetX = (currentX - 0.5) * CONFIG.PHOTO_MOVE;
  const offsetY = (currentY - 0.5) * CONFIG.PHOTO_MOVE;
  const grainOffsetX = (currentX - 0.5) * CONFIG.GRAIN_MOVE;
  const grainOffsetY = (currentY - 0.5) * CONFIG.GRAIN_MOVE;

  // Apply transforms using gsap.set for better batching
  if (photoWrapper) {
    gsap.set(photoWrapper, { x: offsetX, y: offsetY });
  }

  if (grainEl) {
    gsap.set(grainEl, { x: grainOffsetX, y: grainOffsetY });
  }
}

// Public: Initialize photo interaction
export function initPhotoInteraction(): void {
  if (isInitialized) return;
  isInitialized = true;

  // Cache DOM elements once
  photoWrapper = document.getElementById('photo-wrapper');
  grainEl = document.getElementById('grain');

  if (isMobileDevice()) {
    initGyroscope();
  } else {
    initCursor();
  }

  // Animation starts on-demand when input is received (not immediately)
}

// Public: Cleanup
export function destroyPhotoInteraction(): void {
  stopAnimation();

  // Reset positions using cached elements
  if (photoWrapper) {
    gsap.set(photoWrapper, { clearProps: 'x,y' });
  }
  if (grainEl) {
    gsap.set(grainEl, { clearProps: 'x,y' });
  }

  // Clear cached references
  photoWrapper = null;
  grainEl = null;

  // Reset state
  targetX = 0.5;
  targetY = 0.5;
  currentX = 0.5;
  currentY = 0.5;
  isInitialized = false;
}
