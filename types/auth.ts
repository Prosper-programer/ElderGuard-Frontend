/**
 * ElderGuard Authentication & User Types
 */

export type UserRole = 'parent' | 'caregiver';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  assignedElderlyCount?: number;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (
    name: string,
    email: string,
    password: string,
    role: 'parent' | 'caregiver'
  ) => Promise<{ success: boolean; error?: string }>;
  quickLogin: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}
