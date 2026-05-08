import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';
import { Colors } from '@/constants/colors';
import { fontSize, fontWeight, spacing, radius } from '@/constants/theme';

interface SafetyTipCardProps {
  tip: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  color?: string;
}

export function SafetyTipCard({
  tip,
  iconName = 'shield-checkmark',
  color = Colors.teal.primary,
}: SafetyTipCardProps) {
  return (
    <GlassCard style={styles.card} padding={14}>
      <View style={styles.content}>
        <View style={[styles.iconWrap, { backgroundColor: `${color}18` }]}>
          <Ionicons name={iconName} size={18} color={color} />
        </View>
        <Text style={styles.tip}>{tip}</Text>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  tip: {
    flex: 1,
    fontSize: fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
});
