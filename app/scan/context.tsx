import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassCard } from '@/components/common/GlassCard';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { Colors } from '@/constants/colors';
import { fontSize, fontWeight, spacing, radius } from '@/constants/theme';
import { useScanStore } from '@/store/useScanStore';
import { CONTEXT_QUESTIONS } from '@/data/mockResults';

export default function ContextScreen() {
  const { contextAnswers, setContextAnswer } = useScanStore();

  const answeredCount = Object.keys(contextAnswers).length;
  const allAnswered = answeredCount === CONTEXT_QUESTIONS.length;

  return (
    <LinearGradient colors={[Colors.bg.secondary, Colors.bg.primary]} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Nav */}
        <View style={styles.nav}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color={Colors.text.secondary} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Context Questions</Text>
          <View style={styles.stepBadge}>
            <Text style={styles.stepText}>2 of 3</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.delay(0).duration(400)}>
            <Text style={styles.headline}>A few quick{'\n'}questions</Text>
            <Text style={styles.sub}>
              These help improve scan accuracy. All answers are private and stay on your device.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(80).duration(400)} style={styles.questions}>
            {CONTEXT_QUESTIONS.map((q, index) => {
              const answer = contextAnswers[q.id];
              return (
                <GlassCard key={q.id} padding={16} style={styles.questionCard}>
                  <View style={styles.questionHeader}>
                    <View style={styles.questionIndex}>
                      <Text style={styles.questionIndexText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.questionText}>{q.text}</Text>
                  </View>
                  <Text style={styles.questionDescription}>{q.description}</Text>
                  <View style={styles.answerRow}>
                    <TouchableOpacity
                      style={[
                        styles.answerBtn,
                        answer === true && styles.answerBtnYes,
                      ]}
                      onPress={() => setContextAnswer(q.id, answer === true ? null : true)}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={answer === true ? Colors.bg.primary : Colors.text.muted}
                      />
                      <Text
                        style={[
                          styles.answerBtnText,
                          answer === true && styles.answerBtnTextActive,
                        ]}
                      >
                        Yes
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.answerBtn,
                        answer === false && styles.answerBtnNo,
                      ]}
                      onPress={() => setContextAnswer(q.id, answer === false ? null : false)}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name="close"
                        size={16}
                        color={answer === false ? Colors.bg.primary : Colors.text.muted}
                      />
                      <Text
                        style={[
                          styles.answerBtnText,
                          answer === false && styles.answerBtnTextActive,
                        ]}
                      >
                        No
                      </Text>
                    </TouchableOpacity>
                  </View>
                </GlassCard>
              );
            })}
          </Animated.View>

          <View style={{ height: 20 }} />
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerHint}>
            {allAnswered
              ? 'All questions answered — ready to analyze.'
              : `${answeredCount} of ${CONTEXT_QUESTIONS.length} answered · You can skip unanswered questions`}
          </Text>
          <PrimaryButton
            label="Run Safety Analysis"
            onPress={() => router.push('/scan/analyzing')}
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
  backBtn: {
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
  stepBadge: {
    backgroundColor: Colors.teal.muted,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: `${Colors.teal.primary}30`,
  },
  stepText: {
    fontSize: fontSize.xs,
    color: Colors.teal.primary,
    fontWeight: fontWeight.semibold,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  headline: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.heavy,
    color: Colors.text.primary,
    letterSpacing: -1,
    lineHeight: 40,
    marginBottom: spacing.xs,
  },
  sub: {
    fontSize: fontSize.base,
    color: Colors.text.muted,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  questions: { gap: spacing.md },
  questionCard: {},
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  questionIndex: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.teal.muted,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  questionIndexText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: Colors.teal.primary,
  },
  questionText: {
    flex: 1,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: Colors.text.primary,
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  questionDescription: {
    fontSize: fontSize.sm,
    color: Colors.text.muted,
    lineHeight: 18,
    letterSpacing: -0.1,
    marginLeft: 26 + spacing.md,
    marginBottom: spacing.md,
  },
  answerRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  answerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 42,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: Colors.card.borderLight,
    backgroundColor: 'transparent',
  },
  answerBtnYes: {
    backgroundColor: Colors.teal.primary,
    borderColor: Colors.teal.primary,
  },
  answerBtnNo: {
    backgroundColor: Colors.danger,
    borderColor: Colors.danger,
  },
  answerBtnText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: Colors.text.muted,
    letterSpacing: -0.2,
  },
  answerBtnTextActive: {
    color: Colors.bg.primary,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  footerHint: {
    fontSize: fontSize.sm,
    color: Colors.text.muted,
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  cta: { width: '100%' },
});
