import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Users, LogOut, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react-native';
import { ScreenContainer, Button, Card, StatusBadge, Avatar, Divider } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function AdminHomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/welcome');
  };

  return (
    <ScreenContainer scrollable padded backgroundColor={Colors.background}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <View style={styles.userInfo}>
          <Avatar name={user?.name || 'Sarah Jenkins'} size={44} statusIndicator="safe" />
          <View>
            <Text style={styles.userName}>{user?.name || 'Sarah Jenkins'}</Text>
            <View style={styles.badgeWrap}>
              <StatusBadge status="warning" label="System Admin" size="sm" />
            </View>
          </View>
        </View>

        <Button
          title="Logout"
          onPress={handleLogout}
          variant="ghost"
          size="sm"
          leftIcon={<LogOut size={16} color={Colors.critical} />}
          style={styles.logoutBtn}
        />
      </View>

      <Divider spacing={Spacing.md} />

      {/* Role Banner */}
      <Card elevated style={styles.bannerCard}>
        <View style={styles.bannerHeader}>
          <Users size={24} color={Colors.primary} />
          <Text style={styles.bannerTitle}>Admin User Management Console</Text>
        </View>
        <Text style={styles.bannerCopy}>
          You are signed in to the administrative portal. Admins manage Parent and Caregiver accounts across the system. (Admin does not manage elderly care workflows directly).
        </Text>

        <View style={styles.adminStatsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Parents</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Caregivers</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>20</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
        </View>
      </Card>

      <View style={{ height: Spacing.lg }} />

      {/* Roadmap & Permissions Info */}
      <Card style={styles.infoCard}>
        <Text style={styles.infoSectionTitle}>ADMIN CAPABILITIES (PHASE 9)</Text>
        <View style={styles.permList}>
          <View style={styles.permItem}>
            <CheckCircle2 size={16} color={Colors.safe} />
            <Text style={styles.permText}>View all Parent & Caregiver accounts</Text>
          </View>
          <View style={styles.permItem}>
            <CheckCircle2 size={16} color={Colors.safe} />
            <Text style={styles.permText}>Activate & deactivate user access</Text>
          </View>
          <View style={styles.permItem}>
            <ShieldAlert size={16} color={Colors.warning} />
            <Text style={styles.permText}>Isolated from direct elderly health & care data</Text>
          </View>
          <View style={styles.permItem}>
            <Sparkles size={16} color={Colors.primary} />
            <Text style={styles.permText}>Phase 9: Full Admin Management Interface</Text>
          </View>
        </View>
      </Card>

      <View style={{ height: Spacing.xl }} />

      {/* Secondary Actions */}
      <Button
        title="Inspect Design System Tokens"
        onPress={() => router.push('/design-system')}
        variant="secondary"
        fullWidth
      />

      <View style={{ height: Spacing.md }} />

      <Button
        title="Log Out"
        onPress={handleLogout}
        variant="outline"
        fullWidth
      />
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
  userName: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  badgeWrap: {
    marginTop: 2,
  },
  logoutBtn: {
    paddingHorizontal: Spacing.sm,
  },
  bannerCard: {
    backgroundColor: Colors.white,
    marginTop: Spacing.sm,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  bannerTitle: {
    ...Typography.bodySemiBold,
    color: Colors.textPrimary,
    fontSize: 16,
  },
  bannerCopy: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  adminStatsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.surfaceSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  statNumber: {
    ...Typography.metricSmall,
    color: Colors.primary,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: Colors.white,
  },
  infoSectionTitle: {
    ...Typography.overline,
    color: Colors.textTertiary,
    marginBottom: Spacing.sm,
  },
  permList: {
    gap: Spacing.sm,
  },
  permItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  permText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
});
