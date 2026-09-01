import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';
import { Colors, Typography, BorderRadius, Spacing, Layout } from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const containerStyles: ViewStyle[] = [
    styles.base,
    sizeStyles[size],
    variantStyles[variant],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    isDisabled && variant === 'primary' && styles.disabledPrimary,
    isDisabled && variant === 'danger' && styles.disabledDanger,
    style as ViewStyle,
  ].filter(Boolean) as ViewStyle[];

  const textColor = getTextColor(variant, isDisabled);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={containerStyles}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={textColor}
          style={styles.loader}
        />
      ) : (
        leftIcon && <>{leftIcon}</>
      )}
      <Text
        style={[
          size === 'sm' ? Typography.buttonSmall : Typography.button,
          { color: textColor },
        ]}
      >
        {title}
      </Text>
      {!loading && rightIcon && <>{rightIcon}</>}
    </TouchableOpacity>
  );
}

function getTextColor(variant: ButtonVariant, isDisabled: boolean): string {
  if (isDisabled) {
    if (variant === 'primary' || variant === 'danger') return Colors.white;
    return Colors.disabledText;
  }
  switch (variant) {
    case 'primary':
      return Colors.white;
    case 'secondary':
      return Colors.primary;
    case 'outline':
      return Colors.primary;
    case 'ghost':
      return Colors.primary;
    case 'danger':
      return Colors.white;
  }
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    minHeight: Layout.minTouchTarget,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.55,
  },
  disabledPrimary: {
    backgroundColor: Colors.disabled,
    opacity: 1,
  },
  disabledDanger: {
    backgroundColor: Colors.disabled,
    opacity: 1,
  },
  loader: {
    marginRight: 2,
  },
});

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  sm: {
    height: 36,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  md: {
    height: 48,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.sm,
  },
  lg: {
    height: 54,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
};

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.primaryFaded,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: Colors.critical,
  },
};
