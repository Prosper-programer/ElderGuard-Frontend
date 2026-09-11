import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Bell,
  ChevronRight,
  AlertTriangle,
  Plus,
  MapPin,
  CheckCircle,
  Pill,
  RefreshCw,
  Clock,
} from 'lucide-react-native';
import {
  ScreenContainer,
  BottomTabBar,
  Card,
  StatusBadge,
  DeviceIndicator,
  SectionHeader,
} from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useElderly } from '@/context/ElderlyContext';
import { useVitals } from '@/context/VitalsContext';
import { useAlerts } from '@/context/AlertContext';
import { useCare } from '@/context/CareContext';
import {
  MOCK_ELDERLY_PERSON,
  MOCK_CAREGIVER,
  MOCK_PROGRAMME,
  MOCK_CARE_ACTIVITIES,
} from '@/services/mockData';

export default function CaregiverHomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { activeProfile } = useElderly();
  const { vitals } = useVitals();
  const { activeAlerts } = useAlerts();
  const { todayDoses } = useCare();

  const todayStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const caregiverName = user?.name || MOCK_CAREGIVER.name;
  const caregiverFirstName = caregiverName.split(' ')[0];

  return (
    <ScreenContainer
      scrollable
      padded
      backgroundColor="#F0F4FA"
      bottomBar={<BottomTabBar activeTab="home" role="caregiver" />}
    >
      {/* ── 1. Header with Shift Status ─────────────────────── */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.dateLabel}>{todayStr}</Text>
          <Text style={styles.greetingTitle}>Good morning, {caregiverFirstName} 👋</Text>

          <View style={styles.shiftBadge}>
            <View style={styles.shiftPulseDot} />
            <Text style={styles.shiftText}>
              On shift · {MOCK_CAREGIVER.shiftStart}–{MOCK_CAREGIVER.shiftEnd}
            </Text>
          </View>
        </View>

        <View style={styles.headerRightActions}>
          <TouchableOpacity
            onPress={() => router.push('/(caregiver)/alerts' as any)}
            style={styles.headerIconButton}
            activeOpacity={0.7}
          >
            <Bell size={18} color="#475569" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>1</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(caregiver)/settings' as any)}
            style={styles.avatarButton}
            activeOpacity={0.8}
          >
            <Text style={styles.avatarButtonText}>
              {caregiverFirstName.substring(0, 2).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── 2. Margaret Status Hero Green Gradient Card ─────── */}
      <TouchableOpacity
        onPress={() => router.push('/(caregiver)/location' as any)}
        activeOpacity={0.92}
        style={styles.heroCardContainer}
      >
        <View style={styles.heroGreenGradient}>
          <View style={styles.ambientGlow} />

          <View style={styles.heroTopRow}>
            <View style={styles.avatarWrap}>
              <Image
                source={{ uri: MOCK_ELDERLY_PERSON.photo }}
                style={styles.seniorAvatar}
              />
              <View style={styles.safeLiveDot} />
            </View>

            <View style={styles.heroMeta}>
              <Text style={styles.seniorNameText}>{MOCK_ELDERLY_PERSON.fullName}</Text>
              <Text style={styles.seniorSubText}>
                {MOCK_ELDERLY_PERSON.age} yrs · {MOCK_ELDERLY_PERSON.conditions[0]}
              </Text>

              <View style={styles.heroBadgeRow}>
                <View style={styles.safeStatusPill}>
                  <View style={styles.whiteDot} />
                  <Text style={styles.safeStatusText}>SAFE</Text>
                </View>

                <DeviceIndicator
                  connected={true}
                  battery={vitals.batteryLevel || 84}
                  compact
                />
              </View>
            </View>

            <ChevronRight size={18} color="rgba(255, 255, 255, 0.5)" />
          </View>

          {/* 3-Col Vitals Row */}
          <View style={styles.miniVitalsGrid}>
            <View style={styles.miniVitalCell}>
              <Text style={styles.miniVitalValue}>
                {vitals.heartRate?.value || 72}
                <Text style={styles.miniVitalUnit}> bpm</Text>
              </Text>
              <Text style={styles.miniVitalLabel}>Heart Rate</Text>
            </View>

            <View style={styles.miniVitalCell}>
              <Text style={styles.miniVitalValue}>
                {vitals.spo2?.value || 97}
                <Text style={styles.miniVitalUnit}> %</Text>
              </Text>
              <Text style={styles.miniVitalLabel}>SpO₂</Text>
            </View>

            <View style={styles.miniVitalCell}>
              <Text style={styles.miniVitalValue}>
                {vitals.temperature?.value || 36.8}
                <Text style={styles.miniVitalUnit}> °C</Text>
              </Text>
              <Text style={styles.miniVitalLabel}>Temp</Text>
            </View>
          </View>

          <View style={styles.heroFooterRow}>
            <RefreshCw size={10} color="rgba(255, 255, 255, 0.7)" />
            <Text style={styles.heroFooterText}>
              Live · Updated {vitals.lastSyncTime || '2 min ago'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* ── 3. Active Incident Notice Banner ────────────────── */}
      <TouchableOpacity
        onPress={() => router.push('/(caregiver)/alerts' as any)}
        activeOpacity={0.85}
        style={{ marginBottom: 14 }}
      >
        <Card style={styles.activeNoticeCard}>
          <View style={styles.noticeIconWrap}>
            <AlertTriangle size={18} color="#EA580C" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.noticeTitle}>Elevated heart rate detected</Text>
            <Text style={styles.noticeDesc}>
              09:32 AM · Heart rate reached 91 bpm — please check on Margaret
            </Text>
          </View>
          <ChevronRight size={16} color="#FB923C" />
        </Card>
      </TouchableOpacity>

      {/* ── 4. Quick Actions ────────────────────────────────── */}
      <View style={styles.sectionWrap}>
        <SectionHeader title="Quick Actions" />
        <View style={styles.quickActionsGrid}>
          {[
            {
              icon: Plus,
              label: 'Log activity',
              route: '/(caregiver)/care',
              color: '#3C6FDB',
              bg: '#EEF5FF',
            },
            {
              icon: MapPin,
              label: 'Location',
              route: '/(caregiver)/location',
              color: '#8B5CF6',
              bg: '#F5F3FF',
            },
            {
              icon: Bell,
              label: 'Alerts',
              route: '/(caregiver)/alerts',
              color: '#EA580C',
              bg: '#FFF7ED',
            },
          ].map(({ icon: Icon, label, route, color, bg }) => (
            <TouchableOpacity
              key={label}
              onPress={() => router.push(route as any)}
              style={styles.quickActionBtn}
              activeOpacity={0.8}
            >
              <View style={[styles.quickActionIconWrap, { backgroundColor: bg }]}>
                <Icon size={20} color={color} />
              </View>
              <Text style={styles.quickActionLabel}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── 5. Today's Schedule ─────────────────────────────── */}
      <View style={styles.sectionWrap}>
        <SectionHeader
          title="Today's Schedule"
          action="Full view"
          onAction={() => router.push('/(caregiver)/care' as any)}
        />
        <Card style={styles.scheduleCard}>
          {MOCK_PROGRAMME.slice(3, 7).map((item, i) => (
            <View
              key={i}
              style={[
                styles.scheduleRow,
                item.current && styles.scheduleRowCurrent,
                i === 3 && { borderBottomWidth: 0 },
              ]}
            >
              <View
                style={[
                  styles.scheduleDot,
                  item.done
                    ? styles.scheduleDotDone
                    : item.current
                    ? styles.scheduleDotCurrent
                    : styles.scheduleDotPending,
                ]}
              >
                {item.done ? (
                  <CheckCircle size={13} color={Colors.safe} />
                ) : item.current ? (
                  <View style={styles.currentDot} />
                ) : (
                  <View style={styles.pendingDot} />
                )}
              </View>

              <Text
                style={[
                  styles.scheduleLabel,
                  item.done && styles.scheduleLabelDone,
                  item.current && styles.scheduleLabelCurrent,
                ]}
              >
                {item.label}
              </Text>

              {item.isMed && <Pill size={13} color="#8B5CF6" style={{ marginRight: 6 }} />}

              <Text style={styles.scheduleTime}>{item.time}</Text>
            </View>
          ))}
        </Card>
      </View>

      {/* ── 6. My Recent Care Activities ─────────────────────── */}
      <View style={styles.sectionWrap}>
        <SectionHeader
          title="My Recent Activities"
          action="All"
          onAction={() => router.push('/(caregiver)/history' as any)}
        />
        <Card style={styles.cardZeroPadding}>
          {MOCK_CARE_ACTIVITIES.slice(0, 3).map((act, i) => (
            <View
              key={act.id}
              style={[styles.activityRow, i === 2 && { borderBottomWidth: 0 }]}
            >
              <View style={styles.activityIconCircle}>
                <CheckCircle size={15} color={Colors.safe} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.activityTitle}>{act.title}</Text>
                <Text style={styles.activityNotes} numberOfLines={1}>{act.notes}</Text>
              </View>
              <Text style={styles.activityTime}>{act.time}</Text>
            </View>
          ))}
        </Card>
      </View>

      <View style={{ height: Spacing.xl }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 8,
  },
  dateLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  greetingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  shiftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  shiftPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  shiftText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  avatarButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.safe,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  heroCardContainer: {
    marginBottom: 14,
  },
  heroGreenGradient: {
    borderRadius: 24,
    backgroundColor: '#15803D',
    padding: 16,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#15803D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  ambientGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(0, 251, 251, 0.08)',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  avatarWrap: {
    position: 'relative',
  },
  seniorAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  safeLiveDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#14532d',
  },
  heroMeta: {
    flex: 1,
  },
  seniorNameText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  seniorSubText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  safeStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  whiteDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  safeStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  miniVitalsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  miniVitalCell: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  miniVitalValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  miniVitalUnit: {
    fontSize: 9,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  miniVitalLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '600',
    marginTop: 2,
  },
  heroFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  heroFooterText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  activeNoticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  noticeIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9A3412',
  },
  noticeDesc: {
    fontSize: 11,
    color: '#C2410C',
    marginTop: 2,
    lineHeight: 15,
  },
  sectionWrap: {
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  quickActionBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  scheduleCard: {
    padding: 0,
    overflow: 'hidden',
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  scheduleRowCurrent: {
    backgroundColor: '#F0FDF4',
  },
  scheduleDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  scheduleDotDone: {
    backgroundColor: '#DCFCE7',
  },
  scheduleDotCurrent: {
    backgroundColor: '#D1FAE5',
  },
  scheduleDotPending: {
    backgroundColor: '#F1F5F9',
  },
  currentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },
  pendingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },
  scheduleLabel: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  scheduleLabelDone: {
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  scheduleLabelCurrent: {
    color: '#15803D',
    fontWeight: '700',
  },
  scheduleTime: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  cardZeroPadding: {
    padding: 0,
    overflow: 'hidden',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  activityIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.safeBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  activityNotes: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
});
