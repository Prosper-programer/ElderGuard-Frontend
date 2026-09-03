/**
 * ElderGuard Elderly Person Data Types
 */

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

export interface MedicalInfo {
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  medicationNotes?: string;
  physicianName?: string;
  physicianPhone?: string;
  hospitalPreference?: string;
}

export interface DeviceStatus {
  deviceId: string;
  deviceName: string;
  connected: boolean;
  batteryLevel: number;
  lastSync: string;
  signalStrength: 'strong' | 'good' | 'weak';
  firmwareVersion: string;
}

export interface ElderlyProfile {
  id: string;
  fullName: string;
  preferredName: string;
  age: number;
  dateOfBirth: string;
  gender: 'Female' | 'Male' | 'Other';
  address: string;
  phone?: string;
  imageUrl?: any;
  parentManagerId: string;
  primaryCaregiverId?: string;
  primaryCaregiverName?: string;
  medicalInfo: MedicalInfo;
  emergencyContacts: EmergencyContact[];
  deviceStatus: DeviceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ElderlyContextValue {
  activeProfile: ElderlyProfile;
  profiles: ElderlyProfile[];
  updateProfile: (id: string, updates: Partial<ElderlyProfile>) => void;
  createProfile: (data: Omit<ElderlyProfile, 'id' | 'createdAt' | 'updatedAt'>) => ElderlyProfile;
  getAssignedProfileForCaregiver: (caregiverId: string) => ElderlyProfile | undefined;
}
