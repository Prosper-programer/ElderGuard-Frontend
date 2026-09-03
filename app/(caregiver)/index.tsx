import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { HeartHandshake, LogOut, CheckCircle2, User, Sparkles } from 'lucide-react-native';
import { ScreenContainer, Button, Card, StatusBadge, Avatar, Divider } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { MOCK_ELDERLY_PERSON } from '@/services/mockData';

export default function CaregiverHomeScreen() {
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
          <Avatar name={user?.name || 'David Miller'} size={44} statusIndicator="safe" />
          <View>
            <Text style={styles.userName}>{user?.name || 'David Miller'}</Text>
            <View style={styles.badgeWrap}>
              <StatusBadge status="safe" label="Caregiver" size="sm" />
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
          <HeartHandshake size={24} color={Colors.safe} />
          <Text style={styles.bannerTitle}>Caregiver Portal</Text>
        </View>
        <Text style={styles.bannerCopy}>
          Welcome to the Caregiver workspace. You have access to your assigned elderly care recipient to view vital signs, log medication adherence, and record daily activities.
        </Text>

        <View style={styles.assignedBox}>
          <View style={styles.assignedHeader}>
            <User size={16} color={Colors.primary} />
            <Text style={styles.assignedTitle}>Assigned Elderly Person</Text>
          </View>
          <Text style={styles.assignedName}>{MOCK_ELDERLY_PERSON.fullName} (Age {MOCK_ELDERLY_PERSON.age})</Text>
          <Text style={styles.assignedSub}>Managed by: Eleanor Vance (Parent)</Text>
        </View>
      </Card>

      <View style={{ height: Spacing.lg }} />

      {/* Roadmap & Permissions Info */}
      <Card style={styles.infoCard}>
        <Text style={styles.infoSectionTitle}>CAREGIVER PERMISSIONS</Text>
        <View style={styles.permList}>
          <View style={styles.permItem}>
            <CheckCircle2 size={16} color={Colors.safe} />
            <Text style={styles.permText}>View assigned elderly person vitals & IoT status</Text>
          </View>
          <View style={styles.permItem}>
            <CheckCircle2 size={16} color={Colors.safe} />
            <Text style={styles.permText}>Receive real-time fall & emergency alerts</Text>
          </View>
          <View style={styles.permItem}>
            <CheckCircle2 size={16} color={Colors.safe} />
            <Text style={styles.permText}>Log medication taken / missed status</Text>
          </View>
          <View style={styles.permItem}>
            <Sparkles size={16} color={Colors.primary} />
            <Text style={styles.permText}>Phase 3: Caregiver Focused Dashboard (Upcoming)</Text>
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
  assignedBox: {
    marginTop: Spacing.md,
    backgroundColor: Colors.surfaceSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  assignedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 4,
  },
  assignedTitle: {
    ...Typography.captionMedium,
    color: Colors.primary,
  },
  assignedName: {
    ...Typography.bodySemiBold,
    color: Colors.textPrimary,
  },
  assignedSub: {
    ...Typography.caption,
    color: Colors.textTertiary,
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
