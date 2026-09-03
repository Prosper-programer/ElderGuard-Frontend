import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Activity,
  Bell,
  HeartHandshake,
  ArrowRight,
  Shield,
  Sparkles,
} from 'lucide-react-native';
import { ScreenContainer, Button, Card } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer scrollable padded backgroundColor={Colors.background}>
      {/* ── 1. Hero Image with Enhanced Design ──────────────── */}
      <View style={styles.heroCard}>
        <Image
          source={require('@/assets/images/auth_welcome_hero.jpg')}
          style={styles.heroImage}
          resizeMode="cover"
        />

        {/* Top Floating Badge */}
        <View style={styles.topGlassBadge}>
          <Shield size={14} color={Colors.accent} />
          <Text style={styles.topGlassText}>ElderGuard Care Ecosystem</Text>
        </View>

        {/* Bottom Floating Status Overlay */}
        <View style={styles.bottomStatusBadge}>
          <View style={styles.livePulseOuter}>
            <View style={styles.livePulseInner} />
          </View>
          <View>
            <Text style={styles.statusBadgeTitle}>24/7 Smart Protection</Text>
            <Text style={styles.statusBadgeSubtitle}>IoT Wearable & Family Connected</Text>
          </View>
        </View>
      </View>

      {/* ── 2. Brand Heading & Concept ──────────────────────── */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>ElderGuard</Text>
        <Text style={styles.tagline}>
          Intelligent Elderly Monitoring & Care Management
        </Text>
        <View style={styles.conceptPill}>
          <Sparkles size={13} color={Colors.primary} />
          <Text style={styles.conceptText}>
            Monitor · Detect · Alert · Respond · Record
          </Text>
        </View>
      </View>

      {/* ── 3. What The App Does (3 Feature Cards) ─────────── */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionLabel}>WHAT ELDERGUARD DELIVERS</Text>

        {/* Feature 1: Real-time Health Monitoring */}
        <Card style={styles.featureCard}>
          <View style={styles.featureRow}>
            <View style={[styles.iconCircle, { backgroundColor: Colors.primaryFaded }]}>
              <Activity size={22} color={Colors.primary} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Real-time Health Monitoring</Text>
              <Text style={styles.featureDescription}>
                Continuous IoT vital tracking for heart rate, blood oxygen (SpO₂), body temperature, and physical mobility.
              </Text>
            </View>
          </View>
        </Card>

        {/* Feature 2: Instant Emergency Alerts */}
        <Card style={styles.featureCard}>
          <View style={styles.featureRow}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.10)' }]}>
              <Bell size={22} color={Colors.critical} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Instant Fall & Safety Alerts</Text>
              <Text style={styles.featureDescription}>
                Automated detection of abnormal vital thresholds, sudden falls, and optional geofence boundary exits.
              </Text>
            </View>
          </View>
        </Card>

        {/* Feature 3: Care Coordination */}
        <Card style={styles.featureCard}>
          <View style={styles.featureRow}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(34, 197, 94, 0.10)' }]}>
              <HeartHandshake size={22} color={Colors.safe} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Care Coordination & Reminders</Text>
              <Text style={styles.featureDescription}>
                Medication schedules, daily routines, and shared progress records between family members and caregivers.
              </Text>
            </View>
          </View>
        </Card>
      </View>

      {/* ── 4. Primary Actions (Get Started & Go To Login) ─── */}
      <View style={styles.actionSection}>
        <Button
          title="Create Account"
          onPress={() => router.push('/(auth)/signup')}
          variant="primary"
          size="lg"
          fullWidth
          rightIcon={<ArrowRight size={18} color={Colors.white} />}
        />

        <Button
          title="Sign In to Existing Account"
          onPress={() => router.push('/(auth)/login')}
          variant="outline"
          size="lg"
          fullWidth
          style={styles.signInButton}
        />

        {/* Reassurance text */}
        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            Secured IoT connection · Role-based access for Parent, Caregiver & Admin
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    width: '100%',
    height: 270, // Increased length/height as requested
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceSecondary,
    position: 'relative',
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  topGlassBadge: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  topGlassText: {
    ...Typography.captionMedium,
    color: Colors.white,
    fontSize: 11,
    letterSpacing: 0.3,
  },
  bottomStatusBadge: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  livePulseOuter: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(34, 197, 94, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  livePulseInner: {
    width: 12,
    height: 12,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.safe,
  },
  statusBadgeTitle: {
    ...Typography.bodySemiBold,
    color: Colors.white,
    fontSize: 14,
  },
  statusBadgeSubtitle: {
    ...Typography.caption,
    color: 'rgba(241, 245, 249, 0.8)',
    fontSize: 11,
    marginTop: 1,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h1,
    fontSize: 30,
    lineHeight: 36,
    color: Colors.textPrimary,
    letterSpacing: -0.6,
  },
  tagline: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
    lineHeight: 22,
  },
  conceptPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryFaded,
    borderWidth: 1,
    borderColor: 'rgba(60, 111, 219, 0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.md,
  },
  conceptText: {
    ...Typography.overline,
    color: Colors.primary,
    fontSize: 10,
    letterSpacing: 1,
  },
  featuresSection: {
    gap: Spacing.md,
    marginBottom: Spacing['2xl'],
  },
  sectionLabel: {
    ...Typography.overline,
    color: Colors.textTertiary,
    marginBottom: Spacing.xs,
    letterSpacing: 1.2,
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
    marginBottom: 3,
  },
  featureDescription: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  actionSection: {
    marginTop: 'auto',
    paddingBottom: Spacing.xl,
  },
  signInButton: {
    marginTop: Spacing.md,
  },
  footerNote: {
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  footerNoteText: {
    ...Typography.caption,
    color: Colors.textTertiary,
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 16,
  },
});
