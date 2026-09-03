import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  AlertTriangle,
  ShieldAlert,
  Heart,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react-native';
import { Card, StatusBadge, BottomTabBar } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAlerts } from '@/context/AlertContext';

export default function CaregiverAlertsScreen() {
  const router = useRouter();
  const { alerts } = useAlerts();

  const [activeTab, setActiveTab] = useState<'active' | 'all'>('active');

  const filteredAlerts = alerts.filter((a) => {
    if (activeTab === 'active') return a.status !== 'resolved';
    return true;
  });

  return (
    <View style={styles.outerContainer}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top Header ──────────────────────────────────────── */}
        <View style={styles.topHeader}>
          <Text style={styles.screenTitle}>Assigned Incidents</Text>
          <Text style={styles.screenSub}>Margaret Johnson&apos;s active safety alerts</Text>
        </View>

        {/* ── Tab Switcher ────────────────────────────────────── */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            onPress={() => setActiveTab('active')}
            style={[styles.tab, activeTab === 'active' && styles.tabActive]}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
              Active ({alerts.filter((a) => a.status !== 'resolved').length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('all')}
            style={[styles.tab, activeTab === 'all' && styles.tabActive]}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
              All Incidents ({alerts.length})
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: Spacing.base }} />

        {/* ── Incidents List ──────────────────────────────────── */}
        {filteredAlerts.length === 0 ? (
          <Card style={styles.emptyCard}>
            <CheckCircle2 size={40} color={Colors.safe} />
            <Text style={styles.emptyTitle}>No Active Incidents</Text>
            <Text style={styles.emptySubtitle}>Margaret Johnson is safe and vitals are normal.</Text>
          </Card>
        ) : (
          <View style={styles.alertsList}>
            {filteredAlerts.map((alert) => (
              <TouchableOpacity
                key={alert.id}
                onPress={() => router.push(`/(caregiver)/alerts/${alert.id}` as any)}
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
                          : { backgroundColor: 'rgba(245, 158, 11, 0.12)' },
                      ]}
                    >
                      {alert.type === 'fall' ? (
                        <ShieldAlert size={20} color={Colors.critical} />
                      ) : alert.type === 'heart_rate' ? (
                        <Heart size={20} color={Colors.warning} />
                      ) : (
                        <AlertTriangle size={20} color={Colors.warning} />
                      )}
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

                      <Text style={styles.alertTime}>{alert.timestamp} · {alert.location}</Text>
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
      <BottomTabBar activeTab="alerts" role="caregiver" />
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
    width: 42,
    height: 42,
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
  alertTime: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 4,
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
  },
});
