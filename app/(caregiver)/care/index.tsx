import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Pill,
  CheckCircle2,
  XCircle,
  Clock,
  Droplets,
  Activity,
  Heart,
  Sun,
  Sunrise,
  Moon,
} from 'lucide-react-native';
import { ScreenContainer, Card, StatusBadge, BottomTabBar } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useCare } from '@/context/CareContext';
import { useAuth } from '@/context/AuthContext';
import { MedicationDose } from '@/types/care';

export default function CaregiverCareScreen() {
  const { user } = useAuth();
  const { todayDoses, activities, markDoseStatus, updateActivityProgress } = useCare();

  const handleMarkTaken = (doseId: string) => {
    markDoseStatus(doseId, 'taken', `${user?.name || 'David Miller'} (Caregiver)`);
  };

  const handleMarkMissed = (doseId: string) => {
    markDoseStatus(doseId, 'missed', `${user?.name || 'David Miller'} (Caregiver)`);
  };

  const handleAddWater = (activityId: string) => {
    updateActivityProgress(activityId, 0.25, `${user?.name || 'David Miller'} (Caregiver)`);
  };

  const handleAddWalk = (activityId: string) => {
    updateActivityProgress(activityId, 5, `${user?.name || 'David Miller'} (Caregiver)`);
  };

  const takenCount = todayDoses.filter((d) => d.status === 'taken').length;
  const adherenceRate = Math.round((takenCount / todayDoses.length) * 100);

  // Group doses into dayparts
  const morningDoses = todayDoses.filter((d) => d.scheduledTime.includes('AM'));
  const afternoonDoses = todayDoses.filter((d) => d.scheduledTime.includes('12:') || d.scheduledTime.includes('01:') || d.scheduledTime.includes('02:'));
  const eveningDoses = todayDoses.filter((d) => d.scheduledTime.includes('PM') && !afternoonDoses.includes(d));

  const renderDoseItem = (dose: MedicationDose) => {
    const isTaken = dose.status === 'taken';
    const isMissed = dose.status === 'missed';

    return (
      <View key={dose.id} style={[styles.doseItemCard, isTaken && styles.doseItemTaken]}>
        <View style={styles.doseItemHeader}>
          <View style={[styles.doseIconBox, isTaken && { backgroundColor: Colors.safeBg }]}>
            <Pill size={18} color={isTaken ? Colors.safe : Colors.safe} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.doseName}>{dose.medicationName}</Text>
            <Text style={styles.doseDosage}>{dose.dosage}</Text>
          </View>

          <View style={styles.timeTag}>
            <Clock size={11} color={Colors.textSecondary} />
            <Text style={styles.timeTagText}>{dose.scheduledTime}</Text>
          </View>
        </View>

        {dose.loggedBy && (
          <Text style={styles.loggedByText}>
            Logged by {dose.loggedBy} at {dose.loggedAt}
          </Text>
        )}

        <View style={styles.doseActionsRow}>
          <TouchableOpacity
            onPress={() => handleMarkTaken(dose.id)}
            style={[styles.doseActionBtn, isTaken && styles.doseActionTakenActive]}
            activeOpacity={0.8}
          >
            <CheckCircle2 size={15} color={isTaken ? Colors.white : Colors.safe} />
            <Text style={[styles.doseActionText, isTaken && { color: Colors.white }]}>
              {isTaken ? 'Administered' : 'Mark Administered'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleMarkMissed(dose.id)}
            style={[styles.doseActionBtn, isMissed && styles.doseActionMissedActive]}
            activeOpacity={0.8}
          >
            <XCircle size={15} color={isMissed ? Colors.white : Colors.critical} />
            <Text style={[styles.doseActionText, isMissed && { color: Colors.white }]}>
              {isMissed ? 'Refused / Missed' : 'Mark Missed'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer
      scrollable
      padded
      backgroundColor="#F8FAFC"
      bottomBar={<BottomTabBar activeTab="care" role="caregiver" />}
    >
      {/* ── Top Header ──────────────────────────────────────── */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.screenTitle}>Care & Medications</Text>
            <Text style={styles.screenSub}>Administer Margaret Johnson&apos;s daily routine</Text>
          </View>
        </View>

        {/* ── Adherence Score Card ────────────────────────────── */}
        <Card elevated style={styles.adherenceCard}>
          <View style={styles.adherenceRow}>
            <View style={styles.adherenceIconCircle}>
              <Pill size={22} color={Colors.safe} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.adherenceTitle}>Adherence: {adherenceRate}%</Text>
              <Text style={styles.adherenceSub}>
                {takenCount} of {todayDoses.length} doses administered today
              </Text>
            </View>
            <StatusBadge
              status={adherenceRate >= 80 ? 'safe' : 'warning'}
              label={adherenceRate >= 80 ? 'ON TRACK' : 'PENDING'}
              size="sm"
            />
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${adherenceRate}%` }]} />
          </View>
        </Card>

        <View style={{ height: Spacing.lg }} />

        {/* ── Daypart 1: Morning Schedule ─────────────────────── */}
        <View style={styles.daypartHeader}>
          <Sunrise size={16} color="#D97706" />
          <Text style={styles.daypartTitle}>MORNING DOSES (08:00 AM)</Text>
        </View>
        <View style={styles.daypartGroup}>
          {morningDoses.map(renderDoseItem)}
        </View>

        <View style={{ height: Spacing.md }} />

        {/* ── Daypart 2: Afternoon Schedule ───────────────────── */}
        <View style={styles.daypartHeader}>
          <Sun size={16} color="#2563EB" />
          <Text style={styles.daypartTitle}>AFTERNOON DOSES (12:30 PM)</Text>
        </View>
        <View style={styles.daypartGroup}>
          {afternoonDoses.map(renderDoseItem)}
        </View>

        <View style={{ height: Spacing.md }} />

        {/* ── Daypart 3: Evening Schedule ─────────────────────── */}
        <View style={styles.daypartHeader}>
          <Moon size={16} color="#7C3AED" />
          <Text style={styles.daypartTitle}>EVENING DOSES (07:00 PM)</Text>
        </View>
        <View style={styles.daypartGroup}>
          {eveningDoses.map(renderDoseItem)}
        </View>

        <View style={{ height: Spacing.xl }} />

        {/* ── Daily Wellness Assistance ───────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>DAILY ASSISTANCE ROUTINE</Text>
        </View>

        <View style={styles.activitiesList}>
          {activities.map((act) => {
            const isDone = act.status === 'completed';
            const pct = Math.min(100, Math.round((act.current / act.target) * 100));

            return (
              <Card key={act.id} style={styles.actCard}>
                <View style={styles.actRow}>
                  <View style={[styles.actIconCircle, isDone && { backgroundColor: Colors.safeBg }]}>
                    {act.category === 'hydration' ? (
                      <Droplets size={18} color={isDone ? Colors.safe : Colors.primary} />
                    ) : act.category === 'mobility' ? (
                      <Activity size={18} color={isDone ? Colors.safe : Colors.warning} />
                    ) : (
                      <Heart size={18} color={Colors.critical} />
                    )}
                  </View>

                  <View style={styles.actInfo}>
                    <Text style={styles.actTitle}>{act.title}</Text>
                    <Text style={styles.actProgress}>
                      {act.current} / {act.target} {act.unit} ({pct}%)
                    </Text>
                  </View>

                  {act.category === 'hydration' && !isDone && (
                    <TouchableOpacity
                      onPress={() => handleAddWater(act.id)}
                      style={styles.quickIncrementBtn}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.quickIncrementText}>+250ml</Text>
                    </TouchableOpacity>
                  )}

                  {act.category === 'mobility' && !isDone && (
                    <TouchableOpacity
                      onPress={() => handleAddWalk(act.id)}
                      style={styles.quickIncrementBtn}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.quickIncrementText}>+5 min</Text>
                    </TouchableOpacity>
                  )}

                  {isDone && <CheckCircle2 size={22} color={Colors.safe} />}
                </View>

                {/* Progress bar */}
                <View style={styles.actProgressTrack}>
                  <View
                    style={[
                      styles.actProgressFill,
                      {
                        width: `${pct}%`,
                        backgroundColor: Colors.safe,
                      },
                    ]}
                  />
                </View>
              </Card>
            );
          })}
        </View>

        <View style={{ height: Spacing['2xl'] }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    marginBottom: Spacing.base,
  },
  screenTitle: {
    ...Typography.h2,
    fontSize: 22,
    color: Colors.textPrimary,
  },
  screenSub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  adherenceCard: {
    backgroundColor: Colors.white,
  },
  adherenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  adherenceIconCircle: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.safeBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adherenceTitle: {
    ...Typography.bodySemiBold,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  adherenceSub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  progressTrack: {
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceSecondary,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.safe,
    borderRadius: BorderRadius.full,
  },
  daypartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.xs,
  },
  daypartTitle: {
    ...Typography.overline,
    color: Colors.textSecondary,
    fontSize: 11,
    letterSpacing: 0.8,
  },
  daypartGroup: {
    gap: Spacing.sm,
  },
  doseItemCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  doseItemTaken: {
    borderColor: 'rgba(34, 197, 94, 0.3)',
    backgroundColor: '#F0FDF4',
  },
  doseItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  doseIconBox: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.safeBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doseName: {
    ...Typography.bodySemiBold,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  doseDosage: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  timeTagText: {
    ...Typography.captionMedium,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  loggedByText: {
    ...Typography.caption,
    color: Colors.safe,
    marginTop: 6,
    fontSize: 11,
    fontWeight: '500',
  },
  doseActionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  doseActionBtn: {
    flex: 1,
    height: 38,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceSecondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  doseActionTakenActive: {
    backgroundColor: Colors.safe,
  },
  doseActionMissedActive: {
    backgroundColor: Colors.critical,
  },
  doseActionText: {
    ...Typography.captionMedium,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  sectionHeader: {
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    ...Typography.overline,
    color: Colors.textTertiary,
    letterSpacing: 0.8,
    fontSize: 11,
  },
  activitiesList: {
    gap: Spacing.sm,
  },
  actCard: {
    backgroundColor: Colors.white,
  },
  actRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  actIconCircle: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.safeBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actInfo: {
    flex: 1,
  },
  actTitle: {
    ...Typography.bodySemiBold,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  actProgress: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  quickIncrementBtn: {
    backgroundColor: Colors.safeBg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  quickIncrementText: {
    ...Typography.captionMedium,
    color: Colors.safe,
    fontWeight: '700',
  },
  actProgressTrack: {
    height: 6,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  actProgressFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
});
