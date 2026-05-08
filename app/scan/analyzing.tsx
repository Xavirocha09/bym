import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { LoadingPulse } from '@/components/common/LoadingPulse';
import { Colors } from '@/constants/colors';
import { spacing } from '@/constants/theme';
import { useScanStore } from '@/store/useScanStore';
import { generateMockResult } from '@/data/mockResults';
import { addHistoryItem } from '@/utils/historyStorage';

const LOADING_TEXTS = [
  'Checking profile consistency…',
  'Reviewing emotional manipulation signals…',
  'Analyzing image authenticity indicators…',
  'Evaluating communication patterns…',
  'Preparing safety recommendations…',
];

const STEP_DURATION = 1800;

function AnimatedText({ text }: { text: string }) {
  return (
    <Animated.Text
      key={text}
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(300)}
      style={{ fontSize: 15, color: Colors.text.secondary, textAlign: 'center', letterSpacing: -0.2, lineHeight: 22, fontWeight: '500' }}
    >
      {text}
    </Animated.Text>
  );
}

export default function AnalyzingScreen() {
  const { scanType, contextAnswers, setCurrentResult } = useScanStore();
  const [stepIndex, setStepIndex] = useState(0);

  const dotOpacity1 = useSharedValue(1);
  const dotOpacity2 = useSharedValue(0.4);
  const dotOpacity3 = useSharedValue(0.15);

  useEffect(() => {
    dotOpacity1.value = withRepeat(withSequence(withTiming(1, { duration: 400 }), withTiming(0.2, { duration: 400 }), withTiming(0.2, { duration: 800 })), -1, false);
    dotOpacity2.value = withRepeat(withSequence(withTiming(0.3, { duration: 400 }), withTiming(1, { duration: 400 }), withTiming(0.2, { duration: 800 })), -1, false);
    dotOpacity3.value = withRepeat(withSequence(withTiming(0.1, { duration: 800 }), withTiming(1, { duration: 400 }), withTiming(0.2, { duration: 400 })), -1, false);

    const interval = setInterval(() => {
      setStepIndex((i) => {
        if (i >= LOADING_TEXTS.length - 1) { clearInterval(interval); return i; }
        return i + 1;
      });
    }, STEP_DURATION);

    const timeout = setTimeout(async () => {
      if (!scanType) return;
      const result = generateMockResult(scanType, contextAnswers);
      setCurrentResult(result);
      await addHistoryItem({ id: result.id, scanType: result.scanType, cautionLevel: result.cautionLevel, summary: result.summary, createdAt: result.createdAt });
      router.replace('/scan/results');
    }, LOADING_TEXTS.length * STEP_DURATION + 600);

    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, []);

  const dot1Style = useAnimatedStyle(() => ({ opacity: dotOpacity1.value }));
  const dot2Style = useAnimatedStyle(() => ({ opacity: dotOpacity2.value }));
  const dot3Style = useAnimatedStyle(() => ({ opacity: dotOpacity3.value }));

  return (
    <LinearGradient colors={[Colors.bg.primary, Colors.bg.secondary, Colors.bg.primary]} style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl }}>
        {/* Pulse Animation */}
        <View style={{ marginBottom: spacing.xxxl }}>
          <LoadingPulse
            color={Colors.teal.primary}
            icon={<SymbolView name="checkmark.shield.fill" size={32} tintColor={Colors.teal.primary} />}
          />
        </View>

        {/* Status */}
        <View style={{ alignItems: 'center', gap: spacing.md, minHeight: 72 }}>
          <AnimatedText key={stepIndex} text={LOADING_TEXTS[stepIndex]} />
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
            <Animated.View style={[{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.teal.primary }, dot1Style]} />
            <Animated.View style={[{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.teal.primary }, dot2Style]} />
            <Animated.View style={[{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.teal.primary }, dot3Style]} />
          </View>
        </View>

        {/* Privacy note */}
        <View style={{ position: 'absolute', bottom: 60, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <SymbolView name="lock.fill" size={13} tintColor={Colors.text.disabled} />
          <Text style={{ fontSize: 11, color: Colors.text.disabled, letterSpacing: -0.1 }}>
            Analysis is private. Nothing leaves your device.
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}
