/**
 * ============================================================================
 * ElderGuard — BottomTabBar.tsx
 * ============================================================================
 *
 * PURPOSE:
 * Persistent bottom navigation dock for the Parent and Caregiver workspaces.
 *
 * CALLED BY:
 * Parent and caregiver route screens through the `bottomBar` prop of
 * `ScreenContainer`, passing the current tab and workspace role.
 *
 * DATA FLOW:
 * The caller supplies `activeTab` and `role`; `useAlerts()` supplies the current
 * active-alert count; tab presses are converted into Expo Router destinations.
 *
 * RENDERED OUTPUT:
 * A four-item navigation row with role-colored active states and an alert badge.
 *
 * CORE FEATURES:
 * 1. 4 GLANCEABLE TABS:
 *    - `Vitals`      : Real-time telemetry, Hero status halo, hardware status.
 *    - `Care & Meds` : Prescribed medications, daypart dosage timeline, activity goals.
 *    - `Alerts`      : Incident monitoring with real-time red notification counter badge.
 *    - `Profile`     : Senior demographics, emergency contact chain, and clinical history.
 *
 * 2. ROLE-ADAPTIVE ACCENT COLORS:
 *    - Parent    : Primary Blue (`#3C6FDB`)
 *    - Caregiver : Safe Green (`#22C55E`)
 *
 * 3. NATIVE VISUAL FOCUS:
 *    - Active tabs receive a soft, gentle circular background pill with semibold typography.
 *    - Eliminates bulky boxes, borders, and non-native hover artifacts.
 */

import { BorderRadius, Colors, Typography } from "@/constants/theme";
import { useAlerts } from "@/context/AlertContext";
import { useRouter } from "expo-router";
import { Activity, Pill, ShieldAlert, User } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Public tab identifiers shared by route screens and the navigation bar.
export type TabKey = "home" | "care" | "alerts" | "profile";

// Inputs required by the navigation bar's callers to identify state and routes.
interface BottomTabBarProps {
  /** The currently selected tab identifier */
  activeTab: TabKey;
  /** The current user workspace role (determines destination routes and accent palette) */
  role: "parent" | "caregiver";
}

export function BottomTabBar({ activeTab, role }: BottomTabBarProps) {
  // Navigation and device-inset services used by the rendered tab bar.
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { activeAlerts } = useAlerts();

  // Derive the active-state palette from the workspace role supplied by the caller.
  const accentColor = role === "parent" ? Colors.primary : Colors.safe;
  const activeIconBg =
    role === "parent" ? "rgba(60, 111, 219, 0.10)" : "rgba(34, 197, 94, 0.12)";

  // Build role-aware destinations for the four primary navigation tabs.
  const tabs: { key: TabKey; label: string; icon: any; route: string }[] = [
    {
      key: "home",
      label: "Vitals",
      icon: Activity,
      route: role === "parent" ? "/(parent)" : "/(caregiver)",
    },
    {
      key: "care",
      label: "Care & Meds",
      icon: Pill,
      route: role === "parent" ? "/(parent)/care" : "/(caregiver)/care",
    },
    {
      key: "alerts",
      label: "Alerts",
      icon: ShieldAlert,
      route: role === "parent" ? "/(parent)/alerts" : "/(caregiver)/alerts",
    },
    {
      key: "profile",
      label: "Profile",
      icon: User,
      route: role === "parent" ? "/(parent)/profile" : "/(caregiver)/profile",
    },
  ];

  // Ignore the current tab; otherwise replace the route to keep tab navigation flat.
  const handleTabPress = (route: string, key: TabKey) => {
    if (key === activeTab) return;
    router.replace(route as any);
  };

  // Render the dock, its safe-area spacing, and one interactive item per tab.
  return (
    <View
      style={[
        styles.barContainer,
        {
          // Keep the dock above the device's home indicator or gesture area.
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      <View style={styles.tabsRow}>
        {tabs.map((tab) => {
          // Compute visual state and notification visibility for this tab.
          const isActive = tab.key === activeTab;
          const Icon = tab.icon;
          const showBadge = tab.key === "alerts" && activeAlerts.length > 0;

          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => handleTabPress(tab.route, tab.key)}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              {/* Active-state icon background and the tab's navigation icon. */}
              <View
                style={[
                  styles.iconWrap,
                  isActive && [
                    styles.iconWrapActive,
                    { backgroundColor: activeIconBg },
                  ],
                ]}
              >
                <Icon
                  size={21}
                  color={isActive ? accentColor : Colors.textTertiary}
                  strokeWidth={isActive ? 2.4 : 1.9}
                />

                {/* Show the live active-alert count only on the Alerts tab. */}
                {showBadge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{activeAlerts.length}</Text>
                  </View>
                )}
              </View>

              {/* Text label identifying the destination represented by the icon. */}
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? accentColor : Colors.textTertiary,
                    fontWeight: isActive ? "600" : "500",
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
  // Layout and elevation for the dock pinned by ScreenContainer.
  barContainer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.06)",
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 8,
  },
  // Horizontal distribution for the four tab buttons.
  tabsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
  },
  // Stable touch target shared by every tab.
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
  },
  // Fixed icon area prevents the label and badge from shifting the layout.
  iconWrap: {
    width: 48,
    height: 30,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 2,
  },
  iconWrapActive: {
    // Background color is injected dynamically from the workspace role.
  },
  // Typography and color are completed dynamically for active and inactive tabs.
  tabLabel: {
    ...Typography.caption,
    fontSize: 11,
    letterSpacing: -0.1,
  },
  // Position the alert count over the Alerts icon.
  badge: {
    position: "absolute",
    top: -3,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.critical,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  // Compact white badge text remains legible at small sizes.
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
  },
});
