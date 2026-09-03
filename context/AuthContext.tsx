import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthContextValue } from '@/types/auth';
import { MOCK_USERS } from '@/services/mockData';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize initial auth state (simulating reading cached session)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Artificial latency for realistic async feedback
    await new Promise((resolve) => setTimeout(resolve, 600));

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
    if (normalizedEmail === 'admin@elderguard.com') {
      setUser(MOCK_USERS.admin);
      return { success: true };
    }

    // Flexible MVP fallback: if valid email format and password >= 6 chars, assign Parent role
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

  const quickLogin = async (role: UserRole): Promise<void> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setUser(MOCK_USERS[role] || MOCK_USERS.parent);
    setIsLoading(false);
  };

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

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
