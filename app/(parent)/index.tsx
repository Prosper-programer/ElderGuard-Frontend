import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, LogOut, Sparkles, CheckCircle2 } from 'lucide-react-native';
import { ScreenContainer, Button, Card, StatusBadge, Avatar, Divider } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function ParentHomeScreen() {
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
          <Avatar name={user?.name || 'Parent User'} size={44} statusIndicator="safe" />
          <View>
            <Text style={styles.userName}>{user?.name || 'Eleanor Vance'}</Text>
            <View style={styles.badgeWrap}>
              <StatusBadge status="safe" label="Parent Manager" size="sm" />
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

      {/* Auth Success Banner */}
      <Card elevated style={styles.bannerCard}>
        <View style={styles.bannerHeader}>
          <Shield size={24} color={Colors.primary} />
          <Text style={styles.bannerTitle}>Parent Management Workspace</Text>
        </View>
        <Text style={styles.bannerCopy}>
          {"You are authenticated with full Parent privileges. As the primary manager, you have full control over the elderly person's profile, health monitoring, geofences, and reports."}
        </Text>

        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <CheckCircle2 size={16} color={Colors.safe} />
            <Text style={styles.featureText}>Phase 1 Authentication & Role Gateway Active</Text>
          </View>
          <View style={styles.featureItem}>
            <Sparkles size={16} color={Colors.primary} />
            <Text style={styles.featureText}>Phase 2: Elderly Profile Management (Next)</Text>
          </View>
          <View style={styles.featureItem}>
            <Sparkles size={16} color={Colors.primary} />
            <Text style={styles.featureText}>Phase 3: Parent Monitoring Dashboard (Upcoming)</Text>
          </View>
        </View>
      </Card>

      <View style={{ height: Spacing.lg }} />

      {/* Account Info Card */}
      <Card style={styles.infoCard}>
        <Text style={styles.infoSectionTitle}>ACCOUNT DETAILS</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Role:</Text>
          <Text style={styles.infoValue}>Parent / Family Manager</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Assigned Caregiver:</Text>
          <Text style={styles.infoValue}>David Miller (usr-caregiver-01)</Text>
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
  featureList: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  featureText: {
    ...Typography.bodySmallMedium,
    color: Colors.textPrimary,
  },
  infoCard: {
    backgroundColor: Colors.white,
  },
  infoSectionTitle: {
    ...Typography.overline,
    color: Colors.textTertiary,
    marginBottom: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  infoLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  infoValue: {
    ...Typography.bodySmallMedium,
    color: Colors.textPrimary,
  },
});
