import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '@/components/common/GlassCard';
import { Colors } from '@/constants/colors';
import { fontSize, fontWeight, spacing, radius } from '@/constants/theme';
import { clearHistory } from '@/utils/historyStorage';

type IoniconName = keyof typeof Ionicons.glyphMap;

interface SettingsRowProps {
  icon: IoniconName;
  iconColor?: string;
  label: string;
  subtitle?: string;
  onPress?: () => void;
  danger?: boolean;
  rightIcon?: boolean;
}

function SettingsRow({ icon, iconColor = Colors.text.muted, label, subtitle, onPress, danger, rightIcon = true }: SettingsRowProps) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.rowIcon, { backgroundColor: `${iconColor}18` }]}>
        <Ionicons name={icon} size={18} color={danger ? Colors.danger : iconColor} />
      </View>
      <View style={styles.rowContent}>
        <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>{label}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      {onPress && rightIcon && (
        <Ionicons name="chevron-forward" size={16} color={Colors.text.disabled} />
      )}
    </TouchableOpacity>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

export default function SettingsScreen() {
  function handleDeleteAllScans() {
    Alert.alert(
      'Delete All Scans',
      'This will permanently delete all scan history from this device. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: () => clearHistory(),
        },
      ]
    );
  }

  return (
    <LinearGradient colors={[Colors.bg.primary, Colors.bg.tertiary]} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* App identity */}
          <View style={styles.appBranding}>
            <View style={styles.appLogo}>
              <Ionicons name="shield-checkmark" size={36} color={Colors.teal.primary} />
            </View>
            <Text style={styles.appName}>BeforeYouMeet</Text>
            <Text style={styles.appTagline}>Know the risks before you meet.</Text>
            <View style={styles.versionBadge}>
              <Text style={styles.versionText}>Version 1.0.0 · MVP</Text>
            </View>
          </View>

          {/* Privacy */}
          <SectionHeader title="Privacy" />
          <GlassCard padding={0} style={styles.group}>
            <SettingsRow
              icon="lock-closed-outline"
              iconColor={Colors.teal.primary}
              label="How your data is stored"
              subtitle="Scans are saved locally on your device only — never uploaded to external servers."
              rightIcon={false}
            />
            <View style={styles.divider} />
            <SettingsRow
              icon="eye-off-outline"
              iconColor={Colors.indigo}
              label="No profiles are reported"
              subtitle="BYM does not report, expose, or publish any person you scan."
              rightIcon={false}
            />
            <View style={styles.divider} />
            <SettingsRow
              icon="phone-portrait-outline"
              iconColor={Colors.teal.primary}
              label="On-device analysis"
              subtitle="All safety signals are generated locally. Your screenshots stay on your phone."
              rightIcon={false}
            />
          </GlassCard>

          {/* Data */}
          <SectionHeader title="Your Data" />
          <GlassCard padding={0} style={styles.group}>
            <SettingsRow
              icon="trash-outline"
              iconColor={Colors.danger}
              label="Delete all scan history"
              danger
              onPress={handleDeleteAllScans}
            />
          </GlassCard>

          {/* Legal */}
          <SectionHeader title="Legal" />
          <GlassCard padding={0} style={styles.group}>
            <SettingsRow
              icon="document-text-outline"
              iconColor={Colors.text.muted}
              label="Terms of Service"
              onPress={() => {}}
            />
            <View style={styles.divider} />
            <SettingsRow
              icon="shield-outline"
              iconColor={Colors.text.muted}
              label="Privacy Policy"
              onPress={() => {}}
            />
          </GlassCard>

          {/* Disclaimer */}
          <GlassCard padding={16} style={styles.disclaimerCard}>
            <View style={styles.disclaimerRow}>
              <Ionicons name="information-circle-outline" size={18} color={Colors.text.muted} />
              <Text style={styles.disclaimerTitle}>Important disclaimer</Text>
            </View>
            <Text style={styles.disclaimerText}>
              BYM provides AI-assisted guidance only and cannot confirm whether a person is genuine or deceptive. Results are pattern-based signals, not definitive conclusions. Always use your own judgment and consult trusted people in your life.
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
  appBranding: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  appLogo: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.teal.muted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: `${Colors.teal.primary}30`,
  },
  appName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
    color: Colors.text.primary,
    letterSpacing: -0.8,
  },
  appTagline: {
    fontSize: fontSize.base,
    color: Colors.text.muted,
    letterSpacing: -0.2,
  },
  versionBadge: {
    backgroundColor: Colors.card.bg,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: Colors.card.border,
    marginTop: spacing.xs,
  },
  versionText: {
    fontSize: fontSize.xs,
    color: Colors.text.disabled,
    fontWeight: fontWeight.medium,
  },
  sectionHeader: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: Colors.text.muted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: spacing.sm,
    marginLeft: spacing.xs,
  },
  group: { overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowContent: { flex: 1 },
  rowLabel: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: Colors.text.primary,
    letterSpacing: -0.3,
  },
  rowLabelDanger: { color: Colors.danger },
  rowSubtitle: {
    fontSize: fontSize.xs,
    color: Colors.text.muted,
    marginTop: 3,
    lineHeight: 16,
    letterSpacing: -0.1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.separator,
    marginLeft: 52 + spacing.md,
  },
  disclaimerCard: { marginTop: spacing.sm },
  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  disclaimerTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: Colors.text.secondary,
    letterSpacing: -0.3,
  },
  disclaimerText: {
    fontSize: fontSize.sm,
    color: Colors.text.muted,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
});
