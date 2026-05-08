import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/colors';

const MAX_SIZE = 220;
const CENTER_SIZE = 72;
const DURATION = 2600;

function PulseRing({ delay, color }: { delay: number; color: string }) {
  const scale = useSharedValue(0.15);
  const opacity = useSharedValue(0.7);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: DURATION, easing: Easing.out(Easing.quad) }),
        -1,
        false
      )
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(0, { duration: DURATION, easing: Easing.out(Easing.quad) }),
        -1,
        false
      )
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.ring,
        { borderColor: color, width: MAX_SIZE, height: MAX_SIZE, borderRadius: MAX_SIZE / 2 },
        animStyle,
      ]}
    />
  );
}

interface LoadingPulseProps {
  color?: string;
  icon?: React.ReactNode;
}

export function LoadingPulse({ color = Colors.teal.primary, icon }: LoadingPulseProps) {
  return (
    <View style={styles.container}>
      {[0, 900, 1800].map((delay, i) => (
        <PulseRing key={i} delay={delay} color={color} />
      ))}
      <View style={[styles.center, { backgroundColor: `${color}18`, borderColor: `${color}30` }]}>
        {icon ?? <View style={[styles.dot, { backgroundColor: color }]} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: MAX_SIZE,
    height: MAX_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1.5,
  },
  center: {
    width: CENTER_SIZE,
    height: CENTER_SIZE,
    borderRadius: CENTER_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});
