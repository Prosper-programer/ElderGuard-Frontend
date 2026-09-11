import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  MapPin,
  Phone,
  Shield,
  RefreshCw,
  Navigation,
} from 'lucide-react-native';
import {
  ScreenContainer,
  BottomTabBar,
  Card,
  TopBar,
  MapView,
  StatusBadge,
  SectionHeader,
  Button,
} from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';
import { MOCK_ELDERLY_PERSON, MOCK_USERS } from '@/services/mockData';

export default function CaregiverLocationScreen() {
  const router = useRouter();

  const handleCallParent = () => {
    Linking.openURL(`tel:${(MOCK_USERS.parent.phone || '+15551234567').replace(/[^0-9+]/g, '')}`).catch(() => {});
  };

  return (
    <ScreenContainer
      scrollable
      padded
      backgroundColor="#F0F4FA"
      bottomBar={<BottomTabBar activeTab="home" role="caregiver" />}
    >
      <TopBar
        title="Senior Location"
        onBack={() => (router.canGoBack() ? router.back() : router.replace('/(caregiver)' as any))}
      />

      {/* SVG Map Card */}
      <View style={styles.mapWrap}>
        <MapView
          height={260}
          showGeofence={true}
          geofenceRadius={300}
          address={MOCK_ELDERLY_PERSON.address}
          room={MOCK_ELDERLY_PERSON.room}
          isSafe={true}
        />
      </View>

      {/* Location Status Card */}
      <Card style={styles.cardPadding}>
        <View style={styles.headerRow}>
          <Text style={styles.cardHeading}>Current Status</Text>
          <StatusBadge status="safe" size="sm" />
        </View>

        <View style={styles.statusGrid}>
          {[
            { label: 'ZONE', value: 'Inside Safe Boundary', color: Colors.safe },
            { label: 'ROOM', value: MOCK_ELDERLY_PERSON.room, color: Colors.primary },
            { label: 'SPEED', value: 'Stationary (0 km/h)', color: '#64748B' },
            { label: 'GPS LINK', value: 'Strong (±3.2m)', color: Colors.safe },
          ].map(({ label, value, color }) => (
            <View key={label} style={styles.statusBox}>
              <Text style={styles.statusLabel}>{label}</Text>
              <Text style={[styles.statusValue, { color }]}>{value}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Contact Family Quick Action */}
      <View style={{ marginTop: 8 }}>
        <Button
          variant="outline"
          fullWidth
          onClick={handleCallParent}
        >
          <Phone size={16} color={Colors.primary} />
          Call Family ({MOCK_USERS.parent.name})
        </Button>
      </View>

      <View style={{ height: Spacing.xl }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  mapWrap: {
    marginVertical: 12,
  },
  cardPadding: {
    padding: 16,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusBox: {
    width: '48.5%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
  },
  statusLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  statusValue: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
});
