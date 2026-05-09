import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, PlatformColor } from 'react-native';
import { Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { GlassCard } from '@/components/common/GlassCard';
import { Colors } from '@/constants/colors';
import { spacing } from '@/constants/theme';
import { clearHistory } from '@/utils/historyStorage';

interface RowProps {
  sf: string;
  sfColor?: string;
  label: string;
  subtitle?: string;
  onPress?: () => void;
  danger?: boolean;
}

function Row({ sf, sfColor = Colors.text.muted, label, subtitle, onPress, danger }: RowProps) {
  return (
    <TouchableOpacity
      style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md }}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={{ width: 36, height: 36, borderRadius: 10, borderCurve: 'continuous', backgroundColor: `${danger ? Colors.danger : sfColor}18`, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <SymbolView name={sf as any} size={17} tintColor={danger ? Colors.danger : sfColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '500', color: danger ? Colors.danger : Colors.text.primary, letterSpacing: -0.3 }}>{label}</Text>
        {subtitle && <Text style={{ fontSize: 12, color: Colors.text.muted, marginTop: 3, lineHeight: 16, letterSpacing: -0.1 }}>{subtitle}</Text>}
      </View>
      {onPress && !danger && <SymbolView name="chevron.right" size={13} tintColor={Colors.text.muted} weight="semibold" />}
    </TouchableOpacity>
  );
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginLeft: 36 + spacing.md + spacing.md }} />;
}

export default function SettingsScreen() {
  function handleDeleteAll() {
    Alert.alert('Delete All Scans', 'This permanently deletes all scan history from this device.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete All', style: 'destructive', onPress: () => clearHistory() },
    ]);
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Settings' }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1, backgroundColor: Colors.bg.primary }}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* App Branding */}
        <View style={{ alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.sm }}>
          <View style={{ width: 80, height: 80, borderRadius: 22, borderCurve: 'continuous', backgroundColor: Colors.teal.muted, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm, borderWidth: 1, borderColor: `${Colors.teal.primary}30` }}>
            <SymbolView name="checkmark.shield.fill" size={36} tintColor={Colors.teal.primary} />
          </View>
          <Text style={{ fontSize: 20, fontWeight: '800', color: Colors.text.primary, letterSpacing: -0.8 }}>BeforeYouMeet</Text>
          <Text style={{ fontSize: 14, color: Colors.text.secondary, letterSpacing: -0.2 }}>Know the risks before you meet.</Text>
          <View style={{ backgroundColor: 'rgba(255,255,255,0.06)', paddingHorizontal: spacing.md, paddingVertical: 5, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginTop: 4 }}>
            <Text style={{ fontSize: 12, color: Colors.text.disabled, fontWeight: '500' }}>Version 1.0.0 · MVP</Text>
          </View>
        </View>

        <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.text.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginLeft: 4 }}>Privacy</Text>
        <GlassCard padding={0} style={{ overflow: 'hidden' }}>
          <Row sf="lock.fill" sfColor={Colors.teal.primary} label="How your data is stored" subtitle="Scans are saved locally on your device only — never uploaded." />
          <Divider />
          <Row sf="eye.slash.fill" sfColor={Colors.indigo} label="No profiles are reported" subtitle="BYM does not report, expose, or publish any person you scan." />
          <Divider />
          <Row sf="iphone" sfColor={Colors.teal.primary} label="On-device analysis" subtitle="All safety signals are generated locally. Screenshots stay on your phone." />
        </GlassCard>

        <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.text.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginLeft: 4 }}>Your Data</Text>
        <GlassCard padding={0} style={{ overflow: 'hidden' }}>
          <Row sf="trash.fill" label="Delete all scan history" danger onPress={handleDeleteAll} />
        </GlassCard>

        <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.text.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginLeft: 4 }}>Legal</Text>
        <GlassCard padding={0} style={{ overflow: 'hidden' }}>
          <Row sf="doc.text.fill" sfColor={Colors.text.secondary} label="Terms of Service" onPress={() => {}} />
          <Divider />
          <Row sf="shield.fill" sfColor={Colors.text.secondary} label="Privacy Policy" onPress={() => {}} />
        </GlassCard>

        <GlassCard padding={16}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
            <SymbolView name="info.circle" size={16} tintColor={Colors.text.disabled} />
            <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.text.secondary, letterSpacing: -0.3 }}>Important disclaimer</Text>
          </View>
          <Text style={{ fontSize: 13, color: Colors.text.muted, lineHeight: 19, letterSpacing: -0.1 }}>
            BYM provides AI-assisted guidance only and cannot confirm whether a person is genuine or deceptive. Results are pattern-based signals, not definitive conclusions.
          </Text>
        </GlassCard>
      </ScrollView>
    </>
  );
}
