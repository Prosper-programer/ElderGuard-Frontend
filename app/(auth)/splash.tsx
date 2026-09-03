import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Shield } from 'lucide-react-native';
import { ScreenContainer } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Automatically transition to the onboarding tour after 2.2 seconds
    const timer = setTimeout(() => {
      router.replace('/(auth)/onboarding');
    }, 2200);

    return () => clearTimeout(timer);
  }, [router]);

  const handlePressToContinue = () => {
    router.replace('/(auth)/onboarding');
  };

  return (
    <ScreenContainer scrollable={false} padded={false} backgroundColor={Colors.white}>
      <TouchableOpacity
        style={styles.touchContainer}
        activeOpacity={1}
        onPress={handlePressToContinue}
      >
        <View style={styles.centerContent}>
          {/* Outer glow ring */}
          <View style={styles.glowRing}>
            <View style={styles.iconContainer}>
              <Shield size={48} color={Colors.primary} strokeWidth={2.2} />
              <View style={styles.accentDot} />
            </View>
          </View>

          <Text style={styles.brandTitle}>ElderGuard</Text>
          <Text style={styles.tagline}>
            Intelligent Elderly Monitoring & Care
          </Text>
          <Text style={styles.conceptPills}>
            Monitor · Detect · Alert · Respond · Record
          </Text>
        </View>

        {/* Bottom Loading & Status */}
        <View style={styles.bottomStatus}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>Initializing secure care networks…</Text>
          <Text style={styles.tapPrompt}>Tap anywhere to continue</Text>
        </View>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  touchContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing['4xl'],
    paddingHorizontal: Spacing.xl,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowRing: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryFaded,
    borderWidth: 2,
    borderColor: 'rgba(0, 251, 251, 0.35)', // Cyan accent highlight
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
    position: 'relative',
  },
  accentDot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 10,
    height: 10,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.accent, // Cyan accent
    borderWidth: 2,
    borderColor: Colors.white,
  },
  brandTitle: {
    ...Typography.h1,
    fontSize: 34,
    lineHeight: 40,
    color: Colors.textPrimary,
    letterSpacing: -0.8,
  },
  tagline: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  conceptPills: {
    ...Typography.overline,
    color: Colors.primary,
    letterSpacing: 1.2,
    marginTop: Spacing.base,
    backgroundColor: Colors.primaryFaded,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xl,
  },
  bottomStatus: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  loadingText: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
  },
  tapPrompt: {
    ...Typography.caption,
    color: Colors.textTertiary,
    opacity: 0.6,
  },
});
