export const Colors = {
  bg: {
    primary: '#0D1117',
    secondary: '#111827',
    tertiary: '#101623',
  },
  card: {
    bg: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.08)',
    borderLight: 'rgba(255, 255, 255, 0.14)',
    elevated: 'rgba(255, 255, 255, 0.09)',
  },
  teal: {
    primary: '#14B8A6',
    light: '#2DD4BF',
    muted: 'rgba(20, 184, 166, 0.15)',
    dim: 'rgba(20, 184, 166, 0.08)',
  },
  warning: '#FBBF24',
  warningMuted: 'rgba(251, 191, 36, 0.15)',
  danger: '#EF4444',
  dangerMuted: 'rgba(239, 68, 68, 0.15)',
  success: '#10B981',
  successMuted: 'rgba(16, 185, 129, 0.15)',
  orange: '#F97316',
  orangeMuted: 'rgba(249, 115, 22, 0.15)',
  indigo: '#6366F1',
  indigoMuted: 'rgba(99, 102, 241, 0.15)',
  text: {
    primary: '#FFFFFF',
    secondary: '#D1D5DB',
    muted: '#9CA3AF',
    disabled: '#4B5563',
  },
  tab: {
    active: '#14B8A6',
    inactive: '#6B7280',
  },
  separator: 'rgba(255, 255, 255, 0.06)',
} as const;

export type CautionLevel = 'low' | 'moderate' | 'elevated' | 'high';

export const CautionColors: Record<CautionLevel, string> = {
  low: '#10B981',
  moderate: '#FBBF24',
  elevated: '#F97316',
  high: '#EF4444',
};

export const CautionMutedColors: Record<CautionLevel, string> = {
  low: 'rgba(16, 185, 129, 0.12)',
  moderate: 'rgba(251, 191, 36, 0.12)',
  elevated: 'rgba(249, 115, 22, 0.12)',
  high: 'rgba(239, 68, 68, 0.12)',
};

export const CautionBorderColors: Record<CautionLevel, string> = {
  low: 'rgba(16, 185, 129, 0.35)',
  moderate: 'rgba(251, 191, 36, 0.35)',
  elevated: 'rgba(249, 115, 22, 0.35)',
  high: 'rgba(239, 68, 68, 0.35)',
};

export const CautionLabels: Record<CautionLevel, string> = {
  low: 'Low Caution',
  moderate: 'Moderate Caution',
  elevated: 'Elevated Caution',
  high: 'High Caution',
};
