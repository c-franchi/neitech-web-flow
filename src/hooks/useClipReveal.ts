import { RefObject, useLayoutEffect } from 'react';

interface UseClipRevealOptions {
  targetRef: RefObject<HTMLElement>;
  disabled?: boolean;
  start?: string;
  y?: number;
  duration?: number;
  once?: boolean;
}

export function useClipReveal({
  targetRef,
  disabled = false,
  start = 'top 86%',
  y = 48,
  duration = 0.9,
  once = true,
}: UseClipRevealOptions) {
  useLayoutEffect(() => {
    const target = targetRef.current;
    if (!target) {
      return;
    }

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const radius = isMobile ? '32px 32px 0px 0px' : '42px 42px 0px 0px';
    const initialInset = isMobile ? '14% 0% 0% 0%' : '18% 0% 0% 0%';

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
        gsap.set(target, {
          clearProps: 'opacity,transform,transformOrigin,clipPath,willChange',
          opacity: 1,
          y: 0,
          clipPath: `inset(0% 0% 0% 0% round ${radius})`,
        });
        return;
      }

      const ctx = gsap.context(() => {
        gsap.set(target, {
          opacity: 0.72,
          y,
          scaleY: 0.965,
          transformOrigin: 'top center',
          clipPath: `inset(${initialInset} round ${radius})`,
          willChange: 'clip-path, transform, opacity',
        });

        gsap.to(target, {
          opacity: 1,
          y: 0,
          scaleY: 1,
          clipPath: `inset(0% 0% 0% 0% round ${radius})`,
          duration,
          ease: 'power3.out',
          clearProps: 'willChange',
          scrollTrigger: {
            trigger: target,
            start,
            once,
            toggleActions: once ? 'play none none none' : 'play none none reverse',
          },
        });
      }, target);

      cleanup = () => {
        ctx.revert();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [targetRef, disabled, start, y, duration, once]);
}