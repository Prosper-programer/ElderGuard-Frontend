import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronRight,
  Battery,
  Wifi,
  Heart,
  Activity,
  Edit3,
  ShieldAlert,
  Pill,
  BarChart3,
  Settings,
  Thermometer,
  Footprints,
} from 'lucide-react-native';
import { ScreenContainer, Card, StatusBadge, Avatar, Divider } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useElderly } from '@/context/ElderlyContext';
import { useVitals } from '@/context/VitalsContext';
import { useAlerts } from '@/context/AlertContext';
import { useCare } from '@/context/CareContext';

export default function ParentHomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { activeProfile } = useElderly();
  const { vitals } = useVitals();
  const { activeAlerts } = useAlerts();
  const { todayDoses } = useCare();

  const takenDoses = todayDoses.filter((d) => d.status === 'taken').length;

  return (
    <ScreenContainer scrollable padded backgroundColor={Colors.background}>
      {/* ── Top Header ──────────────────────────────────────── */}
      <View style={styles.headerRow}>
        <View style={styles.userInfo}>
          <Avatar name={user?.name || 'Eleanor Vance'} size={44} statusIndicator="safe" />
          <View>
            <Text style={styles.userName}>{user?.name || 'Eleanor Vance'}</Text>
            <View style={styles.badgeWrap}>
              <StatusBadge status="safe" label="Parent Manager" size="sm" />
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(parent)/settings' as any)}
          style={styles.settingsHeaderBtn}
          activeOpacity={0.7}
        >
          <Settings size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <Divider spacing={Spacing.md} />

      {/* ── Active Critical Alert Banner (If Any) ────────────── */}
      {activeAlerts.length > 0 && (
        <TouchableOpacity
          onPress={() => router.push('/(parent)/alerts' as any)}
          activeOpacity={0.85}
        >
          <Card
            elevated
            style={[
              styles.alertBannerCard,
              activeAlerts[0].severity === 'critical'
                ? styles.alertBannerCritical
                : styles.alertBannerWarning,
            ]}
          >
            <View style={styles.alertBannerHeader}>
              <ShieldAlert
                size={22}
                color={activeAlerts[0].severity === 'critical' ? Colors.critical : Colors.warning}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.alertBannerTitle}>{activeAlerts[0].title}</Text>
                <Text style={styles.alertBannerSub}>
                  {activeAlerts[0].location} · {activeAlerts[0].timestamp}
                </Text>
              </View>
              <View style={styles.respondTag}>
                <Text style={styles.respondTagText}>Respond</Text>
                <ChevronRight size={14} color={Colors.white} />
              </View>
            </View>
          </Card>
        </TouchableOpacity>
      )}

      {/* ── Managed Elderly Profile Card ────────────────────── */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>MANAGED ELDERLY PERSON</Text>
        <TouchableOpacity
          onPress={() => router.push('/(parent)/profile' as any)}
          activeOpacity={0.7}
        >
          <Text style={styles.viewProfileLink}>View Profile</Text>
        </TouchableOpacity>
      </View>

      <Card elevated style={styles.elderlyCard}>
        <View style={styles.elderlyTopRow}>
          <Avatar
            name={activeProfile.fullName}
            imageUrl={activeProfile.imageUrl}
            size={64}
            statusIndicator={vitals.overallStatus}
          />
          <View style={styles.elderlyMeta}>
            <View style={styles.nameRow}>
              <Text style={styles.elderlyName}>{activeProfile.fullName}</Text>
              <TouchableOpacity
                onPress={() => router.push('/(parent)/profile/edit' as any)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Edit3 size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.elderlySub}>
              {activeProfile.age} yrs · {activeProfile.gender} · &quot;{activeProfile.preferredName}&quot;
            </Text>
            <View style={styles.statusWrap}>
              <StatusBadge
                status={vitals.overallStatus}
                label={vitals.overallStatus === 'safe' ? 'Wearable Online · Normal' : 'Anomaly Detected'}
                size="sm"
              />
            </View>
          </View>
        </View>

        {/* Live Hardware Telemetry Strip */}
        <View style={styles.metricStrip}>
          <View style={styles.metricItem}>
            <Battery size={15} color={Colors.safe} />
            <Text style={styles.metricLabel}>{vitals.batteryLevel}% Battery</Text>
          </View>
          <View style={styles.stripDivider} />
          <View style={styles.metricItem}>
            <Wifi size={15} color={Colors.primary} />
            <Text style={styles.metricLabel}>{vitals.lastSyncTime}</Text>
          </View>
          <View style={styles.stripDivider} />
          <View style={styles.metricItem}>
            <Heart size={15} color={Colors.critical} />
            <Text style={styles.metricLabel}>{activeProfile.medicalInfo.bloodType}</Text>
          </View>
        </View>
      </Card>

      <View style={{ height: Spacing.lg }} />

      {/* ── Real-Time Vital Statistics (Phase 3) ─────────────── */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>REAL-TIME VITALS TELEMETRY</Text>
        <StatusBadge status={vitals.overallStatus} label={vitals.overallStatus.toUpperCase()} size="sm" />
      </View>

      <View style={styles.vitalsGrid}>
        {/* Heart Rate */}
        <Card style={styles.vitalCard}>
          <View style={styles.vitalTop}>
            <View style={[styles.vitalIconWrap, { backgroundColor: 'rgba(239, 68, 68, 0.10)' }]}>
              <Heart size={18} color={Colors.critical} />
            </View>
            <StatusBadge status={vitals.heartRate.status} label={vitals.heartRate.statusLabel} size="sm" />
          </View>
          <Text style={styles.vitalValue}>
            {vitals.heartRate.value} <Text style={styles.vitalUnit}>{vitals.heartRate.unit}</Text>
          </Text>
          <Text style={styles.vitalRange}>Normal: {vitals.heartRate.normalRange}</Text>
        </Card>

        {/* Blood Oxygen */}
        <Card style={styles.vitalCard}>
          <View style={styles.vitalTop}>
            <View style={[styles.vitalIconWrap, { backgroundColor: Colors.primaryFaded }]}>
              <Activity size={18} color={Colors.primary} />
            </View>
            <StatusBadge status={vitals.spo2.status} label={vitals.spo2.statusLabel} size="sm" />
          </View>
          <Text style={styles.vitalValue}>
            {vitals.spo2.value} <Text style={styles.vitalUnit}>{vitals.spo2.unit}</Text>
          </Text>
          <Text style={styles.vitalRange}>Normal: {vitals.spo2.normalRange}</Text>
        </Card>

        {/* Temperature */}
        <Card style={styles.vitalCard}>
          <View style={styles.vitalTop}>
            <View style={[styles.vitalIconWrap, { backgroundColor: 'rgba(245, 158, 11, 0.10)' }]}>
              <Thermometer size={18} color={Colors.warning} />
            </View>
            <StatusBadge status={vitals.temperature.status} label={vitals.temperature.statusLabel} size="sm" />
          </View>
          <Text style={styles.vitalValue}>
            {vitals.temperature.value} <Text style={styles.vitalUnit}>{vitals.temperature.unit}</Text>
          </Text>
          <Text style={styles.vitalRange}>Normal: {vitals.temperature.normalRange}</Text>
        </Card>

        {/* Daily Steps */}
        <Card style={styles.vitalCard}>
          <View style={styles.vitalTop}>
            <View style={[styles.vitalIconWrap, { backgroundColor: Colors.safeBg }]}>
              <Footprints size={18} color={Colors.safe} />
            </View>
            <StatusBadge status={vitals.steps.status} label="Active" size="sm" />
          </View>
          <Text style={styles.vitalValue}>
            {vitals.steps.value} <Text style={styles.vitalUnit}>steps</Text>
          </Text>
          <Text style={styles.vitalRange}>{vitals.steps.statusLabel}</Text>
        </Card>
      </View>

      <View style={{ height: Spacing.lg }} />

      {/* ── Quick Hub Shortcuts ─────────────────────────────── */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>MANAGEMENT WORKSPACES</Text>
      </View>

      <View style={styles.hubShortcuts}>
        {/* Incident Alert Center */}
        <TouchableOpacity
          onPress={() => router.push('/(parent)/alerts' as any)}
          style={styles.shortcutCard}
          activeOpacity={0.8}
        >
          <View style={[styles.shortcutIcon, { backgroundColor: 'rgba(239, 68, 68, 0.12)' }]}>
            <ShieldAlert size={22} color={Colors.critical} />
          </View>
          <View style={styles.shortcutMeta}>
            <Text style={styles.shortcutTitle}>Incidents & Fall Alerts</Text>
            <Text style={styles.shortcutDesc}>
              {activeAlerts.length} active incidents · Review response cycle
            </Text>
          </View>
          <ChevronRight size={18} color={Colors.textTertiary} />
        </TouchableOpacity>

        {/* Medications & Daily Care */}
        <TouchableOpacity
          onPress={() => router.push('/(parent)/care' as any)}
          style={styles.shortcutCard}
          activeOpacity={0.8}
        >
          <View style={[styles.shortcutIcon, { backgroundColor: Colors.primaryFaded }]}>
            <Pill size={22} color={Colors.primary} />
          </View>
          <View style={styles.shortcutMeta}>
            <Text style={styles.shortcutTitle}>Medications & Daily Care</Text>
            <Text style={styles.shortcutDesc}>
              {takenDoses} of {todayDoses.length} doses logged today
            </Text>
          </View>
          <ChevronRight size={18} color={Colors.textTertiary} />
        </TouchableOpacity>

        {/* Health Analytics & Reports */}
        <TouchableOpacity
          onPress={() => router.push('/(parent)/reports' as any)}
          style={styles.shortcutCard}
          activeOpacity={0.8}
        >
          <View style={[styles.shortcutIcon, { backgroundColor: Colors.safeBg }]}>
            <BarChart3 size={22} color={Colors.safe} />
          </View>
          <View style={styles.shortcutMeta}>
            <Text style={styles.shortcutTitle}>Health Trends & Physician Reports</Text>
            <Text style={styles.shortcutDesc}>24h/7d vital analytics and doctor summary</Text>
          </View>
          <ChevronRight size={18} color={Colors.textTertiary} />
        </TouchableOpacity>
      </View>

      <View style={{ height: Spacing['3xl'] }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  userName: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  badgeWrap: {
    marginTop: 2,
  },
  settingsHeaderBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertBannerCard: {
    backgroundColor: Colors.white,
    marginBottom: Spacing.base,
    borderLeftWidth: 4,
  },
  alertBannerCritical: {
    borderLeftColor: Colors.critical,
    backgroundColor: '#FFF5F5',
  },
  alertBannerWarning: {
    borderLeftColor: Colors.warning,
    backgroundColor: '#FFFBEB',
  },
  alertBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  alertBannerTitle: {
    ...Typography.bodySemiBold,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  alertBannerSub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  respondTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.critical,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
    gap: 2,
  },
  respondTagText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.white,
    fontWeight: '600',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    ...Typography.overline,
    color: Colors.textTertiary,
    letterSpacing: 1,
  },
  viewProfileLink: {
    ...Typography.captionMedium,
    color: Colors.primary,
    fontWeight: '600',
  },
  elderlyCard: {
    backgroundColor: Colors.white,
  },
  elderlyTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
  },
  elderlyMeta: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  elderlyName: {
    ...Typography.h3,
    fontSize: 19,
    color: Colors.textPrimary,
  },
  elderlySub: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statusWrap: {
    marginTop: Spacing.xs,
    alignSelf: 'flex-start',
  },
  metricStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.base,
  },
  metricItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  metricLabel: {
    ...Typography.captionMedium,
    color: Colors.textSecondary,
    fontSize: 12,
  },
  stripDivider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.border,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  vitalCard: {
    width: '47.5%',
    backgroundColor: Colors.white,
    padding: Spacing.md,
  },
  vitalTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  vitalIconWrap: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vitalValue: {
    ...Typography.h2,
    fontSize: 22,
    color: Colors.textPrimary,
  },
  vitalUnit: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textTertiary,
  },
  vitalRange: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  hubShortcuts: {
    gap: Spacing.md,
  },
  shortcutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  shortcutIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutMeta: {
    flex: 1,
  },
  shortcutTitle: {
    ...Typography.bodySemiBold,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  shortcutDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
