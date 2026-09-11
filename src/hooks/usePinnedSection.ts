import { RefObject, useLayoutEffect } from 'react';

interface UsePinnedSectionOptions {
  rootRef: RefObject<HTMLElement>;
  pinRef: RefObject<HTMLElement>;
  backgroundRef?: RefObject<HTMLElement>;
  disabled?: boolean;
}

export function usePinnedSection({
  rootRef,
  pinRef,
  backgroundRef,
  disabled = false,
}: UsePinnedSectionOptions) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;

    if (!root || !pin) {
      return;
    }

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (disabled || isMobile || prefersReducedMotion) {
      return;
    }

    void (async () => {
      const gsapModule = await import('gsap');
      const scrollTriggerModule = await import('gsap/ScrollTrigger');
      const gsap = gsapModule.default;
      const { ScrollTrigger } = scrollTriggerModule;
      gsap.registerPlugin(ScrollTrigger);

      if (cancelled) {
        return;
      }

      const ctx = gsap.context(() => {
        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom+=32% top',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .to(pin, { opacity: 1, scale: 1 }, 0)
          .to(pin, { opacity: 1, scale: 1 }, 0.72)
          .to(pin, { opacity: 0.04, scale: 0.982 }, 1);

        if (backgroundRef?.current) {
          timeline
            .to(backgroundRef.current, { scale: 1, yPercent: 0, opacity: 1 }, 0)
            .to(backgroundRef.current, { scale: 1, yPercent: 0, opacity: 1 }, 0.72)
            .to(backgroundRef.current, { scale: 1.06, yPercent: 4, opacity: 0.22 }, 1);
        }
      }, root);

      cleanup = () => {
        ctx.revert();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [rootRef, pinRef, backgroundRef, disabled]);
}