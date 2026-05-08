import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import Animated, { FadeIn, FadeOut, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';
import { setOnboardingComplete } from '@/utils/historyStorage';
import { Colors } from '@/constants/colors';
import { spacing } from '@/constants/theme';

interface Slide {
  id: number;
  sf: string;
  iconColor: string;
  title: string;
  subtitle: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    sf: 'magnifyingglass.circle.fill',
    iconColor: Colors.teal.primary,
    title: 'Be one step ahead',
    subtitle: 'Run a private AI-assisted safety scan before emotional investment.',
  },
  {
    id: 2,
    sf: 'lock.fill',
    iconColor: Colors.indigo,
    title: 'Private by design',
    subtitle: 'Your scans stay private. No public exposure or reporting.',
  },
  {
    id: 3,
    sf: 'chart.bar.fill',
    iconColor: Colors.warning,
    title: 'Risk signals, not certainty',
    subtitle: 'BYM highlights suspicious patterns and dating safety concerns.',
  },
  {
    id: 4,
    sf: 'checkmark.shield.fill',
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
      style={{ alignItems: 'center', width: '100%' }}
    >
      <View style={{ width: 140, height: 140, borderRadius: 70, backgroundColor: `${slide.iconColor}18`, borderColor: `${slide.iconColor}28`, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl + spacing.md }}>
        <SymbolView name={slide.sf as any} size={64} tintColor={slide.iconColor} />
      </View>
      <Text style={{ fontSize: 34, fontWeight: '800', color: Colors.text.primary, textAlign: 'center', letterSpacing: -1, lineHeight: 40, marginBottom: spacing.md }}>
        {slide.title}
      </Text>
      <Text style={{ fontSize: 17, color: Colors.text.muted, textAlign: 'center', lineHeight: 26, letterSpacing: -0.2, maxWidth: 300 }}>
        {slide.subtitle}
      </Text>
    </Animated.View>
  );
}

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isLast = currentIndex === SLIDES.length - 1;

  async function handleNext() {
    if (isLast) {
      await setOnboardingComplete();
      router.replace('/(tabs)/(home)');
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  function handleSkip() {
    setCurrentIndex(SLIDES.length - 1);
  }

  const slide = SLIDES[currentIndex];

  return (
    <LinearGradient colors={[Colors.bg.primary, Colors.bg.secondary]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.teal.primary, letterSpacing: 2 }}>BYM</Text>
          {!isLast && (
            <TouchableOpacity onPress={handleSkip} activeOpacity={0.7} style={{ paddingHorizontal: spacing.md, paddingVertical: spacing.xs }}>
              <Text style={{ fontSize: 15, color: Colors.text.muted, fontWeight: '500' }}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Slide */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl }}>
          <SlideContent key={currentIndex} slide={slide} />
        </View>

        {/* Footer */}
        <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, gap: spacing.lg }}>
          {/* Dots */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing.sm }}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={{
                  height: 7,
                  borderRadius: 4,
                  backgroundColor: i === currentIndex ? Colors.teal.primary : Colors.card.border,
                  width: i === currentIndex ? 22 : 7,
                }}
              />
            ))}
          </View>

          {/* CTA */}
          <TouchableOpacity style={{ borderRadius: 999, overflow: 'hidden' }} onPress={handleNext} activeOpacity={0.85}>
            <LinearGradient
              colors={[Colors.teal.primary, Colors.teal.light]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl, gap: 8 }}
            >
              <Text style={{ fontSize: 17, fontWeight: '700', color: Colors.bg.primary, letterSpacing: -0.3 }}>
                {isLast ? 'Start Safety Scan' : 'Continue'}
              </Text>
              {!isLast && <SymbolView name="arrow.right" size={16} tintColor={Colors.bg.primary} weight="semibold" />}
            </LinearGradient>
          </TouchableOpacity>

          <Text style={{ fontSize: 11, color: Colors.text.disabled, textAlign: 'center', letterSpacing: -0.1 }}>
            AI-assisted guidance only. Not a definitive safety guarantee.
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
