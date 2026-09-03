import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Layout, Spacing } from '@/constants/theme';

interface ScreenContainerProps {
  children: React.ReactNode;
  /** Enable scrolling (default: true) */
  scrollable?: boolean;
  /** Add horizontal padding (default: true) */
  padded?: boolean;
  /** Background color override */
  backgroundColor?: string;
  /** Handle keyboard avoidance (default: false, enable for form screens) */
  keyboardAvoiding?: boolean;
  /** Extra bottom padding */
  bottomPadding?: number;
  /** Optional pinned bottom bar / navigation */
  bottomBar?: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export function ScreenContainer({
  children,
  scrollable = true,
  padded = true,
  backgroundColor = Colors.background,
  keyboardAvoiding = false,
  bottomPadding,
  bottomBar,
  style,
  contentStyle,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor,
    paddingTop: insets.top,
  };

  const innerContentStyle: ViewStyle = {
    ...(padded && {
      paddingHorizontal: Layout.screenPaddingH,
    }),
    paddingTop: Layout.screenPaddingTop,
    paddingBottom: bottomBar
      ? Spacing.xl
      : (bottomPadding ?? Layout.screenPaddingBottom) + insets.bottom,
  };

  const content = scrollable ? (
    <ScrollView
      style={[styles.scroll, style]}
      contentContainerStyle={[innerContentStyle, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.scroll, innerContentStyle, style, contentStyle]}>
      {children}
    </View>
  );

  return (
    <View style={containerStyle}>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
      {bottomBar}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
});
