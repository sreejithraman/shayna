/**
 * photo-interaction.ts — Cursor/gyroscope parallax for hero photo
 *
 * Desktop: Photo follows cursor position with smooth lerp
 * Mobile: Photo responds to device orientation (gyroscope)
 */

// Configuration
const CONFIG = {
  PHOTO_MOVE: 25, // Max pixels photo moves
  GRAIN_MOVE: 7.5, // Grain moves at 0.3x (25 * 0.3)
  LERP: 0.08, // Smoothing factor (lower = smoother)
  GYRO_RANGE: 40, // Degrees of tilt for full movement
  GYRO_BETA_OFFSET: 40, // Natural phone holding angle offset
};

// State
let targetX = 0.5;
let targetY = 0.5;
let currentX = 0.5;
let currentY = 0.5;
let animationId: number | null = null;
let isInitialized = false;

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
    document.body.addEventListener('touchstart', requestPermission, { once: true });
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
    },
    { passive: true }
  );
}

// Animation loop
function animate(): void {
  // Lerp current position towards target
  currentX += (targetX - currentX) * CONFIG.LERP;
  currentY += (targetY - currentY) * CONFIG.LERP;

  // Calculate offsets (centered at 0.5, so subtract 0.5)
  const offsetX = (currentX - 0.5) * CONFIG.PHOTO_MOVE;
  const offsetY = (currentY - 0.5) * CONFIG.PHOTO_MOVE;
  const grainOffsetX = (currentX - 0.5) * CONFIG.GRAIN_MOVE;
  const grainOffsetY = (currentY - 0.5) * CONFIG.GRAIN_MOVE;

  // Apply transforms
  const photoWrapper = document.getElementById('photo-wrapper');
  const grain = document.getElementById('grain');

  if (photoWrapper) {
    photoWrapper.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  }

  if (grain) {
    grain.style.transform = `translate(${grainOffsetX}px, ${grainOffsetY}px)`;
  }

  // Continue animation loop
  animationId = requestAnimationFrame(animate);
}

// Public: Initialize photo interaction
export function initPhotoInteraction(): void {
  if (isInitialized) return;
  isInitialized = true;

  if (isMobileDevice()) {
    initGyroscope();
  } else {
    initCursor();
  }

  // Start animation loop
  animate();
}

// Public: Cleanup
export function destroyPhotoInteraction(): void {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  // Reset positions
  const photoWrapper = document.getElementById('photo-wrapper');
  const grain = document.getElementById('grain');

  if (photoWrapper) {
    photoWrapper.style.transform = '';
  }
  if (grain) {
    grain.style.transform = '';
  }

  isInitialized = false;
}
