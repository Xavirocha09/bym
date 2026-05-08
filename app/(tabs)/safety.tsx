import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '@/components/common/GlassCard';
import { Colors } from '@/constants/colors';
import { fontSize, fontWeight, spacing, radius } from '@/constants/theme';

type IoniconName = keyof typeof Ionicons.glyphMap;

interface CheckItem {
  id: string;
  text: string;
}

interface CheckSection {
  id: string;
  title: string;
  icon: IoniconName;
  color: string;
  items: CheckItem[];
}

const SECTIONS: CheckSection[] = [
  {
    id: 'before',
    title: 'Before Meeting',
    icon: 'calendar-outline',
    color: Colors.teal.primary,
    items: [
      { id: 'b1', text: 'Video call with them at least once before meeting in person' },
      { id: 'b2', text: 'Verify their identity on LinkedIn or social media' },
      { id: 'b3', text: 'Tell a trusted friend or family member your plans and location' },
      { id: 'b4', text: 'Choose a well-lit, busy public venue for the first meeting' },
      { id: 'b5', text: 'Keep your home address private until trust is well established' },
    ],
  },
  {
    id: 'during',
    title: 'During a First Date',
    icon: 'location-outline',
    color: Colors.indigo,
    items: [
      { id: 'd1', text: 'Arrange your own transportation to and from the date' },
      { id: 'd2', text: 'Keep your phone charged and accessible' },
      { id: 'd3', text: 'Share your live location with a trusted contact' },
      { id: 'd4', text: 'Trust your instincts — leave if something feels wrong' },
      { id: 'd5', text: 'Avoid accepting drinks you did not see being poured' },
    ],
  },
  {
    id: 'financial',
    title: 'Financial Safety',
    icon: 'card-outline',
    color: Colors.warning,
    items: [
      { id: 'f1', text: 'Never send money to someone you haven\'t met in person' },
      { id: 'f2', text: 'Avoid gift cards, wire transfers, or cryptocurrency requests' },
      { id: 'f3', text: 'Be cautious of investment or business opportunities introduced early' },
      { id: 'f4', text: 'Financial requests before meeting are a significant red flag' },
    ],
  },
  {
    id: 'emotional',
    title: 'Emotional Safety',
    icon: 'heart-outline',
    color: Colors.danger,
    items: [
      { id: 'e1', text: 'Be mindful of relationships that escalate unusually fast' },
      { id: 'e2', text: 'Anyone who isolates you from friends or family is a warning sign' },
      { id: 'e3', text: 'Consistent guilt-tripping or pressure is manipulation — not love' },
      { id: 'e4', text: 'You are allowed to set the pace. Healthy connections respect boundaries' },
      { id: 'e5', text: 'Speak with a trusted person if the relationship feels confusing' },
    ],
  },
];

function ChecklistSection({ section }: { section: CheckSection }) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState(true);

  function toggleItem(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleExpand() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((e) => !e);
  }

  const done = checked.size;
  const total = section.items.length;

  return (
    <GlassCard style={styles.sectionCard} padding={0}>
      <TouchableOpacity style={styles.sectionHeader} onPress={toggleExpand} activeOpacity={0.8}>
        <View style={[styles.sectionIconWrap, { backgroundColor: `${section.color}18` }]}>
          <Ionicons name={section.icon} size={20} color={section.color} />
        </View>
        <View style={styles.sectionMeta}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={[styles.sectionProgress, { color: section.color }]}>
            {done}/{total} completed
          </Text>
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={Colors.text.muted}
        />
      </TouchableOpacity>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${(done / total) * 100}%`, backgroundColor: section.color },
          ]}
        />
      </View>

      {expanded && (
        <View style={styles.itemList}>
          {section.items.map((item, index) => {
            const isChecked = checked.has(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.checkItem, index === section.items.length - 1 && styles.checkItemLast]}
                onPress={() => toggleItem(item.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    isChecked && { backgroundColor: section.color, borderColor: section.color },
                  ]}
                >
                  {isChecked && <Ionicons name="checkmark" size={13} color="#fff" />}
                </View>
                <Text style={[styles.checkText, isChecked && styles.checkTextDone]}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </GlassCard>
  );
}

export default function SafetyScreen() {
  return (
    <LinearGradient colors={[Colors.bg.primary, Colors.bg.tertiary]} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIconWrap}>
              <Ionicons name="shield-checkmark" size={22} color={Colors.teal.primary} />
            </View>
            <View>
              <Text style={styles.screenLabel}>Safety Guide</Text>
              <Text style={styles.screenTitle}>Protect yourself</Text>
            </View>
          </View>

          <GlassCard padding={14} style={styles.introBanner}>
            <View style={styles.introRow}>
              <Ionicons name="information-circle" size={18} color={Colors.teal.primary} />
              <Text style={styles.introText}>
                These checklists are evergreen safety practices — not tied to any specific scan.
              </Text>
            </View>
          </GlassCard>

          {SECTIONS.map((section) => (
            <ChecklistSection key={section.id} section={section} />
          ))}

          <GlassCard padding={16} style={styles.disclaimerCard}>
            <Text style={styles.disclaimerTitle}>Remember</Text>
            <Text style={styles.disclaimerText}>
              BYM provides AI-assisted guidance only. These indicators help you notice patterns, not confirm intent. Always trust your own intuition above all else.
            </Text>
          </GlassCard>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  headerIconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: Colors.teal.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenLabel: {
    fontSize: fontSize.xs,
    color: Colors.teal.primary,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  screenTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.heavy,
    color: Colors.text.primary,
    letterSpacing: -0.8,
  },
  introBanner: { marginBottom: spacing.xs },
  introRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  introText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: Colors.text.muted,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  sectionCard: { overflow: 'hidden' },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  sectionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sectionMeta: { flex: 1 },
  sectionTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: Colors.text.primary,
    letterSpacing: -0.3,
  },
  sectionProgress: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    marginTop: 2,
  },
  progressTrack: {
    height: 2,
    backgroundColor: Colors.card.border,
    marginHorizontal: spacing.md,
  },
  progressFill: {
    height: 2,
    borderRadius: 1,
    minWidth: 4,
  },
  itemList: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
  },
  checkItemLast: {
    borderBottomWidth: 0,
    paddingBottom: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.card.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  checkText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  checkTextDone: {
    color: Colors.text.disabled,
    textDecorationLine: 'line-through',
  },
  disclaimerCard: { marginTop: spacing.xs },
  disclaimerTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: Colors.text.secondary,
    marginBottom: spacing.xs,
    letterSpacing: -0.3,
  },
  disclaimerText: {
    fontSize: fontSize.sm,
    color: Colors.text.muted,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
});
