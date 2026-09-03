import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronRight,
  Phone,
  Settings,
  ShieldAlert,
  Pill,
  Heart,
  Activity,
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
    <ScreenContainer
      scrollable
      padded
      backgroundColor="#F8FAFC"
      bottomBar={<BottomTabBar activeTab="home" role="caregiver" />}
    >
      {/* ── 1. Top Modern Header ────────────────────────────── */}
        <View style={styles.headerRow}>
          <View style={styles.userInfo}>
            <Avatar name={user?.name || 'David Miller'} size={42} statusIndicator="safe" />
            <View>
              <Text style={styles.greetingText}>On Active Care Duty,</Text>
              <Text style={styles.userName}>{user?.name || 'David Miller'}</Text>
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

        {/* ── 2. Active Urgent Incident Banner (If Any) ───────── */}
        {activeAlerts.length > 0 && (
          <TouchableOpacity
            onPress={() => router.push('/(caregiver)/alerts' as any)}
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
                  <Text style={styles.respondTagText}>Attend</Text>
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
          medsCompleted={takenCount}
          medsTotal={todayDoses.length}
          statusMessage={vitals.overallStatusMessage}
          location="Assigned Recipient · 142 Elm Street"
        />

        {/* ── 4. Emergency Family Manager Call Bar ────────────── */}
        {primaryContact && (
          <View style={styles.emergencyBar}>
            <View style={{ flex: 1 }}>
              <Text style={styles.emergencyBarLabel}>FAMILY MANAGER CONTACT</Text>
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
              <Text style={styles.emergencyCallText}>Call Eleanor</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: Spacing.lg }} />

        {/* ── 5. Real-Time Vitals Telemetry (Sparklines) ──────── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>REAL-TIME VITALS TELEMETRY</Text>
          <Text style={styles.sectionSub}>Continuous IoT Stream</Text>
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

        {/* ── 6. Operational Care Actions ─────────────────────── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>ACTIVE CARE TASKS</Text>
        </View>

        <View style={styles.hubList}>
          {/* Medication Administration */}
          <TouchableOpacity
            onPress={() => router.push('/(caregiver)/care' as any)}
            style={styles.hubCard}
            activeOpacity={0.8}
          >
            <View style={[styles.hubIconWrap, { backgroundColor: Colors.safeBg }]}>
              <Pill size={20} color={Colors.safe} />
            </View>
            <View style={styles.hubMeta}>
              <Text style={styles.hubTitle}>Administer Prescribed Doses</Text>
              <Text style={styles.hubSub}>
                {takenCount} of {todayDoses.length} doses logged · 1 dose remaining
              </Text>
            </View>
            <ChevronRight size={18} color={Colors.textTertiary} />
          </TouchableOpacity>

          {/* Incident Response */}
          <TouchableOpacity
            onPress={() => router.push('/(caregiver)/alerts' as any)}
            style={styles.hubCard}
            activeOpacity={0.8}
          >
            <View style={[styles.hubIconWrap, { backgroundColor: 'rgba(239, 68, 68, 0.12)' }]}>
              <ShieldAlert size={20} color={Colors.critical} />
            </View>
            <View style={styles.hubMeta}>
              <Text style={styles.hubTitle}>Incident & Alert Log</Text>
              <Text style={styles.hubSub}>
                {activeAlerts.length} active incident · Check Margaret&apos;s status
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
    backgroundColor: Colors.safe,
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
  emergencyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  emergencyBarLabel: {
    ...Typography.overline,
    fontSize: 9,
    color: Colors.textTertiary,
    letterSpacing: 0.5,
  },
  emergencyBarName: {
    ...Typography.bodySmallSemiBold,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  emergencyCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
  },
  emergencyCallText: {
    ...Typography.captionMedium,
    color: Colors.white,
    fontWeight: '600',
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
    color: Colors.safe,
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
