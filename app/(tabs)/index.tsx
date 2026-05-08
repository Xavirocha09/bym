import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassCard } from '@/components/common/GlassCard';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { CautionBadge } from '@/components/common/CautionBadge';
import { Colors } from '@/constants/colors';
import { fontSize, fontWeight, spacing, radius } from '@/constants/theme';
import { getHistory } from '@/utils/historyStorage';
import { HistoryItem } from '@/types';
import { SAFETY_TIPS } from '@/data/mockResults';

const { width } = Dimensions.get('window');

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const [recentScan, setRecentScan] = useState<HistoryItem | null>(null);
  const [tipIndex] = useState(() => Math.floor(Math.random() * SAFETY_TIPS.length));

  useEffect(() => {
    getHistory().then((h) => setRecentScan(h[0] ?? null));
  }, []);

  function startScan() {
    router.push('/scan/type');
  }

  return (
    <LinearGradient colors={[Colors.bg.primary, Colors.bg.tertiary]} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View entering={FadeInDown.delay(0).duration(500)} style={styles.header}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.appName}>BeforeYouMeet</Text>
            </View>
            <TouchableOpacity
              style={styles.headerIcon}
              onPress={() => router.push('/(tabs)/settings')}
              activeOpacity={0.7}
            >
              <Ionicons name="settings-outline" size={22} color={Colors.text.muted} />
            </TouchableOpacity>
          </Animated.View>

          {/* Hero Card */}
          <Animated.View entering={FadeInDown.delay(80).duration(500)}>
            <GlassCard style={styles.heroCard} padding={0}>
              <LinearGradient
                colors={[Colors.teal.dim, 'transparent']}
                style={styles.heroGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={styles.heroPadding}>
                <View style={styles.heroShieldRow}>
                  <View style={styles.heroShield}>
                    <Ionicons name="shield-checkmark" size={28} color={Colors.teal.primary} />
                  </View>
                  <View style={styles.heroBadge}>
                    <View style={styles.heroBadgeDot} />
                    <Text style={styles.heroBadgeText}>AI-Assisted Safety</Text>
                  </View>
                </View>
                <Text style={styles.heroTitle}>Before you meet</Text>
                <Text style={styles.heroSubtitle}>
                  Run a private safety scan on a dating profile or chat screenshots.
                </Text>
                <View style={styles.scanButtons}>
                  <TouchableOpacity
                    style={styles.scanBtn}
                    onPress={() => {
                      router.push('/scan/type');
                    }}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={[Colors.teal.primary, Colors.teal.light]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.scanBtnGradient}
                    >
                      <Ionicons name="person-circle-outline" size={20} color={Colors.bg.primary} />
                      <Text style={styles.scanBtnText}>Scan Profile</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.scanBtn, styles.scanBtnSecondary]}
                    onPress={() => {
                      router.push('/scan/type');
                    }}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="chatbubbles-outline" size={20} color={Colors.teal.primary} />
                    <Text style={[styles.scanBtnText, styles.scanBtnTextSecondary]}>Scan Chat</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </GlassCard>
          </Animated.View>

          {/* Safety Tip */}
          <Animated.View entering={FadeInDown.delay(160).duration(500)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Safety Tip</Text>
            </View>
            <GlassCard padding={16}>
              <View style={styles.tipRow}>
                <View style={styles.tipIcon}>
                  <Ionicons name="bulb" size={20} color={Colors.warning} />
                </View>
                <Text style={styles.tipText}>{SAFETY_TIPS[tipIndex]}</Text>
              </View>
            </GlassCard>
          </Animated.View>

          {/* Recent Scan */}
          {recentScan && (
            <Animated.View entering={FadeInDown.delay(240).duration(500)}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionLabel}>Recent Scan</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
                  <Text style={styles.seeAll}>See all</Text>
                </TouchableOpacity>
              </View>
              <GlassCard padding={16}>
                <View style={styles.recentRow}>
                  <View style={styles.recentLeft}>
                    <View style={styles.recentIcon}>
                      <Ionicons
                        name={
                          recentScan.scanType === 'profile'
                            ? 'person-circle'
                            : recentScan.scanType === 'chat'
                            ? 'chatbubbles'
                            : 'search-circle'
                        }
                        size={22}
                        color={Colors.teal.primary}
                      />
                    </View>
                    <View>
                      <Text style={styles.recentType}>
                        {recentScan.scanType.charAt(0).toUpperCase() + recentScan.scanType.slice(1)} Scan
                      </Text>
                      <Text style={styles.recentDate}>
                        {new Date(recentScan.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Text>
                    </View>
                  </View>
                  <CautionBadge level={recentScan.cautionLevel} size="sm" />
                </View>
              </GlassCard>
            </Animated.View>
          )}

          {/* Quick Actions */}
          <Animated.View entering={FadeInDown.delay(320).duration(500)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Quick Actions</Text>
            </View>
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={styles.quickCard}
                onPress={() => router.push('/(tabs)/safety')}
                activeOpacity={0.85}
              >
                <GlassCard style={{ flex: 1 }} padding={16}>
                  <View style={[styles.quickIcon, { backgroundColor: Colors.teal.muted }]}>
                    <Ionicons name="shield-checkmark" size={22} color={Colors.teal.primary} />
                  </View>
                  <Text style={styles.quickTitle}>Safety{'\n'}Guide</Text>
                </GlassCard>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickCard}
                onPress={() => router.push('/(tabs)/history')}
                activeOpacity={0.85}
              >
                <GlassCard style={{ flex: 1 }} padding={16}>
                  <View style={[styles.quickIcon, { backgroundColor: Colors.indigoMuted }]}>
                    <Ionicons name="time" size={22} color={Colors.indigo} />
                  </View>
                  <Text style={styles.quickTitle}>Scan{'\n'}History</Text>
                </GlassCard>
              </TouchableOpacity>
            </View>
          </Animated.View>

          <View style={styles.bottomSpacer} />
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
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  greeting: {
    fontSize: fontSize.sm,
    color: Colors.text.muted,
    fontWeight: fontWeight.medium,
    letterSpacing: -0.1,
  },
  appName: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.heavy,
    color: Colors.text.primary,
    letterSpacing: -1,
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.card.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  heroCard: { overflow: 'hidden' },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  heroPadding: {
    padding: spacing.lg,
    zIndex: 1,
  },
  heroShieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  heroShield: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: Colors.teal.muted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: `${Colors.teal.primary}30`,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.card.elevated,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  heroBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.teal.primary,
  },
  heroBadgeText: {
    fontSize: fontSize.xs,
    color: Colors.text.muted,
    fontWeight: fontWeight.medium,
    letterSpacing: -0.1,
  },
  heroTitle: {
    fontSize: fontSize.xxl + 2,
    fontWeight: fontWeight.heavy,
    color: Colors.text.primary,
    letterSpacing: -1,
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    fontSize: fontSize.base,
    color: Colors.text.muted,
    lineHeight: 22,
    letterSpacing: -0.2,
    marginBottom: spacing.lg,
  },
  scanButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  scanBtn: {
    flex: 1,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  scanBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 46,
    paddingHorizontal: spacing.md,
  },
  scanBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 46,
    paddingHorizontal: spacing.md,
    backgroundColor: Colors.teal.muted,
    borderWidth: 1,
    borderColor: `${Colors.teal.primary}35`,
  },
  scanBtnText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: Colors.bg.primary,
    letterSpacing: -0.2,
  },
  scanBtnTextSecondary: {
    color: Colors.teal.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  sectionLabel: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: Colors.text.secondary,
    letterSpacing: -0.3,
  },
  seeAll: {
    fontSize: fontSize.sm,
    color: Colors.teal.primary,
    fontWeight: fontWeight.medium,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  tipIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: Colors.warningMuted,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  tipText: {
    flex: 1,
    fontSize: fontSize.base,
    color: Colors.text.secondary,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  recentIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: Colors.teal.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentType: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: Colors.text.primary,
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  recentDate: {
    fontSize: fontSize.sm,
    color: Colors.text.muted,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quickCard: {
    flex: 1,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  quickTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: Colors.text.primary,
    letterSpacing: -0.3,
    lineHeight: 20,
  },
  bottomSpacer: { height: 32 },
});
