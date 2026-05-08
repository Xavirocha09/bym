import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassCard } from '@/components/common/GlassCard';
import { CautionBadge } from '@/components/common/CautionBadge';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { Colors, CautionColors, CautionMutedColors, CautionBorderColors, CautionLabels } from '@/constants/colors';
import { fontSize, fontWeight, spacing, radius } from '@/constants/theme';
import { useScanStore } from '@/store/useScanStore';
import { Signal, SignalSeverity } from '@/types';

type IoniconName = keyof typeof Ionicons.glyphMap;

const SEVERITY_COLORS: Record<SignalSeverity, string> = {
  info: Colors.text.disabled,
  low: Colors.success,
  medium: Colors.warning,
  high: Colors.danger,
};

const SEVERITY_ICONS: Record<SignalSeverity, IoniconName> = {
  info: 'checkmark-circle-outline',
  low: 'alert-circle-outline',
  medium: 'warning-outline',
  high: 'alert-circle',
};

function SignalRow({ signal }: { signal: Signal }) {
  const color = SEVERITY_COLORS[signal.severity];
  const icon = SEVERITY_ICONS[signal.severity];
  return (
    <View style={styles.signalRow}>
      <View style={[styles.signalIcon, { backgroundColor: `${color}18` }]}>
        <Ionicons name={icon} size={16} color={color} />
      </View>
      <View style={styles.signalContent}>
        <Text style={styles.signalTitle}>{signal.title}</Text>
        <Text style={styles.signalDesc}>{signal.description}</Text>
      </View>
    </View>
  );
}

interface ExpandableSection {
  title: string;
  icon: IoniconName;
  iconColor: string;
  signals: Signal[];
  defaultOpen?: boolean;
}

function ExpandableSignalSection({ title, icon, iconColor, signals, defaultOpen = false }: ExpandableSection) {
  const [open, setOpen] = useState(defaultOpen);

  function toggle() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((v) => !v);
  }

  if (signals.length === 0) return null;

  const highCount = signals.filter((s) => s.severity === 'high').length;
  const medCount = signals.filter((s) => s.severity === 'medium').length;

  return (
    <GlassCard padding={0} style={styles.sectionCard}>
      <TouchableOpacity style={styles.sectionHeader} onPress={toggle} activeOpacity={0.8}>
        <View style={[styles.sectionIconWrap, { backgroundColor: `${iconColor}18` }]}>
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <View style={styles.sectionMeta}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionCount}>{signals.length} signal{signals.length !== 1 ? 's' : ''}</Text>
        </View>
        <View style={styles.sectionRight}>
          {highCount > 0 && (
            <View style={styles.severityPip}>
              <Text style={[styles.severityPipText, { color: Colors.danger }]}>{highCount} high</Text>
            </View>
          )}
          <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.text.muted} />
        </View>
      </TouchableOpacity>
      {open && (
        <View style={styles.signalList}>
          {signals.map((signal, i) => (
            <View key={signal.id}>
              <SignalRow signal={signal} />
              {i < signals.length - 1 && <View style={styles.signalDivider} />}
            </View>
          ))}
        </View>
      )}
    </GlassCard>
  );
}

