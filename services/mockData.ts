/**
 * ElderGuard Centralized Mock Data
 *
 * Provides realistic initial mock profiles and records for Parent, Caregiver, and Admin.
 * Used during MVP phases until real backend and IoT stream integrations are connected.
 */

import { User } from '@/types/auth';

export const MOCK_USERS: Record<string, User> = {
  parent: {
    id: 'usr-parent-01',
    name: 'Eleanor Vance',
    email: 'parent@elderguard.com',
    role: 'parent',
    phone: '+1 (555) 234-5678',
    assignedElderlyCount: 1,
    createdAt: '2026-01-15T08:00:00.000Z',
  },
  caregiver: {
    id: 'usr-caregiver-01',
    name: 'David Miller',
    email: 'caregiver@elderguard.com',
    role: 'caregiver',
    phone: '+1 (555) 345-6789',
    assignedElderlyCount: 1,
    createdAt: '2026-02-01T09:30:00.000Z',
  },
  admin: {
    id: 'usr-admin-01',
    name: 'Sarah Jenkins',
    email: 'admin@elderguard.com',
    role: 'admin',
    phone: '+1 (555) 456-7890',
    createdAt: '2025-11-10T12:00:00.000Z',
  },
};

/**
 * Common mock elderly profile referenced across Parent and Caregiver flows.
 */
export const MOCK_ELDERLY_PERSON = {
  id: 'eld-01',
  fullName: 'Margaret Johnson',
  preferredName: 'Margaret',
  age: 78,
  dateOfBirth: '1948-03-22',
  gender: 'Female',
  primaryCaregiverId: 'usr-caregiver-01',
  parentManagerId: 'usr-parent-01',
  bloodType: 'O+',
  emergencyContact: {
    name: 'Eleanor Vance',
    relationship: 'Daughter (Primary)',
    phone: '+1 (555) 234-5678',
  },
  address: '142 Elm Street, Maplewood, NJ',
  deviceConnected: true,
  deviceId: 'EG-IOT-4892',
};
