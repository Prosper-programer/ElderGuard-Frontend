import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  HeartHandshake,
  LogOut,
  Sparkles,
  ChevronRight,
} from 'lucide-react-native';
import { ScreenContainer, Card, Button } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function CaregiverSettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [onDuty, setOnDuty] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/welcome');
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(caregiver)' as any);
    }
  };

  return (
    <ScreenContainer scrollable padded backgroundColor={Colors.background}>
      {/* ── Top Navigation Bar ──────────────────────────────── */}
      <View style={styles.topNav}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={22} color={Colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.navTitle}>Caregiver Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* ── 1. Duty Status ──────────────────────────────────── */}
      <Text style={styles.sectionLabel}>ACTIVE DUTY STATUS</Text>
      <Card style={styles.card}>
        <View style={styles.switchRow}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchTitle}>{onDuty ? 'On Active Duty' : 'Off Duty'}</Text>
            <Text style={styles.switchSub}>
              {onDuty
                ? 'Receiving real-time sensor alerts for Margaret Johnson'
                : 'Alerts temporarily forwarded to secondary family contacts'}
            </Text>
          </View>
          <Switch
            value={onDuty}
            onValueChange={setOnDuty}
            trackColor={{ false: Colors.border, true: Colors.safe }}
          />
        </View>
      </Card>

      <View style={{ height: Spacing.lg }} />

      {/* ── 2. Notification Preferences ─────────────────────── */}
      <Text style={styles.sectionLabel}>CARE NOTIFICATIONS</Text>
      <Card style={styles.card}>
        <View style={styles.switchRow}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchTitle}>Critical Emergency Fall Alerts</Text>
            <Text style={styles.switchSub}>High-priority notifications with sound override</Text>
          </View>
          <Switch
            value={pushAlerts}
            onValueChange={setPushAlerts}
            trackColor={{ false: Colors.border, true: Colors.safe }}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.switchRow}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchTitle}>Scheduled Medication Reminders</Text>
            <Text style={styles.switchSub}>15 minutes before dose time (08:00 AM, 12:30 PM, 07:00 PM)</Text>
          </View>
          <Switch
            value={taskReminders}
            onValueChange={setTaskReminders}
            trackColor={{ false: Colors.border, true: Colors.safe }}
          />
        </View>
      </Card>

      <View style={{ height: Spacing.lg }} />

      {/* ── 3. Account Details ──────────────────────────────── */}
      <Text style={styles.sectionLabel}>CAREGIVER ACCOUNT</Text>
      <Card style={styles.card}>
        <View style={styles.accRow}>
          <HeartHandshake size={20} color={Colors.safe} />
          <View style={{ flex: 1 }}>
            <Text style={styles.accName}>{user?.name || 'David Miller'}</Text>
            <Text style={styles.accEmail}>{user?.email || 'caregiver@elderguard.com'}</Text>
          </View>
          <Text style={styles.roleTag}>CAREGIVER</Text>
        </View>

        <View style={styles.divider} />

        <TouchableOpacity
          onPress={() => router.push('/design-system')}
          style={styles.dsRow}
          activeOpacity={0.7}
        >
          <Sparkles size={18} color={Colors.safe} />
          <Text style={styles.dsText}>Inspect Design System Tokens</Text>
          <ChevronRight size={18} color={Colors.textTertiary} />
        </TouchableOpacity>
      </Card>

      <View style={{ height: Spacing.xl }} />

      {/* ── Logout Button ───────────────────────────────────── */}
      <Button
        title="Sign Out of ElderGuard"
        onPress={handleLogout}
        variant="outline"
        size="lg"
        fullWidth
        leftIcon={<LogOut size={18} color={Colors.critical} />}
      />

      <View style={styles.footerNote}>
        <Text style={styles.footerText}>ElderGuard Mobile Application · v1.0.0 (Expo SDK 54)</Text>
      </View>

      <View style={{ height: Spacing['3xl'] }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceSecondary,
  },
  navTitle: {
    ...Typography.bodySemiBold,
    fontSize: 17,
    color: Colors.textPrimary,
  },
  sectionLabel: {
    ...Typography.overline,
    color: Colors.textTertiary,
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.white,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  switchInfo: {
    flex: 1,
  },
  switchTitle: {
    ...Typography.bodySemiBold,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  switchSub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.sm,
  },
  accRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  accName: {
    ...Typography.bodySemiBold,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  accEmail: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  roleTag: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.safe,
    backgroundColor: Colors.safeBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
  },
  dsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: 4,
  },
  dsText: {
    ...Typography.bodySmallSemiBold,
    color: Colors.safe,
    flex: 1,
  },
  footerNote: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  footerText: {
    ...Typography.caption,
    color: Colors.textTertiary,
    fontSize: 11,
  },
});
