import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  FadeIn,
  FadeOut,
  Easing,
} from 'react-native-reanimated';
import { LoadingPulse } from '@/components/common/LoadingPulse';
import { Colors } from '@/constants/colors';
import { fontSize, fontWeight, spacing } from '@/constants/theme';
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
      style={styles.loadingText}
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
    // Animate dot ellipsis
    dotOpacity1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 400 }),
        withTiming(0.2, { duration: 400 }),
        withTiming(0.2, { duration: 800 })
      ),
      -1,
      false
    );
    dotOpacity2.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 400 }),
        withTiming(1, { duration: 400 }),
        withTiming(0.2, { duration: 800 })
      ),
      -1,
      false
    );
    dotOpacity3.value = withRepeat(
      withSequence(
        withTiming(0.1, { duration: 800 }),
        withTiming(1, { duration: 400 }),
        withTiming(0.2, { duration: 400 })
      ),
      -1,
      false
    );

    // Rotate through loading text
    const interval = setInterval(() => {
      setStepIndex((i) => {
        if (i >= LOADING_TEXTS.length - 1) {
          clearInterval(interval);
          return i;
        }
        return i + 1;
      });
    }, STEP_DURATION);

    // Navigate to results after full analysis duration
    const timeout = setTimeout(async () => {
      if (!scanType) return;
      const result = generateMockResult(scanType, contextAnswers);
      setCurrentResult(result);

      await addHistoryItem({
        id: result.id,
        scanType: result.scanType,
        cautionLevel: result.cautionLevel,
        summary: result.summary,
        createdAt: result.createdAt,
      });

      router.replace('/scan/results');
    }, LOADING_TEXTS.length * STEP_DURATION + 600);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const dot1Style = useAnimatedStyle(() => ({ opacity: dotOpacity1.value }));
  const dot2Style = useAnimatedStyle(() => ({ opacity: dotOpacity2.value }));
  const dot3Style = useAnimatedStyle(() => ({ opacity: dotOpacity3.value }));

  return (
    <LinearGradient colors={[Colors.bg.primary, Colors.bg.secondary, Colors.bg.primary]} style={styles.gradient}>
      <View style={styles.container}>
        {/* Pulse Animation */}
        <View style={styles.pulseWrap}>
          <LoadingPulse
            color={Colors.teal.primary}
            icon={
              <Ionicons name="shield-checkmark" size={32} color={Colors.teal.primary} />
            }
          />
        </View>

        {/* Status */}
        <View style={styles.statusWrap}>
          <AnimatedText key={stepIndex} text={LOADING_TEXTS[stepIndex]} />
          <View style={styles.dots}>
            <Animated.View style={[styles.dot, dot1Style]} />
            <Animated.View style={[styles.dot, dot2Style]} />
            <Animated.View style={[styles.dot, dot3Style]} />
          </View>
        </View>

        {/* Privacy note */}
        <View style={styles.privacyNote}>
          <Ionicons name="lock-closed-outline" size={14} color={Colors.text.disabled} />
          <Text style={styles.privacyText}>
            Analysis is private. Nothing leaves your device.
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  pulseWrap: {
    marginBottom: spacing.xxxl,
  },
  statusWrap: {
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 72,
  },
  loadingText: {
    fontSize: fontSize.base,
    color: Colors.text.secondary,
    textAlign: 'center',
    letterSpacing: -0.2,
    lineHeight: 22,
    fontWeight: fontWeight.medium,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.teal.primary,
  },
  privacyNote: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  privacyText: {
    fontSize: fontSize.xs,
    color: Colors.text.disabled,
    letterSpacing: -0.1,
  },
});
