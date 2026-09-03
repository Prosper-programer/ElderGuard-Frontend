import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, Activity, Bell, HeartHandshake, ArrowRight } from 'lucide-react-native';
import { ScreenContainer, Button, Card } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer scrollable padded backgroundColor={Colors.background}>
      {/* Top Brand Header */}
      <View style={styles.brandContainer}>
        <View style={styles.logoBadge}>
          <Shield size={28} color={Colors.primary} />
        </View>
        <Text style={styles.brandName}>ElderGuard</Text>
        <Text style={styles.tagline}>Intelligent Elderly Monitoring & Care</Text>
      </View>

      {/* Value Proposition Highlights */}
      <View style={styles.cardsContainer}>
        {/* Highlight 1: Vital Health Monitoring */}
        <Card style={styles.featureCard}>
          <View style={styles.featureRow}>
            <View style={[styles.iconCircle, { backgroundColor: Colors.primaryFaded }]}>
              <Activity size={22} color={Colors.primary} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Real-time Health Monitoring</Text>
              <Text style={styles.featureDescription}>
                Continuous IoT vital tracking for heart rate, blood oxygen, temperature, and mobility.
              </Text>
            </View>
          </View>
        </Card>

        {/* Highlight 2: Instant Emergency Alerts */}
        <Card style={styles.featureCard}>
          <View style={styles.featureRow}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.10)' }]}>
              <Bell size={22} color={Colors.critical} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Instant Fall & Safety Alerts</Text>
              <Text style={styles.featureDescription}>
                Automated detection of abnormal vitals, falls, and optional geofence boundary exits.
              </Text>
            </View>
          </View>
        </Card>

        {/* Highlight 3: Care Coordination */}
        <Card style={styles.featureCard}>
          <View style={styles.featureRow}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(34, 197, 94, 0.10)' }]}>
              <HeartHandshake size={22} color={Colors.safe} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Care Coordination & Reminders</Text>
              <Text style={styles.featureDescription}>
                Medication schedules, daily routines, and shared progress between family and caregivers.
              </Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Bottom Actions */}
      <View style={styles.actionContainer}>
        <Button
          title="Get Started"
          onPress={() => router.push('/(auth)/signup')}
          variant="primary"
          size="lg"
          fullWidth
          rightIcon={<ArrowRight size={18} color={Colors.white} />}
        />

        <Button
          title="I already have an account"
          onPress={() => router.push('/(auth)/login')}
          variant="outline"
          size="lg"
          fullWidth
          style={styles.loginButton}
        />

        {/* Tour & Design Links */}
        <View style={styles.linksContainer}>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/onboarding')}
            style={styles.tourLink}
            activeOpacity={0.7}
          >
            <Text style={styles.tourText}>Replay Onboarding Tour</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/design-system')}
            style={styles.designSystemLink}
            activeOpacity={0.7}
          >
            <Text style={styles.designSystemText}>
              Inspect Phase 0 Design System Tokens
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  brandContainer: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryFaded,
    borderWidth: 1.5,
    borderColor: 'rgba(60, 111, 219, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.base,
  },
  brandName: {
    ...Typography.h1,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  tagline: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  cardsContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  featureCard: {
    backgroundColor: Colors.white,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.base,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    ...Typography.bodySemiBold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  featureDescription: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  actionContainer: {
    marginTop: 'auto',
    paddingBottom: Spacing.lg,
  },
  loginButton: {
    marginTop: Spacing.md,
  },
  linksContainer: {
    marginTop: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  tourLink: {
    paddingVertical: Spacing.xs,
  },
  tourText: {
    ...Typography.bodySmallMedium,
    color: Colors.primary,
  },
  designSystemLink: {
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  designSystemText: {
    ...Typography.captionMedium,
    color: Colors.textTertiary,
    textDecorationLine: 'underline',
  },
});
