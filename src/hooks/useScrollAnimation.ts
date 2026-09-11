import { RefObject, useLayoutEffect } from 'react';

export interface UseScrollAnimationOptions {
  targets?: string;
  y?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  start?: string;
  once?: boolean;
  disabled?: boolean;
}

export function useScrollAnimation<T extends HTMLElement>(
  ref: RefObject<T>,
  {
    targets,
    y = 32,
    duration = 0.46,
    stagger = 0,
    delay = 0,
    start = 'top 84%',
    once = true,
    disabled = false,
  }: UseScrollAnimationOptions = {},
) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) {
      return;
    }

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const effectiveY = isMobile ? Math.min(y, 18) : y;
    const effectiveDuration = isMobile ? Math.min(duration, 0.34) : duration;

    void (async () => {
      const gsapModule = await import('gsap');
      const scrollTriggerModule = await import('gsap/ScrollTrigger');
      const gsap = gsapModule.default;
      const { ScrollTrigger } = scrollTriggerModule;
      gsap.registerPlugin(ScrollTrigger);

      if (cancelled) {
        return;
      }

      if (disabled || prefersReducedMotion) {
        const nodes = targets ? gsap.utils.toArray<HTMLElement>(targets, root) : [root];
        gsap.set(nodes, { clearProps: 'all', opacity: 1, y: 0 });
        return;
      }

      const ctx = gsap.context(() => {
        const nodes = targets ? gsap.utils.toArray<HTMLElement>(targets, root) : [root];
        if (nodes.length === 0) {
          return;
        }

        gsap.set(nodes, {
          opacity: 0,
          y: effectiveY,
          willChange: 'transform, opacity',
        });

        gsap.to(nodes, {
          opacity: 1,
          y: 0,
          duration: effectiveDuration,
          delay,
          stagger,
          ease: 'power2.out',
          overwrite: 'auto',
          clearProps: 'willChange',
          scrollTrigger: {
            trigger: root,
            start,
            once,
            toggleActions: once ? 'play none none none' : 'play none none reverse',
          },
        });
      }, root);

      cleanup = () => {
        ctx.revert();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [ref, targets, y, duration, stagger, delay, start, once, disabled]);
}
