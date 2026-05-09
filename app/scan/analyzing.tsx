import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
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
import { analyzeImages } from '@/utils/analyzeImages';
import { addHistoryItem } from '@/utils/historyStorage';

const LOADING_TEXTS = [
  'Checking profile consistency…',
  'Reviewing emotional manipulation signals…',
  'Analyzing image authenticity indicators…',
  'Evaluating communication patterns…',
  'Preparing safety recommendations…',
];

const STEP_DURATION = 1800;
const MIN_STEPS_BEFORE_NAVIGATE = 2;

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
  const { scanType, uploadedImages, contextAnswers, setCurrentResult } = useScanStore();
  const [stepIndex, setStepIndex] = useState(0);

  const dotOpacity1 = useSharedValue(1);
  const dotOpacity2 = useSharedValue(0.4);
  const dotOpacity3 = useSharedValue(0.15);

  useEffect(() => {
    if (!scanType) { router.back(); return; }

    // Dot animation
    dotOpacity1.value = withRepeat(withSequence(withTiming(1, { duration: 400 }), withTiming(0.2, { duration: 400 }), withTiming(0.2, { duration: 800 })), -1, false);
    dotOpacity2.value = withRepeat(withSequence(withTiming(0.3, { duration: 400 }), withTiming(1, { duration: 400 }), withTiming(0.2, { duration: 800 })), -1, false);
    dotOpacity3.value = withRepeat(withSequence(withTiming(0.1, { duration: 800 }), withTiming(1, { duration: 400 }), withTiming(0.2, { duration: 400 })), -1, false);

    // Step text cycling
    const interval = setInterval(() => {
      setStepIndex(i => Math.min(i + 1, LOADING_TEXTS.length - 1));
    }, STEP_DURATION);

    // Minimum display time so animation shows at least a couple steps
    const minTime = new Promise<void>(resolve =>
      setTimeout(resolve, MIN_STEPS_BEFORE_NAVIGATE * STEP_DURATION)
    );

    // Real API call
    const apiCall = analyzeImages(uploadedImages, scanType, contextAnswers);

    Promise.all([apiCall, minTime])
      .then(async ([result]) => {
        setCurrentResult(result);
        await addHistoryItem({
          id: result.id,
          scanType: result.scanType,
          cautionLevel: result.cautionLevel,
          summary: result.summary,
          createdAt: result.createdAt,
          photoSignals: result.photoSignals,
          profileSignals: result.profileSignals,
          chatSignals: result.chatSignals,
          nextSteps: result.nextSteps,
        });
        clearInterval(interval);
        router.replace('/scan/results');
      })
      .catch(err => {
        clearInterval(interval);
        Alert.alert(
          'Analysis failed',
          err.message ?? 'Something went wrong. Please try again.',
          [{ text: 'Go back', onPress: () => router.back() }]
        );
      });

    return () => clearInterval(interval);
  }, []);

  const dot1Style = useAnimatedStyle(() => ({ opacity: dotOpacity1.value }));
  const dot2Style = useAnimatedStyle(() => ({ opacity: dotOpacity2.value }));
  const dot3Style = useAnimatedStyle(() => ({ opacity: dotOpacity3.value }));

  return (
    <LinearGradient colors={[Colors.bg.primary, Colors.bg.secondary, Colors.bg.primary]} style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl }}>
        <View style={{ marginBottom: spacing.xxxl }}>
          <LoadingPulse
            color={Colors.teal.primary}
            icon={<SymbolView name="checkmark.shield.fill" size={32} tintColor={Colors.teal.primary} />}
          />
        </View>

        <View style={{ alignItems: 'center', gap: spacing.md, minHeight: 72 }}>
          <AnimatedText key={stepIndex} text={LOADING_TEXTS[stepIndex]} />
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
            <Animated.View style={[{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.teal.primary }, dot1Style]} />
            <Animated.View style={[{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.teal.primary }, dot2Style]} />
            <Animated.View style={[{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.teal.primary }, dot3Style]} />
          </View>
        </View>

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