export default function ResultsScreen() {
  const { currentResult, resetScan } = useScanStore();

  if (!currentResult) {
    return (
      <View style={styles.errorState}>
        <Text style={styles.errorText}>No scan result found.</Text>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.errorLink}>Go home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const cautionColor = CautionColors[currentResult.cautionLevel];
  const cautionMuted = CautionMutedColors[currentResult.cautionLevel];
  const cautionBorder = CautionBorderColors[currentResult.cautionLevel];

  function handleNewScan() {
    resetScan();
    router.replace('/scan/type');
  }

  function handleDone() {
    resetScan();
    router.replace('/(tabs)');
  }

  return (
    <LinearGradient colors={[Colors.bg.secondary, Colors.bg.primary]} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Nav */}
          <View style={styles.nav}>
            <Text style={styles.navLabel}>Safety Analysis</Text>
            <TouchableOpacity style={styles.doneBtn} onPress={handleDone} activeOpacity={0.7}>
              <Text style={styles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Overall Result Card */}
          <Animated.View entering={FadeInDown.delay(0).duration(500)}>
            <View style={[styles.heroCard, { backgroundColor: cautionMuted, borderColor: cautionBorder }]}>
              <View style={styles.heroTop}>
                <View style={[styles.heroShield, { backgroundColor: `${cautionColor}25` }]}>
                  <Ionicons name="shield-checkmark" size={36} color={cautionColor} />
                </View>
                <CautionBadge level={currentResult.cautionLevel} size="lg" />
              </View>
              <Text style={[styles.heroTitle, { color: cautionColor }]}>
                {CautionLabels[currentResult.cautionLevel]}
              </Text>
              <Text style={styles.heroSummary}>{currentResult.summary}</Text>

              <View style={styles.scanMeta}>
                <View style={styles.scanMetaItem}>
                  <Ionicons
                    name={
                      currentResult.scanType === 'profile'
                        ? 'person-circle-outline'
                        : currentResult.scanType === 'chat'
                        ? 'chatbubbles-outline'
                        : 'search-circle-outline'
                    }
                    size={14}
                    color={Colors.text.muted}
                  />
                  <Text style={styles.scanMetaText}>
                    {currentResult.scanType.charAt(0).toUpperCase() + currentResult.scanType.slice(1)} Scan
                  </Text>
                </View>
                <View style={styles.scanMetaDot} />
                <Text style={styles.scanMetaText}>
                  {new Date(currentResult.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Signal Sections */}
          <Animated.View entering={FadeInDown.delay(100).duration(500)}>
            <Text style={styles.signalsSectionLabel}>Signal Breakdown</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(140).duration(500)}>
            <ExpandableSignalSection
              title="Photo Signals"
              icon="image-outline"
              iconColor={Colors.indigo}
              signals={currentResult.photoSignals}
              defaultOpen
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(180).duration(500)}>
            <ExpandableSignalSection
              title="Profile Signals"
              icon="person-outline"
              iconColor={Colors.teal.primary}
              signals={currentResult.profileSignals}
              defaultOpen
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(220).duration(500)}>
            <ExpandableSignalSection
              title="Chat Signals"
              icon="chatbubble-outline"
              iconColor={Colors.warning}
              signals={currentResult.chatSignals}
              defaultOpen
            />
          </Animated.View>

          {/* Next Steps */}
          {currentResult.nextSteps.length > 0 && (
            <Animated.View entering={FadeInDown.delay(260).duration(500)}>
              <Text style={styles.signalsSectionLabel}>Recommended Next Steps</Text>
              <GlassCard padding={16}>
                {currentResult.nextSteps.map((step, i) => (
                  <View key={i} style={[styles.stepItem, i < currentResult.nextSteps.length - 1 && styles.stepDivider]}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{i + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </GlassCard>
            </Animated.View>
          )}

          {/* Disclaimer */}
          <Animated.View entering={FadeInDown.delay(300).duration(500)}>
            <GlassCard padding={14} style={styles.disclaimer}>
              <View style={styles.disclaimerRow}>
                <Ionicons name="information-circle-outline" size={16} color={Colors.text.disabled} />
                <Text style={styles.disclaimerText}>
                  BYM provides AI-assisted guidance only. These signals do not confirm deceptive intent. Use your judgment and trust your intuition.
                </Text>
              </View>
            </GlassCard>
          </Animated.View>

          {/* Actions */}
          <Animated.View entering={FadeInDown.delay(340).duration(500)} style={styles.actions}>
            <PrimaryButton label="Start New Scan" onPress={handleNewScan} style={styles.actionBtn} />
            <PrimaryButton
              label="Back to Home"
              onPress={handleDone}
              variant="outlined"
              style={styles.actionBtn}
            />
          </Animated.View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  navLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: Colors.text.muted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  doneBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  doneBtnText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: Colors.teal.primary,
    letterSpacing: -0.2,
  },
  heroCard: {
    borderRadius: radius.xxl,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroShield: {
    width: 64,
    height: 64,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.heavy,
    letterSpacing: -0.8,
  },
  heroSummary: {
    fontSize: fontSize.base,
    color: Colors.text.secondary,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  scanMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  scanMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scanMetaText: {
    fontSize: fontSize.xs,
    color: Colors.text.muted,
    fontWeight: fontWeight.medium,
  },
  scanMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.text.disabled,
  },
  signalsSectionLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: Colors.text.muted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: spacing.sm,
    marginLeft: spacing.xs,
  },
  sectionCard: { overflow: 'hidden' },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  sectionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sectionMeta: { flex: 1 },
  sectionTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: Colors.text.primary,
    letterSpacing: -0.3,
  },
  sectionCount: {
    fontSize: fontSize.xs,
    color: Colors.text.muted,
    marginTop: 2,
  },
  sectionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  severityPip: {},
  severityPipText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  signalList: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: 0,
  },
  signalRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  signalIcon: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  signalContent: { flex: 1 },
  signalTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: Colors.text.primary,
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  signalDesc: {
    fontSize: fontSize.sm,
    color: Colors.text.muted,
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  signalDivider: {
    height: 1,
    backgroundColor: Colors.separator,
    marginLeft: 30 + spacing.md,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  stepDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.teal.muted,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  stepNumberText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: Colors.teal.primary,
  },
  stepText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  disclaimer: {},
  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  disclaimerText: {
    flex: 1,
    fontSize: fontSize.xs,
    color: Colors.text.disabled,
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  actionBtn: { width: '100%' },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bg.primary,
    gap: spacing.md,
  },
  errorText: {
    color: Colors.text.muted,
    fontSize: fontSize.base,
  },
  errorLink: {
    color: Colors.teal.primary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
});
