import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

interface StatsCardProps {
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  label: string;
  value: number;
  backgroundColor?: string;
  iconBackgroundColor?: string;
}

export function StatsCard({
  iconName,
  iconColor,
  label,
  value,
  backgroundColor,
  iconBackgroundColor,
}: StatsCardProps) {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: backgroundColor || colors.cardBackground }]}>
      <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor || colors.primaryLight }]}>
        <Ionicons name={iconName} size={24} color={iconColor || colors.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default StatsCard;
