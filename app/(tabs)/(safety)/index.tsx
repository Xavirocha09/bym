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

function LessonCard({
  lesson,
  progress,
  index,
}: {
  lesson: Lesson;
  progress: LessonProgress | undefined;
  index: number;
}) {
  const quizCount = lesson.steps.filter(s => s.type === 'quiz').length;
  const completed = progress?.completed ?? false;
  const minutes = Math.ceil(lesson.steps.length * 0.4);

  return (
    <Animated.View entering={FadeInDown.delay(index * 70).duration(400)}>
      <TouchableOpacity
        onPress={() => router.push(`/(tabs)/(safety)/${lesson.id}` as any)}
        activeOpacity={0.8}
      >
        <GlassCard padding={16}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }}>
            {/* Icon */}
            <View style={{ width: 52, height: 52, borderRadius: 16, borderCurve: 'continuous', backgroundColor: `${lesson.categoryColor}18`, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <SymbolView name={lesson.sf as any} size={26} tintColor={lesson.categoryColor} />
            </View>

            <View style={{ flex: 1, gap: 5 }}>
              {/* Category + status */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <View style={{ backgroundColor: `${lesson.categoryColor}20`, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: lesson.categoryColor, letterSpacing: 0.2 }}>
                    {lesson.category.toUpperCase()}
                  </Text>
                </View>
                {!completed && (
                  <View style={{ backgroundColor: Colors.teal.muted, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: Colors.teal.primary, letterSpacing: 0.2 }}>NEW</Text>
                  </View>
                )}
              </View>

              <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.text.primary, letterSpacing: -0.4, lineHeight: 20 }}>
                {lesson.title}
              </Text>

              {/* Stats row */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: 2 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <SymbolView name="star.fill" size={11} tintColor={Colors.warning} />
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

            {/* Chevron */}
            <SymbolView name="chevron.right" size={13} tintColor={Colors.text.disabled} weight="semibold" style={{ marginTop: 2 }} />
          </View>
        </GlassCard>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function LearnScreen() {
  const [progressMap, setProgressMap] = useState<Record<string, LessonProgress>>({});

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

        {LESSONS.map((lesson, i) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            progress={progressMap[lesson.id]}
            index={i + 1}
          />
        ))}
      </ScrollView>
    </>
  );
}
