import { Colors } from '@/constants/colors';
import { radius, spacing } from '@/constants/theme';
import { useRevenueCat } from '@/providers/revenuecat-provider';
import { setOnboardingComplete } from '@/utils/historyStorage';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as StoreReview from 'expo-store-review';
import { SymbolView } from 'expo-symbols';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  Easing,
  Extrapolation,
  FadeIn,
  FadeInDown,
  FadeInRight,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';

// ─── Demo Scan Constants ──────────────────────────────────────────────────────

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_W = SCREEN_WIDTH - spacing.lg * 2;
const CARD_H = CARD_W * 1.32;
const SWIPE_THRESHOLD = 80;

const DEMO_PROFILES = [
  { id: 1,  source: require('@/assets/profiles/profile-1.jpg') },
  { id: 2,  source: require('@/assets/profiles/profile-2.jpeg') },
  { id: 3,  source: require('@/assets/profiles/profile-3.jpg')  },
  { id: 4,  source: require('@/assets/profiles/profile-4.jpg')  },
  { id: 5,  source: require('@/assets/profiles/profile-5.jpg')  },
  { id: 6,  source: require('@/assets/profiles/profile-6.jpg')  },
  { id: 7,  source: require('@/assets/profiles/profile-7.jpg')  },
  { id: 8,  source: require('@/assets/profiles/profile-8.jpg')  },
  { id: 9,  source: require('@/assets/profiles/profile-9.jpg')  },
  { id: 10, source: require('@/assets/profiles/profile-10.jpg') },
  { id: 11, source: require('@/assets/profiles/profile-11.jpeg') },
  { id: 12, source: require('@/assets/profiles/profile12.jpg') },
];

type DemoProfile = typeof DEMO_PROFILES[0];

// ─── Types ────────────────────────────────────────────────────────────────────

type PlatformChoice = 'apps' | 'social' | 'both';
type PastExp = 'rough' | 'minor' | 'none';
type LoveBombingExp = 'experienced' | 'heard' | 'new';

interface OState {
  name: string;
  ageBracket: string | null;
  platform: PlatformChoice | null;
  frequency: string | null;
  pastExp: PastExp | null;
  loveBombing: LoveBombingExp | null;
  topWorry: string | null;
  instinctRating: number | null;
  demoScanDone: boolean;
  demoSelectedId: number | null;
  starRating: number;
}

interface SP {
  s: OState;
  upd: (p: Partial<OState>) => void;
  onNext: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Pill({
  label, sub, sf, selected, color, onPress,
}: {
  label: string; sub?: string; sf?: string; selected: boolean; color: string; onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: spacing.md,
        paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
        backgroundColor: selected ? `${color}15` : 'rgba(255,255,255,0.05)',
        borderWidth: 1.5, borderColor: selected ? `${color}55` : Colors.card.border,
        borderRadius: radius.xl,
      }}>
        {sf && (
          <View style={{ width: 40, height: 40, borderRadius: 12, borderCurve: 'continuous', backgroundColor: `${color}18`, alignItems: 'center', justifyContent: 'center' }}>
            <SymbolView name={sf as any} size={20} tintColor={color} />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: selected ? Colors.text.primary : Colors.text.secondary, letterSpacing: -0.3 }}>{label}</Text>
          {sub && <Text style={{ fontSize: 13, color: Colors.text.muted, marginTop: 2 }}>{sub}</Text>}
        </View>
        {selected && <SymbolView name="checkmark.circle.fill" size={22} tintColor={color} />}
      </View>
    </TouchableOpacity>
  );
}

function Q({ text }: { text: string }) {
  return (
    <Text style={{ fontSize: 30, fontWeight: '800', color: Colors.text.primary, textAlign: 'center', letterSpacing: -0.9, lineHeight: 38, marginBottom: spacing.xl }}>
      {text}
    </Text>
  );
}

// ─── Screen 0: Welcome ────────────────────────────────────────────────────────

function WelcomeScreen() {
  const flameColors = {
    outer: '#14939C',
    inner: '#26BFC6',
    emberPrimary: '#72E9EE',
    emberSecondary: '#D9FEFF',
    shadow: '#7DECEF',
  } as const;

  const flameDrift = useSharedValue(0);
  const flamePulse = useSharedValue(0);
  const emberRise = useSharedValue(0);

  useEffect(() => {
    flameDrift.value = withDelay(
      250,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
          withTiming(-1, { duration: 1800, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    );

    flamePulse.value = withDelay(
      250,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 1100, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        false
      )
    );

    emberRise.value = withDelay(
      350,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 2100, easing: Easing.out(Easing.cubic) }),
          withTiming(0, { duration: 0 })
        ),
        -1,
        false
      )
    );

    return () => {
      cancelAnimation(flameDrift);
      cancelAnimation(flamePulse);
      cancelAnimation(emberRise);
    };
  }, [emberRise, flameDrift, flamePulse]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(flameDrift.value, [-1, 1], [2, -6], Extrapolation.CLAMP) },
      { rotate: `${interpolate(flameDrift.value, [-1, 1], [-1.2, 1.2], Extrapolation.CLAMP)}deg` },
      { scale: interpolate(flamePulse.value, [0, 1], [1, 1.035], Extrapolation.CLAMP) },
    ],
  }));

  const outerGlowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(flamePulse.value, [0, 1], [0.2, 0.42], Extrapolation.CLAMP),
    transform: [
      { translateY: interpolate(flameDrift.value, [-1, 1], [10, -2], Extrapolation.CLAMP) },
      { scaleX: interpolate(flamePulse.value, [0, 1], [0.88, 1.1], Extrapolation.CLAMP) },
      { scaleY: interpolate(flamePulse.value, [0, 1], [0.82, 1.18], Extrapolation.CLAMP) },
    ],
  }));

  const innerGlowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(flamePulse.value, [0, 1], [0.18, 0.36], Extrapolation.CLAMP),
    transform: [
      { translateY: interpolate(flamePulse.value, [0, 1], [6, -8], Extrapolation.CLAMP) },
      { scaleX: interpolate(flamePulse.value, [0, 1], [0.9, 1.06], Extrapolation.CLAMP) },
      { scaleY: interpolate(flamePulse.value, [0, 1], [0.78, 1.16], Extrapolation.CLAMP) },
    ],
  }));

  const emberPrimaryStyle = useAnimatedStyle(() => ({
    opacity: interpolate(emberRise.value, [0, 0.18, 0.72, 1], [0, 0.7, 0.28, 0], Extrapolation.CLAMP),
    transform: [
      { translateY: interpolate(emberRise.value, [0, 1], [22, -30], Extrapolation.CLAMP) },
      { translateX: interpolate(flameDrift.value, [-1, 1], [-7, 9], Extrapolation.CLAMP) },
      { scale: interpolate(emberRise.value, [0, 1], [0.7, 1.05], Extrapolation.CLAMP) },
    ],
  }));

  const emberSecondaryStyle = useAnimatedStyle(() => ({
    opacity: interpolate(emberRise.value, [0, 0.1, 0.58, 1], [0, 0.48, 0.22, 0], Extrapolation.CLAMP),
    transform: [
      { translateY: interpolate(emberRise.value, [0, 1], [18, -42], Extrapolation.CLAMP) },
      { translateX: interpolate(flameDrift.value, [-1, 1], [10, -12], Extrapolation.CLAMP) },
      { scale: interpolate(emberRise.value, [0, 1], [0.55, 0.95], Extrapolation.CLAMP) },
    ],
  }));

  return (
    <Animated.View entering={FadeIn.duration(600)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl }}>
      <Animated.View entering={FadeInDown.delay(100).duration(600)} style={{ marginBottom: 40 }}>
        <View style={{ width: 180, height: 180, alignItems: 'center', justifyContent: 'center' }}>
          <Animated.View
            pointerEvents="none"
            style={[
              {
                position: 'absolute',
                bottom: 18,
                width: 124,
                height: 124,
                borderRadius: 999,
                backgroundColor: flameColors.outer,
              },
              outerGlowStyle,
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              {
                position: 'absolute',
                bottom: 34,
                width: 92,
                height: 108,
                borderRadius: 999,
                backgroundColor: flameColors.inner,
              },
              innerGlowStyle,
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              {
                position: 'absolute',
                bottom: 88,
                width: 14,
                height: 14,
                borderRadius: 999,
                backgroundColor: flameColors.emberPrimary,
              },
              emberPrimaryStyle,
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              {
                position: 'absolute',
                bottom: 78,
                width: 9,
                height: 9,
                borderRadius: 999,
                backgroundColor: flameColors.emberSecondary,
              },
              emberSecondaryStyle,
            ]}
          />
          <Animated.View style={logoAnimatedStyle}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={{
                height: 130,
                width: 130,
                borderRadius: 40,
                shadowColor: flameColors.shadow,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 3,
              }}
            />
          </Animated.View>
        </View>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(250).duration(600)} style={{ alignItems: 'center', gap: spacing.md }}>
        <Text style={{ fontSize: 42, fontWeight: '800', color: Colors.text.primary, textAlign: 'center', letterSpacing: -1.5, lineHeight: 50 }}>
          Before{'\n'}You Meet.
        </Text>
        <Text style={{ fontSize: 18, color: Colors.text.muted, textAlign: 'center', lineHeight: 26, letterSpacing: -0.2 }}>
          Your private AI safety companion for online dating.
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

