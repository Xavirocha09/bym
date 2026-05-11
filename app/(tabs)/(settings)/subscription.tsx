import { GlassCard } from '@/components/common/GlassCard';
import { Colors } from '@/constants/colors';
import { BYM_PRO_PACKAGE_IDS } from '@/constants/revenuecat';
import { spacing } from '@/constants/theme';
import { useRevenueCat } from '@/providers/revenuecat-provider';
import { formatPackagePeriod } from '@/utils/revenuecat';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function SubscriptionScreen() {
  const {
    isPro,
    proEntitlement,
    isConfigured,
    isLoading,
    currentOffering,
    purchaseByPackageId,
    restorePurchases,
    presentCustomerCenter,
    presentPaywall,
  } = useRevenueCat();

  const weeklyPkg = currentOffering?.availablePackages.find(p => p.identifier === BYM_PRO_PACKAGE_IDS.weekly) ?? null;
  const yearlyPkg = currentOffering?.availablePackages.find(p => p.identifier === BYM_PRO_PACKAGE_IDS.yearly) ?? null;

  const expirationDate = proEntitlement?.expirationDate
    ? new Date(proEntitlement.expirationDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  const BENEFITS = [
    { sf: 'magnifyingglass.circle.fill', label: 'Unlimited profile + chat scans', color: Colors.teal.primary },
    { sf: 'chart.bar.fill', label: 'Detailed risk reports with next steps', color: Colors.indigo },
    { sf: 'checkmark.shield.fill', label: 'Safety lesson library + XP', color: Colors.warning },
    { sf: 'lock.shield.fill', label: 'Private, encrypted, never shared', color: Colors.success },
  ];

  return (
    <>
      <Stack.Screen options={{ title: 'Subscription' }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ flex: 1, backgroundColor: Colors.bg.primary }}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status card */}
        <GlassCard padding={0} borderColor={isPro ? `${Colors.teal.primary}40` : Colors.card.border}>
          {isPro && (
            <LinearGradient
              colors={[Colors.teal.dim, 'transparent']}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 20, borderCurve: 'continuous' }}
            />
          )}
          <View style={{ padding: spacing.lg, gap: spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <View style={{ width: 52, height: 52, borderRadius: 16, borderCurve: 'continuous', backgroundColor: isPro ? Colors.teal.muted : 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: isPro ? `${Colors.teal.primary}30` : Colors.card.border }}>
                <SymbolView name="crown.fill" size={26} tintColor={isPro ? Colors.teal.primary : Colors.warning} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 20, fontWeight: '800', color: Colors.text.primary, letterSpacing: -0.5 }}>BYM Pro</Text>
                <Text style={{ fontSize: 13, color: Colors.text.muted, marginTop: 2 }}>
                  {isPro ? 'Your subscription is active' : 'No active subscription'}
                </Text>
              </View>
              <View style={{ backgroundColor: isPro ? Colors.teal.muted : 'rgba(255,255,255,0.08)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: isPro ? Colors.teal.primary : Colors.text.muted }}>
                  {isPro ? 'ACTIVE' : 'FREE'}
                </Text>
              </View>
            </View>

            {isPro && expirationDate && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: 'rgba(255,255,255,0.05)', padding: spacing.md, borderRadius: 12, borderWidth: 1, borderColor: Colors.card.border }}>
                <SymbolView name="calendar" size={15} tintColor={Colors.text.muted} />
                <Text style={{ fontSize: 13, color: Colors.text.secondary, letterSpacing: -0.2 }}>
                  Renews on <Text style={{ fontWeight: '600', color: Colors.text.primary }}>{expirationDate}</Text>
                </Text>
              </View>
            )}
          </View>
        </GlassCard>

        {/* Active pro: manage button */}
        {isPro && (
          <TouchableOpacity
            onPress={() => void presentCustomerCenter()}
            disabled={!isConfigured}
            activeOpacity={0.85}
            style={{ borderRadius: 999, overflow: 'hidden', opacity: isConfigured ? 1 : 0.5 }}
          >
            <LinearGradient
              colors={[Colors.teal.primary, Colors.teal.light]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <SymbolView name="gearshape.fill" size={16} tintColor={Colors.bg.primary} />
              <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.bg.primary, letterSpacing: -0.3 }}>Manage Subscription</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Free: trial CTA + what's included + upgrade options */}
        {!isPro && (
          <>
            <TouchableOpacity
              onPress={() => void presentPaywall()}
              disabled={!isConfigured}
              activeOpacity={0.85}
              style={{ borderRadius: 999, overflow: 'hidden', opacity: isConfigured ? 1 : 0.5 }}
            >
              <LinearGradient
                colors={[Colors.teal.primary, Colors.teal.light]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <SymbolView name="crown.fill" size={18} tintColor={Colors.bg.primary} />
                <Text style={{ fontSize: 17, fontWeight: '800', color: Colors.bg.primary, letterSpacing: -0.4 }}>Start Free 3-Day Trial</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={{ gap: spacing.sm }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.text.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginLeft: 4 }}>What you get</Text>
              <GlassCard padding={0} style={{ overflow: 'hidden' }}>
                {BENEFITS.map((b, i) => (
                  <View key={i}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md }}>
                      <View style={{ width: 34, height: 34, borderRadius: 10, borderCurve: 'continuous', backgroundColor: `${b.color}15`, alignItems: 'center', justifyContent: 'center' }}>
                        <SymbolView name={b.sf as any} size={17} tintColor={b.color} />
                      </View>
                      <Text style={{ flex: 1, fontSize: 14, color: Colors.text.secondary, letterSpacing: -0.2 }}>{b.label}</Text>
                    </View>
                    {i < BENEFITS.length - 1 && (
                      <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginLeft: 34 + spacing.md * 2 }} />
                    )}
                  </View>
                ))}
              </GlassCard>
            </View>

            <View style={{ gap: spacing.sm }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.text.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginLeft: 4 }}>Choose a plan</Text>
              {[weeklyPkg, yearlyPkg].map((pkg) => {
                if (!pkg) return null;
                const isYearly = pkg.identifier === BYM_PRO_PACKAGE_IDS.yearly;
                return (
                  <GlassCard key={pkg.identifier} padding={spacing.lg} borderColor={isYearly ? `${Colors.teal.primary}40` : Colors.card.border}>
                    {isYearly && (
                      <View style={{ position: 'absolute', top: -1, right: spacing.lg, backgroundColor: Colors.teal.primary, paddingHorizontal: 10, paddingVertical: 4, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
                        <Text style={{ fontSize: 10, fontWeight: '800', color: Colors.bg.primary, letterSpacing: 0.5 }}>BEST VALUE</Text>
                      </View>
                    )}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
                      <View>
                        <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.text.primary, letterSpacing: -0.5 }}>
                          {formatPackagePeriod(pkg.identifier)}
                        </Text>
                        {pkg.product.pricePerMonthString && (
                          <Text style={{ fontSize: 12, color: Colors.text.muted, marginTop: 2 }}>
                            {pkg.product.pricePerMonthString} / month
                          </Text>
                        )}
                      </View>
                      <Text style={{ fontSize: 22, fontWeight: '800', color: Colors.text.primary, letterSpacing: -0.5 }}>
                        {pkg.product.priceString}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => void purchaseByPackageId(pkg.identifier === BYM_PRO_PACKAGE_IDS.weekly ? 'weekly' : 'yearly')}
                      disabled={!isConfigured || isLoading}
                      activeOpacity={0.85}
                      style={{ borderRadius: 999, overflow: 'hidden', opacity: isConfigured && !isLoading ? 1 : 0.5 }}
                    >
                      <LinearGradient
                        colors={[Colors.teal.primary, Colors.teal.light]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ height: 46, alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.bg.primary, letterSpacing: -0.2 }}>
                          Subscribe — {pkg.product.priceString}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </GlassCard>
                );
              })}
            </View>
          </>
        )}

        {/* Restore purchases — always visible */}
        <TouchableOpacity
          onPress={() => void restorePurchases()}
          disabled={!isConfigured}
          activeOpacity={0.7}
          style={{ alignItems: 'center', paddingVertical: spacing.sm, opacity: isConfigured ? 1 : 0.5 }}
        >
          <Text style={{ fontSize: 14, color: Colors.text.muted, fontWeight: '500' }}>Restore purchases</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 12, color: Colors.text.disabled, textAlign: 'center', lineHeight: 18, letterSpacing: -0.1 }}>
          Subscriptions auto-renew unless cancelled at least 24 hours before the end of the current period. Manage or cancel anytime in App Store settings.
        </Text>
      </ScrollView>
    </>
  );
}
