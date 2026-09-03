import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Pill,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Droplets,
  Activity,
  Heart,
} from 'lucide-react-native';
import { ScreenContainer, Card, StatusBadge, Button } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useCare } from '@/context/CareContext';
import { useAuth } from '@/context/AuthContext';

export default function ParentCareScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { todayDoses, activities, markDoseStatus, updateActivityProgress } = useCare();

  const handleMarkTaken = (doseId: string) => {
    markDoseStatus(doseId, 'taken', `${user?.name || 'Eleanor Vance'} (Parent)`);
  };

  const handleMarkMissed = (doseId: string) => {
    markDoseStatus(doseId, 'missed', `${user?.name || 'Eleanor Vance'} (Parent)`);
  };

  const handleAddWater = (activityId: string) => {
    updateActivityProgress(activityId, 0.25, `${user?.name || 'Eleanor Vance'} (Parent)`);
  };

  const handleAddWalk = (activityId: string) => {
    updateActivityProgress(activityId, 5, `${user?.name || 'Eleanor Vance'} (Parent)`);
  };

  const takenCount = todayDoses.filter((d) => d.status === 'taken').length;
  const adherenceRate = Math.round((takenCount / todayDoses.length) * 100);

  return (
    <ScreenContainer scrollable padded backgroundColor={Colors.background}>
      {/* ── Top Navigation Bar ──────────────────────────────── */}
      <View style={styles.topNav}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={22} color={Colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.navTitle}>Medications & Care</Text>

        <TouchableOpacity
          onPress={() => router.push('/(parent)/care/new-medication' as any)}
          style={styles.addNavBtn}
          activeOpacity={0.8}
        >
          <Plus size={18} color={Colors.primary} />
          <Text style={styles.addNavBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* ── 1. Adherence Summary Card ───────────────────────── */}
      <Card elevated style={styles.summaryCard}>
        <View style={styles.summaryHeaderRow}>
          <View style={styles.summaryIconCircle}>
            <Pill size={22} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.summaryTitle}>Today&apos;s Adherence: {adherenceRate}%</Text>
            <Text style={styles.summarySub}>
              {takenCount} of {todayDoses.length} doses logged today
            </Text>
          </View>
          <StatusBadge
            status={adherenceRate >= 80 ? 'safe' : adherenceRate >= 50 ? 'warning' : 'critical'}
            label={adherenceRate >= 80 ? 'EXCELLENT' : 'NEEDS ATTENTION'}
            size="sm"
          />
        </View>

        {/* Progress bar */}
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${adherenceRate}%` }]} />
        </View>
      </Card>

      <View style={{ height: Spacing.lg }} />

      {/* ── 2. Today's Medication Doses ─────────────────────── */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>TODAY&apos;S DOSAGE SCHEDULE</Text>
      </View>

      <View style={styles.dosesList}>
        {todayDoses.map((dose) => {
          const isTaken = dose.status === 'taken';
          const isMissed = dose.status === 'missed';

          return (
            <Card key={dose.id} style={styles.doseCard}>
              <View style={styles.doseTopRow}>
                <View style={[styles.doseIcon, isTaken && styles.doseIconTaken]}>
                  <Pill size={20} color={isTaken ? Colors.safe : Colors.primary} />
                </View>

                <View style={styles.doseInfo}>
                  <Text style={styles.doseName}>{dose.medicationName}</Text>
                  <Text style={styles.doseDosage}>{dose.dosage}</Text>
                </View>

                <View style={styles.timeTag}>
                  <Clock size={12} color={Colors.textSecondary} />
                  <Text style={styles.timeTagText}>{dose.scheduledTime}</Text>
                </View>
              </View>

              {dose.loggedBy && (
                <Text style={styles.loggedByText}>
                  Logged by {dose.loggedBy} at {dose.loggedAt}
                </Text>
              )}

              {/* Action Buttons */}
              <View style={styles.doseActionsRow}>
                <TouchableOpacity
                  onPress={() => handleMarkTaken(dose.id)}
                  style={[styles.doseActionBtn, isTaken && styles.doseActionTakenActive]}
                  activeOpacity={0.8}
                >
                  <CheckCircle2 size={16} color={isTaken ? Colors.white : Colors.safe} />
                  <Text style={[styles.doseActionText, isTaken && { color: Colors.white }]}>
                    {isTaken ? 'Taken' : 'Mark Taken'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleMarkMissed(dose.id)}
                  style={[styles.doseActionBtn, isMissed && styles.doseActionMissedActive]}
                  activeOpacity={0.8}
                >
                  <XCircle size={16} color={isMissed ? Colors.white : Colors.critical} />
                  <Text style={[styles.doseActionText, isMissed && { color: Colors.white }]}>
                    {isMissed ? 'Missed' : 'Mark Missed'}
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
          );
        })}
      </View>

      <View style={{ height: Spacing.xl }} />

      {/* ── 3. Daily Care Activities ────────────────────────── */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>DAILY WELLNESS ACTIVITIES</Text>
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
                    <Droplets size={20} color={isDone ? Colors.safe : Colors.primary} />
                  ) : act.category === 'mobility' ? (
                    <Activity size={20} color={isDone ? Colors.safe : Colors.warning} />
                  ) : (
                    <Heart size={20} color={Colors.critical} />
                  )}
                </View>

                <View style={styles.actInfo}>
                  <Text style={styles.actTitle}>{act.title}</Text>
                  <Text style={styles.actProgress}>
                    {act.current} / {act.target} {act.unit} ({pct}%)
                  </Text>
                  {act.notes && <Text style={styles.actNotes}>{act.notes}</Text>}
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

              {/* Activity Progress Bar */}
              <View style={styles.actProgressTrack}>
                <View
                  style={[
                    styles.actProgressFill,
                    {
                      width: `${pct}%`,
                      backgroundColor: isDone ? Colors.safe : Colors.primary,
                    },
                  ]}
                />
              </View>
            </Card>
          );
        })}
      </View>

      <View style={{ height: Spacing.xl }} />

      <Button
        title="Add New Prescribed Medication"
        onPress={() => router.push('/(parent)/care/new-medication' as any)}
        variant="primary"
        size="lg"
        fullWidth
        leftIcon={<Plus size={18} color={Colors.white} />}
      />

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
  addNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryFaded,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  addNavBtnText: {
    ...Typography.captionMedium,
    color: Colors.primary,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: Colors.white,
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  summaryIconCircle: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTitle: {
    ...Typography.bodySemiBold,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  summarySub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  progressBarTrack: {
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceSecondary,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  sectionHeaderRow: {
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.overline,
    color: Colors.textTertiary,
    letterSpacing: 1,
  },
  dosesList: {
    gap: Spacing.md,
  },
  doseCard: {
    backgroundColor: Colors.white,
  },
  doseTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  doseIcon: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doseIconTaken: {
    backgroundColor: Colors.safeBg,
  },
  doseInfo: {
    flex: 1,
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
    borderRadius: BorderRadius.xs,
  },
  timeTagText: {
    ...Typography.captionMedium,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  loggedByText: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginTop: 6,
    fontSize: 11,
  },
  doseActionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  doseActionBtn: {
    flex: 1,
    height: 38,
    borderRadius: BorderRadius.sm,
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
  activitiesList: {
    gap: Spacing.md,
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
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryFaded,
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
  actNotes: {
    ...Typography.caption,
    color: Colors.textTertiary,
    fontSize: 11,
    marginTop: 2,
  },
  quickIncrementBtn: {
    backgroundColor: Colors.primaryFaded,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  quickIncrementText: {
    ...Typography.captionMedium,
    color: Colors.primary,
    fontWeight: '600',
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
