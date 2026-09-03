import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Users,
  Shield,
  HeartHandshake,
  LogOut,
  Cpu,
  Activity,
  CheckCircle2,
  Clock,
  Search,
} from 'lucide-react-native';
import { ScreenContainer, Card, StatusBadge, Button, TextInput } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'parent' | 'caregiver' | 'admin';
  assignedTo?: string;
  status: 'active' | 'suspended';
  joinedDate: string;
}

const SYSTEM_USERS: UserRecord[] = [
  {
    id: 'usr-1',
    name: 'Eleanor Vance',
    email: 'parent@elderguard.com',
    role: 'parent',
    assignedTo: 'Margaret Johnson (Mother)',
    status: 'active',
    joinedDate: 'Jan 16, 2026',
  },
  {
    id: 'usr-2',
    name: 'David Miller',
    email: 'caregiver@elderguard.com',
    role: 'caregiver',
    assignedTo: 'Margaret Johnson',
    status: 'active',
    joinedDate: 'Jan 20, 2026',
  },
  {
    id: 'usr-3',
    name: 'Sarah Jenkins',
    email: 'admin@elderguard.com',
    role: 'admin',
    status: 'active',
    joinedDate: 'Jan 01, 2026',
  },
  {
    id: 'usr-4',
    name: 'Robert Vance',
    email: 'robert.v@example.com',
    role: 'parent',
    assignedTo: 'Arthur Vance (Father)',
    status: 'active',
    joinedDate: 'Feb 12, 2026',
  },
  {
    id: 'usr-5',
    name: 'Maria Santos',
    email: 'maria.s@carehealth.org',
    role: 'caregiver',
    assignedTo: 'Arthur Vance',
    status: 'active',
    joinedDate: 'Feb 14, 2026',
  },
];

const IOT_DEVICES = [
  { id: 'EG-IOT-4892', recipient: 'Margaret Johnson', battery: '87%', status: 'online', fw: 'v2.4.1' },
  { id: 'EG-IOT-3120', recipient: 'Arthur Vance', battery: '92%', status: 'online', fw: 'v2.4.1' },
  { id: 'EG-IOT-7741', recipient: 'Unassigned Reserve', battery: '100%', status: 'standby', fw: 'v2.4.0' },
];

