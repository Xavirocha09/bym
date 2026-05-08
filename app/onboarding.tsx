import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeOut,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { setOnboardingComplete } from '@/utils/historyStorage';
import { Colors } from '@/constants/colors';
import { fontSize, fontWeight, spacing, radius } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

type IoniconName = keyof typeof Ionicons.glyphMap;

interface Slide {
  id: number;
  icon: IoniconName;
  iconColor: string;
  title: string;
  subtitle: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    icon: 'search-circle',
    iconColor: Colors.teal.primary,
    title: 'Be one step ahead',
    subtitle: 'Run a private AI-assisted safety scan before emotional investment.',
  },
  {
    id: 2,
    icon: 'lock-closed',
    iconColor: Colors.indigo,
    title: 'Private by design',
    subtitle: 'Your scans stay private. No public exposure or reporting.',
  },
  {
    id: 3,
    icon: 'analytics',
    iconColor: Colors.warning,
    title: 'Risk signals, not certainty',
    subtitle: 'BYM highlights suspicious patterns and dating safety concerns.',
  },
  {
    id: 4,
    icon: 'shield-checkmark',
    iconColor: Colors.teal.light,
    title: 'Stay safer online',
    subtitle: 'Spot emotional manipulation, scam signals, and AI-generated profile risks.',
  },
];

function SlideContent({ slide }: { slide: Slide }) {
  return (
    <Animated.View
      entering={FadeIn.duration(380).easing(Easing.out(Easing.quad))}
      exiting={FadeOut.duration(200)}
      style={styles.slideContent}
    >
      <View style={[styles.iconCircle, { backgroundColor: `${slide.iconColor}18`, borderColor: `${slide.iconColor}28` }]}>
        <Ionicons name={slide.icon} size={64} color={slide.iconColor} />
      </View>
      <Text style={styles.slideTitle}>{slide.title}</Text>
      <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
    </Animated.View>
  );
}

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isLast = currentIndex === SLIDES.length - 1;

  async function handleNext() {
    if (isLast) {
      await setOnboardingComplete();
      router.replace('/(tabs)');
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  function handleSkip() {
    setCurrentIndex(SLIDES.length - 1);
  }

  const slide = SLIDES[currentIndex];

  return (
    <LinearGradient colors={[Colors.bg.primary, Colors.bg.secondary]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.wordmark}>
            <Text style={styles.wordmarkText}>BYM</Text>
          </View>
          {!isLast && (
            <TouchableOpacity onPress={handleSkip} style={styles.skipBtn} activeOpacity={0.7}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Slide */}
        <View style={styles.slideArea}>
          <SlideContent key={currentIndex} slide={slide} />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          {/* Dots */}
          <View style={styles.dots}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === currentIndex && styles.dotActive,
                ]}
              />
            ))}
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[Colors.teal.primary, Colors.teal.light]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextBtnGradient}
            >
              <Text style={styles.nextBtnText}>
                {isLast ? 'Start Safety Scan' : 'Continue'}
              </Text>
              {!isLast && (
                <Ionicons name="arrow-forward" size={18} color={Colors.bg.primary} style={{ marginLeft: 6 }} />
              )}
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            AI-assisted guidance only. Not a definitive safety guarantee.
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  wordmark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  wordmarkText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: Colors.teal.primary,
    letterSpacing: 2,
  },
  skipBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  skipText: {
    fontSize: fontSize.base,
    color: Colors.text.muted,
    fontWeight: fontWeight.medium,
  },
  slideArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  slideContent: {
    alignItems: 'center',
    width: '100%',
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl + spacing.md,
    borderWidth: 1,
  },
  slideTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.heavy,
    color: Colors.text.primary,
    textAlign: 'center',
    letterSpacing: -1,
    lineHeight: 40,
    marginBottom: spacing.md,
  },
  slideSubtitle: {
    fontSize: fontSize.md,
    color: Colors.text.muted,
    textAlign: 'center',
    lineHeight: 26,
    letterSpacing: -0.2,
    maxWidth: 300,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.card.border,
  },
  dotActive: {
    width: 22,
    backgroundColor: Colors.teal.primary,
  },
  nextBtn: {
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  nextBtnGradient: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  nextBtnText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: Colors.bg.primary,
    letterSpacing: -0.3,
  },
  disclaimer: {
    fontSize: fontSize.xs,
    color: Colors.text.disabled,
    textAlign: 'center',
    letterSpacing: -0.1,
  },
});