// ─── Screen 1: Name ───────────────────────────────────────────────────────────

function NameScreen({ s, upd }: SP) {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <Animated.View entering={FadeIn.duration(400).easing(Easing.out(Easing.quad))} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl }}>
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={{ alignItems: 'center', marginBottom: spacing.xl + spacing.lg }}>
          <Q text="What's your name?" />
          <Text style={{ fontSize: 16, color: Colors.text.muted, textAlign: 'center', marginTop: -spacing.md }}>
            We'll make your experience personal.
          </Text>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(220).duration(500)} style={{ width: '100%' }}>
          <TextInput
            value={s.name}
            onChangeText={(t) => upd({ name: t })}
            placeholder="Enter your name"
            placeholderTextColor={Colors.text.disabled}
            autoFocus
            returnKeyType="done"
            style={{
              fontSize: 22, fontWeight: '700', color: Colors.text.primary,
              textAlign: 'center', paddingVertical: spacing.lg,
              borderBottomWidth: 2, borderBottomColor: s.name.trim().length > 0 ? Colors.teal.primary : Colors.card.border,
            }}
          />
        </Animated.View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

// ─── Screen 2: Warm Greeting ──────────────────────────────────────────────────

function GreetingScreen({ s }: SP) {
  return (
    <Animated.View entering={FadeIn.duration(400).easing(Easing.out(Easing.quad))} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl }}>
      <Animated.View entering={FadeInDown.delay(100).duration(600)} style={{ marginBottom: 36 }}>
        <View style={{ width: 110, height: 110, borderRadius: 55, backgroundColor: Colors.teal.muted, borderWidth: 1, borderColor: `${Colors.teal.primary}35`, alignItems: 'center', justifyContent: 'center' }}>
          <SymbolView name="hand.wave.fill" size={50} tintColor={Colors.teal.primary} />
        </View>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(250).duration(600)} style={{ alignItems: 'center', gap: spacing.md }}>
        <Text style={{ fontSize: 38, fontWeight: '800', color: Colors.text.primary, textAlign: 'center', letterSpacing: -1.2, lineHeight: 46 }}>
          Nice to meet you,{'\n'}
          <Text style={{ color: Colors.teal.primary }}>{s.name}.</Text>
        </Text>
        <Text style={{ fontSize: 17, color: Colors.text.muted, textAlign: 'center', lineHeight: 26, letterSpacing: -0.2, maxWidth: 300 }}>
          I'm going to ask you a few questions to make BYM completely yours.
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

// ─── Screen 3: Problem Hook ───────────────────────────────────────────────────

function ProblemScreen({ s, upd }: SP) {
  return (
    <Animated.View entering={FadeIn.duration(400).easing(Easing.out(Easing.quad))} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg }}>
      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={{ width: '100%', alignItems: 'center', marginBottom: spacing.xl }}>
        <Q text={`${s.name}, have you ever felt something was off about someone you met online?`} />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(220).duration(500)} style={{ width: '100%', gap: spacing.sm }}>
        {[
          { val: true, label: 'Honestly, yes', sub: 'Something felt wrong but I couldn\'t prove it', sf: 'exclamationmark.triangle.fill', color: Colors.warning },
          { val: false, label: 'Not really, no', sub: 'I\'ve been pretty lucky so far', sf: 'checkmark.circle.fill', color: Colors.teal.primary },
        ].map((opt) => (
          <Pill
            key={String(opt.val)}
            label={opt.label} sub={opt.sub} sf={opt.sf} color={opt.color}
            selected={s.pastExp !== null ? (opt.val === true ? ['rough', 'minor'].includes(s.pastExp) : s.pastExp === 'none') : false}
            onPress={() => {
              Haptics.selectionAsync();
              upd({ pastExp: opt.val ? 'minor' : 'none' });
            }}
          />
        ))}
      </Animated.View>
    </Animated.View>
  );
}

// ─── Screen 4: Age ────────────────────────────────────────────────────────────

function AgeScreen({ s, upd }: SP) {
  const AGES = ['18–24', '25–34', '35–44', '45+'];
  return (
    <Animated.View entering={FadeIn.duration(400).easing(Easing.out(Easing.quad))} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg }}>
      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={{ width: '100%', alignItems: 'center', marginBottom: spacing.xl }}>
        <Q text={`How old are you, ${s.name}?`} />
        <Text style={{ fontSize: 15, color: Colors.text.muted, marginTop: -spacing.md }}>We'll tailor your risk profile to your age group.</Text>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(220).duration(500)} style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {AGES.map((age) => (
          <TouchableOpacity
            key={age}
            onPress={() => { Haptics.selectionAsync(); upd({ ageBracket: age }); }}
            activeOpacity={0.8}
            style={{ width: '48%' }}
          >
            <View style={{
              paddingVertical: spacing.lg + 4, alignItems: 'center', justifyContent: 'center',
              backgroundColor: s.ageBracket === age ? Colors.teal.muted : 'rgba(255,255,255,0.05)',
              borderWidth: 1.5, borderColor: s.ageBracket === age ? `${Colors.teal.primary}55` : Colors.card.border,
              borderRadius: radius.xl,
            }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: s.ageBracket === age ? Colors.teal.primary : Colors.text.secondary, letterSpacing: -0.5 }}>{age}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </Animated.View>
  );
}

// ─── Screen 5: Platform ───────────────────────────────────────────────────────

function PlatformScreen({ s, upd }: SP) {
  const OPTS: { id: PlatformChoice; label: string; sub: string; sf: string; color: string }[] = [
    { id: 'apps', label: 'Dating apps', sub: 'Tinder, Bumble, Hinge, etc.', sf: 'heart.circle.fill', color: Colors.danger },
    { id: 'social', label: 'Social media', sub: 'Instagram, Snapchat, DMs...', sf: 'bubble.left.and.bubble.right.fill', color: Colors.indigo },
    { id: 'both', label: 'Both', sub: 'I use all of them', sf: 'iphone.and.arrow.right.inward', color: Colors.teal.primary },
  ];
  return (
    <Animated.View entering={FadeIn.duration(400).easing(Easing.out(Easing.quad))} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg }}>
      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={{ width: '100%', alignItems: 'center', marginBottom: spacing.xl }}>
        <Q text="Where do you mostly meet people online?" />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(220).duration(500)} style={{ width: '100%', gap: spacing.sm }}>
        {OPTS.map((opt) => (
          <Pill key={opt.id} label={opt.label} sub={opt.sub} sf={opt.sf} color={opt.color}
            selected={s.platform === opt.id}
            onPress={() => { Haptics.selectionAsync(); upd({ platform: opt.id }); }}
          />
        ))}
      </Animated.View>
    </Animated.View>
  );
}

// ─── Screen 6: Frequency ─────────────────────────────────────────────────────

function FrequencyScreen({ s, upd }: SP) {
  const OPTS = [
    { val: 'daily', label: 'Every day', sub: 'I\'m always chatting with someone new', sf: 'flame.fill', color: Colors.danger },
    { val: 'weekly', label: 'A few times a week', sub: 'I check in regularly', sf: 'calendar', color: Colors.warning },
    { val: 'occasional', label: 'Occasionally', sub: 'When I feel like it', sf: 'leaf.fill', color: Colors.teal.primary },
  ];
  return (
    <Animated.View entering={FadeIn.duration(400).easing(Easing.out(Easing.quad))} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg }}>
      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={{ width: '100%', alignItems: 'center', marginBottom: spacing.xl }}>
        <Q text="How often do you talk to new people online?" />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(220).duration(500)} style={{ width: '100%', gap: spacing.sm }}>
        {OPTS.map((opt) => (
          <Pill key={opt.val} label={opt.label} sub={opt.sub} sf={opt.sf} color={opt.color}
            selected={s.frequency === opt.val}
            onPress={() => { Haptics.selectionAsync(); upd({ frequency: opt.val }); }}
          />
        ))}
      </Animated.View>
    </Animated.View>
  );
}

// ─── Screen 7: Past Experience ────────────────────────────────────────────────

function PastExpScreen({ s, upd }: SP) {
  const OPTS: { val: PastExp; label: string; sub: string; color: string }[] = [
    { val: 'rough', label: 'Yes — it was really bad', sub: 'I was deceived or hurt', color: Colors.danger },
    { val: 'minor', label: 'Yes — minor red flags', sub: 'Something felt off but it was fine', color: Colors.warning },
    { val: 'none', label: 'Not yet', sub: 'No major issues so far', color: Colors.teal.primary },
  ];
  return (
    <Animated.View entering={FadeIn.duration(400).easing(Easing.out(Easing.quad))} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg }}>
      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={{ width: '100%', alignItems: 'center', marginBottom: spacing.xl }}>
        <Q text="Has someone you met online ever turned out to be different than they seemed?" />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(220).duration(500)} style={{ width: '100%', gap: spacing.sm }}>
        {OPTS.map((opt) => (
          <Pill key={opt.val} label={opt.label} sub={opt.sub} color={opt.color}
            selected={s.pastExp === opt.val}
            onPress={() => { Haptics.selectionAsync(); upd({ pastExp: opt.val }); }}
          />
        ))}
      </Animated.View>
    </Animated.View>
  );
}