export default function AdminConsoleScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [roleFilter, setRoleFilter] = useState<'all' | 'parent' | 'caregiver' | 'admin'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/welcome');
  };

  const filteredUsers = SYSTEM_USERS.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <ScreenContainer scrollable padded backgroundColor={Colors.background}>
      {/* ── Top Header ──────────────────────────────────────── */}
      <View style={styles.headerRow}>
        <View style={styles.userInfo}>
          <View style={styles.adminAvatar}>
            <Shield size={22} color={Colors.warning} />
          </View>
          <View>
            <Text style={styles.userName}>{user?.name || 'Sarah Jenkins'}</Text>
            <View style={styles.badgeWrap}>
              <StatusBadge status="warning" label="System Administrator" size="sm" />
            </View>
          </View>
        </View>

        <Button
          title="Logout"
          onPress={handleLogout}
          variant="ghost"
          size="sm"
          leftIcon={<LogOut size={16} color={Colors.critical} />}
        />
      </View>

      <View style={{ height: Spacing.md }} />

      {/* ── System Health Metric Cards ──────────────────────── */}
      <View style={styles.metricsRow}>
        <Card style={styles.metricCard}>
          <Users size={20} color={Colors.primary} />
          <Text style={styles.metricNum}>{SYSTEM_USERS.length}</Text>
          <Text style={styles.metricLabel}>Total Users</Text>
        </Card>

        <Card style={styles.metricCard}>
          <Cpu size={20} color={Colors.safe} />
          <Text style={styles.metricNum}>{IOT_DEVICES.length}</Text>
          <Text style={styles.metricLabel}>IoT Devices</Text>
        </Card>

        <Card style={styles.metricCard}>
          <Activity size={20} color={Colors.warning} />
          <Text style={styles.metricNum}>99.9%</Text>
          <Text style={styles.metricLabel}>Telemetry Uptime</Text>
        </Card>
      </View>

      <View style={{ height: Spacing.lg }} />

      {/* ── User Directory Management ───────────────────────── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>USER DIRECTORY & ACCOUNTS</Text>
      </View>

      {/* Search Input */}
      <TextInput
        placeholder="Search user by name or email..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        leftIcon={<Search size={16} color={Colors.textTertiary} />}
      />

      <View style={{ height: Spacing.sm }} />

      {/* Role Filter Chips */}
      <View style={styles.filterRow}>
        {(['all', 'parent', 'caregiver', 'admin'] as const).map((r) => (
          <TouchableOpacity
            key={r}
            onPress={() => setRoleFilter(r)}
            style={[styles.filterChip, roleFilter === r && styles.filterChipActive]}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterChipText, roleFilter === r && styles.filterChipTextActive]}>
              {r.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: Spacing.md }} />

      {/* Users List */}
      <View style={styles.usersList}>
        {filteredUsers.map((u) => (
          <Card key={u.id} style={styles.userCard}>
            <View style={styles.userRow}>
              <View
                style={[
                  styles.userRoleIconCircle,
                  u.role === 'parent'
                    ? { backgroundColor: Colors.primaryFaded }
                    : u.role === 'caregiver'
                    ? { backgroundColor: Colors.safeBg }
                    : { backgroundColor: Colors.warningBg },
                ]}
              >
                {u.role === 'parent' ? (
                  <Shield size={18} color={Colors.primary} />
                ) : u.role === 'caregiver' ? (
                  <HeartHandshake size={18} color={Colors.safe} />
                ) : (
                  <Shield size={18} color={Colors.warning} />
                )}
              </View>

              <View style={styles.userMeta}>
                <View style={styles.userNameRow}>
                  <Text style={styles.userNameText}>{u.name}</Text>
                  <StatusBadge
                    status={u.role === 'parent' ? 'safe' : u.role === 'caregiver' ? 'safe' : 'warning'}
                    label={u.role.toUpperCase()}
                    size="sm"
                  />
                </View>
                <Text style={styles.userEmail}>{u.email}</Text>
                {u.assignedTo && <Text style={styles.assignedToText}>Care Link: {u.assignedTo}</Text>}
              </View>
            </View>
          </Card>
        ))}
      </View>

      <View style={{ height: Spacing.xl }} />

      {/* ── Hardware Fleet Status ───────────────────────────── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>WEARABLE IOT HARDWARE FLEET</Text>
      </View>

      <Card style={styles.fleetCard}>
        {IOT_DEVICES.map((dev, idx) => (
          <View key={dev.id}>
            {idx > 0 && <View style={styles.devDivider} />}
            <View style={styles.devRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.devId}>{dev.id}</Text>
                <Text style={styles.devRecipient}>Linked: {dev.recipient}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <StatusBadge
                  status={dev.status === 'online' ? 'safe' : 'offline'}
                  label={dev.status.toUpperCase()}
                  size="sm"
                />
                <Text style={styles.devBattery}>{dev.battery} · {dev.fw}</Text>
              </View>
            </View>
          </View>
        ))}
      </Card>

      <View style={{ height: Spacing.xl }} />

      {/* ── System Audit Log ────────────────────────────────── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>RECENT AUDIT ACTIVITIES</Text>
      </View>

      <Card style={styles.auditCard}>
        <View style={styles.auditItem}>
          <CheckCircle2 size={16} color={Colors.safe} />
          <View style={{ flex: 1 }}>
            <Text style={styles.auditText}>IoT firmware auto-sync completed for EG-IOT-4892</Text>
            <Text style={styles.auditTime}>Today at 02:00 AM</Text>
          </View>
        </View>

        <View style={styles.devDivider} />

        <View style={styles.auditItem}>
          <Clock size={16} color={Colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.auditText}>Parent Eleanor Vance verified emergency dialer contacts</Text>
            <Text style={styles.auditTime}>Yesterday at 04:30 PM</Text>
          </View>
        </View>
      </Card>

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
  adminAvatar: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.warningBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  badgeWrap: {
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  metricCard: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    padding: Spacing.md,
  },
  metricNum: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginTop: 4,
  },
  metricLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
    fontSize: 10,
  },
  sectionHeader: {
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    ...Typography.overline,
    color: Colors.textTertiary,
    letterSpacing: 1,
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  filterChip: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterChipText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.white,
  },
  usersList: {
    gap: Spacing.sm,
  },
  userCard: {
    backgroundColor: Colors.white,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  userRoleIconCircle: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMeta: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  userNameText: {
    ...Typography.bodySemiBold,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  userEmail: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  assignedToText: {
    ...Typography.caption,
    color: Colors.primary,
    fontSize: 11,
    marginTop: 2,
  },
  fleetCard: {
    backgroundColor: Colors.white,
  },
  devRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  devId: {
    ...Typography.bodySemiBold,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  devRecipient: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  devBattery: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  devDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.xs,
  },
  auditCard: {
    backgroundColor: Colors.white,
  },
  auditItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  auditText: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  auditTime: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginTop: 1,
  },
});
