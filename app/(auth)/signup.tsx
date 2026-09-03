import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  User as UserIcon,
  Mail,
  Lock,
  Shield,
  HeartHandshake,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react-native';
import { ScreenContainer, Button, TextInput } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function SignUpScreen() {
  const router = useRouter();
  const { signup } = useAuth();

  const [selectedRole, setSelectedRole] = useState<'parent' | 'caregiver'>('parent');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    setError(null);
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await signup(name, email, password, selectedRole);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Registration failed. Please try again.');
    } else {
      router.replace('/');
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(auth)/welcome' as any);
    }
  };

  return (
    <ScreenContainer scrollable keyboardAvoiding padded backgroundColor={Colors.background}>
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Screen Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Choose your account type to get started with ElderGuard.
        </Text>
      </View>

      {/* ── Modern 2-Box Role Selector In A Row ─────────────── */}
      <Text style={styles.sectionLabel}>CHOOSE YOUR ROLE</Text>
      <View style={styles.roleBoxesRow}>
        {/* Parent Role Box */}
        <TouchableOpacity
          style={[
            styles.roleBox,
            selectedRole === 'parent' && styles.roleBoxParentActive,
          ]}
          onPress={() => {
            setSelectedRole('parent');
            if (error) setError(null);
          }}
          activeOpacity={0.8}
        >
          {selectedRole === 'parent' && (
            <View style={[styles.checkBubble, { backgroundColor: Colors.primary }]}>
              <Check size={10} color={Colors.white} strokeWidth={3} />
            </View>
          )}

          <View
            style={[
              styles.iconCircle,
              selectedRole === 'parent'
                ? { backgroundColor: Colors.white }
                : { backgroundColor: Colors.surfaceSecondary },
            ]}
          >
            <Shield
              size={22}
              color={selectedRole === 'parent' ? Colors.primary : Colors.textSecondary}
            />
          </View>

          <Text
            style={[
              styles.roleTitle,
              selectedRole === 'parent' && { color: Colors.primary },
            ]}
          >
            Parent
          </Text>
          <Text style={styles.roleSubtitle}>Family Manager</Text>

          <View
            style={[
              styles.miniBadge,
              selectedRole === 'parent'
                ? { backgroundColor: Colors.primary }
                : { backgroundColor: Colors.surfaceSecondary },
            ]}
          >
            <Text
              style={[
                styles.miniBadgeText,
                selectedRole === 'parent'
                  ? { color: Colors.white }
                  : { color: Colors.textTertiary },
              ]}
            >
              Full Control
            </Text>
          </View>
        </TouchableOpacity>

        {/* Caregiver Role Box */}
        <TouchableOpacity
          style={[
            styles.roleBox,
            selectedRole === 'caregiver' && styles.roleBoxCaregiverActive,
          ]}
          onPress={() => {
            setSelectedRole('caregiver');
            if (error) setError(null);
          }}
          activeOpacity={0.8}
        >
          {selectedRole === 'caregiver' && (
            <View style={[styles.checkBubble, { backgroundColor: Colors.safe }]}>
              <Check size={10} color={Colors.white} strokeWidth={3} />
            </View>
          )}

          <View
            style={[
              styles.iconCircle,
              selectedRole === 'caregiver'
                ? { backgroundColor: Colors.white }
                : { backgroundColor: Colors.surfaceSecondary },
            ]}
          >
            <HeartHandshake
              size={22}
              color={selectedRole === 'caregiver' ? Colors.safe : Colors.textSecondary}
            />
          </View>

          <Text
            style={[
              styles.roleTitle,
              selectedRole === 'caregiver' && { color: Colors.safe },
            ]}
          >
            Caregiver
          </Text>
          <Text style={styles.roleSubtitle}>Care Assistant</Text>

          <View
            style={[
              styles.miniBadge,
              selectedRole === 'caregiver'
                ? { backgroundColor: Colors.safe }
                : { backgroundColor: Colors.surfaceSecondary },
            ]}
          >
            <Text
              style={[
                styles.miniBadgeText,
                selectedRole === 'caregiver'
                  ? { color: Colors.white }
                  : { color: Colors.textTertiary },
              ]}
            >
              Assigned Care
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* ── Dynamic Role Capability Note ────────────────────── */}
      <View style={styles.roleDetailCard}>
        <View style={styles.roleDetailHeader}>
          <Sparkles
            size={15}
            color={selectedRole === 'parent' ? Colors.primary : Colors.safe}
          />
          <Text style={styles.roleDetailHeading}>
            {selectedRole === 'parent'
              ? 'Parent Manager Privileges'
              : 'Caregiver Assistant Privileges'}
          </Text>
        </View>
        <Text style={styles.roleDetailText}>
          {selectedRole === 'parent'
            ? 'You can create elderly profiles, configure geofencing boundaries, monitor live vital statistics, and generate formal health & safety reports.'
            : 'You will access assigned elderly loved ones to log medication adherence, record daily routine completions, and view live status updates.'}
        </Text>
      </View>

      {/* ── Form Fields ─────────────────────────────────────── */}
      <View style={styles.form}>
        {error && (
          <View style={styles.errorBanner}>
            <AlertCircle size={18} color={Colors.critical} />
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        <TextInput
          label="Full Name"
          placeholder="e.g. Eleanor Vance"
          value={name}
          onChangeText={(t) => {
            setName(t);
            if (error) setError(null);
          }}
          leftIcon={<UserIcon size={18} color={Colors.textTertiary} />}
        />

        <View style={styles.spacing} />

        <TextInput
          label="Email Address"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            if (error) setError(null);
          }}
          leftIcon={<Mail size={18} color={Colors.textTertiary} />}
        />

        <View style={styles.spacing} />

        <TextInput
          label="Password"
          placeholder="At least 6 characters"
          secureTextEntry
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            if (error) setError(null);
          }}
          leftIcon={<Lock size={18} color={Colors.textTertiary} />}
        />

        <View style={styles.spacing} />

        <TextInput
          label="Confirm Password"
          placeholder="Re-enter your password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={(t) => {
            setConfirmPassword(t);
            if (error) setError(null);
          }}
          leftIcon={<Lock size={18} color={Colors.textTertiary} />}
        />

        <Button
          title={`Create Account as ${selectedRole === 'parent' ? 'Parent' : 'Caregiver'}`}
          onPress={handleSignUp}
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          style={{
            backgroundColor: selectedRole === 'parent' ? Colors.primary : Colors.safe,
            marginTop: Spacing.xl,
          }}
        />
      </View>

      {/* Switch to Login */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
          activeOpacity={0.7}
        >
          <Text style={styles.footerLink}>Log In</Text>
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
  sectionLabel: {
    ...Typography.overline,
    color: Colors.textTertiary,
    marginBottom: Spacing.xs,
    letterSpacing: 1,
  },
  roleBoxesRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  roleBox: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
    position: 'relative',
  },
  roleBoxParentActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryFaded,
    shadowColor: Colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  roleBoxCaregiverActive: {
    borderColor: Colors.safe,
    backgroundColor: Colors.safeBg,
    shadowColor: Colors.safe,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
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
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  roleTitle: {
    ...Typography.bodySemiBold,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  roleSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  miniBadge: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.xl,
  },
  miniBadgeText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '600',
  },
  roleDetailCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  roleDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  roleDetailHeading: {
    ...Typography.bodySmallSemiBold,
    color: Colors.textPrimary,
    fontSize: 13,
  },
  roleDetailText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  form: {
    width: '100%',
  },
  spacing: {
    height: Spacing.md,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.criticalBg,
    borderColor: Colors.critical,
    borderWidth: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.base,
  },
  errorBannerText: {
    ...Typography.bodySmall,
    color: Colors.critical,
    flex: 1,
  },
  submitButton: {
    marginTop: Spacing.xl,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xl,
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