// ─── Screen 8: Love Bombing ───────────────────────────────────────────────────

function LoveBombingScreen({ s, upd }: SP) {
  const OPTS: { val: LoveBombingExp; label: string; sub: string; color: string }[] = [
    { val: 'experienced', label: 'Yes — I\'ve been through it', sub: 'Intense affection, too fast', color: Colors.danger },
    { val: 'heard', label: 'I\'ve heard of it', sub: 'I know what to watch for', color: Colors.warning },
    { val: 'new', label: 'No, what is it?', sub: 'I\'m new to this term', color: Colors.indigo },
  ];
  return (
    <Animated.View entering={FadeIn.duration(400).easing(Easing.out(Easing.quad))} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg }}>
      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={{ width: '100%', alignItems: 'center', marginBottom: spacing.xl }}>
        <Q text="Have you ever experienced love bombing?" />
        <Text style={{ fontSize: 14, color: Colors.text.disabled, textAlign: 'center', marginTop: -spacing.md, lineHeight: 20 }}>
          Overwhelming affection from someone you just met to gain trust fast.
        </Text>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(220).duration(500)} style={{ width: '100%', gap: spacing.sm }}>
        {OPTS.map((opt) => (
          <Pill key={opt.val} label={opt.label} sub={opt.sub} color={opt.color}
            selected={s.loveBombing === opt.val}
            onPress={() => { Haptics.selectionAsync(); upd({ loveBombing: opt.val }); }}
          />
        ))}
      </Animated.View>
    </Animated.View>
  );
}

// ─── Screen 9: Top Worry ─────────────────────────────────────────────────────

function TopWorryScreen({ s, upd }: SP) {
  const OPTS = [
    { val: 'catfish', label: 'Fake profiles / catfish', sf: 'person.crop.circle.badge.exclamationmark.fill', color: Colors.danger },
    { val: 'scam', label: 'Romance scammers', sf: 'dollarsign.circle.fill', color: Colors.orange },
    { val: 'safety', label: 'Physical safety', sf: 'location.slash.fill', color: Colors.warning },
    { val: 'manipulation', label: 'Emotional manipulation', sf: 'brain.fill', color: Colors.indigo },
  ];
  return (
    <Animated.View entering={FadeIn.duration(400).easing(Easing.out(Easing.quad))} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg }}>
      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={{ width: '100%', alignItems: 'center', marginBottom: spacing.xl }}>
        <Q text={`What worries you most about online dating, ${s.name}?`} />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(220).duration(500)} style={{ width: '100%', gap: spacing.sm }}>
        {OPTS.map((opt) => (
          <Pill key={opt.val} label={opt.label} sf={opt.sf} color={opt.color}
            selected={s.topWorry === opt.val}
            onPress={() => { Haptics.selectionAsync(); upd({ topWorry: opt.val }); }}
          />
        ))}
      </Animated.View>
    </Animated.View>
  );
}

// ─── Screen 10: Instinct Rating ───────────────────────────────────────────────

function InstinctScreen({ s, upd }: SP) {
  return (
    <Animated.View entering={FadeIn.duration(400).easing(Easing.out(Easing.quad))} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl }}>
      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={{ alignItems: 'center', marginBottom: spacing.xl + spacing.lg }}>
        <Q text={`How much do you trust your gut instincts online, ${s.name}?`} />
        <Text style={{ fontSize: 15, color: Colors.text.muted, textAlign: 'center', marginTop: -spacing.md }}>
          1 = not at all · 5 = completely
        </Text>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(220).duration(500)} style={{ flexDirection: 'row', gap: spacing.md }}>
        {[1, 2, 3, 4, 5].map((n) => {
          const selected = s.instinctRating !== null && n <= s.instinctRating;
          return (
            <TouchableOpacity
              key={n}
              onPress={() => { Haptics.selectionAsync(); upd({ instinctRating: n }); }}
              activeOpacity={0.7}
              style={{ flex: 1, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: radius.lg, borderCurve: 'continuous', backgroundColor: selected ? Colors.teal.muted : 'rgba(255,255,255,0.05)', borderWidth: 1.5, borderColor: selected ? `${Colors.teal.primary}55` : Colors.card.border }}
            >
              <Text style={{ fontSize: 22, fontWeight: '800', color: selected ? Colors.teal.primary : Colors.text.disabled }}>{n}</Text>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
      {s.instinctRating !== null && (
        <Animated.View entering={FadeInDown.duration(300)} style={{ marginTop: spacing.xl }}>
          <Text style={{ fontSize: 15, color: Colors.text.muted, textAlign: 'center', letterSpacing: -0.2 }}>
            {s.instinctRating <= 2
              ? 'Your instincts need data to back them up — that\'s exactly what BYM provides.'
              : s.instinctRating <= 3
              ? 'Good instincts + AI analysis = serious protection.'
              : 'Strong instincts. BYM gives those instincts proof.'}
          </Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

// ─── Screen 11: Bombshell ─────────────────────────────────────────────────────

function BombshellScreen({ s }: SP) {
  const platformLabel = s.platform === 'apps' ? 'dating apps' : s.platform === 'social' ? 'social media' : 'dating apps and social media';
  const freqLabel = s.frequency === 'daily' ? 'every day' : s.frequency === 'weekly' ? 'several times a week' : 'occasionally';
  const scamRate = s.platform === 'apps' ? '68%' : s.platform === 'social' ? '71%' : '74%';
  const riskLine = s.pastExp === 'rough'
    ? `You've already experienced deception online — and you're still at risk.`
    : s.pastExp === 'minor'
    ? `You've noticed red flags before. Most people don't catch them until it's too late.`
    : `You haven't had issues yet — but with ${freqLabel} exposure, the odds are stacking up.`;

  const POINTS = [
    { label: `You meet people on ${platformLabel}`, sub: `${scamRate} of romance fraud reports come from this category`, color: Colors.warning },
    { label: `You chat ${freqLabel}`, sub: `That's up to ${s.frequency === 'daily' ? '365' : s.frequency === 'weekly' ? '150' : '40'}+ new contacts a year`, color: Colors.orange },
    { label: riskLine, sub: 'Scammers specifically target people with your profile', color: Colors.danger },
  ];

  return (
    <Animated.View entering={FadeIn.duration(400).easing(Easing.out(Easing.quad))} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg }}>
      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={{ width: '100%', alignItems: 'center', marginBottom: spacing.xl }}>
        <Text style={{ fontSize: 30, fontWeight: '800', color: Colors.text.primary, textAlign: 'center', letterSpacing: -0.9, lineHeight: 38, marginBottom: spacing.sm }}>
          Here's what we know about you, <Text style={{ color: Colors.teal.primary }}>{s.name}.</Text>
        </Text>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(200).duration(500)} style={{ width: '100%', gap: spacing.sm }}>
        {POINTS.map((pt, i) => (
          <Animated.View key={i} entering={FadeInDown.delay(300 + i * 120).duration(400)}>
            <View style={{ backgroundColor: `${pt.color}10`, borderWidth: 1, borderColor: `${pt.color}28`, borderRadius: radius.xl, padding: spacing.md, gap: 4 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.text.primary, letterSpacing: -0.3 }}>{pt.label}</Text>
              <Text style={{ fontSize: 13, color: Colors.text.muted, lineHeight: 18 }}>{pt.sub}</Text>
            </View>
          </Animated.View>
        ))}
      </Animated.View>
    </Animated.View>
  );
}

// ─── Screen 12: 1-in-7 Insight ────────────────────────────────────────────────

const GLITCH_IDX = 2;

function InsightScreen({ s }: SP) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [glitchPhase, setGlitchPhase] = useState<'waiting' | 'glitching' | 'locked'>('waiting');

  const glitchX = useSharedValue(0);
  const glitchOpacity = useSharedValue(1);
  const labelOpacity = useSharedValue(0);
  const bodyOpacity = useSharedValue(0);

  const glitchStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: glitchX.value }],
    opacity: glitchOpacity.value,
  }));
  const labelStyle = useAnimatedStyle(() => ({ opacity: labelOpacity.value }));
  const bodyStyle = useAnimatedStyle(() => ({ opacity: bodyOpacity.value }));

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Silhouettes appear one by one
    for (let i = 0; i < 7; i++) {
      timers.push(setTimeout(() => setVisibleCount(i + 1), 250 + i * 110));
    }

    // Glitch starts after all 7 are visible
    const glitchAt = 250 + 7 * 110 + 350;
    timers.push(setTimeout(() => {
      setGlitchPhase('glitching');

      glitchX.value = withSequence(
        withTiming(-7, { duration: 45 }),
        withTiming(7, { duration: 45 }),
        withTiming(-5, { duration: 45 }),
        withTiming(5, { duration: 45 }),
        withTiming(-7, { duration: 45 }),
        withTiming(7, { duration: 45 }),
        withTiming(-3, { duration: 45 }),
        withTiming(0, { duration: 45 }),
      );

      glitchOpacity.value = withSequence(
        withTiming(0.1, { duration: 55 }),
        withTiming(1,   { duration: 55 }),
        withTiming(0.2, { duration: 40 }),
        withTiming(1,   { duration: 65 }),
        withTiming(0.0, { duration: 40 }),
        withTiming(1,   { duration: 45 }),
        withTiming(0.3, { duration: 40 }),
        withTiming(1,   { duration: 100 }),
      );

      // Lock in and reveal text
      timers.push(setTimeout(() => {
        runOnJS(setGlitchPhase)('locked');
        runOnJS(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning))();
        labelOpacity.value = withDelay(100, withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) }));
        bodyOpacity.value  = withDelay(400, withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) }));
      }, 520));
    }, glitchAt));

    return () => timers.forEach(clearTimeout);
  }, []);

  const isLocked = glitchPhase === 'locked';

  return (
    <Animated.View entering={FadeIn.duration(400)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl }}>

      {/* 7 profile silhouettes */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: spacing.xxl }}>
        {Array.from({ length: 7 }).map((_, i) => {
          const isGlitch = i === GLITCH_IDX;
          const isVisible = visibleCount > i;

          // Keep layout stable with invisible placeholder
          if (!isVisible) return <View key={i} style={{ width: 40, height: 40 }} />;

          if (isGlitch) {
            return (
              <Animated.View
                key={i}
                entering={FadeInDown.duration(200)}
                style={[
                  { width: 40, height: 40, borderRadius: 12, borderCurve: 'continuous', borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
                  isLocked
                    ? { backgroundColor: 'rgba(239,68,68,0.18)', borderColor: 'rgba(239,68,68,0.45)' }
                    : { backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.12)' },
                ]}
              >
                <Animated.View style={glitchPhase === 'glitching' ? glitchStyle : undefined}>
                  <SymbolView
                    name={isLocked ? 'exclamationmark.triangle.fill' : 'person.fill'}
                    size={20}
                    tintColor={isLocked ? Colors.danger : Colors.text.disabled}
                  />
                </Animated.View>
              </Animated.View>
            );
          }

          return (
            <Animated.View
              key={i}
              entering={FadeInDown.duration(200)}
              style={{ width: 40, height: 40, borderRadius: 12, borderCurve: 'continuous', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' }}
            >
              <SymbolView name="person.fill" size={20} tintColor={Colors.text.disabled} />
            </Animated.View>
          );
        })}
      </View>

      {/* "1 in 7" */}
      <Animated.View style={[{ alignItems: 'center' }, labelStyle]}>
        <Text style={{ fontSize: 72, fontWeight: '800', color: Colors.warning, letterSpacing: -3, lineHeight: 76 }}>
          1 in 7
        </Text>
      </Animated.View>

      {/* Body */}
      <Animated.View style={[{ alignItems: 'center', gap: spacing.md, marginTop: spacing.lg }, bodyStyle]}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: Colors.text.primary, textAlign: 'center', letterSpacing: -0.6, lineHeight: 30 }}>
          dating profiles contains a hidden risk signal.
        </Text>
        <Text style={{ fontSize: 15, color: Colors.text.muted, textAlign: 'center', lineHeight: 23, letterSpacing: -0.2 }}>
          AI-generated faces, stolen photos, and scripted behavior are engineered to feel real.
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

// ─── Screen 13: Promise ───────────────────────────────────────────────────────

function PromiseScreen({ s }: SP) {
  const worryLabel: Record<string, string> = {
    catfish: 'spot AI-generated and stolen-photo profiles',
    scam: 'detect romance scam patterns before they cost you',
    safety: 'know who\'s safe before you agree to meet',
    manipulation: 'recognize love bombing and manipulation tactics',
  };
  const goal = worryLabel[s.topWorry ?? 'catfish'];

  const pulse = useSharedValue(1);
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.00, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
    return () => cancelAnimation(pulse);
  }, []);

  return (
    <Animated.View entering={FadeIn.duration(400).easing(Easing.out(Easing.quad))} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl }}>
      <Animated.View entering={FadeInDown.delay(100).duration(600)} style={{ marginBottom: 36 }}>
        {/* <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: Colors.teal.muted, borderWidth: 1, borderColor: `${Colors.teal.primary}35`, alignItems: 'center', justifyContent: 'center' }}>
          <SymbolView name="checkmark.shield.fill" size={54} tintColor={Colors.teal.primary} />
        </View> */}
        <Animated.Image
          source={require('@/assets/images/logo.png')}
          style={[ 
            pulseStyle,{
            height: 100,
            width: 100
          }]}
        />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(250).duration(600)} style={{ alignItems: 'center', gap: spacing.lg }}>
        <Text style={{ fontSize: 34, fontWeight: '800', color: Colors.text.primary, textAlign: 'center', letterSpacing: -1, lineHeight: 42 }}>
          That's why BYM exists, <Text style={{ color: Colors.teal.primary }}>{s.name}.</Text>
        </Text>
        <View style={{ backgroundColor: Colors.teal.muted, borderWidth: 1, borderColor: `${Colors.teal.primary}35`, borderRadius: radius.xl, padding: spacing.md, width: '100%' }}>
          <Text style={{ fontSize: 15, color: Colors.text.secondary, textAlign: 'center', lineHeight: 24, letterSpacing: -0.2 }}>
            Your goal: <Text style={{ fontWeight: '700', color: Colors.teal.primary }}>{goal}.</Text>
          </Text>
        </View>
        <Text style={{ fontSize: 16, color: Colors.text.muted, textAlign: 'center', lineHeight: 24 }}>
          Before we go further — let's show you exactly what that looks like.
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

