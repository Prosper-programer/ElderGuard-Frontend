import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Heart,
  Activity,
  FileText,
  Share2,
  TrendingUp,
  AlertTriangle,
  Download,
} from 'lucide-react-native';
import { ScreenContainer, Card, StatusBadge, Button, Divider } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useElderly } from '@/context/ElderlyContext';
import { useCare } from '@/context/CareContext';
import { useAlerts } from '@/context/AlertContext';

const HEART_RATE_HOURLY = [
  { hour: '06:00', bpm: 68, status: 'safe' },
  { hour: '08:00', bpm: 74, status: 'safe' },
  { hour: '10:00', bpm: 82, status: 'safe' },
  { hour: '12:00', bpm: 78, status: 'safe' },
  { hour: '14:00', bpm: 114, status: 'warning' },
  { hour: '16:00', bpm: 75, status: 'safe' },
  { hour: '18:00', bpm: 71, status: 'safe' },
  { hour: '20:00', bpm: 69, status: 'safe' },
];

export default function ReportsScreen() {
  const router = useRouter();
  const { activeProfile } = useElderly();
  const { todayDoses } = useCare();
  const { alerts } = useAlerts();

  const [timeframe, setTimeframe] = useState<'24h' | '7d'>('24h');
  const [reportModalVisible, setReportModalVisible] = useState(false);

  const takenDoses = todayDoses.filter((d) => d.status === 'taken').length;
  const adherence = Math.round((takenDoses / todayDoses.length) * 100);

  const handleExport = () => {
    if (Platform.OS === 'web') {
      window.print();
    } else {
      Alert.alert(
        'Export Summary Report',
        'Clinical Care Report for Dr. Robert Chen has been compiled and saved to device downloads.',
        [{ text: 'OK' }]
      );
    }
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

        <Text style={styles.navTitle}>Health Analytics & Reports</Text>

        <TouchableOpacity
          onPress={handleExport}
          style={styles.shareNavBtn}
          activeOpacity={0.8}
        >
          <Share2 size={18} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* ── Timeframe Selector ──────────────────────────────── */}
      <View style={styles.timeframeRow}>
        <TouchableOpacity
          onPress={() => setTimeframe('24h')}
          style={[styles.tfBtn, timeframe === '24h' && styles.tfBtnActive]}
          activeOpacity={0.8}
        >
          <Text style={[styles.tfText, timeframe === '24h' && styles.tfTextActive]}>
            Last 24 Hours
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setTimeframe('7d')}
          style={[styles.tfBtn, timeframe === '7d' && styles.tfBtnActive]}
          activeOpacity={0.8}
        >
          <Text style={[styles.tfText, timeframe === '7d' && styles.tfTextActive]}>
            Last 7 Days
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: Spacing.base }} />

      {/* ── 1. Stability & Wellness Score ───────────────────── */}
      <Card elevated style={styles.scoreCard}>
        <View style={styles.scoreRow}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNumber}>96%</Text>
            <Text style={styles.scoreLabel}>STABILITY</Text>
          </View>
          <View style={styles.scoreMeta}>
            <Text style={styles.scoreTitle}>Overall Vitals Normal</Text>
            <Text style={styles.scoreSubtitle}>
              {activeProfile.fullName}&apos;s physiological readings remained within safe clinical thresholds 96% of the monitored period.
            </Text>
            <View style={styles.badgeWrap}>
              <StatusBadge status="safe" label="Clinically Stable" size="sm" />
            </View>
          </View>
        </View>
      </Card>

      <View style={{ height: Spacing.md }} />

      {/* ── 2. Heart Rate Timeline Telemetry ─────────────────── */}
      <Card style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <View style={styles.chartIconTitle}>
            <Heart size={18} color={Colors.critical} />
            <Text style={styles.chartTitle}>Heart Rate Trend (bpm)</Text>
          </View>
          <Text style={styles.chartAvgText}>Avg: 74 bpm</Text>
        </View>

        {/* Visual Bar Graph */}
        <View style={styles.barsContainer}>
          {HEART_RATE_HOURLY.map((item, idx) => {
            const heightPct = Math.min(100, Math.max(25, (item.bpm / 140) * 100));
            const isAlert = item.status === 'warning';

            return (
              <View key={idx} style={styles.barCol}>
                <Text style={[styles.barVal, isAlert && { color: Colors.warning }]}>
                  {item.bpm}
                </Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${heightPct}%`,
                        backgroundColor: isAlert ? Colors.warning : Colors.primary,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barHour}>{item.hour}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.chartLegendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
            <Text style={styles.legendText}>Normal Resting (60-100)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.warning }]} />
            <Text style={styles.legendText}>Elevated Peak (&gt;100)</Text>
          </View>
        </View>
      </Card>

      <View style={{ height: Spacing.md }} />

      {/* ── 3. Oxygen Saturation (SpO2) Summary ─────────────── */}
      <Card style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <View style={styles.chartIconTitle}>
            <Activity size={18} color={Colors.primary} />
            <Text style={styles.chartTitle}>Blood Oxygen Saturation (SpO₂)</Text>
          </View>
          <Text style={styles.chartAvgText}>Avg: 98%</Text>
        </View>

        <View style={styles.spo2Row}>
          <View style={styles.spo2StatBox}>
            <Text style={styles.spo2StatVal}>98%</Text>
            <Text style={styles.spo2StatLbl}>Current Reading</Text>
          </View>
          <View style={styles.spo2StatBox}>
            <Text style={styles.spo2StatVal}>96%</Text>
            <Text style={styles.spo2StatLbl}>Lowest Recorded</Text>
          </View>
          <View style={styles.spo2StatBox}>
            <Text style={styles.spo2StatVal}>99%</Text>
            <Text style={styles.spo2StatLbl}>Peak Recorded</Text>
          </View>
        </View>
      </Card>

      <View style={{ height: Spacing.md }} />

      {/* ── 4. Medication Adherence & Incidents Summary ─────── */}
      <View style={styles.metricsGrid}>
        <Card style={styles.gridCard}>
          <TrendingUp size={20} color={Colors.safe} />
          <Text style={styles.gridVal}>{adherence}%</Text>
          <Text style={styles.gridLbl}>Med Adherence</Text>
        </Card>

        <Card style={styles.gridCard}>
          <AlertTriangle size={20} color={Colors.warning} />
          <Text style={styles.gridVal}>{alerts.length}</Text>
          <Text style={styles.gridLbl}>Incidents Logged</Text>
        </Card>
      </View>

      <View style={{ height: Spacing.xl }} />

      {/* ── 5. Generate Clinical Physician Summary Report ───── */}
      <Button
        title="Generate Clinical Physician Report"
        onPress={() => setReportModalVisible(!reportModalVisible)}
        variant="primary"
        size="lg"
        fullWidth
        leftIcon={<FileText size={18} color={Colors.white} />}
      />

      {reportModalVisible && (
        <View style={styles.reportPreviewCard}>
          <View style={styles.reportPreviewHeader}>
            <FileText size={20} color={Colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.reportTitle}>CLINICAL CARE SUMMARY</Text>
              <Text style={styles.reportSub}>For: Dr. Robert Chen, MD · {activeProfile.fullName}</Text>
            </View>
          </View>

          <Divider spacing={Spacing.sm} />

          <Text style={styles.reportSectionTitle}>PATIENT PROFILE</Text>
          <Text style={styles.reportItemText}>• Age / Gender: 78 yrs · Female</Text>
          <Text style={styles.reportItemText}>• Blood Type: O+ · Known Allergies: Penicillin, Sulfa drugs</Text>
          <Text style={styles.reportItemText}>• Chronic Conditions: Hypertension (Stage 1), Mild Osteoarthritis</Text>

          <Text style={styles.reportSectionTitle}>MONITORED METRICS</Text>
          <Text style={styles.reportItemText}>• Mean Resting Pulse: 74 bpm (Min 68, Max 118)</Text>
          <Text style={styles.reportItemText}>• Mean Blood Oxygen: 98% SpO₂</Text>
          <Text style={styles.reportItemText}>• Medication Adherence: {adherence}% Compliance</Text>
          <Text style={styles.reportItemText}>• Safety Incidents: {alerts.length} logged incidents resolved</Text>

          <View style={{ height: Spacing.md }} />

          <Button
            title="Export / Download PDF"
            onPress={handleExport}
            variant="secondary"
            size="md"
            fullWidth
            leftIcon={<Download size={16} color={Colors.primary} />}
          />
        </View>
      )}

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
  shareNavBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryFaded,
  },
  timeframeRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSecondary,
    padding: 3,
    borderRadius: BorderRadius.sm,
  },
  tfBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: BorderRadius.xs,
  },
  tfBtnActive: {
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  tfText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  tfTextActive: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  scoreCard: {
    backgroundColor: Colors.white,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.safeBg,
    borderColor: Colors.safe,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    ...Typography.h2,
    fontSize: 22,
    color: Colors.safe,
  },
  scoreLabel: {
    ...Typography.overline,
    fontSize: 8,
    color: Colors.safe,
    letterSpacing: 0.5,
  },
  scoreMeta: {
    flex: 1,
  },
  scoreTitle: {
    ...Typography.bodySemiBold,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  scoreSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginTop: 2,
  },
  badgeWrap: {
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  chartCard: {
    backgroundColor: Colors.white,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  chartIconTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chartTitle: {
    ...Typography.bodySemiBold,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  chartAvgText: {
    ...Typography.captionMedium,
    color: Colors.textSecondary,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barVal: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textTertiary,
    marginBottom: 4,
  },
  barTrack: {
    width: 14,
    height: 90,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: BorderRadius.full,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: BorderRadius.full,
  },
  barHour: {
    ...Typography.caption,
    fontSize: 9,
    color: Colors.textTertiary,
    marginTop: 6,
  },
  chartLegendRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
  },
  legendText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  spo2Row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  spo2StatBox: {
    flex: 1,
    backgroundColor: Colors.surfaceSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  spo2StatVal: {
    ...Typography.h3,
    color: Colors.primary,
  },
  spo2StatLbl: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textTertiary,
    marginTop: 2,
    textAlign: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  gridCard: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    padding: Spacing.md,
  },
  gridVal: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginTop: 4,
  },
  gridLbl: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  reportPreviewCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderColor: Colors.border,
    borderWidth: 1,
    padding: Spacing.base,
    marginTop: Spacing.md,
  },
  reportPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  reportTitle: {
    ...Typography.overline,
    color: Colors.primary,
    letterSpacing: 1,
  },
  reportSub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  reportSectionTitle: {
    ...Typography.overline,
    color: Colors.textTertiary,
    letterSpacing: 1,
    marginTop: Spacing.md,
    marginBottom: 4,
    fontSize: 10,
  },
  reportItemText: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
});
