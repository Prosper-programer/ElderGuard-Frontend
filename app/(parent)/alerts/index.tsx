import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  AlertTriangle,
  ShieldAlert,
  Heart,
  Battery,
  ChevronRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react-native';
import { Card, StatusBadge, BottomTabBar } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAlerts } from '@/context/AlertContext';
import { useVitals } from '@/context/VitalsContext';
import { AlertIncident } from '@/types/alerts';

export default function AlertsListScreen() {
  const router = useRouter();
  const { alerts, triggerAlert } = useAlerts();
  const { simulateAnomaly, resetToNormal } = useVitals();

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'resolved'>('all');

  const filteredAlerts = alerts.filter((a) => {
    if (activeTab === 'active') return a.status === 'active' || a.status === 'acknowledged';
    if (activeTab === 'resolved') return a.status === 'resolved';
    return true;
  });

  const handleSimulateFall = () => {
    simulateAnomaly('fall');
    triggerAlert({
      type: 'fall',
      severity: 'critical',
      title: 'Sudden Fall Detected',
      description: 'Accelerometer detected sudden 3.4G downward impact in Kitchen.',
      elderlyId: 'eld-01',
      elderlyName: 'Margaret Johnson',
      location: 'Kitchen Area — 142 Elm Street',
      vitalReadings: {
        heartRate: 119,
        spo2: 96,
        impactGForce: 3.4,
      },
    });
  };

  const handleSimulateTachycardia = () => {
    simulateAnomaly('tachycardia');
    triggerAlert({
      type: 'heart_rate',
      severity: 'critical',
      title: 'High Heart Rate Spiked (>135 bpm)',
      description: 'Resting pulse reached 138 bpm while elderly person is stationary.',
      elderlyId: 'eld-01',
      elderlyName: 'Margaret Johnson',
      location: 'Bedroom Residence',
      vitalReadings: {
        heartRate: 138,
        spo2: 97,
      },
    });
  };

  const getAlertIcon = (type: AlertIncident['type'], severity: AlertIncident['severity']) => {
    const color =
      severity === 'critical'
        ? Colors.critical
        : severity === 'warning'
        ? Colors.warning
        : Colors.primary;

    switch (type) {
      case 'fall':
        return <ShieldAlert size={20} color={color} />;
      case 'heart_rate':
        return <Heart size={20} color={color} />;
      case 'battery':
        return <Battery size={20} color={color} />;
      default:
        return <AlertTriangle size={20} color={color} />;
    }
  };

  return (
    <View style={styles.outerContainer}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top Header ──────────────────────────────────────── */}
        <View style={styles.topHeader}>
          <Text style={styles.screenTitle}>Incident & Alert Center</Text>
          <Text style={styles.screenSub}>Continuous 24/7 safety monitoring</Text>
        </View>

        {/* ── Simulation / Testing Strip ───────────────────────── */}
        <Card style={styles.simulateCard}>
          <View style={styles.simHeader}>
            <Sparkles size={14} color={Colors.primary} />
            <Text style={styles.simTitle}>SIMULATE INCIDENTS FOR TESTING</Text>
          </View>
          <View style={styles.simButtonsRow}>
            <TouchableOpacity
              onPress={handleSimulateFall}
              style={[styles.simBtn, { backgroundColor: 'rgba(239, 68, 68, 0.12)' }]}
            >
              <Text style={[styles.simBtnText, { color: Colors.critical }]}>+ Trigger Fall</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSimulateTachycardia}
              style={[styles.simBtn, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}
            >
              <Text style={[styles.simBtnText, { color: Colors.warning }]}>+ High Pulse</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={resetToNormal}
              style={[styles.simBtn, { backgroundColor: Colors.surfaceSecondary }]}
            >
              <Text style={[styles.simBtnText, { color: Colors.textSecondary }]}>Reset Vitals</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <View style={{ height: Spacing.md }} />

        {/* ── Filter Tabs ─────────────────────────────────────── */}
        <View style={styles.tabsRow}>
          {(['all', 'active', 'resolved'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'all'
                  ? `All (${alerts.length})`
                  : tab === 'active'
                  ? `Active (${alerts.filter((a) => a.status !== 'resolved').length})`
                  : `Resolved (${alerts.filter((a) => a.status === 'resolved').length})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: Spacing.base }} />

        {/* ── Alerts List ─────────────────────────────────────── */}
        {filteredAlerts.length === 0 ? (
          <Card style={styles.emptyCard}>
            <CheckCircle2 size={40} color={Colors.safe} />
            <Text style={styles.emptyTitle}>No Alerts in this Category</Text>
            <Text style={styles.emptySubtitle}>All sensors and vital signs are currently normal.</Text>
          </Card>
        ) : (
          <View style={styles.alertsList}>
            {filteredAlerts.map((alert) => (
              <TouchableOpacity
                key={alert.id}
                onPress={() => router.push(`/(parent)/alerts/${alert.id}` as any)}
                activeOpacity={0.8}
              >
                <Card
                  elevated={alert.status === 'active'}
                  style={[
                    styles.alertCard,
                    alert.severity === 'critical' && alert.status !== 'resolved' && styles.alertCardCritical,
                  ]}
                >
                  <View style={styles.alertRow}>
                    <View
                      style={[
                        styles.alertIconCircle,
                        alert.severity === 'critical'
                          ? { backgroundColor: 'rgba(239, 68, 68, 0.12)' }
                          : alert.severity === 'warning'
                          ? { backgroundColor: 'rgba(245, 158, 11, 0.12)' }
                          : { backgroundColor: Colors.primaryFaded },
                      ]}
                    >
                      {getAlertIcon(alert.type, alert.severity)}
                    </View>

                    <View style={styles.alertMeta}>
                      <View style={styles.alertHeaderRow}>
                        <Text style={styles.alertTitle} numberOfLines={1}>
                          {alert.title}
                        </Text>
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

                      <Text style={styles.alertDesc} numberOfLines={2}>
                        {alert.description}
                      </Text>

                      <View style={styles.alertFooterRow}>
                        <Text style={styles.alertTime}>{alert.timestamp}</Text>
                        <Text style={styles.alertLoc}>· {alert.location}</Text>
                      </View>
                    </View>

                    <ChevronRight size={18} color={Colors.textTertiary} />
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: Spacing['3xl'] }} />
      </ScrollView>

      {/* ── Pinned Bottom Tab Bar ────────────────────────────── */}
      <BottomTabBar activeTab="alerts" role="parent" />
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
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
  simulateCard: {
    backgroundColor: Colors.white,
    borderColor: 'rgba(60, 111, 219, 0.25)',
    borderWidth: 1,
  },
  simHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  simTitle: {
    ...Typography.overline,
    fontSize: 10,
    color: Colors.primary,
    letterSpacing: 1,
  },
  simButtonsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  simBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: BorderRadius.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  simBtnText: {
    ...Typography.captionMedium,
    fontSize: 11,
    fontWeight: '600',
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSecondary,
    padding: 3,
    borderRadius: BorderRadius.full,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: BorderRadius.full,
  },
  tabActive: {
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  alertsList: {
    gap: Spacing.md,
  },
  alertCard: {
    backgroundColor: Colors.white,
  },
  alertCardCritical: {
    borderColor: Colors.critical,
    borderWidth: 1.5,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  alertIconCircle: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertMeta: {
    flex: 1,
  },
  alertHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 3,
  },
  alertTitle: {
    ...Typography.bodySemiBold,
    fontSize: 15,
    color: Colors.textPrimary,
    flex: 1,
  },
  alertDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  alertFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  alertTime: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textTertiary,
  },
  alertLoc: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  emptyCard: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
  },
  emptyTitle: {
    ...Typography.bodySemiBold,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
});
