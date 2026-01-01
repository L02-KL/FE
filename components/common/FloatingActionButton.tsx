import AppColors from '@/constants/colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface FloatingActionButtonProps {
  onPress: () => void;
}

export function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.icon}>+</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: AppColors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: AppColors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
  icon: {
    fontSize: 32,
    color: AppColors.white,
    fontWeight: '300',
    marginTop: -2,
  },
});

export default FloatingActionButton;
