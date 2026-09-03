import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronRight,
  Battery,
  Wifi,
  Phone,
  Settings,
  ShieldAlert,
  Pill,
  Heart,
  Activity,
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

export default function CaregiverHomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { activeProfile } = useElderly();
  const { vitals } = useVitals();
  const { activeAlerts } = useAlerts();
  const { todayDoses } = useCare();

  const primaryContact =
    activeProfile.emergencyContacts.find((c) => c.isPrimary) ||
    activeProfile.emergencyContacts[0];

  const handleCall = (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const url = Platform.OS === 'ios' ? `telprompt:${cleanPhone}` : `tel:${cleanPhone}`;
    Linking.openURL(url).catch(() => {});
  };

  const takenCount = todayDoses.filter((d) => d.status === 'taken').length;

  return (
    <ScreenContainer scrollable padded backgroundColor={Colors.background}>
      {/* ── Top Header ──────────────────────────────────────── */}
      <View style={styles.headerRow}>
        <View style={styles.userInfo}>
          <Avatar name={user?.name || 'David Miller'} size={44} statusIndicator="safe" />
          <View>
            <Text style={styles.userName}>{user?.name || 'David Miller'}</Text>
            <View style={styles.badgeWrap}>
              <StatusBadge status="safe" label="Caregiver (Active Duty)" size="sm" />
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(caregiver)/settings' as any)}
          style={styles.settingsHeaderBtn}
          activeOpacity={0.7}
        >
          <Settings size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <Divider spacing={Spacing.md} />

      {/* ── Active Critical Incident Banner (If Any) ────────── */}
      {activeAlerts.length > 0 && (
        <TouchableOpacity
          onPress={() => router.push('/(caregiver)/alerts' as any)}
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
                <Text style={styles.respondTagText}>Attend</Text>
                <ChevronRight size={14} color={Colors.white} />
              </View>
            </View>
          </Card>
        </TouchableOpacity>
      )}

      {/* ── Assigned Elderly Care Recipient ─────────────────── */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>ASSIGNED CARE RECIPIENT</Text>
        <TouchableOpacity
          onPress={() => router.push('/(caregiver)/profile' as any)}
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
            </View>
            <Text style={styles.elderlySub}>
              {activeProfile.age} yrs · {activeProfile.gender} · &quot;{activeProfile.preferredName}&quot;
            </Text>
            <View style={styles.statusWrap}>
              <StatusBadge
                status={vitals.overallStatus}
                label={vitals.overallStatus === 'safe' ? 'IoT Wearable Normal' : 'Care Alert Active'}
                size="sm"
              />
            </View>
          </View>
        </View>

        {/* Quick Metrics Strip */}
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

        {/* Emergency Family Contact Strip */}
        {primaryContact && (
          <View style={styles.emergencyBar}>
            <View style={{ flex: 1 }}>
              <Text style={styles.emergencyBarLabel}>Family Manager (Emergency)</Text>
              <Text style={styles.emergencyBarName}>
                {primaryContact.name} ({primaryContact.relationship})
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleCall(primaryContact.phone)}
              style={styles.emergencyCallBtn}
              activeOpacity={0.8}
            >
              <Phone size={14} color={Colors.white} />
              <Text style={styles.emergencyCallText}>Call</Text>
            </TouchableOpacity>
          </View>
        )}
      </Card>

      <View style={{ height: Spacing.lg }} />

      {/* ── Real-Time Vital Statistics ──────────────────────── */}
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

      {/* ── Caregiver Operational Workspaces ─────────────────── */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>DAILY CARE ACTIONS</Text>
      </View>

      <View style={styles.hubShortcuts}>
        {/* Medication & Care Routine Logging */}
        <TouchableOpacity
          onPress={() => router.push('/(caregiver)/care' as any)}
          style={styles.shortcutCard}
          activeOpacity={0.8}
        >
          <View style={[styles.shortcutIcon, { backgroundColor: Colors.safeBg }]}>
            <Pill size={22} color={Colors.safe} />
          </View>
          <View style={styles.shortcutMeta}>
            <Text style={styles.shortcutTitle}>Medication Administration & Routines</Text>
            <Text style={styles.shortcutDesc}>
              {takenCount} of {todayDoses.length} doses administered today
            </Text>
          </View>
          <ChevronRight size={18} color={Colors.textTertiary} />
        </TouchableOpacity>

        {/* Incident Alerts Center */}
        <TouchableOpacity
          onPress={() => router.push('/(caregiver)/alerts' as any)}
          style={styles.shortcutCard}
          activeOpacity={0.8}
        >
          <View style={[styles.shortcutIcon, { backgroundColor: 'rgba(239, 68, 68, 0.12)' }]}>
            <ShieldAlert size={22} color={Colors.critical} />
          </View>
          <View style={styles.shortcutMeta}>
            <Text style={styles.shortcutTitle}>Assigned Incident Alerts</Text>
            <Text style={styles.shortcutDesc}>
              {activeAlerts.length} active alerts · Review & Acknowledge
            </Text>
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
    backgroundColor: Colors.safe,
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
    color: Colors.safe,
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
  emergencyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.md,
  },
  emergencyBarLabel: {
    ...Typography.overline,
    fontSize: 9,
    color: Colors.critical,
  },
  emergencyBarName: {
    ...Typography.bodySmallSemiBold,
    color: Colors.textPrimary,
    marginTop: 1,
  },
  emergencyCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.critical,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  emergencyCallText: {
    ...Typography.captionMedium,
    color: Colors.white,
    fontWeight: '600',
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
