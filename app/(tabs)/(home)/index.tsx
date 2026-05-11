import { CautionBadge } from '@/components/common/CautionBadge';
import { GlassCard } from '@/components/common/GlassCard';
import { Colors } from '@/constants/colors';
import { spacing } from '@/constants/theme';
import { SAFETY_TIPS } from '@/data/mockResults';
import { useRevenueCat } from '@/providers/revenuecat-provider';
import { HistoryItem, ScanType } from '@/types';
import { getHistory } from '@/utils/historyStorage';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const SCAN_SYMBOLS: Record<ScanType, string> = {
  profile: 'person.circle.fill',
  chat: 'bubble.left.and.bubble.right.fill',
  full: 'magnifyingglass.circle.fill',
};

const SCAN_LABELS: Record<ScanType, string> = {
  profile: 'Profile Scan',
  chat: 'Chat Scan',
  full: 'Full Scan',
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const [recentScan, setRecentScan] = useState<HistoryItem | null>(null);
  const [tipIndex] = useState(() => Math.floor(Math.random() * SAFETY_TIPS.length));
  const { isPro, proEntitlement, isConfigured, presentPaywall, presentCustomerCenter } = useRevenueCat();

  useEffect(() => {
    getHistory().then((h) => setRecentScan(h[0] ?? null));
  }, []);

  async function handleScanPress() {
    if (isPro) {
      router.push('/scan/type');
      return;
    }
    const history = await getHistory();
    if (history.length >= 1) {
      await presentPaywall();
      // After paywall closes the user either subscribed or dismissed.
      // isPro will update via the RevenueCat listener — let them tap again.
      return;
    }
    router.push('/scan/type');
  }

  return (
    <>
      <Stack.Screen options={{ title: 'BeforeYouMeet' }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1, backgroundColor: Colors.bg.primary }}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <Animated.View entering={FadeInDown.delay(0).duration(500)} style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 15, color: Colors.text.secondary, marginBottom: 2 }}>
              {getGreeting()}
            </Text>
            <Text style={{ fontSize: 13, color: Colors.text.muted }}>
              Know the risks before you meet.
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/onboarding')}
            style={{ backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.3)', letterSpacing: 0.5 }}>DEV_</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Hero Card */}
        <Animated.View entering={FadeInDown.delay(60).duration(500)}>
          <GlassCard padding={0} borderColor={`${Colors.teal.primary}30`}>
            <LinearGradient
              colors={[Colors.teal.dim, 'transparent']}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 20, borderCurve: 'continuous' }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={{ padding: spacing.lg }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
                {/* <View style={{ width: 52, height: 52, borderRadius: 16, borderCurve: 'continuous', backgroundColor: Colors.teal.muted, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: `${Colors.teal.primary}30` }}>
                  <SymbolView name="checkmark.shield.fill" size={26} tintColor={Colors.teal.primary} />
                </View> */}
                <Image                                                                                                                                   
                  source={require('@/assets/images/logo.png')}                                                                                           
                  style={{                                                                                                                               
                  height: 52,                                                                                                                         
                  width: 52                                                                                                                           
                  }}                                                                                                                                     
                />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.07)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, borderWidth: 1, borderColor: Colors.card.border }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.teal.primary }} />
                  <Text style={{ fontSize: 12, color: Colors.text.secondary, fontWeight: '500' }}>AI-Assisted Safety</Text>
                </View>
              </View>

              <Text style={{ fontSize: 28, fontWeight: '800', color: Colors.text.primary, letterSpacing: -0.8, marginBottom: 6 }}>
                Before you meet
              </Text>
              <Text style={{ fontSize: 15, color: Colors.text.secondary, lineHeight: 22, letterSpacing: -0.2, marginBottom: spacing.lg }}>
                Run a private safety scan on a dating profile or chat screenshots.
              </Text>

              <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                <TouchableOpacity
                  style={{ flex: 1, borderRadius: 999, overflow: 'hidden' }}
                  onPress={() => void handleScanPress()}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={[Colors.teal.primary, Colors.teal.light]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 46, paddingHorizontal: spacing.md }}
                  >
                    <SymbolView name="person.circle.fill" size={18} tintColor={Colors.bg.primary} />
                    <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.bg.primary, letterSpacing: -0.2 }}>Scan Profile</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 46, paddingHorizontal: spacing.md, backgroundColor: Colors.teal.muted, borderRadius: 999, borderWidth: 1, borderColor: `${Colors.teal.primary}35` }}
                  onPress={() => void handleScanPress()}
                  activeOpacity={0.85}
                >
                  <SymbolView name="bubble.left.and.bubble.right.fill" size={16} tintColor={Colors.teal.primary} />
                  <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.teal.primary, letterSpacing: -0.2 }}>Scan Chat</Text>
                </TouchableOpacity>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        {!isPro &&
          <Animated.View entering={FadeInDown.delay(90).duration(500)}>
            <GlassCard padding={0} borderColor={isPro ? `${Colors.teal.primary}45` : Colors.card.borderLight}>
              <View style={{ padding: spacing.lg, gap: spacing.md }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                    <View style={{ width: 46, height: 46, borderRadius: 14, borderCurve: 'continuous', backgroundColor: isPro ? Colors.teal.muted : 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' }}>
                      <SymbolView name="crown.fill" size={22} tintColor={isPro ? Colors.teal.primary : Colors.warning} />
                    </View>
                    <View>
                      <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.text.primary, letterSpacing: -0.4 }}>BYM Pro</Text>
                      <View style={{ backgroundColor: isPro ? Colors.teal.muted : Colors.warningMuted, position:'absolute', right: 0, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 }}>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: isPro ? Colors.teal.primary : Colors.warning }}>
                          {isPro ? 'ACTIVE' : 'UPGRADE'}
                        </Text>
                      </View>
                      <Text style={{ fontSize: 12, color: Colors.text.muted, marginTop: 2 }}>
                        {isPro ? 'Entitlement active' : 'Unlock premium subscription access'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                  <TouchableOpacity
                    style={{ flex: 1, borderRadius: 999, overflow: 'hidden' }}
                    onPress={() => {
                      if (isPro) {
                        void presentCustomerCenter();
                        return;
                      }

                      void presentPaywall();
                    }}
                    activeOpacity={0.85}
                    disabled={!isConfigured}
                  >
                    <LinearGradient
                      colors={[Colors.teal.primary, Colors.teal.light]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ alignItems: 'center', justifyContent: 'center', height: 44, opacity: isConfigured ? 1 : 0.5 }}
                    >
                      <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.bg.primary, letterSpacing: -0.2 }}>
                        {isPro ? 'Manage plan' : 'Upgrade now'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </GlassCard>
          </Animated.View>
        }

        {/* Safety Tip */}
        <Animated.View entering={FadeInDown.delay(120).duration(500)}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.text.secondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.sm }}>Safety Tip</Text>
          <GlassCard padding={14}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, borderCurve: 'continuous', backgroundColor: Colors.warningMuted, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <SymbolView name="lightbulb.fill" size={18} tintColor={Colors.warning} />
              </View>
              <Text style={{ flex: 1, fontSize: 14, color: Colors.text.secondary, lineHeight: 20, letterSpacing: -0.1 }}>
                {SAFETY_TIPS[tipIndex]}
              </Text>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Recent Scan */}
        {recentScan && (
          <Animated.View entering={FadeInDown.delay(180).duration(500)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.text.secondary, textTransform: 'uppercase', letterSpacing: 0.5 }}>Recent Scan</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/(history)')}>
                <Text style={{ fontSize: 14, color: Colors.teal.primary, fontWeight: '500' }}>See all</Text>
              </TouchableOpacity>
            </View>
            <GlassCard padding={16}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                  <View style={{ width: 42, height: 42, borderRadius: 12, borderCurve: 'continuous', backgroundColor: Colors.teal.muted, alignItems: 'center', justifyContent: 'center' }}>
                    <SymbolView name={SCAN_SYMBOLS[recentScan.scanType] as any} size={22} tintColor={Colors.teal.primary} />
                  </View>
                  <View>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.text.primary, letterSpacing: -0.3, marginBottom: 2 }}>
                      {SCAN_LABELS[recentScan.scanType]}
                    </Text>
                    <Text style={{ fontSize: 12, color: Colors.text.muted }}>
                      {new Date(recentScan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                  </View>
                </View>
                <CautionBadge level={recentScan.cautionLevel} size="sm" />
              </View>
            </GlassCard>
          </Animated.View>
        )}

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(240).duration(500)}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.text.secondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.sm }}>Quick Actions</Text>
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => router.push('/(tabs)/(safety)')} activeOpacity={0.85}>
              <GlassCard padding={16}>
                <View style={{ width: 42, height: 42, borderRadius: 12, borderCurve: 'continuous', backgroundColor: Colors.teal.muted, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md }}>
                  <SymbolView name="checkmark.shield.fill" size={22} tintColor={Colors.teal.primary} />
                </View>
                <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.text.primary, letterSpacing: -0.3, lineHeight: 20 }}>Safety{'\n'}Guide</Text>
              </GlassCard>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => router.push('/(tabs)/(history)')} activeOpacity={0.85}>
              <GlassCard padding={16}>
                <View style={{ width: 42, height: 42, borderRadius: 12, borderCurve: 'continuous', backgroundColor: Colors.indigoMuted, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md }}>
                  <SymbolView name="clock.fill" size={22} tintColor={Colors.indigo} />
                </View>
                <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.text.primary, letterSpacing: -0.3, lineHeight: 20 }}>Scan{'\n'}History</Text>
              </GlassCard>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </>
  );
}
