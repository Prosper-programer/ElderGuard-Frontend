import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.94)).current;
  const pulseAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    // Gentle natural reveal
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 45,
        useNativeDriver: true,
      }),
    ]).start();

    // Breathing glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.7,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Transition to onboarding tour after 2.2 seconds
    const timer = setTimeout(() => {
      router.replace('/(auth)/onboarding');
    }, 2200);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, pulseAnim, router]);

  const handleSkip = () => {
    router.replace('/(auth)/onboarding');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <TouchableOpacity
        style={styles.touchArea}
        activeOpacity={1}
        onPress={handleSkip}
      >
        {/* Ambient background glow ring */}
        <Animated.View
          style={[
            styles.ambientGlow,
            {
              opacity: pulseAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        />

        {/* Center Brand Identity */}
        <Animated.View
          style={[
            styles.brandCenter,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Luminous Shield Emblem */}
          <View style={styles.logoBadge}>
            <Svg width={54} height={60} viewBox="0 0 54 60" fill="none">
              <Defs>
                <LinearGradient id="pulseGrad" x1="0" y1="30" x2="54" y2="30" gradientUnits="userSpaceOnUse">
                  <Stop offset="0%" stopColor="#00FBFB" />
                  <Stop offset="100%" stopColor="#FFFFFF" />
                </LinearGradient>
              </Defs>

              {/* Solid White Guardian Shield */}
              <Path
                d="M27 3L49 11.5V30C49 44.5 39.5 55.2 27 59C14.5 55.2 5 44.5 5 30V11.5L27 3Z"
                fill="#FFFFFF"
              />

              {/* Heart Pulse Line in Vibrant Brand Blue */}
              <Path
                d="M14 31H22L25.5 21L30.5 39L34.5 28L37 31H40"
                stroke="#1D4ED8"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Satellite Indicator Dot */}
              <Circle cx={27} cy={16} r={2.5} fill="#00FBFB" />
            </Svg>
          </View>

          {/* Typography */}
          <Text style={styles.brandTitle}>ElderGuard</Text>
          <Text style={styles.brandTagline}>Intelligent Care & Safety for Loved Ones</Text>

          <View style={styles.conceptPill}>
            <View style={styles.statusDot} />
            <Text style={styles.conceptPillText}>Safe · Monitored · Connected</Text>
          </View>
        </Animated.View>

        {/* Human, Reassuring Footer */}
        <Animated.View style={[styles.bottomFooter, { opacity: fadeAnim }]}>
          <Text style={styles.footerNote}>Tap anywhere to continue</Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E3A8A', // Rich Deep Sapphire / Cobalt Blue
  },
  touchArea: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 56,
    paddingHorizontal: 24,
  },
  ambientGlow: {
    position: 'absolute',
    top: '28%',
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: (width * 0.85) / 2,
    backgroundColor: 'rgba(37, 99, 235, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(0, 251, 251, 0.15)',
  },
  brandCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  brandTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#BFDBFE', // Light soft sky blue
    marginTop: 8,
    textAlign: 'center',
  },
  conceptPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E', // Green status
  },
  conceptPillText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  bottomFooter: {
    alignItems: 'center',
  },
  footerNote: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.4,
  },
});
