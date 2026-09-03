import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Edit3,
  Phone,
  Heart,
  ShieldCheck,
  Battery,
  Wifi,
  MapPin,
  Calendar,
  AlertTriangle,
  UserCheck,
  Stethoscope,
} from 'lucide-react-native';
import { ScreenContainer, Button, Card, StatusBadge, Avatar, Divider } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useElderly } from '@/context/ElderlyContext';

export default function ParentElderlyProfileScreen() {
  const router = useRouter();
  const { activeProfile } = useElderly();

  const primaryContact = activeProfile.emergencyContacts.find((c) => c.isPrimary) || activeProfile.emergencyContacts[0];
  const secondaryContact = activeProfile.emergencyContacts.find((c) => !c.isPrimary);

  const handleCall = (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const url = Platform.OS === 'ios' ? `telprompt:${cleanPhone}` : `tel:${cleanPhone}`;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <ScreenContainer scrollable padded backgroundColor={Colors.background}>
      {/* ── 1. Top Navigation Bar ────────────────────────────── */}
      <View style={styles.topNav}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={22} color={Colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.navTitle}>Elderly Profile</Text>

        <TouchableOpacity
          onPress={() => router.push('/(parent)/profile/edit')}
          style={styles.editHeaderButton}
          activeOpacity={0.7}
        >
          <Edit3 size={18} color={Colors.primary} />
          <Text style={styles.editHeaderText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* ── 2. Hero Profile Card ─────────────────────────────── */}
      <Card elevated style={styles.heroCard}>
        <View style={styles.heroRow}>
          <Avatar
            name={activeProfile.fullName}
            imageUrl={activeProfile.imageUrl}
            size={80}
            statusIndicator="safe"
          />
          <View style={styles.heroMeta}>
            <Text style={styles.heroName}>{activeProfile.fullName}</Text>
            <Text style={styles.heroSub}>
              {activeProfile.age} yrs · {activeProfile.gender} · &quot;{activeProfile.preferredName}&quot;
            </Text>
            <View style={styles.statusWrap}>
              <StatusBadge status="safe" label="Device Online · Normal" size="sm" />
            </View>
          </View>
        </View>

        {/* Live Device Quick Strip */}
        <View style={styles.deviceStrip}>
          <View style={styles.deviceMetric}>
            <Battery size={16} color={Colors.safe} />
            <Text style={styles.deviceMetricText}>{activeProfile.deviceStatus.batteryLevel}% Battery</Text>
          </View>
          <View style={styles.deviceDivider} />
          <View style={styles.deviceMetric}>
            <Wifi size={16} color={Colors.primary} />
            <Text style={styles.deviceMetricText}>Synced {activeProfile.deviceStatus.lastSync}</Text>
          </View>
        </View>
      </Card>

      <View style={{ height: Spacing.md }} />

      {/* ── 3. Primary Emergency Contacts Card ───────────────── */}
      <Card style={styles.sectionCard}>
        <View style={styles.cardHeader}>
          <Phone size={18} color={Colors.critical} />
          <Text style={styles.cardTitle}>EMERGENCY CONTACTS</Text>
        </View>

        {/* Primary Contact */}
        {primaryContact && (
          <View style={styles.contactItem}>
            <View style={styles.contactInfo}>
              <View style={styles.primaryBadgeRow}>
                <Text style={styles.contactName}>{primaryContact.name}</Text>
                <View style={styles.primaryPill}>
                  <Text style={styles.primaryPillText}>PRIMARY</Text>
                </View>
              </View>
              <Text style={styles.contactRelation}>{primaryContact.relationship}</Text>
              <Text style={styles.contactPhone}>{primaryContact.phone}</Text>
            </View>
            <TouchableOpacity
              onPress={() => handleCall(primaryContact.phone)}
              style={styles.callActionButton}
              activeOpacity={0.8}
            >
              <Phone size={16} color={Colors.white} />
              <Text style={styles.callActionText}>Call</Text>
            </TouchableOpacity>
          </View>
        )}

        {secondaryContact && (
          <>
            <Divider spacing={Spacing.sm} />
            <View style={styles.contactItem}>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{secondaryContact.name}</Text>
                <Text style={styles.contactRelation}>{secondaryContact.relationship}</Text>
                <Text style={styles.contactPhone}>{secondaryContact.phone}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleCall(secondaryContact.phone)}
                style={[styles.callActionButton, styles.callSecondaryButton]}
                activeOpacity={0.8}
              >
                <Phone size={16} color={Colors.primary} />
                <Text style={[styles.callActionText, { color: Colors.primary }]}>Call</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Card>

      <View style={{ height: Spacing.md }} />

      {/* ── 4. Medical & Health Information ──────────────────── */}
      <Card style={styles.sectionCard}>
        <View style={styles.cardHeader}>
          <Heart size={18} color={Colors.critical} />
          <Text style={styles.cardTitle}>HEALTH & MEDICAL PROFILE</Text>
        </View>

        {/* Blood Type & Allergies */}
        <View style={styles.medicalRow}>
          <View style={styles.bloodTypeBox}>
            <Text style={styles.bloodTypeLabel}>BLOOD TYPE</Text>
            <Text style={styles.bloodTypeValue}>{activeProfile.medicalInfo.bloodType}</Text>
          </View>

          <View style={styles.allergiesBox}>
            <View style={styles.alertHeader}>
              <AlertTriangle size={14} color={Colors.warning} />
              <Text style={styles.allergiesLabel}>ALLERGIES</Text>
            </View>
            <View style={styles.chipsWrap}>
              {activeProfile.medicalInfo.allergies.map((allergy, i) => (
                <View key={i} style={styles.allergyChip}>
                  <Text style={styles.allergyText}>{allergy}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Chronic Conditions */}
        <View style={styles.conditionSection}>
          <Text style={styles.metaSubhead}>CHRONIC CONDITIONS</Text>
          <View style={styles.chipsWrap}>
            {activeProfile.medicalInfo.chronicConditions.map((condition, i) => (
              <View key={i} style={styles.conditionChip}>
                <Text style={styles.conditionText}>{condition}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Medication Schedule Note */}
        {activeProfile.medicalInfo.medicationNotes && (
          <View style={styles.medNoteBox}>
            <Text style={styles.medNoteLabel}>DAILY MEDICATION NOTES</Text>
            <Text style={styles.medNoteText}>{activeProfile.medicalInfo.medicationNotes}</Text>
          </View>
        )}

        {/* Physician / Hospital */}
        <View style={styles.physicianBox}>
          <Stethoscope size={16} color={Colors.textSecondary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.physicianName}>{activeProfile.medicalInfo.physicianName}</Text>
            <Text style={styles.hospitalName}>{activeProfile.medicalInfo.hospitalPreference}</Text>
          </View>
        </View>
      </Card>

      <View style={{ height: Spacing.md }} />

      {/* ── 5. Personal Details & Residence ──────────────────── */}
      <Card style={styles.sectionCard}>
        <View style={styles.cardHeader}>
          <MapPin size={18} color={Colors.primary} />
          <Text style={styles.cardTitle}>RESIDENTIAL & CONTACT</Text>
        </View>

        <View style={styles.detailRow}>
          <MapPin size={16} color={Colors.textTertiary} />
          <View style={styles.detailMeta}>
            <Text style={styles.detailLabel}>Home Address</Text>
            <Text style={styles.detailValue}>{activeProfile.address}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Calendar size={16} color={Colors.textTertiary} />
          <View style={styles.detailMeta}>
            <Text style={styles.detailLabel}>Date of Birth</Text>
            <Text style={styles.detailValue}>{activeProfile.dateOfBirth} ({activeProfile.age} years old)</Text>
          </View>
        </View>

        {activeProfile.phone && (
          <View style={styles.detailRow}>
            <Phone size={16} color={Colors.textTertiary} />
            <View style={styles.detailMeta}>
              <Text style={styles.detailLabel}>Personal Phone</Text>
              <Text style={styles.detailValue}>{activeProfile.phone}</Text>
            </View>
          </View>
        )}
      </Card>

      <View style={{ height: Spacing.md }} />

      {/* ── 6. Care Team & Device Information ────────────────── */}
      <Card style={styles.sectionCard}>
        <View style={styles.cardHeader}>
          <ShieldCheck size={18} color={Colors.safe} />
          <Text style={styles.cardTitle}>CARE MANAGEMENT & IOT DEVICE</Text>
        </View>

        <View style={styles.teamRow}>
          <UserCheck size={16} color={Colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.teamRole}>Assigned Caregiver</Text>
            <Text style={styles.teamMember}>{activeProfile.primaryCaregiverName || 'David Miller'}</Text>
          </View>
        </View>

        <View style={styles.teamRow}>
          <Wifi size={16} color={Colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.teamRole}>IoT Wearable Hardware</Text>
            <Text style={styles.teamMember}>
              {activeProfile.deviceStatus.deviceName} ({activeProfile.deviceStatus.deviceId})
            </Text>
          </View>
        </View>
      </Card>

      {/* ── 7. Bottom Actions ────────────────────────────────── */}
      <View style={styles.bottomActions}>
        <Button
          title="Edit Profile Information"
          onPress={() => router.push('/(parent)/profile/edit')}
          variant="primary"
          size="lg"
          fullWidth
          leftIcon={<Edit3 size={18} color={Colors.white} />}
        />

        <View style={{ height: Spacing.sm }} />

        <Button
          title="Return to Dashboard"
          onPress={() => router.back()}
          variant="secondary"
          size="lg"
          fullWidth
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceSecondary,
  },
  navTitle: {
    ...Typography.bodySemiBold,
    fontSize: 17,
    color: Colors.textPrimary,
  },
  editHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryFaded,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  editHeaderText: {
    ...Typography.captionMedium,
    color: Colors.primary,
    fontWeight: '600',
  },
  heroCard: {
    backgroundColor: Colors.white,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
  },
  heroMeta: {
    flex: 1,
  },
  heroName: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  heroSub: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statusWrap: {
    marginTop: Spacing.xs,
    alignSelf: 'flex-start',
  },
  deviceStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.base,
  },
  deviceMetric: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
  },
  deviceMetricText: {
    ...Typography.captionMedium,
    color: Colors.textSecondary,
  },
  deviceDivider: {
    width: 1,
    height: 18,
    backgroundColor: Colors.border,
  },
  sectionCard: {
    backgroundColor: Colors.white,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.base,
  },
  cardTitle: {
    ...Typography.overline,
    color: Colors.textTertiary,
    letterSpacing: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactInfo: {
    flex: 1,
  },
  primaryBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  contactName: {
    ...Typography.bodySemiBold,
    color: Colors.textPrimary,
  },
  primaryPill: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  primaryPillText: {
    ...Typography.overline,
    fontSize: 9,
    color: Colors.critical,
    letterSpacing: 0.5,
  },
  contactRelation: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  contactPhone: {
    ...Typography.captionMedium,
    color: Colors.primary,
    marginTop: 2,
  },
  callActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.safe,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
  },
  callSecondaryButton: {
    backgroundColor: Colors.primaryFaded,
  },
  callActionText: {
    ...Typography.captionMedium,
    color: Colors.white,
    fontWeight: '600',
  },
  medicalRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  bloodTypeBox: {
    backgroundColor: Colors.surfaceSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
  },
  bloodTypeLabel: {
    ...Typography.overline,
    fontSize: 9,
    color: Colors.textTertiary,
  },
  bloodTypeValue: {
    ...Typography.metricSmall,
    color: Colors.critical,
    marginTop: 2,
  },
  allergiesBox: {
    flex: 1,
    backgroundColor: Colors.surfaceSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  allergiesLabel: {
    ...Typography.overline,
    fontSize: 9,
    color: Colors.warning,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  allergyChip: {
    backgroundColor: Colors.warningLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
  },
  allergyText: {
    ...Typography.caption,
    fontSize: 11,
    color: '#B45309',
    fontWeight: '600',
  },
  conditionSection: {
    marginBottom: Spacing.md,
  },
  metaSubhead: {
    ...Typography.overline,
    fontSize: 10,
    color: Colors.textTertiary,
    marginBottom: 6,
  },
  conditionChip: {
    backgroundColor: Colors.primaryFaded,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
  },
  conditionText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.primaryDark,
    fontWeight: '500',
  },
  medNoteBox: {
    backgroundColor: '#FEF9C3',
    borderColor: '#FDE047',
    borderWidth: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  medNoteLabel: {
    ...Typography.overline,
    fontSize: 9,
    color: '#854D0E',
    marginBottom: 2,
  },
  medNoteText: {
    ...Typography.bodySmall,
    color: '#713F12',
    lineHeight: 18,
  },
  physicianBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surfaceSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  physicianName: {
    ...Typography.bodySmallSemiBold,
    color: Colors.textPrimary,
  },
  hospitalName: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  detailMeta: {
    flex: 1,
  },
  detailLabel: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  detailValue: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
    marginTop: 1,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  teamRole: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  teamMember: {
    ...Typography.bodySmallSemiBold,
    color: Colors.textPrimary,
    marginTop: 1,
  },
  bottomActions: {
    paddingVertical: Spacing.xl,
    paddingBottom: Spacing['3xl'],
  },
});
