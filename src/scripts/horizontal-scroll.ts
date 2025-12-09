/**
 * Horizontal Scroll with Drag
 *
 * Enables drag-to-scroll on horizontal feed containers.
 * Works alongside native touch scroll on mobile.
 */

/**
 * State for tracking drag scroll interactions.
 * @property isDown - Whether mouse button is currently pressed
 * @property startX - X position where drag started
 * @property scrollLeft - Scroll position when drag started
 */
interface DragScrollState {
  isDown: boolean;
  startX: number;
  scrollLeft: number;
}

/** Store cleanup functions for each container */
const containerCleanups = new Map<HTMLElement, () => void>();

export function initHorizontalScroll(): void {
  const containers = document.querySelectorAll<HTMLElement>('[data-horizontal-scroll]');

  containers.forEach((container) => {
    // Skip if already initialized
    if (containerCleanups.has(container)) return;

    const state: DragScrollState = {
      isDown: false,
      startX: 0,
      scrollLeft: 0,
    };

    // Event handlers with explicit types
    const handleMouseDown = (e: MouseEvent): void => {
      state.isDown = true;
      container.classList.add('dragging');
      state.startX = e.pageX - container.offsetLeft;
      state.scrollLeft = container.scrollLeft;
    };

    const handleMouseLeave = (): void => {
      state.isDown = false;
      container.classList.remove('dragging');
    };

    const handleMouseUp = (): void => {
      state.isDown = false;
      container.classList.remove('dragging');
    };

    const handleMouseMove = (e: MouseEvent): void => {
      if (!state.isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - state.startX) * 1.5; // Scroll speed multiplier
      container.scrollLeft = state.scrollLeft - walk;
    };

    const handleSelectStart = (e: Event): void => {
      if (state.isDown) e.preventDefault();
    };

    // Add event listeners
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('selectstart', handleSelectStart);

    // Store cleanup function
    const cleanup = (): void => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('selectstart', handleSelectStart);
      container.classList.remove('dragging');
    };
    containerCleanups.set(container, cleanup);
  });
}

export function destroyHorizontalScroll(): void {
  containerCleanups.forEach((cleanup) => cleanup());
  containerCleanups.clear();
}
