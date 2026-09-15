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
import { apiLogin, apiSignup, apiLogout } from '@/services/authService';

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
   * Logs in a user using email and password via the Express + MySQL backend.
   */
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; user?: User }> => {
    setIsLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    // Call real Node.js + Express backend API
    const result = await apiLogin(email, password);

    if (result.success && result.user) {
      setUser(result.user);
      setIsLoading(false);
      return { success: true, user: result.user };
    }

    // Offline / demo fallback if backend is unreachable or demo accounts are used
    if (normalizedEmail === 'parent@elderguard.com' || normalizedEmail === 'robert.thompson@email.com') {
      setUser(MOCK_USERS.parent);
      setIsLoading(false);
      return { success: true, user: MOCK_USERS.parent };
    }
    if (normalizedEmail === 'caregiver@elderguard.com' || normalizedEmail === 'sarah.mitchell@elderguard.com') {
      setUser(MOCK_USERS.caregiver);
      setIsLoading(false);
      return { success: true, user: MOCK_USERS.caregiver };
    }
    if (normalizedEmail === 'doctor@elderguard.com') {
      setUser(MOCK_USERS.doctor);
      setIsLoading(false);
      return { success: true, user: MOCK_USERS.doctor };
    }

    setIsLoading(false);
    return {
      success: false,
      error: result.error || 'Invalid credentials.',
    };
  };

  /**
   * Registers a new user account with role assignment on the Express + MySQL backend.
   */
  const signup = async (
    name: string,
    email: string,
    password: string,
    role: 'parent' | 'caregiver',
    phone?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    // Call real Node.js + Express backend API
    const result = await apiSignup(name, email, password, role, phone);

    if (result.success && result.user) {
      setUser(result.user);
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return {
      success: false,
      error: result.error || 'Failed to register.',
    };
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
   * Clears active session and signs out the user on the backend.
   */
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    await apiLogout();
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
