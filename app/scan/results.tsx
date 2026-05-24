import { CautionBadge } from '@/components/common/CautionBadge';
import { GlassCard } from '@/components/common/GlassCard';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { CautionBorderColors, CautionColors, CautionLabels, CautionMutedColors, Colors } from '@/constants/colors';
import { spacing } from '@/constants/theme';
import { useScanStore } from '@/store/useScanStore';
import { Signal, SignalSeverity } from '@/types';
import { enableLearnReminders, getHasPromptedForLearnReminders, getLearnRemindersEnabled, markLearnRemindersPrompted } from '@/utils/learnNotifications';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React, { useState } from 'react';
import { Alert, LayoutAnimation, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SEVERITY_COLORS: Record<SignalSeverity, string> = {
  info: Colors.text.disabled,
  low: Colors.success,
  medium: Colors.warning,
  high: Colors.danger,
};

const SEVERITY_SYMBOLS: Record<SignalSeverity, string> = {
  info: 'checkmark.circle',
  low: 'exclamationmark.circle',
  medium: 'exclamationmark.triangle',
  high: 'exclamationmark.circle.fill',
};

const SCAN_TYPE_SYMBOLS: Record<string, string> = {
  profile: 'person.circle',
  chat: 'bubble.left.and.bubble.right',
  full: 'checkmark.shield',
};

function SignalRow({ signal }: { signal: Signal }) {
  const color = SEVERITY_COLORS[signal.severity];
  const sf = SEVERITY_SYMBOLS[signal.severity];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, paddingVertical: spacing.sm + 2 }}>
      <View style={{ width: 30, height: 30, borderRadius: 8, borderCurve: 'continuous', backgroundColor: `${color}18`, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
        <SymbolView name={sf as any} size={16} tintColor={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.text.primary, letterSpacing: -0.2, marginBottom: 4 }}>{signal.title}</Text>
        <Text style={{ fontSize: 13, color: Colors.text.muted, lineHeight: 18, letterSpacing: -0.1 }}>{signal.description}</Text>
      </View>
    </View>
  );
}

interface ExpandableSectionProps {
  title: string;
  sf: string;
  sfColor: string;
  signals: Signal[];
  defaultOpen?: boolean;
}

function ExpandableSignalSection({ title, sf, sfColor, signals, defaultOpen = false }: ExpandableSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  function toggle() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((v) => !v);
  }

  if (signals.length === 0) return null;

  const highCount = signals.filter((s) => s.severity === 'high').length;

  return (
    <GlassCard padding={0} style={{ overflow: 'hidden' }}>
      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md }} onPress={toggle} activeOpacity={0.8}>
        <View style={{ width: 40, height: 40, borderRadius: 12, borderCurve: 'continuous', backgroundColor: `${sfColor}18`, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <SymbolView name={sf as any} size={20} tintColor={sfColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.text.primary, letterSpacing: -0.3 }}>{title}</Text>
          <Text style={{ fontSize: 11, color: Colors.text.muted, marginTop: 2 }}>{signals.length} signal{signals.length !== 1 ? 's' : ''}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          {highCount > 0 && (
            <Text style={{ fontSize: 11, fontWeight: '600', color: Colors.danger }}>{highCount} high</Text>
          )}
          <SymbolView name={open ? 'chevron.up' : 'chevron.down'} size={13} tintColor={Colors.text.muted} weight="semibold" />
        </View>
      </TouchableOpacity>
      {open && (
        <View style={{ paddingHorizontal: spacing.md, paddingBottom: spacing.md }}>
          <View style={{ height: 1, backgroundColor: Colors.separator, marginBottom: spacing.sm }} />
          {signals.map((signal, i) => (
            <View key={signal.id}>
              <SignalRow signal={signal} />
              {i < signals.length - 1 && <View style={{ height: 1, backgroundColor: Colors.separator, marginLeft: 30 + spacing.md }} />}
            </View>
          ))}
        </View>
      )}
    </GlassCard>
  );
}

