import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';
import { Colors } from '@/constants/colors';
import { fontSize, fontWeight, spacing, radius } from '@/constants/theme';
import { ScanType } from '@/types';

interface ScanTypeCardProps {
  type: ScanType;
  title: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
  color: string;
  selected?: boolean;
  onPress: () => void;
}

export function ScanTypeCard({
  title,
  description,
  iconName,
  color,
  selected,
  onPress,
}: ScanTypeCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <GlassCard
        style={[styles.card, selected ? { borderColor: color } : undefined]}
        borderColor={selected ? color : Colors.card.border}
        padding={18}
      >
        <View style={styles.row}>
          <View style={[styles.iconWrap, { backgroundColor: `${color}18` }]}>
            <Ionicons name={iconName} size={26} color={color} />
          </View>
          <View style={styles.text}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
          <View style={[styles.check, selected && { backgroundColor: color, borderColor: color }]}>
            {selected && <Ionicons name="checkmark" size={14} color={Colors.bg.primary} />}
          </View>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  text: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: Colors.text.primary,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  description: {
    fontSize: fontSize.sm,
    color: Colors.text.muted,
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.card.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
