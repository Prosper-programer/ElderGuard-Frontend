import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Heart, Activity, Pill, Check } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, StatusType } from '@/constants/theme';

interface HeroStatusRingProps {
  name: string;
  imageUrl?: any;
  status: StatusType;
  heartRate: number | string;
  spo2: number | string;
  medsCompleted: number;
  medsTotal: number;
  statusMessage?: string;
  location?: string;
}

export function HeroStatusRing({
  name,
  imageUrl,
  status,
  heartRate,
  spo2,
  medsCompleted,
  medsTotal,
  statusMessage,
  location = 'At Home — 142 Elm Street',
}: HeroStatusRingProps) {
  const isSafe = status === 'safe';
  const isCritical = status === 'critical';

  const ringColor = isCritical ? Colors.critical : isSafe ? Colors.safe : Colors.warning;
  const ringBg = isCritical ? '#FEE2E2' : isSafe ? '#DCFCE7' : '#FEF3C7';

  // Circle dimensions
  const size = 110;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = isSafe ? 0.95 : isCritical ? 0.35 : 0.7;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={styles.container}>
      {/* ── Status Orb & Photo ───────────────────────────────── */}
      <View style={styles.orbContainer}>
        {/* SVG Progress Arc Ring */}
        <Svg width={size} height={size} style={styles.svgRing}>
          {/* Background Track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={ringBg}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress Arc */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={ringColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>

        {/* Center Avatar Image */}
        <View style={styles.avatarWrap}>
          {imageUrl ? (
            <Image source={imageUrl} style={styles.avatarImage} resizeMode="cover" />
          ) : (
            <Text style={styles.avatarInitials}>{name.slice(0, 2).toUpperCase()}</Text>
          )}
        </View>

        {/* Status Indicator Bubble */}
        <View style={[styles.statusCheckBubble, { backgroundColor: ringColor }]}>
          {isSafe ? (
            <Check size={12} color={Colors.white} strokeWidth={3} />
          ) : (
            <Activity size={12} color={Colors.white} />
          )}
        </View>
      </View>

      {/* ── Glanceable Status Headline ───────────────────────── */}
      <View style={styles.statusMeta}>
        <Text style={styles.headline}>
          {statusMessage || (isSafe ? `${name} is Safe at Home` : `Attention Needed for ${name}`)}
        </Text>
        <Text style={styles.locationText}>{location}</Text>
      </View>

      {/* ── 3 Glanceable Metric Badges ───────────────────────── */}
      <View style={styles.metricsRow}>
        {/* Heart Rate */}
        <View style={styles.metricPill}>
          <Heart size={14} color={Colors.critical} />
          <Text style={styles.metricValue}>{heartRate} bpm</Text>
        </View>

        {/* Blood Oxygen */}
        <View style={styles.metricPill}>
          <Activity size={14} color={Colors.primary} />
          <Text style={styles.metricValue}>{spo2}% SpO₂</Text>
        </View>

        {/* Meds Taken */}
        <View style={styles.metricPill}>
          <Pill size={14} color={Colors.safe} />
          <Text style={styles.metricValue}>
            {medsCompleted}/{medsTotal} Meds
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  orbContainer: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: Spacing.sm,
  },
  svgRing: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  avatarWrap: {
    width: 92,
    height: 92,
    borderRadius: 46,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    ...Typography.h2,
    color: Colors.primary,
  },
  statusCheckBubble: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  statusMeta: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headline: {
    ...Typography.h3,
    fontSize: 18,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  locationText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  metricPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  metricValue: {
    ...Typography.captionMedium,
    fontSize: 12,
    color: Colors.textPrimary,
  },
});