export default function ResultsScreen() {
  const { currentResult, resetScan } = useScanStore();
  const insets = useSafeAreaInsets();

  if (!currentResult) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bg.primary, gap: spacing.md }}>
        <Text style={{ color: Colors.text.muted, fontSize: 15 }}>No scan result found.</Text>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/(home)')}>
          <Text style={{ color: Colors.teal.primary, fontSize: 15, fontWeight: '600' }}>Go home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const cautionColor = CautionColors[currentResult.cautionLevel];
  const cautionMuted = CautionMutedColors[currentResult.cautionLevel];
  const cautionBorder = CautionBorderColors[currentResult.cautionLevel];

  function startNewScan() {
    router.dismissAll();
    resetScan();
    router.push('/scan/type');
  }

  function goHome() {
    router.dismissAll();
    resetScan();
    router.replace('/(tabs)/(home)');
  }

  async function continueWithReminderPrompt(nextAction: () => void) {
    const [hasPrompted, remindersEnabled] = await Promise.all([
      getHasPromptedForLearnReminders(),
      getLearnRemindersEnabled(),
    ]);

    if (hasPrompted || remindersEnabled) {
      nextAction();
      return;
    }

    Alert.alert(
      'Get Learn reminders?',
      'Turn on short tips and lesson reminders so BYM can bring you back to the Learn tab after scans.',
      [
        {
          text: 'Not now',
          style: 'cancel',
          onPress: () => {
            void markLearnRemindersPrompted();
            nextAction();
          },
        },
        {
          text: 'Turn on reminders',
          onPress: () => {
            void enableRemindersThenContinue(nextAction);
          },
        },
      ]
    );
  }

  async function enableRemindersThenContinue(nextAction: () => void) {
    await markLearnRemindersPrompted();

    const status = await enableLearnReminders();

    if (status !== 'granted') {
      Alert.alert(
        'Notifications are off',
        'You can enable reminders later if you want quick tips from the Learn tab.'
      );
    }

    nextAction();
  }

  return (
    <LinearGradient colors={[Colors.bg.secondary, Colors.bg.primary]} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        {/* Nav */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: Colors.text.muted, letterSpacing: 0.8, textTransform: 'uppercase' }}>Safety Analysis</Text>
          <TouchableOpacity style={{ paddingHorizontal: spacing.md, paddingVertical: spacing.xs }} onPress={() => void continueWithReminderPrompt(goHome)} activeOpacity={0.7}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.teal.primary, letterSpacing: -0.2 }}>Done</Text>
          </TouchableOpacity>
        </View>

        {/* Overall Result Card */}
        <Animated.View entering={FadeInDown.delay(0).duration(500)}>
          <View style={{ borderRadius: 28, borderCurve: 'continuous', borderWidth: 1, padding: spacing.lg, gap: spacing.md, backgroundColor: cautionMuted, borderColor: cautionBorder }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ width: 64, height: 64, borderRadius: 20, borderCurve: 'continuous', backgroundColor: `${cautionColor}25`, alignItems: 'center', justifyContent: 'center' }}>
                <SymbolView name="checkmark.shield.fill" size={36} tintColor={cautionColor} />
              </View>
              <CautionBadge level={currentResult.cautionLevel} size="lg" />
            </View>
            <Text style={{ fontSize: 24, fontWeight: '800', letterSpacing: -0.8, color: cautionColor }}>
              {CautionLabels[currentResult.cautionLevel]}
            </Text>
            <Text style={{ fontSize: 15, color: Colors.text.secondary, lineHeight: 24, letterSpacing: -0.2 }}>
              {currentResult.summary}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <SymbolView name={SCAN_TYPE_SYMBOLS[currentResult.scanType] as any} size={13} tintColor={Colors.text.muted} />
                <Text style={{ fontSize: 11, color: Colors.text.muted, fontWeight: '500' }}>
                  {currentResult.scanType === 'full' ? 'Safety Scan' : currentResult.scanType.charAt(0).toUpperCase() + currentResult.scanType.slice(1) + ' Scan'}
                </Text>
              </View>
              <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: Colors.text.disabled }} />
              <Text style={{ fontSize: 11, color: Colors.text.muted, fontWeight: '500' }}>
                {new Date(currentResult.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Signal Sections */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: Colors.text.muted, letterSpacing: 0.8, textTransform: 'uppercase', marginTop: spacing.sm, marginLeft: spacing.xs }}>Signal Breakdown</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(140).duration(500)}>
          <ExpandableSignalSection title="Photo Signals" sf="photo" sfColor={Colors.indigo} signals={currentResult.photoSignals} defaultOpen />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(180).duration(500)}>
          <ExpandableSignalSection title="Profile Signals" sf="person.fill" sfColor={Colors.teal.primary} signals={currentResult.profileSignals} defaultOpen />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(220).duration(500)}>
          <ExpandableSignalSection title="Chat Signals" sf="bubble.left.fill" sfColor={Colors.warning} signals={currentResult.chatSignals} defaultOpen />
        </Animated.View>

        {/* Next Steps */}
        {currentResult.nextSteps.length > 0 && (
          <Animated.View entering={FadeInDown.delay(260).duration(500)}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: Colors.text.muted, letterSpacing: 0.8, textTransform: 'uppercase', marginTop: spacing.sm, marginLeft: spacing.xs, marginBottom: spacing.sm }}>
              Recommended Next Steps
            </Text>
            <GlassCard padding={16}>
              {currentResult.nextSteps.map((step, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, paddingVertical: spacing.sm + 2, borderBottomWidth: i < currentResult.nextSteps.length - 1 ? 1 : 0, borderBottomColor: Colors.separator }}>
                  <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.teal.muted, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: Colors.teal.primary }}>{i + 1}</Text>
                  </View>
                  <Text style={{ flex: 1, fontSize: 13, color: Colors.text.secondary, lineHeight: 20, letterSpacing: -0.1 }}>{step}</Text>
                </View>
              ))}
            </GlassCard>
          </Animated.View>
        )}

        {/* Disclaimer */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <GlassCard padding={14}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }}>
              <SymbolView name="info.circle" size={16} tintColor={Colors.text.disabled} />
              <Text style={{ flex: 1, fontSize: 11, color: Colors.text.disabled, lineHeight: 18, letterSpacing: -0.1 }}>
                BYM provides AI-assisted guidance only. These signals do not confirm deceptive intent. Use your judgment and trust your intuition.
              </Text>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Actions */}
        <Animated.View entering={FadeInDown.delay(340).duration(500)} style={{ gap: spacing.sm, marginTop: spacing.sm }}>
          <PrimaryButton label="Start New Scan" onPress={() => void continueWithReminderPrompt(startNewScan)} />
          <PrimaryButton label="Back to Home" onPress={() => void continueWithReminderPrompt(goHome)} variant="outlined" />
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}
