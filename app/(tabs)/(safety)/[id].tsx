import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Dimensions,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn, FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle,
  withTiming, withSpring, Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/colors';
import { spacing } from '@/constants/theme';
import { LESSONS, LessonStep, InfoStep, QuizStep } from '@/data/lessons';
import { saveLessonProgress, getLessonProgress } from '@/utils/lessonStorage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ViewState = 'intro' | 'step' | 'complete';

// ─── Info card ───────────────────────────────────────────────────────────────

function InfoCard({
  step,
  color,
  bottomInset,
  onNext,
}: {
  step: InfoStep;
  color: string;
  bottomInset: number;
  onNext: () => void;
}) {
  return (
    <Animated.View entering={FadeInUp.duration(340)} style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: spacing.lg, gap: spacing.xl }}>
        {step.sf && (
          <View style={{ width: 72, height: 72, borderRadius: 22, borderCurve: 'continuous', backgroundColor: `${color}20`, alignItems: 'center', justifyContent: 'center' }}>
            <SymbolView name={step.sf as any} size={34} tintColor={color} />
          </View>
        )}
        <View style={{ gap: spacing.md }}>
          <Text style={{ fontSize: 26, fontWeight: '800', color: Colors.text.primary, letterSpacing: -0.8, lineHeight: 32 }}>
            {step.heading}
          </Text>
          <Text style={{ fontSize: 17, color: Colors.text.secondary, lineHeight: 26, letterSpacing: -0.3 }}>
            {step.body}
          </Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: spacing.lg, paddingBottom: bottomInset + spacing.md }}>
        <TouchableOpacity
          onPress={onNext}
          activeOpacity={0.85}
          style={{ backgroundColor: color, borderRadius: 16, borderCurve: 'continuous', paddingVertical: 17, alignItems: 'center' }}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#000', letterSpacing: -0.3 }}>Continue</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

// ─── Quiz card ────────────────────────────────────────────────────────────────

