import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, User as UserIcon, Mail, Lock, Shield, HeartHandshake, AlertCircle } from 'lucide-react-native';
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
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Choose your role to get started with ElderGuard.
        </Text>
      </View>

      {/* Role Selection */}
      <Text style={styles.sectionLabel}>Select Your Role</Text>
      <View style={styles.roleSelectionContainer}>
        {/* Parent Role Card */}
        <TouchableOpacity
          style={[
            styles.roleCard,
            selectedRole === 'parent' && styles.roleCardSelected,
          ]}
          onPress={() => setSelectedRole('parent')}
          activeOpacity={0.8}
        >
          <View style={styles.roleHeader}>
            <View
              style={[
                styles.roleIconCircle,
                selectedRole === 'parent' ? styles.roleIconCircleSelected : styles.roleIconCircleDefault,
              ]}
            >
              <Shield
                size={20}
                color={selectedRole === 'parent' ? Colors.primary : Colors.textSecondary}
              />
            </View>
            <View style={styles.roleTitleCol}>
              <Text style={styles.roleTitle}>Parent / Family Manager</Text>
              <Text style={styles.roleSub}>Primary profile & care admin</Text>
            </View>
            <View
              style={[
                styles.radioOuter,
                selectedRole === 'parent' && styles.radioOuterSelected,
              ]}
            >
              {selectedRole === 'parent' && <View style={styles.radioInner} />}
            </View>
          </View>
          <Text style={styles.roleDescription}>
            Create elderly profiles, configure geofences, monitor vitals, receive alerts, and generate reports.
          </Text>
        </TouchableOpacity>

        {/* Caregiver Role Card */}
        <TouchableOpacity
          style={[
            styles.roleCard,
            selectedRole === 'caregiver' && styles.roleCardSelected,
          ]}
          onPress={() => setSelectedRole('caregiver')}
          activeOpacity={0.8}
        >
          <View style={styles.roleHeader}>
            <View
              style={[
                styles.roleIconCircle,
                selectedRole === 'caregiver' ? styles.roleIconCircleCaregiver : styles.roleIconCircleDefault,
              ]}
            >
              <HeartHandshake
                size={20}
                color={selectedRole === 'caregiver' ? Colors.safe : Colors.textSecondary}
              />
            </View>
            <View style={styles.roleTitleCol}>
              <Text style={styles.roleTitle}>Caregiver</Text>
              <Text style={styles.roleSub}>Assigned daily care partner</Text>
            </View>
            <View
              style={[
                styles.radioOuter,
                selectedRole === 'caregiver' && styles.radioOuterSelected,
              ]}
            >
              {selectedRole === 'caregiver' && <View style={styles.radioInner} />}
            </View>
          </View>
          <Text style={styles.roleDescription}>
            View assigned elderly person, track medication adherence, and record daily care activities.
          </Text>
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
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
          title="Create Account"
          onPress={handleSignUp}
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          style={styles.submitButton}
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
    paddingVertical: Spacing.sm,
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
    marginTop: Spacing.xs,
  },
  sectionLabel: {
    ...Typography.overline,
    color: Colors.textTertiary,
    marginBottom: Spacing.sm,
  },
  roleSelectionContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  roleCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing.base,
  },
  roleCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(60, 111, 219, 0.03)',
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xs,
  },
  roleIconCircle: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleIconCircleDefault: {
    backgroundColor: Colors.surfaceSecondary,
  },
  roleIconCircleSelected: {
    backgroundColor: Colors.primaryFaded,
  },
  roleIconCircleCaregiver: {
    backgroundColor: Colors.safeBg,
  },
  roleTitleCol: {
    flex: 1,
  },
  roleTitle: {
    ...Typography.bodySemiBold,
    color: Colors.textPrimary,
  },
  roleSub: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
  },
  roleDescription: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 2,
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
