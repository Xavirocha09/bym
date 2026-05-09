import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScanTypeCard } from '@/components/common/ScanTypeCard';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { GlassCard } from '@/components/common/GlassCard';
import { Colors } from '@/constants/colors';
import { spacing } from '@/constants/theme';
import { useScanStore } from '@/store/useScanStore';
import { ScanType } from '@/types';

const SCAN_OPTIONS = [
  {
    type: 'profile' as ScanType,
    title: 'Profile Scan',
    description: 'Analyze dating profile screenshots for authenticity signals and red flags.',
    sf: 'person.circle.fill',
    color: Colors.teal.primary,
  },
  {
    type: 'chat' as ScanType,
    title: 'Chat Scan',
    description: 'Analyze conversation screenshots for manipulation patterns and scam signals.',
    sf: 'bubble.left.and.bubble.right.fill',
    color: Colors.indigo,
  },
  {
    type: 'full' as ScanType,
    title: 'Full Scan',
    description: 'Analyze both profile and chat screenshots for a comprehensive safety overview.',
    sf: 'magnifyingglass.circle.fill',
    color: Colors.teal.light,
  },
];

export default function ScanTypeScreen() {
  const { scanType, setScanType } = useScanStore();
  const [selected, setSelected] = useState<ScanType | null>(scanType);
  const insets = useSafeAreaInsets();

  function handleSelect(type: ScanType) {
    setSelected(type);
    setScanType(type);
  }

  return (
    <LinearGradient colors={[Colors.bg.secondary, Colors.bg.primary]} style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* Nav */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: insets.top + spacing.md, paddingBottom: spacing.md }}>
          <TouchableOpacity
            style={{ width: 40, height: 40, borderRadius: 20, borderCurve: 'continuous', backgroundColor: Colors.card.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.card.border }}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <SymbolView name="xmark" size={16} tintColor={Colors.text.secondary} weight="semibold" />
          </TouchableOpacity>
          <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.text.secondary, letterSpacing: -0.2 }}>Choose Scan Type</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.sm, gap: spacing.lg }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.delay(0).duration(400)}>
            <Text style={{ fontSize: 34, fontWeight: '800', color: Colors.text.primary, letterSpacing: -1, lineHeight: 40, marginBottom: spacing.sm }}>
              What would you like{'\n'}to analyze?
            </Text>
            <Text style={{ fontSize: 15, color: Colors.text.muted, lineHeight: 22, letterSpacing: -0.2 }}>
              Choose the type of content you have available to scan.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(80).duration(400)}>
            {SCAN_OPTIONS.map((opt) => (
              <ScanTypeCard
                key={opt.type}
                {...opt}
                selected={selected === opt.type}
                onPress={() => handleSelect(opt.type)}
              />
            ))}
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <GlassCard padding={14}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <SymbolView name="lock.fill" size={16} tintColor={Colors.teal.primary} />
                <Text style={{ flex: 1, fontSize: 13, color: Colors.text.muted, lineHeight: 18, letterSpacing: -0.1 }}>
                  Screenshots are analyzed privately. Nothing is uploaded or shared.
                </Text>
              </View>
            </GlassCard>
          </Animated.View>

          <View style={{ height: 20 }} />
        </ScrollView>

        <View style={{ padding: spacing.lg, paddingBottom: insets.bottom + spacing.md }}>
          <PrimaryButton
            label="Continue"
            onPress={() => router.push('/scan/upload')}
            disabled={!selected}
          />
        </View>
      </View>
    </LinearGradient>
  );
}