function QuizCard({
  step,
  color,
  onAnswer,
}: {
  step: QuizStep;
  color: string;
  onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;

  function handleSelect(i: number) {
    if (answered) return;
    setSelected(i);
    onAnswer(i === step.correct);
  }

  function optionStyle(i: number) {
    if (!answered) return { bg: 'rgba(255,255,255,0.07)', border: 'rgba(255,255,255,0.12)', text: Colors.text.primary };
    if (i === step.correct) return { bg: 'rgba(52,199,89,0.15)', border: Colors.success, text: Colors.success };
    if (i === selected) return { bg: 'rgba(255,69,58,0.15)', border: Colors.danger, text: Colors.danger };
    return { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.06)', text: Colors.text.disabled };
  }

  function optionIcon(i: number) {
    if (!answered) return null;
    if (i === step.correct) return <SymbolView name="checkmark.circle.fill" size={18} tintColor={Colors.success} />;
    if (i === selected) return <SymbolView name="xmark.circle.fill" size={18} tintColor={Colors.danger} />;
    return null;
  }

  return (
    <Animated.View entering={FadeInUp.duration(340)} style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.xl * 2, gap: spacing.md }}
        showsVerticalScrollIndicator={false}
      >
        {/* Question */}
        <View style={{ gap: spacing.sm, marginBottom: spacing.sm }}>
          <View style={{ backgroundColor: `${color}20`, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, alignSelf: 'flex-start' }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color, letterSpacing: 0.4 }}>QUESTION</Text>
          </View>
          <Text style={{ fontSize: 20, fontWeight: '700', color: Colors.text.primary, letterSpacing: -0.5, lineHeight: 28 }}>
            {step.question}
          </Text>
        </View>

        {/* Options */}
        {step.options.map((opt, i) => {
          const s = optionStyle(i);
          return (
            <TouchableOpacity
              key={i}
              onPress={() => handleSelect(i)}
              activeOpacity={answered ? 1 : 0.75}
              style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderRadius: 14, borderCurve: 'continuous', borderWidth: 1.5, backgroundColor: s.bg, borderColor: s.border }}
            >
              <View style={{ width: 28, height: 28, borderRadius: 14, borderWidth: answered ? 0 : 1.5, borderColor: 'rgba(255,255,255,0.18)', backgroundColor: answered ? 'transparent' : 'transparent', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {answered
                  ? optionIcon(i)
                  : <Text style={{ fontSize: 13, fontWeight: '700', color: Colors.text.muted }}>
                      {String.fromCharCode(65 + i)}
                    </Text>
                }
              </View>
              <Text style={{ flex: 1, fontSize: 15, color: s.text, lineHeight: 22, letterSpacing: -0.2, fontWeight: answered && i === step.correct ? '600' : '400' }}>
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Explanation */}
        {answered && (
          <Animated.View entering={FadeInDown.duration(300)}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, padding: spacing.md, borderRadius: 14, borderCurve: 'continuous', backgroundColor: selected === step.correct ? 'rgba(52,199,89,0.1)' : 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: selected === step.correct ? 'rgba(52,199,89,0.25)' : 'rgba(255,255,255,0.1)' }}>
              <SymbolView name="lightbulb.fill" size={16} tintColor={Colors.warning} />
              <Text style={{ flex: 1, fontSize: 14, color: Colors.text.secondary, lineHeight: 20, letterSpacing: -0.2 }}>
                {step.explanation}
              </Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </Animated.View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = LESSONS.find(l => l.id === id);
  const insets = useSafeAreaInsets();
  const tabBarHeight = insets.bottom + 49; // 49pt standard iOS tab bar + home indicator

  const [viewState, setViewState] = useState<ViewState>('intro');
  const [stepIndex, setStepIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  const progressAnim = useSharedValue(0);

  useEffect(() => {
    if (!lesson) return;
    getLessonProgress().then(p => {
      if (p[lesson.id]?.completed) setAlreadyCompleted(true);
    });
  }, [lesson?.id]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressAnim.value * 100}%`,
  }));

  if (!lesson) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bg.primary }}>
        <Text style={{ color: Colors.text.muted }}>Lesson not found.</Text>
      </View>
    );
  }

  const totalSteps = lesson.steps.length;
  const totalQuizzes = lesson.steps.filter(s => s.type === 'quiz').length;
  const currentStep = lesson.steps[stepIndex] as LessonStep;

  function updateProgress(index: number) {
    progressAnim.value = withTiming((index) / totalSteps, { duration: 400, easing: Easing.out(Easing.quad) });
  }

  function handleStart() {
    setViewState('step');
    updateProgress(0);
  }

  function handleInfoNext() {
    const next = stepIndex + 1;
    if (next >= totalSteps) {
      finish();
    } else {
      setStepIndex(next);
      updateProgress(next);
    }
  }

  function handleQuizAnswer(correct: boolean) {
    if (correct) setScore(s => s + 1);
    setQuizAnswered(true);
  }

  function handleQuizContinue() {
    setQuizAnswered(false);
    const next = stepIndex + 1;
    if (next >= totalSteps) {
      finish();
    } else {
      setStepIndex(next);
      updateProgress(next);
    }
  }

  async function finish() {
    if (!lesson) return;
    progressAnim.value = withTiming(1, { duration: 400 });
    await saveLessonProgress(lesson.id, {
      completed: true,
      score,
      total: totalQuizzes,
      xpEarned: lesson.xp,
    });
    setViewState('complete');
  }

  // ── Intro ──────────────────────────────────────────────────────────────────

  if (viewState === 'intro') {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <LinearGradient colors={[Colors.bg.secondary, Colors.bg.primary]} style={{ flex: 1 }}>
          <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
            {/* Close */}
            <View style={{ padding: spacing.lg }}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' }}
                activeOpacity={0.7}
              >
                <SymbolView name="xmark" size={14} tintColor={Colors.text.secondary} weight="semibold" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: 0, gap: spacing.lg, flexGrow: 1 }} showsVerticalScrollIndicator={false}>
              <Animated.View entering={FadeInDown.delay(0).duration(400)} style={{ gap: spacing.lg, flex: 1 }}>
                {/* Icon */}
                <View style={{ width: 80, height: 80, borderRadius: 24, borderCurve: 'continuous', backgroundColor: `${lesson.categoryColor}20`, alignItems: 'center', justifyContent: 'center' }}>
                  <SymbolView name={lesson.sf as any} size={40} tintColor={lesson.categoryColor} />
                </View>

                {/* Badge */}
                <View style={{ backgroundColor: `${lesson.categoryColor}20`, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, alignSelf: 'flex-start' }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: lesson.categoryColor, letterSpacing: 0.3 }}>
                    {lesson.category.toUpperCase()}
                  </Text>
                </View>

                <Text style={{ fontSize: 32, fontWeight: '800', color: Colors.text.primary, letterSpacing: -1, lineHeight: 38 }}>
                  {lesson.title}
                </Text>

                <Text style={{ fontSize: 16, color: Colors.text.secondary, lineHeight: 24, letterSpacing: -0.3 }}>
                  {lesson.summary}
                </Text>

                {/* Stats */}
                <View style={{ flexDirection: 'row', gap: spacing.md }}>
                  <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 14, borderCurve: 'continuous', padding: spacing.md, alignItems: 'center', gap: 6 }}>
                    <SymbolView name="star.fill" size={20} tintColor={Colors.warning} />
                    <Text style={{ fontSize: 20, fontWeight: '800', color: Colors.text.primary }}>+{lesson.xp}</Text>
                    <Text style={{ fontSize: 12, color: Colors.text.muted }}>XP to earn</Text>
                  </View>
                  <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 14, borderCurve: 'continuous', padding: spacing.md, alignItems: 'center', gap: 6 }}>
                    <SymbolView name="checkmark.circle.fill" size={20} tintColor={lesson.categoryColor} />
                    <Text style={{ fontSize: 20, fontWeight: '800', color: Colors.text.primary }}>{totalQuizzes}</Text>
                    <Text style={{ fontSize: 12, color: Colors.text.muted }}>Questions</Text>
                  </View>
                  <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 14, borderCurve: 'continuous', padding: spacing.md, alignItems: 'center', gap: 6 }}>
                    <SymbolView name="clock.fill" size={20} tintColor={Colors.teal.primary} />
                    <Text style={{ fontSize: 20, fontWeight: '800', color: Colors.text.primary }}>~{Math.ceil(totalSteps * 0.4)}</Text>
                    <Text style={{ fontSize: 12, color: Colors.text.muted }}>Minutes</Text>
                  </View>
                </View>

                {alreadyCompleted && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: 'rgba(52,199,89,0.1)', borderRadius: 12, padding: spacing.md, borderWidth: 1, borderColor: 'rgba(52,199,89,0.2)' }}>
                    <SymbolView name="checkmark.circle.fill" size={16} tintColor={Colors.success} />
                    <Text style={{ fontSize: 13, color: Colors.success, fontWeight: '500' }}>You completed this lesson — retake to review</Text>
                  </View>
                )}
              </Animated.View>
            </ScrollView>

            <Animated.View entering={FadeInDown.delay(200).duration(400)} style={{ padding: spacing.lg, paddingBottom: insets.bottom + spacing.md }}>
              <TouchableOpacity
                onPress={handleStart}
                activeOpacity={0.85}
                style={{ backgroundColor: lesson.categoryColor, borderRadius: 16, borderCurve: 'continuous', paddingVertical: 17, alignItems: 'center' }}
              >
                <Text style={{ fontSize: 17, fontWeight: '700', color: '#000', letterSpacing: -0.3 }}>
                  {alreadyCompleted ? 'Retake Lesson' : 'Start Lesson'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </LinearGradient>
      </>
    );
  }

  // ── Complete ───────────────────────────────────────────────────────────────

  if (viewState === 'complete') {
    const perfect = score === totalQuizzes;
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <LinearGradient colors={[Colors.bg.secondary, Colors.bg.primary]} style={{ flex: 1 }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, paddingBottom: insets.bottom + spacing.xl }}>
            <Animated.View entering={FadeIn.duration(500)} style={{ alignItems: 'center', gap: spacing.xl, width: '100%' }}>
              {/* Trophy */}
              <View style={{ width: 100, height: 100, borderRadius: 30, borderCurve: 'continuous', backgroundColor: `${lesson.categoryColor}20`, alignItems: 'center', justifyContent: 'center' }}>
                <SymbolView name={perfect ? 'trophy.fill' : 'checkmark.shield.fill'} size={52} tintColor={lesson.categoryColor} />
              </View>

              <View style={{ alignItems: 'center', gap: spacing.sm }}>
                <Text style={{ fontSize: 32, fontWeight: '800', color: Colors.text.primary, letterSpacing: -1 }}>
                  {perfect ? 'Perfect score!' : 'Lesson complete!'}
                </Text>
                <Text style={{ fontSize: 16, color: Colors.text.secondary, textAlign: 'center', lineHeight: 24, letterSpacing: -0.2 }}>
                  You got {score} out of {totalQuizzes} questions right.
                </Text>
              </View>

              {/* Score cards */}
              <View style={{ flexDirection: 'row', gap: spacing.md, width: '100%' }}>
                <View style={{ flex: 1, backgroundColor: `${lesson.categoryColor}15`, borderRadius: 16, borderCurve: 'continuous', padding: spacing.lg, alignItems: 'center', gap: spacing.sm, borderWidth: 1, borderColor: `${lesson.categoryColor}30` }}>
                  <Text style={{ fontSize: 32, fontWeight: '800', color: lesson.categoryColor }}>+{lesson.xp}</Text>
                  <Text style={{ fontSize: 13, color: Colors.text.muted, fontWeight: '500' }}>XP Earned</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16, borderCurve: 'continuous', padding: spacing.lg, alignItems: 'center', gap: spacing.sm }}>
                  <Text style={{ fontSize: 32, fontWeight: '800', color: Colors.text.primary }}>{score}/{totalQuizzes}</Text>
                  <Text style={{ fontSize: 13, color: Colors.text.muted, fontWeight: '500' }}>Correct</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => router.back()}
                activeOpacity={0.85}
                style={{ backgroundColor: lesson.categoryColor, borderRadius: 16, borderCurve: 'continuous', paddingVertical: 17, alignItems: 'center', width: '100%' }}
              >
                <Text style={{ fontSize: 17, fontWeight: '700', color: '#000', letterSpacing: -0.3 }}>Back to Learn</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </LinearGradient>
      </>
    );
  }

  // ── Step ───────────────────────────────────────────────────────────────────

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1, backgroundColor: Colors.bg.primary, paddingTop: insets.top }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            activeOpacity={0.7}
          >
            <SymbolView name="xmark" size={13} tintColor={Colors.text.muted} weight="semibold" />
          </TouchableOpacity>

          <View style={{ flex: 1, height: 6, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
            <Animated.View style={[{ height: '100%', backgroundColor: lesson.categoryColor, borderRadius: 3 }, progressStyle]} />
          </View>

          <Text style={{ fontSize: 12, color: Colors.text.muted, fontWeight: '600', minWidth: 32, textAlign: 'right' }}>
            {stepIndex + 1}/{totalSteps}
          </Text>
        </View>

        {/* Step content — keyed so entering animation fires on each step */}
        <View style={{ flex: 1 }} key={stepIndex}>
          {currentStep.type === 'info' ? (
            <InfoCard
              step={currentStep as InfoStep}
              color={lesson.categoryColor}
              bottomInset={tabBarHeight}
              onNext={handleInfoNext}
            />
          ) : (
            <QuizCard
              step={currentStep as QuizStep}
              color={lesson.categoryColor}
              onAnswer={handleQuizAnswer}
            />
          )}
        </View>

        {/* Quiz continue button — shown after answering */}
        {currentStep.type === 'quiz' && quizAnswered && (
          <Animated.View entering={FadeInUp.duration(300)} style={{ paddingHorizontal: spacing.lg, paddingBottom: tabBarHeight + spacing.sm }}>
            <TouchableOpacity
              onPress={handleQuizContinue}
              activeOpacity={0.85}
              style={{ backgroundColor: lesson.categoryColor, borderRadius: 16, borderCurve: 'continuous', paddingVertical: 17, alignItems: 'center' }}
            >
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#000', letterSpacing: -0.3 }}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </>
  );
}
