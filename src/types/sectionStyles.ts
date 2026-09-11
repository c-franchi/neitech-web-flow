export type AnimationPreset = 'premium' | 'subtle' | 'minimal' | 'none';
export type PortfolioLayout = 'grid' | 'carousel';

export interface SectionStyles {
  backgroundColor?: string;
  backgroundImage?: string;
  textColor?: string;
  headingColor?: string;
  accentColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  fontFamily?: string;
  headingFontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  headingFontWeight?: string;
  borderColor?: string;
  cardBackground?: string;
  cardTextColor?: string;
  animationsEnabled?: boolean;
  animationPreset?: AnimationPreset;
  revealEnabled?: boolean;
  hoverEnabled?: boolean;
  parallaxEnabled?: boolean;
  heroPinEnabled?: boolean;
  heroOverlapEnabled?: boolean;
  portfolioLayout?: PortfolioLayout;
}

export interface SectionMotionSettings {
  animationsEnabled: boolean;
  revealEnabled: boolean;
  hoverEnabled: boolean;
  parallaxEnabled: boolean;
  revealY: number;
  revealDuration: number;
  stagger: number;
}

export function getSectionMotionSettings(styles?: SectionStyles): SectionMotionSettings {
  const preset = styles?.animationPreset ?? 'premium';
  const animationsEnabled = styles?.animationsEnabled !== false && preset !== 'none';

  if (!animationsEnabled) {
    return {
      animationsEnabled: false,
      revealEnabled: false,
      hoverEnabled: false,
      parallaxEnabled: false,
      revealY: 0,
      revealDuration: 0,
      stagger: 0,
    };
  }

  const presetConfig = {
    premium: { revealY: 32, revealDuration: 0.46, stagger: 0.08 },
    subtle: { revealY: 20, revealDuration: 0.34, stagger: 0.05 },
    minimal: { revealY: 14, revealDuration: 0.28, stagger: 0.03 },
    none: { revealY: 0, revealDuration: 0, stagger: 0 },
  }[preset];

  return {
    animationsEnabled,
    revealEnabled: styles?.revealEnabled !== false,
    hoverEnabled: styles?.hoverEnabled !== false,
    parallaxEnabled: styles?.parallaxEnabled !== false,
    revealY: presetConfig.revealY,
    revealDuration: presetConfig.revealDuration,
    stagger: presetConfig.stagger,
  };
}
