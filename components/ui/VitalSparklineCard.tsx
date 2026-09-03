import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { StatusBadge } from './StatusBadge';
import { Colors, Typography, Spacing, BorderRadius, StatusType } from '@/constants/theme';

interface VitalSparklineCardProps {
  label: string;
  value: number | string;
  unit: string;
  status: StatusType;
  statusLabel: string;
  normalRange: string;
  icon: React.ReactNode;
  iconBg: string;
  sparklineColor?: string;
  trend?: 'stable' | 'rising' | 'falling';
}

export function VitalSparklineCard({
  label,
  value,
  unit,
  status,
  statusLabel,
  normalRange,
  icon,
  iconBg,
  sparklineColor,
}: VitalSparklineCardProps) {
  const isCritical = status === 'critical';
  const isWarning = status === 'warning';

  const strokeColor =
    sparklineColor ||
    (isCritical ? Colors.critical : isWarning ? Colors.warning : Colors.primary);

  // Wavy 24-hr sparkline path
  const pathD = isCritical
    ? 'M0,18 C15,18 25,6 40,6 C55,6 65,22 80,22 C95,22 105,2 120,2'
    : isWarning
    ? 'M0,14 C20,14 30,8 50,8 C70,8 80,18 100,18 C110,18 115,10 120,10'
    : 'M0,14 C15,14 25,10 40,10 C55,10 65,16 80,16 C95,16 105,12 120,12';

  return (
    <View style={styles.card}>
      {/* Top row: Icon, Label, StatusBadge */}
      <View style={styles.topRow}>
        <View style={[styles.iconBox, { backgroundColor: iconBg }]}>{icon}</View>
        <Text style={styles.label}>{label}</Text>
        <StatusBadge status={status} label={statusLabel} size="sm" />
      </View>

      {/* Middle row: Big Value + Sparkline */}
      <View style={styles.middleRow}>
        <View style={styles.valueWrap}>
          <Text style={styles.value}>
            {value} <Text style={styles.unit}>{unit}</Text>
          </Text>
        </View>

        {/* Mini SVG Sparkline */}
        <View style={styles.sparklineWrap}>
          <Svg width={75} height={24} viewBox="0 0 120 24">
            <Path
              d={pathD}
              fill="none"
              stroke={strokeColor}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      </View>

      {/* Bottom Range Text */}
      <Text style={styles.rangeText}>Normal: {normalRange}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '47.5%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: Spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.xs,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...Typography.captionMedium,
    fontSize: 11,
    color: Colors.textSecondary,
    flex: 1,
  },
  middleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 4,
  },
  valueWrap: {
    flex: 1,
  },
  value: {
    ...Typography.h2,
    fontSize: 21,
    color: Colors.textPrimary,
  },
  unit: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textTertiary,
  },
  sparklineWrap: {
    width: 75,
    height: 24,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  rangeText: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textTertiary,
  },
});