// ─── Screen 14: Detective Challenge ──────────────────────────────────────────

function LiveScanIntroScreen({ s }: SP) {
  const pulse = useSharedValue(1);
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.00, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
    return () => cancelAnimation(pulse);
  }, []);

  // Personalize the challenge line based on what we know
  const challengeLine = (() => {
    if (s.pastExp === 'rough') return `You've been burned before, ${s.name}. Let's see if your eye has sharpened.`;
    if (s.pastExp === 'minor')  return `You've had close calls, ${s.name}. Time to put that instinct to the test.`;
    if (s.topWorry === 'catfish' || s.topWorry === 'scam') return `You know the risk is real, ${s.name}. Now let's see if you can spot it.`;
    return `${s.name}, let's put your AI detective skills to the test.`;
  })();

  const contextStat = (() => {
    if (s.pastExp === 'rough' || s.pastExp === 'minor') return '7 in 10 people who\'ve been fooled before still can\'t spot AI faces.';
    return 'Most people swipe right on AI faces without a second thought.';
  })();

  return (
    <Animated.View entering={FadeIn.duration(400).easing(Easing.out(Easing.quad))} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl }}>

      {/* Pulsing icon */}
      <Animated.View entering={FadeInDown.delay(0).duration(500)} style={{ marginBottom: spacing.xl }}>
        <Animated.View style={pulseStyle}>
          <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(251,191,36,0.12)', borderWidth: 1.5, borderColor: 'rgba(251,191,36,0.3)', alignItems: 'center', justifyContent: 'center' }}>
            <SymbolView name="eye.circle.fill" size={56} tintColor={Colors.warning} />
          </View>
        </Animated.View>
      </Animated.View>

      {/* Challenge headline */}
      <Animated.View entering={FadeInDown.delay(150).duration(500)} style={{ alignItems: 'center', marginBottom: spacing.lg }}>
        <Text style={{ fontSize: 32, fontWeight: '800', color: Colors.text.primary, textAlign: 'center', letterSpacing: -1, lineHeight: 40 }}>
          {challengeLine}
        </Text>
      </Animated.View>

      {/* The mission */}
      <Animated.View entering={FadeInDown.delay(280).duration(500)} style={{ alignItems: 'center', marginBottom: spacing.xl }}>
        <Text style={{ fontSize: 17, color: Colors.text.secondary, textAlign: 'center', lineHeight: 26, letterSpacing: -0.3 }}>
          You'll see a stack of profiles.{' '}
          <Text style={{ fontWeight: '700', color: Colors.text.primary }}>One is a real person.</Text>
          {' '}The rest are AI-generated fakes.
        </Text>
      </Animated.View>

      {/* Swipe legend */}
      <Animated.View entering={FadeInDown.delay(400).duration(500)} style={{ flexDirection: 'row', gap: spacing.md, width: '100%' }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: 'rgba(52,199,89,0.1)', borderWidth: 1, borderColor: 'rgba(52,199,89,0.25)', borderRadius: radius.xl, paddingVertical: 12 }}>
          <Text style={{ fontSize: 17 }}>→</Text>
          <Text style={{ fontSize: 14, fontWeight: '700', color: Colors.success }}>Real</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: Colors.card.border, borderRadius: radius.xl, paddingVertical: 12 }}>
          <Text style={{ fontSize: 17 }}>←</Text>
          <Text style={{ fontSize: 14, fontWeight: '700', color: Colors.text.muted }}>Skip</Text>
        </View>
      </Animated.View>

      {/* Tension stat */}
      <Animated.View entering={FadeInDown.delay(520).duration(500)} style={{ marginTop: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <SymbolView name="info.circle" size={13} tintColor={Colors.text.disabled} />
        <Text style={{ fontSize: 13, color: Colors.text.disabled, textAlign: 'center', letterSpacing: -0.1 }}>
          {contextStat}
        </Text>
      </Animated.View>

    </Animated.View>
  );
}

// ─── Screen 15: Demo Scan ─────────────────────────────────────────────────────

