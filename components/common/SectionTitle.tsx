import React from 'react';
import { Text, View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants/colors';
import { fontSize, fontWeight, spacing } from '@/constants/theme';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
}

export function SectionTitle({ title, subtitle, style }: SectionTitleProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: Colors.text.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: Colors.text.muted,
    marginTop: spacing.xs,
    lineHeight: 18,
  },
});
