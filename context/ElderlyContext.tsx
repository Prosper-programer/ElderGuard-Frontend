/**
 * ============================================================================
 * ElderGuard — ElderlyContext.tsx
 * ============================================================================
 * 
 * PURPOSE:
 * Stores and manages the senior profile (Margaret Johnson), including:
 * 1. Demographic and contact data (Name, address, phone, avatar).
 * 2. Clinical and medical history (Blood type, allergies, chronic conditions, physician).
 * 3. Emergency contacts hierarchy (Primary vs. secondary family responders).
 * 4. Paired IoT hardware telemetry status (Device ID, battery %, connection status).
 * 
 * ROLE ACCESS:
 * - Parent: Full Read/Write access (can edit contacts, medical notes, add new seniors).
 * - Caregiver: Read-Only access (displays assigned senior care instructions).
 */

import React, { createContext, useContext, useState } from 'react';
import { ElderlyProfile, ElderlyContextValue } from '@/types/elderly';

/**
 * Baseline demonstration profile for Margaret Johnson (Age 78):
 */
const INITIAL_PROFILES: ElderlyProfile[] = [
  {
    id: 'eld-01',
    fullName: 'Margaret Johnson',
    preferredName: 'Margaret',
    age: 78,
    dateOfBirth: '1948-03-22',
    gender: 'Female',
    address: '142 Elm Street, Maplewood, NJ 07040',
    phone: '+1 (555) 782-9012',
    imageUrl: require('@/assets/images/elderly_margaret.jpg'),
    parentManagerId: 'usr-parent-01', // Eleanor Vance
    primaryCaregiverId: 'usr-caregiver-01', // David Miller
    primaryCaregiverName: 'David Miller',

    // Clinical Information
    medicalInfo: {
      bloodType: 'O+',
      allergies: ['Penicillin', 'Sulfa drugs'],
      chronicConditions: ['Hypertension (Stage 1)', 'Mild Osteoarthritis'],
      medicationNotes: 'Lisinopril 10mg every morning at 08:00 AM. Calcium supplement with lunch.',
      physicianName: 'Dr. Robert Chen, MD',
      physicianPhone: '+1 (555) 890-1234',
      hospitalPreference: 'Saint Luke Memorial Medical Center',
    },

    // Emergency Contact Chain
    emergencyContacts: [
      {
        id: 'ec-1',
        name: 'Eleanor Vance',
        relationship: 'Daughter (Primary Care Manager)',
        phone: '+1 (555) 234-5678',
        isPrimary: true,
      },
      {
        id: 'ec-2',
        name: 'James Johnson',
        relationship: 'Son',
        phone: '+1 (555) 678-9012',
        isPrimary: false,
      },
    ],

    // Hardware Telemetry & Pairing
    deviceStatus: {
      deviceId: 'EG-IOT-4892',
      deviceName: 'ElderGuard Wearable Band V2',
      connected: true,
      batteryLevel: 87,
      lastSync: '2 minutes ago',
      signalStrength: 'strong',
      firmwareVersion: 'v2.4.1',
    },
    createdAt: '2026-01-16T10:00:00.000Z',
    updatedAt: '2026-09-02T14:30:00.000Z',
  },
];

// React Context definition for elderly profile management
const ElderlyContext = createContext<ElderlyContextValue | undefined>(undefined);

/**
 * ElderlyProvider Component
 * Exposes the active senior profile, list of profiles, and update/creation handlers.
 */
export function ElderlyProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfiles] = useState<ElderlyProfile[]>(INITIAL_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState<string>('eld-01');

  // Currently selected senior profile
  const activeProfile =
    profiles.find((p) => p.id === activeProfileId) || profiles[0] || INITIAL_PROFILES[0];

  /**
   * Updates an existing senior's profile with partial attributes.
   */
  const updateProfile = (id: string, updates: Partial<ElderlyProfile>) => {
    setProfiles((prev) =>
      prev.map((profile) => {
        if (profile.id === id) {
          return {
            ...profile,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
        return profile;
      })
    );
  };

  /**
   * Creates and registers a new senior profile into the system.
   */
  const createProfile = (
    data: Omit<ElderlyProfile, 'id' | 'createdAt' | 'updatedAt'>
  ): ElderlyProfile => {
    const newProfile: ElderlyProfile = {
      ...data,
      id: `eld-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProfiles((prev) => [newProfile, ...prev]);
    setActiveProfileId(newProfile.id);
    return newProfile;
  };

  /**
   * Retrieves the senior assigned to a specific professional caregiver.
   */
  const getAssignedProfileForCaregiver = (caregiverId: string): ElderlyProfile | undefined => {
    return profiles.find((p) => p.primaryCaregiverId === caregiverId) || profiles[0];
  };

  return (
    <ElderlyContext.Provider
      value={{
        activeProfile,
        profiles,
        updateProfile,
        createProfile,
        getAssignedProfileForCaregiver,
      }}
    >
      {children}
    </ElderlyContext.Provider>
  );
}

/**
 * useElderly Custom Hook
 * Provides direct access to senior demographic, clinical, and hardware pairing state.
 */
export function useElderly(): ElderlyContextValue {
  const context = useContext(ElderlyContext);
  if (!context) {
    throw new Error('useElderly must be used within an ElderlyProvider');
  }
  return context;
}
