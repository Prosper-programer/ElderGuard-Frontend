import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';

export default function SplashScreen() {
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Gentle, natural fade-in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();

    // Transition to onboarding tour after 2 seconds
    const timer = setTimeout(() => {
      router.replace('/(auth)/onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, router]);

  const handleSkip = () => {
    router.replace('/(auth)/onboarding');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <TouchableOpacity
        style={styles.touchArea}
        activeOpacity={1}
        onPress={handleSkip}
      >
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
          {/* Clean, Iconic Blue Shield with Heart & Pulse */}
          <View style={styles.logoBadge}>
            <Svg width={46} height={52} viewBox="0 0 46 52" fill="none">
              {/* Solid Vibrant Shield */}
              <Path
                d="M23 2L42 9.5V25.5C42 38.5 33.8 47.8 23 51C12.2 47.8 4 38.5 4 25.5V9.5L23 2Z"
                fill="#3C6FDB"
              />
              {/* Clean White Vital Pulse */}
              <Path
                d="M12 26.5H19L22 19L26 33L29 24.5L31 26.5H34"
                stroke="#FFFFFF"
                strokeWidth={2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>

          {/* Typography */}
          <Text style={styles.brandTitle}>ElderGuard</Text>
          <Text style={styles.brandTagline}>Connected care for loved ones</Text>
        </Animated.View>

        {/* Quiet, Human Bottom Footer */}
        <Animated.View style={[styles.bottomFooter, { opacity: fadeAnim }]}>
          <Text style={styles.footerNote}>Simple · Safe · Connected</Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  touchArea: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 56,
    paddingHorizontal: 24,
  },
  brandCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBadge: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: '#EFF6FF', // Light subtle blue surface
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#3C6FDB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 4,
  },
  brandTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 30,
    color: '#0F172A', // Slate 900
    letterSpacing: -0.6,
  },
  brandTagline: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#64748B', // Slate 500
    marginTop: 6,
    textAlign: 'center',
  },
  bottomFooter: {
    alignItems: 'center',
  },
  footerNote: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: '#94A3B8', // Slate 400
    letterSpacing: 0.8,
  },
});
