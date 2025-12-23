import { useEffect, useRef } from 'react';

export function useSwipeGesture(onSwipeLeft, onSwipeRight, threshold = 50) {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX.current;
      const deltaY = touchEndY - touchStartY.current;

      // Only trigger if horizontal swipe is dominant
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, threshold]);
}

export function usePinchZoom(elementRef) {
  const initialDistance = useRef(0);
  const initialScale = useRef(1);
  const currentScale = useRef(1);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const getDistance = (touches) => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        initialDistance.current = getDistance(e.touches);
        initialScale.current = currentScale.current;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const distance = getDistance(e.touches);
        const scale = (distance / initialDistance.current) * initialScale.current;
        currentScale.current = Math.min(Math.max(0.5, scale), 3);
        element.style.transform = `scale(${currentScale.current})`;
      }
    };

    const handleTouchEnd = () => {
      if (currentScale.current < 1) {
        currentScale.current = 1;
        element.style.transform = 'scale(1)';
        element.style.transition = 'transform 0.3s ease';
        setTimeout(() => {
          element.style.transition = '';
        }, 300);
      }
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef]);
}