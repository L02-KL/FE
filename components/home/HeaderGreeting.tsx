import { Mascot } from '@/components/common/Mascot';
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface HeaderGreetingProps {
  userName?: string;
}

export function HeaderGreeting({ userName = 'User' }: HeaderGreetingProps) {
  const { colors } = useTheme();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.textContainer}>
          <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>Welcome back!</Text>
          <Text style={[styles.greetingText, { color: colors.textPrimary }]}>
            {getGreeting()} 👋
          </Text>
          <Text style={[styles.subtitleText, { color: colors.textSecondary }]}>Let's tackle your tasks today</Text>
        </View>
        <Mascot mood="hehe" size="small" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    marginBottom: 4,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
  },
});

export default HeaderGreeting;
