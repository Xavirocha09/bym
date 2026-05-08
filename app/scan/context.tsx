import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassCard } from '@/components/common/GlassCard';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { Colors } from '@/constants/colors';
import { spacing } from '@/constants/theme';
import { useScanStore } from '@/store/useScanStore';
import { CONTEXT_QUESTIONS } from '@/data/mockResults';

export default function ContextScreen() {
  const { contextAnswers, setContextAnswer } = useScanStore();
  const insets = useSafeAreaInsets();

  const answeredCount = Object.keys(contextAnswers).length;
  const allAnswered = answeredCount === CONTEXT_QUESTIONS.length;

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
            <SymbolView name="chevron.left" size={16} tintColor={Colors.text.secondary} weight="semibold" />
          </TouchableOpacity>
          <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.text.secondary, letterSpacing: -0.2 }}>Context Questions</Text>
          <View style={{ backgroundColor: Colors.teal.muted, paddingHorizontal: spacing.sm + 2, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: `${Colors.teal.primary}30` }}>
            <Text style={{ fontSize: 11, color: Colors.teal.primary, fontWeight: '600' }}>2 of 3</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.sm, gap: spacing.md }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.delay(0).duration(400)}>
            <Text style={{ fontSize: 34, fontWeight: '800', color: Colors.text.primary, letterSpacing: -1, lineHeight: 40, marginBottom: spacing.xs }}>
              A few quick{'\n'}questions
            </Text>
            <Text style={{ fontSize: 15, color: Colors.text.muted, lineHeight: 22, letterSpacing: -0.2 }}>
              These help improve scan accuracy. All answers are private and stay on your device.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(80).duration(400)} style={{ gap: spacing.md }}>
            {CONTEXT_QUESTIONS.map((q, index) => {
              const answer = contextAnswers[q.id];
              return (
                <GlassCard key={q.id} padding={16}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.sm }}>
                    <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: Colors.teal.muted, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: Colors.teal.primary }}>{index + 1}</Text>
                    </View>
                    <Text style={{ flex: 1, fontSize: 15, fontWeight: '600', color: Colors.text.primary, letterSpacing: -0.3, lineHeight: 22 }}>{q.text}</Text>
                  </View>
                  <Text style={{ fontSize: 13, color: Colors.text.muted, lineHeight: 18, letterSpacing: -0.1, marginLeft: 26 + spacing.md, marginBottom: spacing.md }}>
                    {q.description}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                    <TouchableOpacity
                      style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 42, borderRadius: 999, borderWidth: 1.5, borderColor: answer === true ? Colors.teal.primary : Colors.card.borderLight, backgroundColor: answer === true ? Colors.teal.primary : 'transparent' }}
                      onPress={() => setContextAnswer(q.id, answer === true ? null : true)}
                      activeOpacity={0.8}
                    >
                      <SymbolView name="checkmark" size={14} tintColor={answer === true ? Colors.bg.primary : Colors.text.muted} weight="semibold" />
                      <Text style={{ fontSize: 15, fontWeight: '600', color: answer === true ? Colors.bg.primary : Colors.text.muted, letterSpacing: -0.2 }}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 42, borderRadius: 999, borderWidth: 1.5, borderColor: answer === false ? Colors.danger : Colors.card.borderLight, backgroundColor: answer === false ? Colors.danger : 'transparent' }}
                      onPress={() => setContextAnswer(q.id, answer === false ? null : false)}
                      activeOpacity={0.8}
                    >
                      <SymbolView name="xmark" size={14} tintColor={answer === false ? Colors.bg.primary : Colors.text.muted} weight="semibold" />
                      <Text style={{ fontSize: 15, fontWeight: '600', color: answer === false ? Colors.bg.primary : Colors.text.muted, letterSpacing: -0.2 }}>No</Text>
                    </TouchableOpacity>
                  </View>
                </GlassCard>
              );
            })}
          </Animated.View>

          <View style={{ height: 20 }} />
        </ScrollView>

        <View style={{ padding: spacing.lg, paddingBottom: insets.bottom + spacing.md, gap: spacing.md }}>
          <Text style={{ fontSize: 13, color: Colors.text.muted, textAlign: 'center', letterSpacing: -0.1 }}>
            {allAnswered
              ? 'All questions answered — ready to analyze.'
              : `${answeredCount} of ${CONTEXT_QUESTIONS.length} answered · You can skip unanswered questions`}
          </Text>
          <PrimaryButton
            label="Run Safety Analysis"
            onPress={() => router.push('/scan/analyzing')}
          />
        </View>
      </View>
    </LinearGradient>
  );
}
