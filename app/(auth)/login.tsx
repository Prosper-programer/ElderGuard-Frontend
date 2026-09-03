import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Mail, Lock, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react-native';
import { ScreenContainer, Button, TextInput, Card } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';

export default function LoginScreen() {
  const router = useRouter();
  const { login, quickLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(result.error || 'Failed to log in. Please check your credentials.');
    } else {
      // Upon successful login, root index will automatically route based on role
      router.replace('/');
    }
  };

  const handleQuickLogin = async (role: UserRole) => {
    setError(null);
    setLoading(true);
    await quickLogin(role);
    setLoading(false);
    router.replace('/');
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
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Sign in to access real-time monitoring and care coordination.
        </Text>
      </View>

      {/* Quick Demo Login Box */}
      <Card style={styles.demoCard}>
        <View style={styles.demoHeader}>
          <ShieldCheck size={16} color={Colors.primary} />
          <Text style={styles.demoTitle}>Quick Demo Logins</Text>
        </View>
        <Text style={styles.demoDescription}>
          Tap any role below to instantly log in for testing:
        </Text>
        <View style={styles.roleChipsRow}>
          <TouchableOpacity
            style={[styles.roleChip, styles.roleChipParent]}
            onPress={() => handleQuickLogin('parent')}
            activeOpacity={0.7}
          >
            <UserCheck size={14} color={Colors.primary} />
            <Text style={styles.roleChipTextParent}>Parent (Eleanor)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleChip, styles.roleChipCaregiver]}
            onPress={() => handleQuickLogin('caregiver')}
            activeOpacity={0.7}
          >
            <UserCheck size={14} color={Colors.safe} />
            <Text style={styles.roleChipTextCaregiver}>Caregiver (David)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleChip, styles.roleChipAdmin]}
            onPress={() => handleQuickLogin('admin')}
            activeOpacity={0.7}
          >
            <UserCheck size={14} color={Colors.textSecondary} />
            <Text style={styles.roleChipTextAdmin}>Admin (Sarah)</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Login Form */}
      <View style={styles.form}>
        {error && (
          <View style={styles.errorBanner}>
            <AlertCircle size={18} color={Colors.critical} />
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        <TextInput
          label="Email address"
          placeholder="e.g. parent@elderguard.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (error) setError(null);
          }}
          leftIcon={<Mail size={18} color={Colors.textTertiary} />}
        />

        <View style={styles.spacing} />

        <TextInput
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (error) setError(null);
          }}
          leftIcon={<Lock size={18} color={Colors.textTertiary} />}
        />

        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

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
    marginBottom: Spacing.xl,
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
  demoCard: {
    backgroundColor: Colors.surface,
    borderColor: 'rgba(60, 111, 219, 0.25)',
    marginBottom: Spacing.xl,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  demoTitle: {
    ...Typography.bodySemiBold,
    color: Colors.primary,
  },
  demoDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  roleChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
  roleChipParent: {
    backgroundColor: Colors.primaryFaded,
    borderColor: Colors.primaryLight,
  },
  roleChipTextParent: {
    ...Typography.captionMedium,
    color: Colors.primary,
  },
  roleChipCaregiver: {
    backgroundColor: Colors.safeBg,
    borderColor: Colors.safe,
  },
  roleChipTextCaregiver: {
    ...Typography.captionMedium,
    color: '#15803D',
  },
  roleChipAdmin: {
    backgroundColor: Colors.surfaceSecondary,
    borderColor: Colors.border,
  },
  roleChipTextAdmin: {
    ...Typography.captionMedium,
    color: Colors.textPrimary,
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
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  forgotPasswordText: {
    ...Typography.bodySmallMedium,
    color: Colors.primary,
  },
  submitButton: {
    marginTop: Spacing.xs,
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
