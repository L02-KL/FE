import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../constants/colors';

const SplashScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Text animation (delay 500ms)
    Animated.timing(textFadeAnim, {
      toValue: 1,
      duration: 800,
      delay: 500,
      useNativeDriver: true,
    }).start();

    // Navigate after 3 seconds to allow users to read the intro
    const timer = setTimeout(() => {
      navigation.navigate('Onboarding' as never);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Background decorative circles */}
      <View style={styles.backgroundCircles}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>BKMindCare</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.introContainer,
          {
            opacity: textFadeAnim,
          },
        ]}
      >
        <Text style={styles.tagline}>Hệ thống hỗ trợ tâm lý</Text>
        <Text style={styles.subtitle}>Trường Đại học Bách khoa - ĐHQG TP.HCM</Text>
        <Text style={styles.description}>
          Chăm sóc sức khỏe tâm thần của bạn{'\n'}
          một cách toàn diện và chuyên nghiệp
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundCircles: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: 200,
    opacity: 0.3,
  },
  circle1: {
    width: 300,
    height: 300,
    backgroundColor: Colors.blue,
    top: -100,
    left: -50,
  },
  circle2: {
    width: 250,
    height: 250,
    backgroundColor: Colors.teal,
    top: '30%',
    right: -50,
  },
  circle3: {
    width: 200,
    height: 200,
    backgroundColor: Colors.purpleLight,
    bottom: -50,
    left: '20%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 24,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    letterSpacing: 0.5,
  },
  introContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 20,
  },
  tagline: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default SplashScreen;

