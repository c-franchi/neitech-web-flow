import { RefObject, useLayoutEffect } from 'react';

interface UseParallaxOptions {
  rootRef: RefObject<HTMLElement>;
  backgroundRef?: RefObject<HTMLElement>;
  contentRef?: RefObject<HTMLElement>;
  foregroundRefs?: Array<RefObject<HTMLElement> | null>;
  disabled?: boolean;
}

export function useParallax({
  rootRef,
  backgroundRef,
  contentRef,
  foregroundRefs = [],
  disabled = false,
}: UseParallaxOptions) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (disabled || prefersReducedMotion) {
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
        if (backgroundRef?.current) {
          gsap.to(backgroundRef.current, {
            yPercent: isMobile ? 8 : 18,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top top',
              end: 'bottom top',
              scrub: isMobile ? 0.5 : 0.9,
            },
          });
        }

        if (contentRef?.current) {
          gsap.to(contentRef.current, {
            yPercent: isMobile ? -2 : -5,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top top',
              end: 'bottom top',
              scrub: isMobile ? 0.4 : 0.8,
            },
          });
        }

        foregroundRefs.forEach((foregroundRef, index) => {
          const node = foregroundRef?.current;
          if (!node) {
            return;
          }

          const distance = isMobile ? 8 + index * 3 : 18 + index * 8;
          gsap.to(node, {
            y: index % 2 === 0 ? -distance : distance,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top bottom',
              end: 'bottom top',
              scrub: isMobile ? 0.35 : 0.9,
            },
          });
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
  }, [rootRef, backgroundRef, contentRef, foregroundRefs, disabled]);
}
