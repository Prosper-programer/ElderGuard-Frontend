/**
 * ============================================================================
 * ElderGuard — AuthContext.tsx
 * ============================================================================
 * 
 * PURPOSE:
 * Manages user authentication, session state, and role-based permissions:
 * 
 * THE 2 USER ROLES:
 * 1. `parent`    : Family member / Senior Care Manager (Theme: Blue #3C6FDB)
 *                   - Full permissions: Vitals, prescriptions, doctor reports, configuration.
 * 2. `caregiver` : Professional nurse, aide, or assisted living staff (Theme: Green #22C55E)
 *                   - Care administration: Vitals, daypart dose logging, incident responses.
 * 
 * PRODUCTION API POINT:
 * In production, replace the simulated credential check with your JWT endpoint:
 *   const res = await fetch('https://api.elderguard.com/v1/auth/login', { ... });
 *   await SecureStore.setItemAsync('user_token', res.data.token);
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthContextValue } from '@/types/auth';
import { MOCK_USERS } from '@/services/mockData';

// React Context for authentication session state
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * AuthProvider Component
 * Exposes current user object, role, login/signup handlers, and session persistence.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Simulates reading cached JWT token on initial app boot
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Logs in a user using email and password.
   * Matches pre-seeded demo accounts (parent, caregiver) or generates a flexible demo user.
   */
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 600)); // Simulates network roundtrip

    const normalizedEmail = email.trim().toLowerCase();

    // Check pre-configured mock accounts
    if (normalizedEmail === 'parent@elderguard.com') {
      setUser(MOCK_USERS.parent);
      return { success: true };
    }
    if (normalizedEmail === 'caregiver@elderguard.com') {
      setUser(MOCK_USERS.caregiver);
      return { success: true };
    }

    // Flexible fallback: if valid email format and password >= 6 chars, assign Parent role
    if (normalizedEmail.includes('@') && password.length >= 6) {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        email: normalizedEmail,
        role: 'parent',
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid credentials. Password must be at least 6 characters.',
    };
  };

  /**
   * Registers a new user account with role assignment.
   */
  const signup = async (
    name: string,
    email: string,
    password: string,
    role: 'parent' | 'caregiver'
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!name.trim()) {
      return { success: false, error: 'Full name is required.' };
    }
    if (!email.trim() || !email.includes('@')) {
      return { success: false, error: 'Valid email address is required.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      assignedElderlyCount: 0,
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    return { success: true };
  };

  /**
   * Quick 1-tap role switcher for rapid developer testing.
   */
  const quickLogin = async (role: UserRole): Promise<void> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setUser(MOCK_USERS[role] || MOCK_USERS.parent);
    setIsLoading(false);
  };

  /**
   * Clears active session and signs out the user.
   */
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 200));
    setUser(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        quickLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth Custom Hook
 * Provides direct access to current user identity, active role, and auth methods.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
