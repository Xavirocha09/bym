import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CautionLevel, CautionColors, CautionMutedColors, CautionBorderColors, CautionLabels } from '@/constants/colors';
import { fontSize, fontWeight, radius, spacing } from '@/constants/theme';

interface CautionBadgeProps {
  level: CautionLevel;
  size?: 'sm' | 'md' | 'lg';
}

export function CautionBadge({ level, size = 'md' }: CautionBadgeProps) {
  const color = CautionColors[level];
  const bgColor = CautionMutedColors[level];
  const borderColor = CautionBorderColors[level];
  const label = CautionLabels[level];

  return (
    <View style={[styles.badge, { backgroundColor: bgColor, borderColor }, size === 'sm' && styles.sm, size === 'lg' && styles.lg]}>
      <View style={[styles.dot, { backgroundColor: color, shadowColor: color }]} />
      <Text style={[styles.label, { color }, size === 'sm' && styles.labelSm, size === 'lg' && styles.labelLg]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    gap: 5,
  },
  lg: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    letterSpacing: -0.2,
  },
  labelSm: {
    fontSize: fontSize.xs,
  },
  labelLg: {
    fontSize: fontSize.base,
  },
});
