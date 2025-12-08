/**
 * Horizontal Scroll with Drag
 *
 * Enables drag-to-scroll on horizontal feed containers.
 * Works alongside native touch scroll on mobile.
 */

interface DragScrollState {
  isDown: boolean;
  startX: number;
  scrollLeft: number;
}

export function initHorizontalScroll(): void {
  const containers = document.querySelectorAll<HTMLElement>('[data-horizontal-scroll]');

  containers.forEach((container) => {
    const state: DragScrollState = {
      isDown: false,
      startX: 0,
      scrollLeft: 0,
    };

    // Mouse events for desktop drag
    container.addEventListener('mousedown', (e) => {
      state.isDown = true;
      container.classList.add('dragging');
      state.startX = e.pageX - container.offsetLeft;
      state.scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
      state.isDown = false;
      container.classList.remove('dragging');
    });

    container.addEventListener('mouseup', () => {
      state.isDown = false;
      container.classList.remove('dragging');
    });

    container.addEventListener('mousemove', (e) => {
      if (!state.isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - state.startX) * 1.5; // Scroll speed multiplier
      container.scrollLeft = state.scrollLeft - walk;
    });

    // Prevent text selection while dragging
    container.addEventListener('selectstart', (e) => {
      if (state.isDown) e.preventDefault();
    });
  });
}

export function destroyHorizontalScroll(): void {
  // Cleanup handled by page navigation
}
