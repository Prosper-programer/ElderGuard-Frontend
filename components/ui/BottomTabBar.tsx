import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Activity, Pill, ShieldAlert, User } from 'lucide-react-native';
import { Colors, Typography, BorderRadius } from '@/constants/theme';
import { useAlerts } from '@/context/AlertContext';

export type TabKey = 'home' | 'care' | 'alerts' | 'profile';

interface BottomTabBarProps {
  activeTab: TabKey;
  role: 'parent' | 'caregiver';
}

export function BottomTabBar({ activeTab, role }: BottomTabBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { activeAlerts } = useAlerts();

  const accentColor = role === 'parent' ? Colors.primary : Colors.safe;

  const tabs: { key: TabKey; label: string; icon: any; route: string }[] = [
    {
      key: 'home',
      label: 'Vitals',
      icon: Activity,
      route: role === 'parent' ? '/(parent)' : '/(caregiver)',
    },
    {
      key: 'care',
      label: 'Care & Meds',
      icon: Pill,
      route: role === 'parent' ? '/(parent)/care' : '/(caregiver)/care',
    },
    {
      key: 'alerts',
      label: 'Alerts',
      icon: ShieldAlert,
      route: role === 'parent' ? '/(parent)/alerts' : '/(caregiver)/alerts',
    },
    {
      key: 'profile',
      label: 'Profile',
      icon: User,
      route: role === 'parent' ? '/(parent)/profile' : '/(caregiver)/profile',
    },
  ];

  const handleTabPress = (route: string, key: TabKey) => {
    if (key === activeTab) return;
    router.replace(route as any);
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      <View style={styles.tabsRow}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          const Icon = tab.icon;
          const showBadge = tab.key === 'alerts' && activeAlerts.length > 0;

          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => handleTabPress(tab.route, tab.key)}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconWrap,
                  isActive && {
                    backgroundColor: role === 'parent' ? Colors.primaryFaded : Colors.safeBg,
                  },
                ]}
              >
                <Icon size={20} color={isActive ? accentColor : Colors.textTertiary} />

                {/* Live Red Badge on Alerts */}
                {showBadge && (
                  <View style={styles.badgeDot}>
                    <Text style={styles.badgeText}>{activeAlerts.length}</Text>
                  </View>
                )}
              </View>

              <Text
                style={[
                  styles.tabLabel,
                  isActive && {
                    color: accentColor,
                    fontWeight: '600',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 2,
  },
  iconWrap: {
    width: 38,
    height: 30,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabLabel: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 3,
  },
  badgeDot: {
    position: 'absolute',
    top: -2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.critical,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '700',
  },
});