function SwipeCard({ profile, onSwipeLeft, onSwipeRight }: {
  profile: DemoProfile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      tx.value = e.translationX;
      ty.value = e.translationY * 0.25;
    })
    .onEnd((e) => {
      if (e.translationX > SWIPE_THRESHOLD) {
        tx.value = withSpring(SCREEN_WIDTH * 1.5, { damping: 14 });
        runOnJS(onSwipeRight)();
      } else if (e.translationX < -SWIPE_THRESHOLD) {
        tx.value = withSpring(-SCREEN_WIDTH * 1.5, { damping: 14 });
        runOnJS(onSwipeLeft)();
      } else {
        tx.value = withSpring(0, { damping: 16 });
        ty.value = withSpring(0, { damping: 16 });
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { rotate: `${interpolate(tx.value, [-160, 0, 160], [-14, 0, 14], Extrapolation.CLAMP)}deg` },
    ],
  }));

  const realStyle = useAnimatedStyle(() => ({
    opacity: interpolate(tx.value, [20, 90], [0, 1], Extrapolation.CLAMP),
  }));

  const skipStyle = useAnimatedStyle(() => ({
    opacity: interpolate(tx.value, [-90, -20], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[{ width: CARD_W, height: CARD_H, borderRadius: radius.xxl, overflow: 'hidden', position: 'absolute' }, cardStyle]}>
        <Image source={profile.source} style={{ width: '100%', height: '100%' }} resizeMode="cover" />

        {/* REAL label */}
        <Animated.View style={[{ position: 'absolute', top: 22, left: 18, backgroundColor: Colors.success, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 3, borderColor: 'white' }, realStyle]}>
          <Text style={{ color: 'white', fontWeight: '900', fontSize: 20, letterSpacing: 1.5 }}>REAL ✓</Text>
        </Animated.View>

        {/* SKIP label */}
        <Animated.View style={[{ position: 'absolute', top: 22, right: 18, backgroundColor: Colors.danger, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 3, borderColor: 'white' }, skipStyle]}>
          <Text style={{ color: 'white', fontWeight: '900', fontSize: 20, letterSpacing: 1.5 }}>SKIP ✗</Text>
        </Animated.View>

      </Animated.View>
    </GestureDetector>
  );
}

type DemoPhase = 'swipe' | 'confirm' | 'scanning' | 'result';

const CONFIRM_PHRASES = [
  'Looks real, right?',
  'Good instinct. But let\'s make sure.',
  'This one does look convincing...',
  'Most people would trust this one.',
  'Your gut says real. Let\'s verify.',
  'Looks legit. Let\'s dig deeper.',
];

function DemoScanScreen({ s, upd }: SP) {
  const [phase, setPhase] = useState<DemoPhase>('swipe');
  const [cardIdx, setCardIdx] = useState(0);
  const [selected, setSelected] = useState<DemoProfile | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const pulse = useSharedValue(1);
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  function handleSwipeLeft() {
    Haptics.selectionAsync();
    setCardIdx((i) => (i + 1) % DEMO_PROFILES.length);
  }

  function handleSwipeRight() {
    const picked = DEMO_PROFILES[cardIdx];
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelected(picked);
    upd({ demoSelectedId: picked.id });
    setPhase('confirm');
  }

  function handleScanNow() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setPhase('scanning');
    pulse.value = withRepeat(withTiming(0.75, { duration: 650 }), -1, true);
    setTimeout(() => {
      cancelAnimation(pulse);
      pulse.value = withSpring(1);
      setPhase('result');
      upd({ demoScanDone: true });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }, 2800);
  }

  function handleTryAgain() {
    setRetryCount(c => c + 1);
    setPhase('swipe');
    setCardIdx(0);
    setSelected(null);
  }

  const top = DEMO_PROFILES[cardIdx];
  const next = DEMO_PROFILES[(cardIdx + 1) % DEMO_PROFILES.length];
  const third = DEMO_PROFILES[(cardIdx + 2) % DEMO_PROFILES.length];

  // ── Swipe phase ──
  if (phase === 'swipe') {
    return (
      <Animated.View entering={FadeIn.duration(400)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg }}>
        <Animated.View entering={FadeInDown.delay(80).duration(500)} style={{ alignItems: 'center', marginBottom: spacing.lg }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: Colors.text.primary, textAlign: 'center', letterSpacing: -0.6 }}>
            Which one is real?
          </Text>
          <Text style={{ fontSize: 14, color: Colors.text.muted, textAlign: 'center', marginTop: 5 }}>
            Swipe → if you think it's real · ← to skip
          </Text>
        </Animated.View>

        {/* Card stack */}
        <View style={{ width: CARD_W, height: CARD_H, position: 'relative' }}>
          {/* 3rd card (back) */}
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: radius.xxl, overflow: 'hidden', opacity: 0.45, transform: [{ scale: 0.90 }, { translateY: -18 }] }}>
            <Image source={third.source} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          </View>
          {/* 2nd card */}
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: radius.xxl, overflow: 'hidden', opacity: 0.72, transform: [{ scale: 0.95 }, { translateY: -9 }] }}>
            <Image source={next.source} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          </View>
          {/* Top interactive card */}
          <SwipeCard key={top.id} profile={top} onSwipeLeft={handleSwipeLeft} onSwipeRight={handleSwipeRight} />
        </View>

        <Text style={{ fontSize: 13, color: Colors.text.disabled, marginTop: spacing.md }}>
          {cardIdx + 1} / {DEMO_PROFILES.length} profiles
        </Text>
      </Animated.View>
    );
  }

  // ── Confirm phase ──
  if (phase === 'confirm') {
    const phrase = CONFIRM_PHRASES[retryCount % CONFIRM_PHRASES.length];
    return (
      <Animated.View entering={FadeInRight.duration(350)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg }}>
        {/* Selected profile card with teal border */}
        <Animated.View entering={FadeInDown.delay(0).duration(400)} style={{ width: CARD_W, height: CARD_H * 0.66, borderRadius: radius.xxl, overflow: 'hidden', marginBottom: spacing.lg }}>
          {selected && <Image source={selected.source} style={{ width: '100%', height: '100%' }} resizeMode="cover" />}
          {/* Teal glow border */}
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: radius.xxl, borderWidth: 3, borderColor: Colors.teal.primary }} />
          {/* Checkmark badge */}
          <Animated.View entering={FadeIn.delay(150).duration(300)} style={{ position: 'absolute', top: 14, right: 14, width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.teal.primary, alignItems: 'center', justifyContent: 'center', shadowColor: Colors.teal.primary, shadowOpacity: 0.6, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } }}>
            <SymbolView name="checkmark" size={19} tintColor={Colors.bg.primary} weight="bold" />
          </Animated.View>
        </Animated.View>

        {/* Phrase + sub */}
        <Animated.View entering={FadeInDown.delay(120).duration(400)} style={{ alignItems: 'center', marginBottom: spacing.xl }}>
          <Text style={{ fontSize: 26, fontWeight: '800', color: Colors.text.primary, textAlign: 'center', letterSpacing: -0.7, lineHeight: 34 }}>
            {phrase}
          </Text>
          <Text style={{ fontSize: 14, color: Colors.text.muted, textAlign: 'center', marginTop: spacing.sm, lineHeight: 20 }}>
            Let BYM run a deep scan on this profile.
          </Text>
        </Animated.View>

        {/* Scan Now CTA */}
        <Animated.View entering={FadeInDown.delay(260).duration(400)} style={{ width: '100%' }}>
          <TouchableOpacity onPress={handleScanNow} activeOpacity={0.85} style={{ borderRadius: 999, overflow: 'hidden' }}>
            <LinearGradient
              colors={[Colors.teal.primary, Colors.teal.light]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ height: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}
            >
              <SymbolView name="magnifyingglass" size={20} tintColor={Colors.bg.primary} weight="semibold" />
              <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.bg.primary, letterSpacing: -0.4 }}>Scan Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    );
  }

  // ── Scanning phase ──
  if (phase === 'scanning') {
    return (
      <Animated.View entering={FadeIn.duration(300)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg }}>
        <View style={{ width: CARD_W, height: CARD_H, borderRadius: radius.xxl, overflow: 'hidden' }}>
          {selected && <Image source={selected.source} style={{ width: '100%', height: '100%' }} resizeMode="cover" />}
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center', gap: spacing.lg }}>
            <Animated.View style={[{ width: 88, height: 88, borderRadius: 44, backgroundColor: Colors.teal.muted, borderWidth: 2, borderColor: Colors.teal.primary, alignItems: 'center', justifyContent: 'center' }, pulseStyle]}>
              <SymbolView name="magnifyingglass" size={38} tintColor={Colors.teal.primary} />
            </Animated.View>
            <Text style={{ color: 'white', fontWeight: '700', fontSize: 17, letterSpacing: -0.3 }}>Analyzing with AI...</Text>
          </View>
        </View>
      </Animated.View>
    );
  }

  // ── Result phase ──
  const SIGNALS = [
    { label: 'AI generation confirmed', sub: '91% confidence — pixel-level noise classifier detected diffusion model fingerprint', sf: 'camera.badge.exclamationmark.fill', color: Colors.danger },
    { label: 'Abnormal frequency spectrum', sub: 'DCT analysis shows non-natural high-frequency patterns absent in real camera photos', sf: 'waveform.badge.exclamationmark', color: Colors.orange },
    { label: 'Compression artifact mismatch', sub: 'Statistical noise distribution inconsistent with any known camera sensor or codec', sf: 'chart.bar.xaxis.ascending.badge.clock', color: Colors.warning },
  ];

  return (
    <Animated.View entering={FadeIn.duration(400)} style={{ flex: 1, justifyContent: 'center', paddingHorizontal: spacing.lg }}>
      {/* Result header */}
      <Animated.View entering={FadeInDown.delay(0).duration(400)}>
        <View style={{ backgroundColor: 'rgba(239,68,68,0.12)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)', borderRadius: radius.xxl, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md }}>
          <View style={{ width: 46, height: 46, borderRadius: 14, borderCurve: 'continuous', backgroundColor: 'rgba(239,68,68,0.2)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <SymbolView name="exclamationmark.shield.fill" size={24} tintColor={Colors.danger} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: Colors.danger, letterSpacing: -0.4 }}>HIGH CAUTION — AI Generated</Text>
            <Text style={{ fontSize: 13, color: Colors.text.muted, marginTop: 3, lineHeight: 18 }}>
              That was not a real person, {s.name}. This is why you need BYM.
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Signals */}
      <View style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
        {SIGNALS.map((sig, i) => (
          <Animated.View key={sig.label} entering={FadeInDown.delay(120 + i * 110).duration(380)}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, backgroundColor: `${sig.color}10`, borderWidth: 1, borderColor: `${sig.color}28`, borderRadius: radius.xl, padding: spacing.md }}>
              <SymbolView name={sig.sf as any} size={18} tintColor={sig.color} style={{ marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.text.primary, letterSpacing: -0.2 }}>{sig.label}</Text>
                <Text style={{ fontSize: 12, color: Colors.text.muted, marginTop: 3, lineHeight: 17 }}>{sig.sub}</Text>
              </View>
            </View>
          </Animated.View>
        ))}
      </View>

      {/* Try again — max 1 retry */}
      {retryCount < 1 && (
        <Animated.View entering={FadeInDown.delay(480).duration(350)}>
          <TouchableOpacity
            onPress={handleTryAgain}
            activeOpacity={0.7}
            style={{ alignItems: 'center', paddingVertical: spacing.md, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: Colors.card.border, borderRadius: radius.xl }}
          >
            <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.text.secondary }}>
              Try Again 
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );
}

