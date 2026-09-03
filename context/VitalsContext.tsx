import React, { createContext, useContext, useState, useCallback } from 'react';
import { VitalsSummary, VitalsContextValue } from '@/types/vitals';

const INITIAL_VITALS: VitalsSummary = {
  elderlyId: 'eld-01',
  elderlyName: 'Margaret Johnson',
  overallStatus: 'safe',
  overallStatusMessage: 'All Vitals Within Normal Thresholds',
  heartRate: {
    type: 'heartRate',
    label: 'Heart Rate',
    value: 72,
    unit: 'bpm',
    status: 'safe',
    statusLabel: 'Normal Resting',
    normalRange: '60 - 100 bpm',
    lastUpdated: 'Just now',
    trend: 'stable',
  },
  spo2: {
    type: 'spo2',
    label: 'Blood Oxygen',
    value: 98,
    unit: '%',
    status: 'safe',
    statusLabel: 'Optimal',
    normalRange: '95 - 100%',
    lastUpdated: '1 min ago',
    trend: 'stable',
  },
  temperature: {
    type: 'temperature',
    label: 'Body Temp',
    value: 36.7,
    unit: '°C',
    status: 'safe',
    statusLabel: 'Normal',
    normalRange: '36.1 - 37.2 °C',
    lastUpdated: '3 mins ago',
    trend: 'stable',
  },
  steps: {
    type: 'steps',
    label: 'Daily Activity',
    value: 3840,
    unit: 'steps',
    status: 'safe',
    statusLabel: '76% of Goal (5,000)',
    normalRange: 'Target: 5,000',
    lastUpdated: 'Live',
    trend: 'rising',
  },
  batteryLevel: 87,
  isConnected: true,
  lastSyncTime: '2 mins ago',
};

const VitalsContext = createContext<VitalsContextValue | undefined>(undefined);

export function VitalsProvider({ children }: { children: React.ReactNode }) {
  const [vitals, setVitals] = useState<VitalsSummary>(INITIAL_VITALS);

  const refreshVitals = useCallback(async () => {
    // Simulates an IoT wearable BLE / cellular refresh
    await new Promise((resolve) => setTimeout(resolve, 800));
    setVitals((prev) => ({
      ...prev,
      lastSyncTime: 'Just now',
      heartRate: {
        ...prev.heartRate,
        value: 70 + Math.floor(Math.random() * 6),
        lastUpdated: 'Just now',
      },
    }));
  }, []);

  const simulateAnomaly = useCallback((anomalyType: 'fall' | 'tachycardia' | 'lowOxygen') => {
    if (anomalyType === 'fall') {
      setVitals((prev) => ({
        ...prev,
        overallStatus: 'critical',
        overallStatusMessage: 'CRITICAL ALERT: Sudden Fall Detected',
        heartRate: {
          ...prev.heartRate,
          value: 118,
          status: 'warning',
          statusLabel: 'Elevated Following Fall',
        },
      }));
    } else if (anomalyType === 'tachycardia') {
      setVitals((prev) => ({
        ...prev,
        overallStatus: 'critical',
        overallStatusMessage: 'CRITICAL: Tachycardia Detected',
        heartRate: {
          ...prev.heartRate,
          value: 138,
          status: 'critical',
          statusLabel: 'Abnormally High (>130)',
        },
      }));
    } else if (anomalyType === 'lowOxygen') {
      setVitals((prev) => ({
        ...prev,
        overallStatus: 'warning',
        overallStatusMessage: 'WARNING: Blood Oxygen Below Normal (91%)',
        spo2: {
          ...prev.spo2,
          value: 91,
          status: 'warning',
          statusLabel: 'Low Oxygen Alert (<92%)',
        },
      }));
    }
  }, []);

  const resetToNormal = useCallback(() => {
    setVitals(INITIAL_VITALS);
  }, []);

  return (
    <VitalsContext.Provider
      value={{
        vitals,
        refreshVitals,
        simulateAnomaly,
        resetToNormal,
      }}
    >
      {children}
    </VitalsContext.Provider>
  );
}

export function useVitals(): VitalsContextValue {
  const context = useContext(VitalsContext);
  if (!context) {
    throw new Error('useVitals must be used within a VitalsProvider');
  }
  return context;
}
