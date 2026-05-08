import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { GlassCard } from './GlassCard';
import { Colors } from '@/constants/colors';
import { spacing } from '@/constants/theme';
import { ScanType } from '@/types';

interface ScanTypeCardProps {
  type: ScanType;
  title: string;
  description: string;
  sf: string;
  color: string;
  selected?: boolean;
  onPress: () => void;
}

export function ScanTypeCard({ title, description, sf, color, selected, onPress }: ScanTypeCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={{ marginBottom: spacing.md }}>
      <GlassCard borderColor={selected ? color : Colors.card.border} padding={18}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <View style={{ width: 52, height: 52, borderRadius: 16, borderCurve: 'continuous', backgroundColor: `${color}18`, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <SymbolView name={sf as any} size={26} tintColor={color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 17, fontWeight: '600', color: Colors.text.primary, letterSpacing: -0.3, marginBottom: 4 }}>{title}</Text>
            <Text style={{ fontSize: 13, color: Colors.text.muted, lineHeight: 18, letterSpacing: -0.1 }}>{description}</Text>
          </View>
          <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: selected ? color : Colors.card.border, backgroundColor: selected ? color : 'transparent', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {selected && <SymbolView name="checkmark" size={12} tintColor={Colors.bg.primary} weight="bold" />}
          </View>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}
