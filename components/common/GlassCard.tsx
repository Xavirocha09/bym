import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { BlurView } from 'expo-blur';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: number;
  borderRadius?: number;
  borderColor?: string;
}

export function GlassCard({
  children,
  style,
  padding = 16,
  borderRadius = 20,
  borderColor = 'rgba(255, 255, 255, 0.1)',
}: GlassCardProps) {
  const outerStyle: ViewStyle = {
    borderRadius,
    borderCurve: 'continuous',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor,
  };

  const inner = <View style={{ padding }}>{children}</View>;

  if (isLiquidGlassAvailable()) {
    return (
      <GlassView style={[outerStyle, style]}>
        {inner}
      </GlassView>
    );
  }

  return (
    <BlurView
      tint="systemUltraThinMaterialDark"
      intensity={80}
      style={[outerStyle, style]}
    >
      {inner}
    </BlurView>
  );
}
