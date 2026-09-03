import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Mail,
  Lock,
  Shield,
  HeartHandshake,
  Users,
  Check,
  AlertCircle,
} from 'lucide-react-native';
import { ScreenContainer, Button, TextInput } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';

interface RolePreset {
  role: UserRole;
  label: string;
  badge: string;
  name: string;
  email: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  accentColor: string;
  accentBg: string;
}

const ROLE_PRESETS: RolePreset[] = [
  {
    role: 'parent',
    label: 'Parent',
    badge: 'Manager',
    name: 'Eleanor Vance',
    email: 'parent@elderguard.com',
    icon: Shield,
    accentColor: Colors.primary,
    accentBg: Colors.primaryFaded,
  },
  {
    role: 'caregiver',
    label: 'Caregiver',
    badge: 'Assistant',
    name: 'David Miller',
    email: 'caregiver@elderguard.com',
    icon: HeartHandshake,
    accentColor: Colors.safe,
    accentBg: Colors.safeBg,
  },
  {
    role: 'admin',
    label: 'Admin',
    badge: 'Console',
    name: 'Sarah Jenkins',
    email: 'admin@elderguard.com',
    icon: Users,
    accentColor: Colors.warning,
    accentBg: Colors.warningBg,
  },
];

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>('parent');
  const activePreset = ROLE_PRESETS.find((p) => p.role === selectedRole)!;
  const ActiveIcon = activePreset.icon;

  const [email, setEmail] = useState(activePreset.email);
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    const preset = ROLE_PRESETS.find((p) => p.role === role)!;
    setEmail(preset.email);
    setError(null);
  };

  const handleLogin = async () => {
    setError(null);
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Failed to sign in. Please check your credentials.');
    } else {
      router.replace('/');
    }
  };

  return (
    <ScreenContainer scrollable keyboardAvoiding padded backgroundColor={Colors.background}>
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Screen Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>
          Select your account role to access your dedicated workspace.
        </Text>
      </View>

      {/* ── Modern 3-Box Role Selector In A Row ─────────────── */}
      <Text style={styles.selectorLabel}>SELECT ACCOUNT ROLE</Text>
      <View style={styles.roleBoxesRow}>
        {ROLE_PRESETS.map((preset) => {
          const isSelected = preset.role === selectedRole;
          const RoleIcon = preset.icon;

          return (
            <TouchableOpacity
              key={preset.role}
              onPress={() => handleSelectRole(preset.role)}
              activeOpacity={0.8}
              style={[
                styles.roleBox,
                isSelected && {
                  borderColor: preset.accentColor,
                  backgroundColor: preset.accentBg,
                  shadowColor: preset.accentColor,
                  shadowOpacity: 0.25,
                  shadowRadius: 8,
                  elevation: 4,
                },
              ]}
            >
              {/* Active Checkmark Bubble */}
              {isSelected && (
                <View style={[styles.checkBubble, { backgroundColor: preset.accentColor }]}>
                  <Check size={10} color={Colors.white} strokeWidth={3} />
                </View>
              )}

              {/* Icon Circle */}
              <View
                style={[
                  styles.iconWrap,
                  {
                    backgroundColor: isSelected ? Colors.white : Colors.surfaceSecondary,
                  },
                ]}
              >
                <RoleIcon
                  size={20}
                  color={isSelected ? preset.accentColor : Colors.textSecondary}
                />
              </View>

              {/* Title & Badge */}
              <Text
                style={[
                  styles.roleTitle,
                  isSelected && { color: preset.accentColor },
                ]}
                numberOfLines={1}
              >
                {preset.label}
              </Text>

              <View
                style={[
                  styles.miniBadge,
                  isSelected
                    ? { backgroundColor: preset.accentColor }
                    : { backgroundColor: Colors.surfaceSecondary },
                ]}
              >
                <Text
                  style={[
                    styles.miniBadgeText,
                    isSelected ? { color: Colors.white } : { color: Colors.textTertiary },
                  ]}
                >
                  {preset.badge}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Active Role Account Card & Login Form ────────────── */}
      <View style={styles.accountCard}>
        {/* Selected Profile Summary */}
        <View style={styles.profileSummaryRow}>
          <View style={[styles.profileAvatar, { backgroundColor: activePreset.accentBg }]}>
            <ActiveIcon size={22} color={activePreset.accentColor} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{activePreset.name}</Text>
            <Text style={styles.profileRoleLabel}>
              Signing in as {activePreset.label} ({activePreset.badge})
            </Text>
          </View>
        </View>

        {/* Error Alert */}
        {error && (
          <View style={styles.errorBanner}>
            <AlertCircle size={16} color={Colors.critical} />
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        {/* Standard Credentials Form */}
        <View style={styles.formSection}>
          <TextInput
            label="Email address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError(null);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon={<Mail size={16} color={Colors.textTertiary} />}
          />

          <View style={{ height: Spacing.md }} />

          <TextInput
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (error) setError(null);
            }}
            secureTextEntry
            leftIcon={<Lock size={16} color={Colors.textTertiary} />}
          />

          <View style={styles.forgotRow}>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* Unified Primary Brand Button (Identical to Sign Up) */}
          <Button
            title="Sign In"
            onPress={handleLogin}
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            style={styles.submitButton}
          />
        </View>
      </View>

      {/* Switch to Sign Up */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>{"Don't have an account?"}</Text>
        <TouchableOpacity
          onPress={() => router.push('/(auth)/signup')}
          activeOpacity={0.7}
        >
          <Text style={styles.footerLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  navBar: {
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceSecondary,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 20,
  },
  selectorLabel: {
    ...Typography.overline,
    color: Colors.textTertiary,
    marginBottom: Spacing.xs,
    letterSpacing: 1,
  },
  roleBoxesRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  roleBox: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
    alignItems: 'center',
    position: 'relative',
  },
  checkBubble: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  roleTitle: {
    ...Typography.bodySemiBold,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  miniBadge: {
    marginTop: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.xl,
  },
  miniBadgeText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '600',
  },
  accountCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: Spacing.xl,
  },
  profileSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    marginBottom: Spacing.md,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...Typography.bodySemiBold,
    color: Colors.textPrimary,
    fontSize: 15,
  },
  profileRoleLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  formSection: {
    width: '100%',
  },
  forgotRow: {
    alignItems: 'flex-end',
    marginTop: Spacing.sm,
    marginBottom: Spacing.base,
  },
  forgotText: {
    ...Typography.bodySmallMedium,
    color: Colors.primary,
  },
  submitButton: {
    marginTop: Spacing.xs,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.criticalBg,
    borderColor: Colors.critical,
    borderWidth: 1,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.base,
  },
  errorBannerText: {
    ...Typography.bodySmall,
    color: Colors.critical,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.lg,
    marginTop: 'auto',
  },
  footerText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  footerLink: {
    ...Typography.bodySemiBold,
    color: Colors.primary,
  },
});
