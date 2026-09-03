import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronRight,
  Battery,
  Wifi,
  Heart,
  Activity,
  ShieldAlert,
  Pill,
  BarChart3,
  Settings,
  Thermometer,
  Footprints,
} from 'lucide-react-native';
import {
  ScreenContainer,
  Card,
  Avatar,
  HeroStatusRing,
  VitalSparklineCard,
  BottomTabBar,
} from '@/components/ui';
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
    <ScreenContainer
      scrollable
      padded
      backgroundColor="#F8FAFC"
      bottomBar={<BottomTabBar activeTab="home" role="parent" />}
    >
      {/* ── 1. Top Modern Header ────────────────────────────── */}
        <View style={styles.headerRow}>
          <View style={styles.userInfo}>
            <Avatar name={user?.name || 'Eleanor Vance'} size={42} statusIndicator="safe" />
            <View>
              <Text style={styles.greetingText}>Good afternoon,</Text>
              <Text style={styles.userName}>{user?.name || 'Eleanor Vance'}</Text>
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

        {/* ── 2. Active Urgent Incident Banner (If Any) ───────── */}
        {activeAlerts.length > 0 && (
          <TouchableOpacity
            onPress={() => router.push('/(parent)/alerts' as any)}
            activeOpacity={0.88}
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
                <View
                  style={[
                    styles.alertIconCircle,
                    {
                      backgroundColor:
                        activeAlerts[0].severity === 'critical'
                          ? 'rgba(239, 68, 68, 0.15)'
                          : 'rgba(245, 158, 11, 0.15)',
                    },
                  ]}
                >
                  <ShieldAlert
                    size={22}
                    color={activeAlerts[0].severity === 'critical' ? Colors.critical : Colors.warning}
                  />
                </View>
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

        {/* ── 3. Apple-Health Style Hero Status Ring ──────────── */}
        <HeroStatusRing
          name={activeProfile.preferredName || 'Margaret'}
          imageUrl={activeProfile.imageUrl}
          status={vitals.overallStatus}
          heartRate={vitals.heartRate.value}
          spo2={vitals.spo2.value}
          medsCompleted={takenDoses}
          medsTotal={todayDoses.length}
          statusMessage={vitals.overallStatusMessage}
          location="At Home — 142 Elm Street"
        />

        {/* ── 4. Paired Wearable IoT Health Strip ─────────────── */}
        <View style={styles.hardwareStrip}>
          <View style={styles.hwCol}>
            <Battery size={14} color={Colors.safe} />
            <Text style={styles.hwText}>{vitals.batteryLevel}% Battery</Text>
          </View>
          <View style={styles.hwDivider} />
          <View style={styles.hwCol}>
            <Wifi size={14} color={Colors.primary} />
            <Text style={styles.hwText}>Synced {vitals.lastSyncTime}</Text>
          </View>
          <View style={styles.hwDivider} />
          <View style={styles.hwCol}>
            <Heart size={14} color={Colors.critical} />
            <Text style={styles.hwText}>Blood: {activeProfile.medicalInfo.bloodType}</Text>
          </View>
        </View>

        <View style={{ height: Spacing.lg }} />

        {/* ── 5. Real-Time Vitals Telemetry (Sparklines) ──────── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>REAL-TIME VITALS TELEMETRY</Text>
          <Text style={styles.sectionSub}>Auto-refreshed live</Text>
        </View>

        <View style={styles.vitalsGrid}>
          {/* Heart Rate */}
          <VitalSparklineCard
            label="Heart Rate"
            value={vitals.heartRate.value}
            unit="bpm"
            status={vitals.heartRate.status}
            statusLabel={vitals.heartRate.statusLabel}
            normalRange={vitals.heartRate.normalRange}
            icon={<Heart size={15} color={Colors.critical} />}
            iconBg="rgba(239, 68, 68, 0.10)"
          />

          {/* Blood Oxygen */}
          <VitalSparklineCard
            label="Blood Oxygen"
            value={vitals.spo2.value}
            unit="%"
            status={vitals.spo2.status}
            statusLabel={vitals.spo2.statusLabel}
            normalRange={vitals.spo2.normalRange}
            icon={<Activity size={15} color={Colors.primary} />}
            iconBg={Colors.primaryFaded}
          />

          {/* Body Temperature */}
          <VitalSparklineCard
            label="Body Temp"
            value={vitals.temperature.value}
            unit="°C"
            status={vitals.temperature.status}
            statusLabel={vitals.temperature.statusLabel}
            normalRange={vitals.temperature.normalRange}
            icon={<Thermometer size={15} color={Colors.warning} />}
            iconBg="rgba(245, 158, 11, 0.10)"
          />

          {/* Daily Steps */}
          <VitalSparklineCard
            label="Daily Steps"
            value={vitals.steps.value}
            unit="steps"
            status={vitals.steps.status}
            statusLabel={vitals.steps.statusLabel}
            normalRange="Goal: 5,000"
            icon={<Footprints size={15} color={Colors.safe} />}
            iconBg={Colors.safeBg}
          />
        </View>

        <View style={{ height: Spacing.md }} />

        {/* ── 6. Operational Hub Shortcuts ────────────────────── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>CARE & ANALYTICS WORKSPACES</Text>
        </View>

        <View style={styles.hubList}>
          {/* Care & Medications */}
          <TouchableOpacity
            onPress={() => router.push('/(parent)/care' as any)}
            style={styles.hubCard}
            activeOpacity={0.8}
          >
            <View style={[styles.hubIconWrap, { backgroundColor: Colors.primaryFaded }]}>
              <Pill size={20} color={Colors.primary} />
            </View>
            <View style={styles.hubMeta}>
              <Text style={styles.hubTitle}>Today&apos;s Medication & Care Schedule</Text>
              <Text style={styles.hubSub}>
                {takenDoses} of {todayDoses.length} doses logged today · Adherence on track
              </Text>
            </View>
            <ChevronRight size={18} color={Colors.textTertiary} />
          </TouchableOpacity>

          {/* Health Trends & Reports */}
          <TouchableOpacity
            onPress={() => router.push('/(parent)/reports' as any)}
            style={styles.hubCard}
            activeOpacity={0.8}
          >
            <View style={[styles.hubIconWrap, { backgroundColor: Colors.safeBg }]}>
              <BarChart3 size={20} color={Colors.safe} />
            </View>
            <View style={styles.hubMeta}>
              <Text style={styles.hubTitle}>Health Trends & Physician Report</Text>
              <Text style={styles.hubSub}>
                24h/7d telemetry charts & Doctor Robert Chen care summary
              </Text>
            </View>
            <ChevronRight size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
        </View>

        <View style={{ height: Spacing['2xl'] }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  greetingText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 12,
  },
  userName: {
    ...Typography.h3,
    color: Colors.textPrimary,
    fontSize: 17,
  },
  settingsHeaderBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  alertBannerCard: {
    backgroundColor: '#FFF5F5',
    marginBottom: Spacing.base,
    borderLeftWidth: 4,
    borderLeftColor: Colors.critical,
  },
  alertBannerCritical: {
    backgroundColor: '#FFF5F5',
    borderLeftColor: Colors.critical,
  },
  alertBannerWarning: {
    backgroundColor: '#FFFBEB',
    borderLeftColor: Colors.warning,
  },
  alertBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  alertIconCircle: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    gap: 2,
  },
  respondTagText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.white,
    fontWeight: '700',
  },
  hardwareStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.full,
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  hwCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hwText: {
    ...Typography.captionMedium,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  hwDivider: {
    width: 1,
    height: 14,
    backgroundColor: Colors.borderLight,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.overline,
    color: Colors.textTertiary,
    letterSpacing: 0.8,
    fontSize: 11,
  },
  sectionSub: {
    ...Typography.caption,
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '500',
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  hubList: {
    gap: Spacing.sm,
  },
  hubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  hubIconWrap: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubMeta: {
    flex: 1,
  },
  hubTitle: {
    ...Typography.bodySemiBold,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  hubSub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
