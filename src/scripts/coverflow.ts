/**
 * Coverflow Effect
 *
 * Swiper-based coverflow carousel with 3D rotation effect.
 * - Click to center slide
 * - Info overlay only on active slide
 * - Keyboard and mousewheel navigation
 */

import Swiper from 'swiper';
import { EffectCoverflow, FreeMode, Keyboard, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

let swiperInstance: Swiper | null = null;
let wheelHandler: ((e: WheelEvent) => void) | null = null;

export function initCoverflow(): void {
  const container = document.querySelector<HTMLElement>('.coverflow-swiper');
  if (!container || swiperInstance) return;

  swiperInstance = new Swiper('.coverflow-swiper', {
    modules: [EffectCoverflow, FreeMode, Keyboard, Mousewheel],
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 5, // Limit visible slides to prevent extreme rotation
    slideToClickedSlide: true,
    // Touch handling - detect horizontal vs vertical intent
    touchAngle: 30, // Stricter angle (default 45) - more vertical = page scroll
    touchReleaseOnEdges: true, // Allow page scroll at carousel edges
    passiveListeners: false, // Allow preventDefault on events
    keyboard: {
      enabled: true,
    },
    mousewheel: {
      forceToAxis: true,
      releaseOnEdges: true, // Allow page scroll when at edges
      sensitivity: 1,
    },
    freeMode: {
      enabled: true,
      sticky: true,
      momentumRatio: 0.5,
      momentumVelocityRatio: 0.5,
    },
    coverflowEffect: {
      rotate: 20, // Lower base rotation (20° × 2 positions = 40° max on edges)
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: false,
    },
  });

  // Prevent page scroll when scrolling within coverflow (unless at edges)
  wheelHandler = (e: WheelEvent) => {
    if (!swiperInstance) return;

    const isAtBeginning = swiperInstance.isBeginning;
    const isAtEnd = swiperInstance.isEnd;
    const scrollingRight = e.deltaY > 0 || e.deltaX > 0;
    const scrollingLeft = e.deltaY < 0 || e.deltaX < 0;

    // Allow page scroll only when at edge AND scrolling in that direction
    const allowPageScroll =
      (isAtBeginning && scrollingLeft) || (isAtEnd && scrollingRight);

    if (!allowPageScroll) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  container.addEventListener('wheel', wheelHandler, { passive: false });
}

export function destroyCoverflow(): void {
  // Remove wheel handler
  if (wheelHandler) {
    const container = document.querySelector<HTMLElement>('.coverflow-swiper');
    if (container) {
      container.removeEventListener('wheel', wheelHandler);
    }
    wheelHandler = null;
  }

  // Destroy swiper instance
  if (swiperInstance) {
    swiperInstance.destroy(true, true);
    swiperInstance = null;
  }
}
