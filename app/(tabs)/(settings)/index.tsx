import { GlassCard } from '@/components/common/GlassCard';
import { Colors } from '@/constants/colors';
import { spacing } from '@/constants/theme';
import { useRevenueCat } from '@/providers/revenuecat-provider';
import { clearHistory } from '@/utils/historyStorage';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React, { useEffect } from 'react';
import { Alert, Image, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

interface RowProps {
  sf: string;
  sfColor?: string;
  label: string;
  subtitle?: string;
  onPress?: () => void;
  danger?: boolean;
  badge?: string;
  badgeColor?: string;
}

function Row({ sf, sfColor = Colors.text.muted, label, subtitle, onPress, danger, badge, badgeColor }: RowProps) {
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
      {badge && (
        <View style={{ backgroundColor: badgeColor ? `${badgeColor}18` : 'rgba(255,255,255,0.08)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: badgeColor ?? Colors.text.muted }}>{badge}</Text>
        </View>
      )}
      {onPress && !danger && <SymbolView name="chevron.right" size={13} tintColor={Colors.text.muted} weight="semibold" />}
    </TouchableOpacity>
  );
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginLeft: 36 + spacing.md + spacing.md }} />;
}

export default function SettingsScreen() {
  const { isPro } = useRevenueCat();

  const logoPulse = useSharedValue(1);
  useEffect(() => {
    logoPulse.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 950 }),
        withTiming(1, { duration: 950 })
      ),
      -1,
      false
    );
  }, []);
  const logoAnimStyle = useAnimatedStyle(() => ({ transform: [{ scale: logoPulse.value }] }));

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
        <Image                                                                                                                                   
          source={require('@/assets/images/logo.png')}                                                                                           
          style={{                                                                                                                               
          height: 100,                                                                                                                         
          width: 100                                                                                                                           
          }}                                                                                                                                     
        /> 
          <Text style={{ fontSize: 20, fontWeight: '900', color: Colors.text.primary, letterSpacing: -0.8 }}>BYM</Text>
          <Text style={{ fontSize: 20, fontWeight: '800', color: Colors.text.primary, letterSpacing: -0.8 }}>BeforeYouMeet</Text>
          <Text style={{ fontSize: 14, color: Colors.text.secondary, letterSpacing: -0.2 }}>Know the risks before you meet.</Text>
          <View style={{ backgroundColor: 'rgba(255,255,255,0.06)', paddingHorizontal: spacing.md, paddingVertical: 5, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginTop: 4 }}>
            <Text style={{ fontSize: 12, color: Colors.text.disabled, fontWeight: '500' }}>Version 1.0.0</Text>
          </View>
        </View>

        {/* Pro upsell banner — free users only */}
        {!isPro && (
          <GlassCard padding={0} borderColor={`${Colors.teal.primary}40`}>
            <LinearGradient
              colors={[Colors.teal.dim, 'transparent']}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 20, borderCurve: 'continuous' }}
            />
            <View style={{ padding: spacing.lg, gap: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <Animated.View style={logoAnimStyle}>
                  <Image
                    source={require('@/assets/images/logo.png')}
                    style={{ width: 52, height: 52, borderRadius: 14, borderCurve: 'continuous' }}
                  />
                </Animated.View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.text.primary, letterSpacing: -0.5 }}>Unlock BYM Pro</Text>
                  <Text style={{ fontSize: 13, color: Colors.text.muted, marginTop: 2 }}>Unlimited scans. Total confidence.</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/(settings)/subscription')}
                activeOpacity={0.85}
                style={{ borderRadius: 999, overflow: 'hidden' }}
              >
                <LinearGradient
                  colors={[Colors.teal.primary, Colors.teal.light]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  <SymbolView name="crown.fill" size={16} tintColor={Colors.bg.primary} />
                  <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.bg.primary, letterSpacing: -0.3 }}>Go Premium</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </GlassCard>
        )}

        <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.text.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginLeft: 4 }}>Account</Text>
        <GlassCard padding={0} style={{ overflow: 'hidden' }}>
          <Row
            sf="crown.fill"
            sfColor={isPro ? Colors.teal.primary : Colors.warning}
            label="Subscription"
            subtitle={isPro ? 'BYM Pro is active' : 'Upgrade to unlock all features'}
            badge={isPro ? 'PRO' : 'FREE'}
            badgeColor={isPro ? Colors.teal.primary : Colors.text.muted}
            onPress={() => router.push('/(tabs)/(settings)/subscription')}
          />
        </GlassCard>

        <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.text.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginLeft: 4 }}>Privacy</Text>
        <GlassCard padding={0} style={{ overflow: 'hidden' }}>
          <Row sf="lock.fill" sfColor={Colors.teal.primary} label="How your data is stored" subtitle="Scans are saved locally on your device only — never uploaded." />
          <Divider />
          <Row sf="eye.slash.fill" sfColor={Colors.indigo} label="No profiles are reported" subtitle="BYM does not report, expose, or publish any person you scan." />
          <Divider />
          <Row sf="iphone" sfColor={Colors.teal.primary} label="On-device analysis" subtitle="All safety signals are generated locally. Screenshots stay on your phone." />
        </GlassCard>

        <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.text.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginLeft: 4 }}>Legal</Text>
        <GlassCard padding={0} style={{ overflow: 'hidden' }}>
          <Row sf="doc.text.fill" sfColor={Colors.text.secondary} label="Terms of Service" onPress={() => Linking.openURL('https://beforeyoumeet.vercel.app/terms.html')} />
          <Divider />
          <Row sf="shield.fill" sfColor={Colors.text.secondary} label="Privacy Policy" onPress={() => Linking.openURL('https://beforeyoumeet.vercel.app/privacy.html')} />
          <Divider />
          <Row sf="building.columns.fill" sfColor={Colors.text.secondary} label="Apple EULA" onPress={() => Linking.openURL('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/')} />
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

        <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.text.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginLeft: 4 }}>Your Data</Text>
        <GlassCard padding={0} style={{ overflow: 'hidden' }}>
          <Row sf="trash.fill" label="Delete all scan history" danger onPress={handleDeleteAll} />
        </GlassCard>
        
      </ScrollView>
    </>
  );
}
