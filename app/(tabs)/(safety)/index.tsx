import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, LayoutAnimation, PlatformColor } from 'react-native';
import { Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { GlassCard } from '@/components/common/GlassCard';
import { Colors } from '@/constants/colors';
import { spacing } from '@/constants/theme';

interface CheckItem { id: string; text: string }
interface Section { id: string; title: string; sf: string; color: string; items: CheckItem[] }

const SECTIONS: Section[] = [
  {
    id: 'before', title: 'Before Meeting', sf: 'calendar', color: Colors.teal.primary,
    items: [
      { id: 'b1', text: 'Video call at least once before meeting in person' },
      { id: 'b2', text: 'Verify identity on LinkedIn or social media' },
      { id: 'b3', text: 'Tell a trusted person your plans and location' },
      { id: 'b4', text: 'Choose a busy public venue for the first meeting' },
      { id: 'b5', text: 'Keep your home address private until trust is established' },
    ],
  },
  {
    id: 'during', title: 'During a First Date', sf: 'location.fill', color: Colors.indigo,
    items: [
      { id: 'd1', text: 'Arrange your own transportation both ways' },
      { id: 'd2', text: 'Keep your phone charged and accessible' },
      { id: 'd3', text: 'Share live location with a trusted contact' },
      { id: 'd4', text: 'Trust your instincts — leave if something feels wrong' },
      { id: 'd5', text: 'Avoid drinks you did not see being poured' },
    ],
  },
  {
    id: 'financial', title: 'Financial Safety', sf: 'creditcard.fill', color: Colors.warning,
    items: [
      { id: 'f1', text: 'Never send money to someone you haven\'t met in person' },
      { id: 'f2', text: 'Avoid gift cards, wire transfers, or crypto requests' },
      { id: 'f3', text: 'Be cautious of investment opportunities introduced early' },
      { id: 'f4', text: 'Financial requests before meeting are a major red flag' },
    ],
  },
  {
    id: 'emotional', title: 'Emotional Safety', sf: 'heart.fill', color: Colors.danger,
    items: [
      { id: 'e1', text: 'Be mindful of relationships that escalate unusually fast' },
      { id: 'e2', text: 'Isolation from friends or family is a warning sign' },
      { id: 'e3', text: 'Consistent guilt-tripping or pressure is manipulation' },
      { id: 'e4', text: 'You control the pace. Healthy connections respect boundaries' },
    ],
  },
];

function ChecklistSection({ section }: { section: Section }) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(true);

  function toggle(id: string) {
    setChecked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  function toggleOpen() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(v => !v);
  }

  const done = checked.size;
  const total = section.items.length;

  return (
    <GlassCard padding={0} style={{ overflow: 'hidden' }}>
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md }}
        onPress={toggleOpen}
        activeOpacity={0.8}
      >
        <View style={{ width: 40, height: 40, borderRadius: 12, borderCurve: 'continuous', backgroundColor: `${section.color}18`, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <SymbolView name={section.sf as any} size={20} tintColor={section.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: PlatformColor('label') as any, letterSpacing: -0.3 }}>{section.title}</Text>
          <Text style={{ fontSize: 12, color: section.color, marginTop: 2, fontWeight: '500' }}>{done}/{total} completed</Text>
        </View>
        <SymbolView name={open ? 'chevron.up' : 'chevron.down'} size={14} tintColor={PlatformColor('tertiaryLabel') as any} weight="semibold" />
      </TouchableOpacity>

      <View style={{ height: 2, backgroundColor: 'rgba(255,255,255,0.06)', marginHorizontal: spacing.md }}>
        <View style={{ height: 2, width: `${(done / total) * 100}%`, backgroundColor: section.color, borderRadius: 1, minWidth: done > 0 ? 4 : 0 }} />
      </View>

      {open && (
        <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.xs }}>
          {section.items.map((item, i) => (
            <TouchableOpacity
              key={item.id}
              style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, paddingVertical: 10, borderBottomWidth: i < section.items.length - 1 ? 1 : 0, borderBottomColor: 'rgba(255,255,255,0.06)' }}
              onPress={() => toggle(item.id)}
              activeOpacity={0.7}
            >
              <View style={{ width: 22, height: 22, borderRadius: 7, borderCurve: 'continuous', borderWidth: 1.5, borderColor: checked.has(item.id) ? section.color : 'rgba(255,255,255,0.2)', backgroundColor: checked.has(item.id) ? section.color : 'transparent', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                {checked.has(item.id) && <SymbolView name="checkmark" size={12} tintColor="#fff" weight="bold" />}
              </View>
              <Text style={{ flex: 1, fontSize: 14, color: checked.has(item.id) ? PlatformColor('quaternaryLabel') as any : PlatformColor('secondaryLabel') as any, lineHeight: 20, letterSpacing: -0.1, textDecorationLine: checked.has(item.id) ? 'line-through' : 'none' }}>
                {item.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </GlassCard>
  );
}

export default function SafetyScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Safety Guide' }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1, backgroundColor: Colors.bg.primary }}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <GlassCard padding={14}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <SymbolView name="info.circle.fill" size={16} tintColor={Colors.teal.primary} />
            <Text style={{ flex: 1, fontSize: 13, color: PlatformColor('secondaryLabel') as any, lineHeight: 18, letterSpacing: -0.1 }}>
              Evergreen safety practices — not tied to any specific scan.
            </Text>
          </View>
        </GlassCard>

        {SECTIONS.map(s => <ChecklistSection key={s.id} section={s} />)}

        <GlassCard padding={16}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: PlatformColor('secondaryLabel') as any, marginBottom: 6, letterSpacing: -0.3 }}>Remember</Text>
          <Text style={{ fontSize: 13, color: PlatformColor('tertiaryLabel') as any, lineHeight: 19, letterSpacing: -0.1 }}>
            BYM provides AI-assisted guidance only. Trust your own intuition above all else.
          </Text>
        </GlassCard>
      </ScrollView>
    </>
  );
}
