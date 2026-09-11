import React, { ElementType, ReactNode, useRef } from 'react';
import { useScrollAnimation, UseScrollAnimationOptions } from '../hooks/useScrollAnimation';

type AnimatedSectionProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & UseScrollAnimationOptions & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

const AnimatedSection = <T extends ElementType = 'div'>(props: AnimatedSectionProps<T>) => {
  const {
    as,
    children,
    className,
    targets,
    y,
    duration,
    stagger,
    delay,
    start,
    once,
    disabled,
    ...rest
  } = props;

  const Component = (as || 'div') as ElementType;
  const ref = useRef<HTMLElement>(null);

  useScrollAnimation(ref, {
    targets,
    y,
    duration,
    stagger,
    delay,
    start,
    once,
    disabled,
  });

  return (
    <Component ref={ref} className={className} {...rest}>
      {children}
    </Component>
  );
};

export default AnimatedSection;