// ─── Screen 16: Review at Peak ────────────────────────────────────────────────

function ReviewScreen({ s }: SP) {
  const selectedProfile = DEMO_PROFILES.find((p) => p.id === s.demoSelectedId) ?? DEMO_PROFILES[0];

  return (
    <Animated.View entering={FadeIn.duration(400).easing(Easing.out(Easing.quad))} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg }}>
      <Animated.View entering={FadeInDown.delay(80).duration(500)} style={{ marginBottom: spacing.lg, position: 'relative' }}>
        <View style={{ width: 130, height: 130, borderRadius: radius.xxl, overflow: 'hidden', borderWidth: 3, borderColor: Colors.danger }}>
          <Image source={selectedProfile.source} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        </View>
        <View style={{ position: 'absolute', bottom: -10, alignSelf: 'center', backgroundColor: Colors.danger, borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 4, borderWidth: 2, borderColor: Colors.bg.primary }}>
          <Text style={{ fontSize: 11, fontWeight: '800', color: 'white', letterSpacing: 0.5 }}>AI GENERATED</Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(220).duration(600)} style={{ alignItems: 'center', gap: spacing.lg }}>
        <Text style={{ fontSize: 30, fontWeight: '800', color: Colors.text.primary, textAlign: 'center', letterSpacing: -0.9, lineHeight: 38 }}>
          You just caught a dangerous profile, <Text style={{ color: Colors.teal.primary }}>{s.name}.</Text>
        </Text>
        <Text style={{ fontSize: 16, color: Colors.text.muted, textAlign: 'center', lineHeight: 24, letterSpacing: -0.2 }}>
          AI faces are getting harder to spot every day. Most people can't tell the difference anymore — but now you have a tool that can.
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

// ─── Screen 17: Loading ───────────────────────────────────────────────────────

function LoadingScreen({ s, onNext }: SP) {
  const progress = useSharedValue(0);
  const progressStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  const STEPS = [
    `Reading ${s.name}'s answers...`,
    'Calculating your risk profile...',
    'Building your safety plan...',
    'Almost ready...',
  ];
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 3400 });
    const intervals = [0, 850, 1700, 2550].map((delay, i) =>
      setTimeout(() => setStepIdx(i), delay)
    );
    const done = setTimeout(onNext, 3600);
    return () => { intervals.forEach(clearTimeout); clearTimeout(done); };
  }, []);

  return (
    <Animated.View entering={FadeIn.duration(400)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl }}>
      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={{ marginBottom: 40, alignItems: 'center' }}>
        <View style={{ width: 110, height: 110, borderRadius: 55, backgroundColor: Colors.teal.muted, borderWidth: 1, borderColor: `${Colors.teal.primary}35`, alignItems: 'center', justifyContent: 'center' }}>
          <SymbolView name="person.badge.shield.checkmark.fill" size={50} tintColor={Colors.teal.primary} />
        </View>
      </Animated.View>
      <Text style={{ fontSize: 28, fontWeight: '800', color: Colors.text.primary, textAlign: 'center', letterSpacing: -0.8, lineHeight: 36, marginBottom: spacing.xl }}>
        Building {s.name}'s{'\n'}safety profile...
      </Text>
      <View style={{ width: '100%', height: 6, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden', marginBottom: spacing.lg }}>
        <Animated.View style={[{ height: 6, backgroundColor: Colors.teal.primary, borderRadius: 3 }, progressStyle]} />
      </View>
      <Text style={{ fontSize: 15, color: Colors.text.muted, textAlign: 'center' }}>{STEPS[stepIdx]}</Text>
    </Animated.View>
  );
}

// ─── Screen 18: Summary ───────────────────────────────────────────────────────

function SummaryScreen({ s }: SP) {
  const expLabel = s.pastExp === 'rough' ? 'prior deception experience' : s.pastExp === 'minor' ? 'minor red flag exposure' : 'no prior incidents';
  const platformLabel = s.platform === 'apps' ? 'dating apps' : s.platform === 'social' ? 'social media' : 'multi-platform';
  const POINTS = [
    { sf: 'person.crop.circle.badge.exclamationmark.fill', color: Colors.warning, label: `Risk category: ${platformLabel} user, ${s.ageBracket ?? '25–34'}` },
    { sf: 'exclamationmark.triangle.fill', color: Colors.orange, label: `Exposure history: ${expLabel}` },
    { sf: 'brain.fill', color: Colors.indigo, label: `Primary concern: ${s.topWorry === 'catfish' ? 'fake profiles' : s.topWorry === 'scam' ? 'romance scams' : s.topWorry === 'safety' ? 'physical safety' : 'emotional manipulation'}` },
    { sf: 'shield.checkmark.fill', color: Colors.teal.primary, label: 'Protection status: BYM active' },
  ];

  return (
    <Animated.View entering={FadeIn.duration(400).easing(Easing.out(Easing.quad))} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg }}>
      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={{ width: '100%', alignItems: 'center', marginBottom: spacing.xl }}>
        <Text style={{ fontSize: 30, fontWeight: '800', color: Colors.text.primary, textAlign: 'center', letterSpacing: -0.9, lineHeight: 38 }}>
          <Text style={{ color: Colors.teal.primary }}>{s.name}</Text>'s Safety Profile
        </Text>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(200).duration(500)} style={{ width: '100%', gap: spacing.sm }}>
        {POINTS.map((pt, i) => (
          <Animated.View key={i} entering={FadeInDown.delay(300 + i * 100).duration(350)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: `${pt.color}10`, borderWidth: 1, borderColor: `${pt.color}28`, borderRadius: radius.xl, paddingHorizontal: spacing.lg, paddingVertical: spacing.md }}>
              <SymbolView name={pt.sf as any} size={20} tintColor={pt.color} />
              <Text style={{ flex: 1, fontSize: 14, color: Colors.text.secondary, fontWeight: '500', letterSpacing: -0.2 }}>{pt.label}</Text>
            </View>
          </Animated.View>
        ))}
      </Animated.View>
    </Animated.View>
  );
}

// ─── Screen 19: 30-Day Goal ───────────────────────────────────────────────────

