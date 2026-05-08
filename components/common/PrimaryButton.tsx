import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { Colors } from '@/constants/colors';
import { radius, fontSize, fontWeight, spacing } from '@/constants/theme';

type ButtonVariant = 'filled' | 'outlined' | 'ghost';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  variant?: ButtonVariant;
  style?: ViewStyle;
  disabled?: boolean;
  small?: boolean;
}

export function PrimaryButton({
  label,
  onPress,
  loading,
  variant = 'filled',
  style,
  disabled,
  small,
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        small && styles.small,
        variant === 'filled' && styles.filled,
        variant === 'outlined' && styles.outlined,
        variant === 'ghost' && styles.ghost,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.82}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'filled' ? Colors.bg.primary : Colors.teal.primary}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.label,
            small && styles.labelSmall,
            variant !== 'filled' && styles.labelTeal,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  small: {
    height: 42,
    paddingHorizontal: spacing.md,
  },
  filled: {
    backgroundColor: Colors.teal.primary,
  },
  outlined: {
    borderWidth: 1.5,
    borderColor: Colors.teal.primary,
    backgroundColor: 'transparent',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.38,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: Colors.bg.primary,
    letterSpacing: -0.3,
  },
  labelSmall: {
    fontSize: fontSize.base,
  },
  labelTeal: {
    color: Colors.teal.primary,
  },
});
