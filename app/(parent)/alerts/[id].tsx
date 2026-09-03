import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  ShieldAlert,
  Phone,
  Clock,
  MapPin,
  Activity,
  Heart,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
} from 'lucide-react-native';
import { ScreenContainer, Button, Card, StatusBadge, TextInput, Divider } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAlerts } from '@/context/AlertContext';
import { useAuth } from '@/context/AuthContext';

export default function AlertDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { getAlertById, acknowledgeAlert, resolveAlert } = useAlerts();

  const alert = getAlertById(id || '');

  const [notes, setNotes] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!alert) {
    return (
      <ScreenContainer padded backgroundColor={Colors.background}>
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <Card style={styles.notFoundCard}>
          <AlertTriangle size={32} color={Colors.warning} />
          <Text style={styles.notFoundTitle}>Alert Not Found</Text>
          <Text style={styles.notFoundSub}>This alert may have been archived or removed.</Text>
          <Button title="Back to Alerts" onPress={() => router.back()} variant="secondary" />
        </Card>
      </ScreenContainer>
    );
  }

  const handleAcknowledge = () => {
    acknowledgeAlert(alert.id, `${user?.name || 'Eleanor Vance'} (Parent)`);
  };

  const handleResolve = () => {
    if (!notes.trim()) {
      setShowNoteInput(true);
      return;
    }
    setIsSubmitting(true);
    resolveAlert(alert.id, `${user?.name || 'Eleanor Vance'} (Parent)`, notes.trim());
    setIsSubmitting(false);
    setShowNoteInput(false);
  };

  const handleCallEmergency = (phone: string) => {
    const clean = phone.replace(/[^0-9+]/g, '');
    const url = Platform.OS === 'ios' ? `telprompt:${clean}` : `tel:${clean}`;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <ScreenContainer scrollable keyboardAvoiding padded backgroundColor={Colors.background}>
      {/* ── Top Navigation Bar ──────────────────────────────── */}
      <View style={styles.topNav}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={22} color={Colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.navTitle}>Incident Details</Text>

        <StatusBadge
          status={
            alert.status === 'resolved'
              ? 'safe'
              : alert.severity === 'critical'
              ? 'critical'
              : 'warning'
          }
          label={alert.status.toUpperCase()}
          size="sm"
        />
      </View>

      {/* ── 1. Severity Banner ──────────────────────────────── */}
      <Card
        elevated
        style={[
          styles.bannerCard,
          alert.severity === 'critical'
            ? styles.bannerCritical
            : alert.severity === 'warning'
            ? styles.bannerWarning
            : styles.bannerInfo,
        ]}
      >
        <View style={styles.bannerHeader}>
          <ShieldAlert
            size={24}
            color={
              alert.severity === 'critical'
                ? Colors.critical
                : alert.severity === 'warning'
                ? Colors.warning
                : Colors.primary
            }
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>{alert.title}</Text>
            <Text style={styles.bannerTarget}>Recipient: {alert.elderlyName}</Text>
          </View>
        </View>
        <Text style={styles.bannerDesc}>{alert.description}</Text>
      </Card>

      <View style={{ height: Spacing.md }} />

      {/* ── 2. Telemetry & Sensor Readings at Event ─────────── */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionLabel}>INCIDENT SENSOR TELEMETRY</Text>
        <View style={styles.telemetryGrid}>
          {alert.vitalReadings?.heartRate && (
            <View style={styles.telemetryBox}>
              <Heart size={18} color={Colors.critical} />
              <Text style={styles.telemetryVal}>{alert.vitalReadings.heartRate} bpm</Text>
              <Text style={styles.telemetryLbl}>Pulse at Impact</Text>
            </View>
          )}

          {alert.vitalReadings?.spo2 && (
            <View style={styles.telemetryBox}>
              <Activity size={18} color={Colors.primary} />
              <Text style={styles.telemetryVal}>{alert.vitalReadings.spo2}%</Text>
              <Text style={styles.telemetryLbl}>Oxygen Saturation</Text>
            </View>
          )}

          {alert.vitalReadings?.impactGForce && (
            <View style={styles.telemetryBox}>
              <AlertTriangle size={18} color={Colors.critical} />
              <Text style={styles.telemetryVal}>{alert.vitalReadings.impactGForce}G</Text>
              <Text style={styles.telemetryLbl}>Impact Force</Text>
            </View>
          )}
        </View>

        <Divider spacing={Spacing.md} />

        <View style={styles.metaRow}>
          <Clock size={16} color={Colors.textTertiary} />
          <Text style={styles.metaText}>{alert.timestamp}</Text>
        </View>

        <View style={styles.metaRow}>
          <MapPin size={16} color={Colors.textTertiary} />
          <Text style={styles.metaText}>{alert.location}</Text>
        </View>
      </Card>

      <View style={{ height: Spacing.md }} />

      {/* ── 3. Emergency Quick Dial Actions ─────────────────── */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionLabel}>EMERGENCY RESPONSE CALLS</Text>
        <View style={styles.dialActionsRow}>
          <TouchableOpacity
            onPress={() => handleCallEmergency('911')}
            style={styles.emergencyDialBtn}
            activeOpacity={0.8}
          >
            <Phone size={18} color={Colors.white} />
            <Text style={styles.emergencyDialText}>Call 911 / EMS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleCallEmergency('+1 (555) 782-9012')}
            style={styles.caregiverDialBtn}
            activeOpacity={0.8}
          >
            <Phone size={18} color={Colors.primary} />
            <Text style={styles.caregiverDialText}>Call Margaret</Text>
          </TouchableOpacity>
        </View>
      </Card>

      <View style={{ height: Spacing.md }} />

      {/* ── 4. Incident Response Lifecycle ──────────────────── */}
      <Card style={styles.sectionCard}>
        <Text style={styles.sectionLabel}>INCIDENT RESOLUTION TIMELINE</Text>

        {alert.status === 'active' && (
          <View style={styles.actionStateBox}>
            <Text style={styles.stateNoticeText}>
              This incident is currently ACTIVE. Please acknowledge receipt to notify other caregivers that assistance is underway.
            </Text>
            <Button
              title="Acknowledge Alert"
              onPress={handleAcknowledge}
              variant="primary"
              size="md"
              fullWidth
              leftIcon={<CheckCircle2 size={18} color={Colors.white} />}
            />
          </View>
        )}

        {alert.status === 'acknowledged' && (
          <View style={styles.timelineItem}>
            <UserCheck size={18} color={Colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.timelineTitle}>Acknowledged by {alert.acknowledgedBy}</Text>
              <Text style={styles.timelineTime}>{alert.acknowledgedAt}</Text>
            </View>
          </View>
        )}

        {alert.status !== 'resolved' && (
          <View style={{ marginTop: Spacing.md }}>
            {showNoteInput ? (
              <View>
                <TextInput
                  label="Resolution & Check Notes *"
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="e.g. Senior is safe on couch, vitals normalized, no injuries."
                  multiline
                />
                <View style={{ height: Spacing.sm }} />
                <Button
                  title="Submit & Mark Resolved"
                  onPress={handleResolve}
                  variant="primary"
                  size="md"
                  fullWidth
                  loading={isSubmitting}
                />
              </View>
            ) : (
              <Button
                title="Mark Incident as Resolved"
                onPress={() => setShowNoteInput(true)}
                variant="secondary"
                size="md"
                fullWidth
              />
            )}
          </View>
        )}

        {alert.status === 'resolved' && (
          <View style={styles.resolvedBox}>
            <CheckCircle2 size={22} color={Colors.safe} />
            <View style={{ flex: 1 }}>
              <Text style={styles.resolvedTitle}>Incident Resolved</Text>
              <Text style={styles.resolvedBy}>Resolved by: {alert.resolvedBy}</Text>
              {alert.resolutionNotes && (
                <Text style={styles.resolvedNotes}>&quot;{alert.resolutionNotes}&quot;</Text>
              )}
            </View>
          </View>
        )}
      </Card>

      <View style={{ height: Spacing['2xl'] }} />
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
  bannerCard: {
    backgroundColor: Colors.white,
    borderLeftWidth: 4,
  },
  bannerCritical: {
    borderLeftColor: Colors.critical,
  },
  bannerWarning: {
    borderLeftColor: Colors.warning,
  },
  bannerInfo: {
    borderLeftColor: Colors.primary,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xs,
  },
  bannerTitle: {
    ...Typography.h3,
    fontSize: 18,
    color: Colors.textPrimary,
  },
  bannerTarget: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  bannerDesc: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: Colors.white,
  },
  sectionLabel: {
    ...Typography.overline,
    color: Colors.textTertiary,
    letterSpacing: 1,
    marginBottom: Spacing.base,
  },
  telemetryGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  telemetryBox: {
    flex: 1,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    alignItems: 'center',
  },
  telemetryVal: {
    ...Typography.bodySemiBold,
    fontSize: 16,
    color: Colors.textPrimary,
    marginTop: 4,
  },
  telemetryLbl: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textTertiary,
    marginTop: 2,
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 3,
  },
  metaText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  dialActionsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  emergencyDialBtn: {
    flex: 1,
    height: 48,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.critical,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  emergencyDialText: {
    ...Typography.button,
    color: Colors.white,
    fontSize: 14,
  },
  caregiverDialBtn: {
    flex: 1,
    height: 48,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primaryFaded,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  caregiverDialText: {
    ...Typography.button,
    color: Colors.primary,
    fontSize: 14,
  },
  actionStateBox: {
    gap: Spacing.md,
  },
  stateNoticeText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.primaryFaded,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  timelineTitle: {
    ...Typography.bodySmallSemiBold,
    color: Colors.primary,
  },
  timelineTime: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  resolvedBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.safeBg,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  resolvedTitle: {
    ...Typography.bodySmallSemiBold,
    color: Colors.safe,
  },
  resolvedBy: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  resolvedNotes: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  notFoundCard: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
    gap: Spacing.md,
  },
  notFoundTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  notFoundSub: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
});
