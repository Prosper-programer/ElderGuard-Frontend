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
  const activeIconBg = role === 'parent' ? 'rgba(60, 111, 219, 0.10)' : 'rgba(34, 197, 94, 0.12)';

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
        styles.barContainer,
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
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              {/* Icon Container with soft active pill */}
              <View
                style={[
                  styles.iconWrap,
                  isActive && [styles.iconWrapActive, { backgroundColor: activeIconBg }],
                ]}
              >
                <Icon
                  size={21}
                  color={isActive ? accentColor : Colors.textTertiary}
                  strokeWidth={isActive ? 2.4 : 1.9}
                />

                {/* Notification Badge on Alerts */}
                {showBadge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{activeAlerts.length}</Text>
                  </View>
                )}
              </View>

              {/* Label */}
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? accentColor : Colors.textTertiary,
                    fontWeight: isActive ? '600' : '500',
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
  barContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.06)',
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 8,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  iconWrap: {
    width: 48,
    height: 30,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 2,
  },
  iconWrapActive: {
    // Soft, clean pill behind active icon
  },
  tabLabel: {
    ...Typography.caption,
    fontSize: 11,
    letterSpacing: -0.1,
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.critical,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
});
