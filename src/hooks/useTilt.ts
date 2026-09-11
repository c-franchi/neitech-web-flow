import { RefObject, useEffect } from 'react';

interface UseTiltOptions {
  maxTilt?: number;
  scale?: number;
  disabled?: boolean;
}

export function useTilt<T extends HTMLElement>(
  ref: RefObject<T>,
  { maxTilt = 8, scale = 1.035, disabled = false }: UseTiltOptions = {},
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (disabled || isMobile || prefersReducedMotion) {
      element.style.transform = '';
      element.style.removeProperty('--pointer-x');
      element.style.removeProperty('--pointer-y');
      return;
    }

    let rafId = 0;
    let rect = element.getBoundingClientRect();
    let nextRotateX = 0;
    let nextRotateY = 0;

    const applyTransform = () => {
      element.style.transform = `perspective(1400px) rotateX(${nextRotateX}deg) rotateY(${nextRotateY}deg) scale(${scale})`;
      rafId = 0;
    };

    const updateRect = () => {
      rect = element.getBoundingClientRect();
    };

    const handlePointerEnter = () => {
      updateRect();
      element.style.willChange = 'transform';
    };

    const handlePointerMove = (event: MouseEvent) => {
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      const ratioX = offsetX / rect.width;
      const ratioY = offsetY / rect.height;

      nextRotateY = (ratioX - 0.5) * maxTilt * 2;
      nextRotateX = (0.5 - ratioY) * maxTilt * 2;
      element.style.setProperty('--pointer-x', `${ratioX * 100}%`);
      element.style.setProperty('--pointer-y', `${ratioY * 100}%`);

      if (rafId === 0) {
        rafId = window.requestAnimationFrame(applyTransform);
      }
    };

    const handlePointerLeave = () => {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }

      element.style.transition = 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)';
      element.style.transform = 'perspective(1400px) rotateX(0deg) rotateY(0deg) scale(1)';

      window.setTimeout(() => {
        element.style.transition = '';
        element.style.willChange = '';
      }, 320);
    };

    element.addEventListener('mouseenter', handlePointerEnter);
    element.addEventListener('mousemove', handlePointerMove);
    element.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, { passive: true });

    return () => {
      element.removeEventListener('mouseenter', handlePointerEnter);
      element.removeEventListener('mousemove', handlePointerMove);
      element.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [ref, maxTilt, scale, disabled]);
}
