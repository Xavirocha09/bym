import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScanTypeCard } from '@/components/common/ScanTypeCard';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { GlassCard } from '@/components/common/GlassCard';
import { Colors } from '@/constants/colors';
import { fontSize, fontWeight, spacing, radius } from '@/constants/theme';
import { useScanStore } from '@/store/useScanStore';
import { ScanType } from '@/types';

const SCAN_OPTIONS = [
  {
    type: 'profile' as ScanType,
    title: 'Profile Scan',
    description: 'Analyze dating profile screenshots for authenticity signals and red flags.',
    iconName: 'person-circle-outline' as const,
    color: Colors.teal.primary,
  },
  {
    type: 'chat' as ScanType,
    title: 'Chat Scan',
    description: 'Analyze conversation screenshots for manipulation patterns and scam signals.',
    iconName: 'chatbubbles-outline' as const,
    color: Colors.indigo,
  },
  {
    type: 'full' as ScanType,
    title: 'Full Scan',
    description: 'Analyze both profile and chat screenshots for a comprehensive safety overview.',
    iconName: 'search-circle-outline' as const,
    color: Colors.teal.light,
  },
];

export default function ScanTypeScreen() {
  const { scanType, setScanType } = useScanStore();
  const [selected, setSelected] = useState<ScanType | null>(scanType);

  function handleSelect(type: ScanType) {
    setSelected(type);
    setScanType(type);
  }

  function handleContinue() {
    if (!selected) return;
    router.push('/scan/upload');
  }

  return (
    <LinearGradient colors={[Colors.bg.secondary, Colors.bg.primary]} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Nav */}
        <View style={styles.nav}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="close" size={22} color={Colors.text.secondary} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Choose Scan Type</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.delay(0).duration(400)}>
            <Text style={styles.headline}>What would you like{'\n'}to analyze?</Text>
            <Text style={styles.sub}>
              Choose the type of content you have available to scan.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(80).duration(400)} style={styles.options}>
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
              <View style={styles.infoRow}>
                <Ionicons name="lock-closed-outline" size={16} color={Colors.teal.primary} />
                <Text style={styles.infoText}>
                  Screenshots are analyzed privately. Nothing is uploaded or shared.
                </Text>
              </View>
            </GlassCard>
          </Animated.View>
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton
            label="Continue"
            onPress={handleContinue}
            disabled={!selected}
            style={styles.cta}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  navTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: Colors.text.secondary,
    letterSpacing: -0.2,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.lg,
  },
  headline: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.heavy,
    color: Colors.text.primary,
    letterSpacing: -1,
    lineHeight: 40,
    marginBottom: spacing.sm,
  },
  sub: {
    fontSize: fontSize.base,
    color: Colors.text.muted,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  options: { gap: 0 },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: Colors.text.muted,
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.lg,
  },
  cta: { width: '100%' },
});