function GoalScreen({ s }: SP) {
  const goalMap: Record<string, { headline: string; items: string[] }> = {
    catfish: {
      headline: 'In 30 days, you\'ll effortlessly identify fake profiles.',
      items: ['Spot AI-generated faces in seconds', 'Detect stolen or stock photos instantly', 'Know when a bio doesn\'t add up'],
    },
    scam: {
      headline: 'In 30 days, romance scams won\'t fool you.',
      items: ['Recognize love bombing red flags early', 'Spot financial manipulation patterns', 'Know when to walk away — confidently'],
    },
    safety: {
      headline: 'In 30 days, every date starts with confidence.',
      items: ['Know exactly who you\'re meeting before you go', 'Spot inconsistencies across platforms', 'Feel safe saying yes — or no'],
    },
    manipulation: {
      headline: 'In 30 days, emotional manipulation won\'t touch you.',
      items: ['Identify love bombing before it escalates', 'Recognize gaslighting and guilt patterns', 'Trust your instincts — backed by data'],
    },
  };
  const goal = goalMap[s.topWorry ?? 'catfish'];

  return (
    <Animated.View entering={FadeIn.duration(400).easing(Easing.out(Easing.quad))} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg }}>
      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={{ width: '100%', alignItems: 'center', marginBottom: spacing.xl }}>
        <View style={{ backgroundColor: Colors.teal.muted, borderWidth: 1, borderColor: `${Colors.teal.primary}35`, borderRadius: radius.full, paddingHorizontal: 14, paddingVertical: 6, marginBottom: spacing.md }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: Colors.teal.primary, letterSpacing: 0.5 }}>YOUR 30-DAY GOAL</Text>
        </View>
        <Text style={{ fontSize: 26, fontWeight: '800', color: Colors.text.primary, textAlign: 'center', letterSpacing: -0.8, lineHeight: 34 }}>
          {goal.headline}
        </Text>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(220).duration(500)} style={{ width: '100%', gap: spacing.sm }}>
        {goal.items.map((item, i) => (
          <Animated.View key={i} entering={FadeInDown.delay(320 + i * 100).duration(350)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: Colors.card.border, borderRadius: radius.xl, paddingHorizontal: spacing.lg, paddingVertical: spacing.md }}>
              <View style={{ width: 28, height: 28, borderRadius: 8, borderCurve: 'continuous', backgroundColor: Colors.teal.muted, alignItems: 'center', justifyContent: 'center' }}>
                <SymbolView name="checkmark" size={14} tintColor={Colors.teal.primary} weight="bold" />
              </View>
              <Text style={{ flex: 1, fontSize: 15, color: Colors.text.secondary, letterSpacing: -0.2 }}>{item}</Text>
            </View>
          </Animated.View>
        ))}
      </Animated.View>

      {/* Learn tab teaser */}
      <Animated.View entering={FadeInDown.delay(620).duration(400)} style={{ width: '100%', marginTop: spacing.lg }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: `${Colors.indigo}12`, borderWidth: 1, borderColor: `${Colors.indigo}30`, borderRadius: radius.xl, paddingHorizontal: spacing.lg, paddingVertical: spacing.md }}>
          <View style={{ width: 36, height: 36, borderRadius: 10, borderCurve: 'continuous', backgroundColor: `${Colors.indigo}20`, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <SymbolView name="graduationcap.fill" size={18} tintColor={Colors.indigo} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: Colors.text.primary, letterSpacing: -0.3 }}>Interactive lessons inside</Text>
            <Text style={{ fontSize: 12, color: Colors.text.muted, marginTop: 2, lineHeight: 17 }}>
              Short quizzes and courses in the Learn tab help you build real detection skills — with XP rewards.
            </Text>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

// ─── Screen 20: Commitment ────────────────────────────────────────────────────

function CommitmentScreen({ s, onNext }: SP) {
  return (
    <Animated.View entering={FadeIn.duration(400).easing(Easing.out(Easing.quad))} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl }}>
      <Animated.View entering={FadeInDown.delay(100).duration(600)} style={{ marginBottom: 36 }}>
        <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: Colors.teal.muted, borderWidth: 1, borderColor: `${Colors.teal.primary}35`, alignItems: 'center', justifyContent: 'center' }}>
          <SymbolView name="hand.raised.fill" size={52} tintColor={Colors.teal.primary} />
        </View>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(250).duration(600)} style={{ alignItems: 'center', gap: spacing.xl, width: '100%' }}>
        <Text style={{ fontSize: 34, fontWeight: '800', color: Colors.text.primary, textAlign: 'center', letterSpacing: -1.1, lineHeight: 42 }}>
          {s.name}, are you ready to date smarter?
        </Text>
        <TouchableOpacity
          style={{ width: '100%', borderRadius: 999, overflow: 'hidden' }}
          onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); onNext(); }}
          activeOpacity={0.85}
        >
          <LinearGradient colors={[Colors.teal.primary, Colors.teal.light]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={{ height: 60, alignItems: 'center', justifyContent: 'center', gap: 8, flexDirection: 'row' }}>
            <SymbolView name="hand.thumbsup.fill" size={20} tintColor={Colors.bg.primary} />
            <Text style={{ fontSize: 18, fontWeight: '800', color: Colors.bg.primary, letterSpacing: -0.4 }}>I'm In, Let's Go</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={onNext} activeOpacity={0.6}>
          <Text style={{ fontSize: 14, color: Colors.text.disabled }}>Maybe later</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

// ─── Screen 21: Social Proof ──────────────────────────────────────────────────

function SocialProofScreen({ s }: SP) {
  const REVIEWS = [
    { name: 'Riley', text: 'Caught a catfish on the first scan. Wish I had this years ago.' },
    { name: 'Jordan', text: 'Saved me from a romance scammer who seemed totally legit.' },
  ];

  return (
    <Animated.View entering={FadeIn.duration(400).easing(Easing.out(Easing.quad))} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg }}>
      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={{ alignItems: 'center', marginBottom: spacing.xl }}>
        <Text style={{ fontSize: 30, fontWeight: '800', color: Colors.text.primary, textAlign: 'center', letterSpacing: -0.9, lineHeight: 38 }}>
          BYM was built for people{'\n'}who <Text style={{ color: Colors.teal.primary }}>take their safety seriously.</Text>
        </Text>
        <Text style={{ fontSize: 15, color: Colors.text.muted, textAlign: 'center', lineHeight: 22, marginTop: spacing.md }}>
          If you're here, you're already ahead of most.
        </Text>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(220).duration(500)} style={{ width: '100%', gap: spacing.sm }}>
        {REVIEWS.map((r, i) => (
          <Animated.View key={i} entering={FadeInDown.delay(320 + i * 100).duration(350)}>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: Colors.card.border, borderRadius: radius.xl, padding: spacing.md, gap: spacing.sm }}>
              <View style={{ flexDirection: 'row', gap: 3 }}>
                {[1,2,3,4,5].map(n => <SymbolView key={n} name="star.fill" size={12} tintColor={Colors.warning} />)}
              </View>
              <Text style={{ fontSize: 14, color: Colors.text.secondary, lineHeight: 20, letterSpacing: -0.1 }}>"{r.text}"</Text>
              <Text style={{ fontSize: 12, color: Colors.text.muted, fontWeight: '600' }}>— {r.name}</Text>
            </View>
          </Animated.View>
        ))}
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(550).duration(400)} style={{ marginTop: spacing.xl }}>
        <Text style={{ fontSize: 15, color: Colors.text.muted, textAlign: 'center' }}>
          You belong here, <Text style={{ color: Colors.teal.primary, fontWeight: '700' }}>{s.name}</Text>.
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

// ─── Screen 22: Paywall ───────────────────────────────────────────────────────

