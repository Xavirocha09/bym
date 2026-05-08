import React from 'react';
import { View, StyleSheet, Platform, StyleProp, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '@/constants/colors';
import { radius } from '@/constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  padding?: number;
  borderRadius?: number;
  borderColor?: string;
}

export function GlassCard({
  children,
  style,
  intensity = 18,
  padding = 16,
  borderRadius = radius.xl,
  borderColor = Colors.card.border,
}: GlassCardProps) {
  return (
    <View style={[styles.container, { borderRadius, borderColor }, style]}>
      {Platform.OS === 'ios' ? (
        <BlurView intensity={intensity} tint="dark" style={[StyleSheet.absoluteFill, { borderRadius }]} />
      ) : null}
      <View style={[styles.overlay, { borderRadius, backgroundColor: Platform.OS === 'ios' ? Colors.card.bg : Colors.card.elevated }]} />
      <View style={[styles.content, { padding }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderWidth: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
});
