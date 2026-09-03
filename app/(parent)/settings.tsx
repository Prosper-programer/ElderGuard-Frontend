import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Cpu,
  Shield,
  LogOut,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';
import { ScreenContainer, Card, Button } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useElderly } from '@/context/ElderlyContext';

export default function ParentSettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { activeProfile } = useElderly();

  const [pushAlerts, setPushAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [vitalsAlerts, setVitalsAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/welcome');
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(parent)' as any);
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

        <Text style={styles.navTitle}>Settings & Preferences</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* ── 1. Alert Notifications ──────────────────────────── */}
      <Text style={styles.sectionLabel}>EMERGENCY ALERT NOTIFICATIONS</Text>
      <Card style={styles.card}>
        <View style={styles.switchRow}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchTitle}>Emergency Fall Push Alerts</Text>
            <Text style={styles.switchSub}>Instant high-priority alerts with alarm tone</Text>
          </View>
          <Switch
            value={pushAlerts}
            onValueChange={setPushAlerts}
            trackColor={{ false: Colors.border, true: Colors.primary }}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.switchRow}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchTitle}>Emergency SMS Fall Dispatch</Text>
            <Text style={styles.switchSub}>Send automated SMS to emergency contacts</Text>
          </View>
          <Switch
            value={smsAlerts}
            onValueChange={setSmsAlerts}
            trackColor={{ false: Colors.border, true: Colors.primary }}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.switchRow}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchTitle}>Abnormal Vital Threshold Alerts</Text>
            <Text style={styles.switchSub}>Alert when Heart Rate &gt;120 or SpO₂ &lt;92%</Text>
          </View>
          <Switch
            value={vitalsAlerts}
            onValueChange={setVitalsAlerts}
            trackColor={{ false: Colors.border, true: Colors.primary }}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.switchRow}>
          <View style={styles.switchInfo}>
            <Text style={styles.switchTitle}>Daily Evening Care Digest</Text>
            <Text style={styles.switchSub}>Daily summary of medications and vitals</Text>
          </View>
          <Switch
            value={dailyDigest}
            onValueChange={setDailyDigest}
            trackColor={{ false: Colors.border, true: Colors.primary }}
          />
        </View>
      </Card>

      <View style={{ height: Spacing.lg }} />

      {/* ── 2. Paired IoT Hardware ──────────────────────────── */}
      <Text style={styles.sectionLabel}>PAIRED IOT HARDWARE</Text>
      <Card style={styles.card}>
        <View style={styles.hwRow}>
          <Cpu size={22} color={Colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.hwName}>{activeProfile.deviceStatus.deviceName}</Text>
            <Text style={styles.hwMeta}>
              ID: {activeProfile.deviceStatus.deviceId} · FW: {activeProfile.deviceStatus.firmwareVersion}
            </Text>
          </View>
          <ChevronRight size={18} color={Colors.textTertiary} />
        </View>
      </Card>

      <View style={{ height: Spacing.lg }} />

      {/* ── 3. Account & System Info ────────────────────────── */}
      <Text style={styles.sectionLabel}>ACCOUNT DETAILS</Text>
      <Card style={styles.card}>
        <View style={styles.accRow}>
          <Shield size={18} color={Colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.accName}>{user?.name || 'Eleanor Vance'}</Text>
            <Text style={styles.accEmail}>{user?.email || 'parent@elderguard.com'}</Text>
          </View>
          <Text style={styles.roleTag}>PARENT</Text>
        </View>

        <View style={styles.divider} />

        <TouchableOpacity
          onPress={() => router.push('/design-system')}
          style={styles.dsRow}
          activeOpacity={0.7}
        >
          <Sparkles size={18} color={Colors.primary} />
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
  hwRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  hwName: {
    ...Typography.bodySemiBold,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  hwMeta: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
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
    color: Colors.primary,
    backgroundColor: Colors.primaryFaded,
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
    color: Colors.primary,
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