function PaywallScreen({ onNext }: SP) {
  const { presentPaywall } = useRevenueCat();
  const [loading, setLoading] = useState(false);

  const scanY = useSharedValue(-2);
  const scanOpacity = useSharedValue(0);
  const badgeOpacity = useSharedValue(0);
  const badgeScale = useSharedValue(0.75);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    scanOpacity.value = withTiming(1, { duration: 400 });
    scanY.value = withDelay(
      300,
      withRepeat(
        withSequence(
          withTiming(154, { duration: 1000, easing: Easing.linear }),
          withTiming(-2, { duration: 0 })
        ),
        2,
        false,
        () => {
          scanOpacity.value = withTiming(0, { duration: 250 });
          badgeOpacity.value = withDelay(250, withTiming(1, { duration: 400 }));
          badgeScale.value = withDelay(250, withSpring(1, { damping: 10, stiffness: 160 }));
          pulseScale.value = withDelay(900, withRepeat(
            withSequence(
              withTiming(1.06, { duration: 900, easing: Easing.inOut(Easing.quad) }),
              withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) })
            ),
            -1,
            false
          ));
        }
      )
    );
  }, []);

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanY.value }],
    opacity: scanOpacity.value,
  }));

  const scanChipStyle = useAnimatedStyle(() => ({
    opacity: scanOpacity.value,
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    opacity: badgeOpacity.value,
    transform: [{ scale: badgeScale.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  async function handleTrial() {
    setLoading(true);
    await presentPaywall();
    setLoading(false);
    onNext();
  }

  const BENEFITS = [
    { sf: 'magnifyingglass.circle.fill', label: 'Unlimited profile + chat scans', color: Colors.teal.primary },
    { sf: 'chart.bar.fill', label: 'Detailed risk reports with next steps', color: Colors.indigo },
    { sf: 'checkmark.shield.fill', label: 'Safety lesson library + XP', color: Colors.warning },
    { sf: 'lock.shield.fill', label: 'Private, encrypted, never shared', color: Colors.success },
  ];

  return (
    <Animated.View entering={FadeIn.duration(400).easing(Easing.out(Easing.quad))} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg }}>
      {/* Image with animated scan overlay */}
      <View style={{ width: '100%', height: 150, marginBottom: spacing.lg }}>
        <Image
          source={require('@/assets/images/fake-profiles.png')}
          style={{ width: '100%', height: '100%' }}
          resizeMode='contain'
        />

        {/* Scanning beam */}
        <Animated.View style={[{ position: 'absolute', left: 0, right: 0, pointerEvents: 'none' }, scanLineStyle]}>
          <LinearGradient
            colors={['transparent', `${Colors.teal.primary}CC`, Colors.teal.primary, `${Colors.teal.primary}CC`, 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ height: 2 }}
          />
          <LinearGradient
            colors={[`${Colors.teal.primary}28`, 'transparent']}
            style={{ height: 22 }}
          />
        </Animated.View>

        {/* Scanning chip */}
        <Animated.View style={[{ position: 'absolute', top: 8, left: 8 }, scanChipStyle]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(0,0,0,0.65)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: `${Colors.teal.primary}40` }}>
            <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.teal.primary }} />
            <Text style={{ fontSize: 10, fontWeight: '700', color: Colors.teal.primary, letterSpacing: 0.8 }}>SCANNING</Text>
          </View>
        </Animated.View>

        {/* Detection badge */}
        <Animated.View style={[{ position: 'absolute', bottom: 8, left: 0, right: 0, alignItems: 'center' }, badgeStyle]}>
          <Animated.View style={pulseStyle}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(220,38,38,0.95)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,120,120,0.4)' }}>
              <SymbolView name="xmark.shield.fill" size={14} tintColor="white" />
              <Text style={{ fontSize: 12, fontWeight: '800', color: 'white', letterSpacing: 0.6 }}>AI GENERATION DETECTED</Text>
            </View>
          </Animated.View>
        </Animated.View>
      </View>
      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={{ alignItems: 'center', marginBottom: spacing.lg }}>
        <Text style={{ fontSize: 32, fontWeight: '800', color: Colors.text.primary, textAlign: 'center', letterSpacing: -1, lineHeight: 40, marginBottom: spacing.sm }}>
          Unlimited scans.{'\n'}
          <Text style={{ color: Colors.teal.primary }}>Total confidence.</Text>
        </Text>
        <Text style={{ fontSize: 15, color: Colors.text.muted, textAlign: 'center', lineHeight: 22 }}>
          Less than one coffee to date safely.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(500)} style={{ width: '100%', gap: spacing.sm, marginBottom: spacing.lg }}>
        {BENEFITS.map((b, i) => (
          <Animated.View key={i} entering={FadeInDown.delay(280 + i * 80).duration(350)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: Colors.card.border, borderRadius: radius.xl, paddingHorizontal: spacing.lg, paddingVertical: spacing.md }}>
              <SymbolView name={b.sf as any} size={20} tintColor={b.color} />
              <Text style={{ flex: 1, fontSize: 15, color: Colors.text.secondary, letterSpacing: -0.2 }}>{b.label}</Text>
            </View>
          </Animated.View>
        ))}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(620).duration(400)} style={{ width: '100%', gap: spacing.md }}>
        <TouchableOpacity
          style={{ borderRadius: 999, overflow: 'hidden', opacity: loading ? 0.6 : 1 }}
          onPress={handleTrial}
          activeOpacity={0.85}
          disabled={loading}
        >
          <LinearGradient colors={[Colors.teal.primary, Colors.teal.light]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={{ height: 58, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 17, fontWeight: '800', color: Colors.bg.primary, letterSpacing: -0.4 }}>
              {loading ? 'Loading...' : 'Start Free 3-Day Trial'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={onNext} activeOpacity={0.7} style={{ alignItems: 'center', paddingVertical: spacing.sm }}>
          <Text style={{ fontSize: 14, color: Colors.text.disabled }}>Continue without trial</Text>
        </TouchableOpacity> */}
      </Animated.View>
    </Animated.View>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

const TOTAL = 23;
const AUTO_ADVANCE_SCREENS = new Set([17]);
const NO_FOOTER_SCREENS = new Set([17, 20, 22]);

function getCanProceed(idx: number, s: OState): boolean {
  switch (idx) {
    case 1: return s.name.trim().length >= 2;
    case 3: return s.pastExp !== null;
    case 4: return s.ageBracket !== null;
    case 5: return s.platform !== null;
    case 6: return s.frequency !== null;
    case 7: return s.pastExp !== null;
    case 8: return s.loveBombing !== null;
    case 9: return s.topWorry !== null;
    case 10: return s.instinctRating !== null;
    case 15: return s.demoScanDone;
    default: return true;
  }
}

export default function Onboarding() {
  const [idx, setIdx] = useState(0);
  const [s, setS] = useState<OState>({
    name: '', ageBracket: null, platform: null, frequency: null,
    pastExp: null, loveBombing: null, topWorry: null, instinctRating: null,
    demoScanDone: false, demoSelectedId: null, starRating: 0,
  });

  function upd(p: Partial<OState>) { setS((prev) => ({ ...prev, ...p })); }

  async function handleNext() {
    if (idx === 16) {
      StoreReview.isAvailableAsync().then(available => {
        if (available) StoreReview.requestReview();
      });
    }
    if (idx === TOTAL - 1) {
      await setOnboardingComplete();
      router.replace('/(tabs)/(home)');
    } else {
      setIdx((i) => i + 1);
    }
  }

  const sp: SP = { s, upd, onNext: handleNext };
  const showFooter = !NO_FOOTER_SCREENS.has(idx);
  const canProceed = getCanProceed(idx, s);

  const ctaLabel = idx === TOTAL - 1 ? 'Start Free Trial' : 'Continue';

  function renderScreen() {
    switch (idx) {
      case 0:  return <WelcomeScreen key={0} {...sp} />;
      case 1:  return <NameScreen key={1} {...sp} />;
      case 2:  return <GreetingScreen key={2} {...sp} />;
      case 3:  return <ProblemScreen key={3} {...sp} />;
      case 4:  return <AgeScreen key={4} {...sp} />;
      case 5:  return <PlatformScreen key={5} {...sp} />;
      case 6:  return <FrequencyScreen key={6} {...sp} />;
      case 7:  return <PastExpScreen key={7} {...sp} />;
      case 8:  return <LoveBombingScreen key={8} {...sp} />;
      case 9:  return <TopWorryScreen key={9} {...sp} />;
      case 10: return <InstinctScreen key={10} {...sp} />;
      case 11: return <BombshellScreen key={11} {...sp} />;
      case 12: return <InsightScreen key={12} {...sp} />;
      case 13: return <PromiseScreen key={13} {...sp} />;
      case 14: return <LiveScanIntroScreen key={14} {...sp} />;
      case 15: return <DemoScanScreen key={15} {...sp} />;
      case 16: return <ReviewScreen key={16} {...sp} />;
      case 17: return <LoadingScreen key={17} {...sp} />;
      case 18: return <SummaryScreen key={18} {...sp} />;
      case 19: return <GoalScreen key={19} {...sp} />;
      case 20: return <CommitmentScreen key={20} {...sp} />;
      case 21: return <SocialProofScreen key={21} {...sp} />;
      case 22: return <PaywallScreen key={22} {...sp} />;
      default: return null;
    }
  }

  const showSkip = idx >= 3 && idx <= 10 && !AUTO_ADVANCE_SCREENS.has(idx);

  return (
    <LinearGradient colors={[Colors.bg.primary, Colors.bg.secondary]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.teal.primary, letterSpacing: 2 }}>BYM</Text>
          {showSkip && (
            <TouchableOpacity onPress={() => setIdx(11)} activeOpacity={0.7} style={{ paddingHorizontal: spacing.md, paddingVertical: spacing.xs }}>
              <Text style={{ fontSize: 15, color: Colors.text.disabled, fontWeight: '500' }}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Content */}
        <View style={{ flex: 1 }}>{renderScreen()}</View>

        {/* Footer */}
        {showFooter && (
          <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, gap: spacing.lg }}>
            {/* Dots */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
              {Array.from({ length: TOTAL }).map((_, i) => (
                <View key={i} style={{ height: 5, borderRadius: 3, backgroundColor: i === idx ? Colors.teal.primary : Colors.card.border, width: i === idx ? 18 : 5 }} />
              ))}
            </View>
            {/* CTA */}
            <TouchableOpacity
              style={{ borderRadius: 999, overflow: 'hidden', opacity: canProceed ? 1 : 0.4 }}
              onPress={canProceed ? handleNext : undefined}
              activeOpacity={0.85}
            >
              <LinearGradient colors={[Colors.teal.primary, Colors.teal.light]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={{ height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Text style={{ fontSize: 17, fontWeight: '700', color: Colors.bg.primary, letterSpacing: -0.3 }}>{ctaLabel}</Text>
                {canProceed && idx < TOTAL - 1 && <SymbolView name="arrow.right" size={16} tintColor={Colors.bg.primary} weight="semibold" />}
              </LinearGradient>
            </TouchableOpacity>
            <Text style={{ fontSize: 11, color: Colors.text.disabled, textAlign: 'center', letterSpacing: -0.1 }}>
              By continuing you accept the{' '}
              <Text onPress={() => Linking.openURL('https://beforeyoumeet.vercel.app/terms.html')} style={{ color: Colors.teal.primary, textDecorationLine: 'underline' }}>
                terms
              </Text>
            </Text>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}
