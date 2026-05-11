import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, router, useFocusEffect } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassCard } from '@/components/common/GlassCard';
import { Colors } from '@/constants/colors';
import { spacing } from '@/constants/theme';
import { LESSONS, Lesson } from '@/data/lessons';
import { getLessonProgress, LessonProgress } from '@/utils/lessonStorage';
import { useRevenueCat } from '@/providers/revenuecat-provider';

function LessonCard({
  lesson,
  progress,
  index,
  locked,
  onLockedPress,
}: {
  lesson: Lesson;
  progress: LessonProgress | undefined;
  index: number;
  locked: boolean;
  onLockedPress: () => void;
}) {
  const quizCount = lesson.steps.filter(s => s.type === 'quiz').length;
  const completed = progress?.completed ?? false;
  const minutes = Math.ceil(lesson.steps.length * 0.4);

  function handlePress() {
    if (locked) {
      onLockedPress();
    } else {
      router.push(`/(tabs)/(safety)/${lesson.id}` as any);
    }
  }

  return (
    <Animated.View entering={FadeInDown.delay(index * 70).duration(400)}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <GlassCard padding={16} style={locked ? { opacity: 0.6 } : undefined}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }}>
            {/* Icon */}
            <View style={{ width: 52, height: 52, borderRadius: 16, borderCurve: 'continuous', backgroundColor: locked ? 'rgba(255,255,255,0.06)' : `${lesson.categoryColor}18`, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <SymbolView name={locked ? 'lock.fill' : lesson.sf as any} size={26} tintColor={locked ? Colors.text.disabled : lesson.categoryColor} />
            </View>

            <View style={{ flex: 1, gap: 5 }}>
              {/* Category + status */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <View style={{ backgroundColor: locked ? 'rgba(255,255,255,0.06)' : `${lesson.categoryColor}20`, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: locked ? Colors.text.disabled : lesson.categoryColor, letterSpacing: 0.2 }}>
                    {locked ? 'PRO' : lesson.category.toUpperCase()}
                  </Text>
                </View>
                {!completed && !locked && (
                  <View style={{ backgroundColor: Colors.teal.muted, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: Colors.teal.primary, letterSpacing: 0.2 }}>NEW</Text>
                  </View>
                )}
              </View>

              <Text style={{ fontSize: 15, fontWeight: '700', color: locked ? Colors.text.muted : Colors.text.primary, letterSpacing: -0.4, lineHeight: 20 }}>
                {lesson.title}
              </Text>

              {/* Stats row */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: 2 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <SymbolView name="star.fill" size={11} tintColor={locked ? Colors.text.disabled : Colors.warning} />
                  <Text style={{ fontSize: 12, color: Colors.text.muted, fontWeight: '600' }}>+{lesson.xp} XP</Text>
                </View>
                <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: Colors.text.disabled }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <SymbolView name="checkmark.circle" size={11} tintColor={Colors.text.disabled} />
                  <Text style={{ fontSize: 12, color: Colors.text.muted }}>{quizCount} questions</Text>
                </View>
                <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: Colors.text.disabled }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <SymbolView name="clock" size={11} tintColor={Colors.text.disabled} />
                  <Text style={{ fontSize: 12, color: Colors.text.muted }}>{minutes} min</Text>
                </View>
              </View>

              {/* Score if completed */}
              {completed && progress && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 4 }}>
                  <SymbolView name="checkmark.circle.fill" size={13} tintColor={Colors.success} />
                  <Text style={{ fontSize: 12, color: Colors.success, fontWeight: '600' }}>
                    Completed · {progress.score}/{progress.total} correct
                  </Text>
                </View>
              )}
            </View>

            {/* Lock or chevron */}
            <SymbolView
              name={locked ? 'lock.fill' : 'chevron.right'}
              size={13}
              tintColor={locked ? Colors.warning : Colors.text.disabled}
              weight="semibold"
              style={{ marginTop: 2 }}
            />
          </View>
        </GlassCard>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function LearnScreen() {
  const [progressMap, setProgressMap] = useState<Record<string, LessonProgress>>({});
  const { isPro, presentPaywall } = useRevenueCat();

  useFocusEffect(useCallback(() => {
    getLessonProgress().then(setProgressMap);
  }, []));

  const completedCount = LESSONS.filter(l => progressMap[l.id]?.completed).length;
  const totalXP = Object.values(progressMap).reduce((sum, p) => sum + (p.xpEarned ?? 0), 0);
  const maxXP = LESSONS.reduce((sum, l) => sum + l.xp, 0);

  return (
    <>
      <Stack.Screen options={{ title: 'Learn' }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1, backgroundColor: Colors.bg.primary }}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress banner */}
        <Animated.View entering={FadeInDown.delay(0).duration(400)}>
          <GlassCard padding={16}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <View>
                <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.text.secondary, letterSpacing: -0.2 }}>
                  {completedCount}/{LESSONS.length} lessons complete
                </Text>
                <Text style={{ fontSize: 11, color: Colors.text.muted, marginTop: 2 }}>
                  {totalXP} / {maxXP} XP earned
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,196,0,0.12)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 }}>
                <SymbolView name="star.fill" size={14} tintColor={Colors.warning} />
                <Text style={{ fontSize: 15, fontWeight: '800', color: Colors.warning }}>{totalXP} XP</Text>
              </View>
            </View>
            <View style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
              <View style={{ height: 6, width: `${(completedCount / LESSONS.length) * 100}%`, backgroundColor: Colors.teal.primary, borderRadius: 3, minWidth: completedCount > 0 ? 8 : 0 }} />
            </View>
          </GlassCard>
        </Animated.View>

        {LESSONS.map((lesson, i) => {
          const locked = !isPro && i > 0;
          return (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              progress={progressMap[lesson.id]}
              index={i + 1}
              locked={locked}
              onLockedPress={() => void presentPaywall()}
            />
          );
        })}
      </ScrollView>
    </>
  );
}
