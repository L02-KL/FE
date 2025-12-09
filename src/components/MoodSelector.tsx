import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MoodType } from '../types';
import { Colors } from '../constants/colors';

interface MoodSelectorProps {
  selectedMood?: MoodType;
  onSelectMood: (mood: MoodType) => void;
}

const moods: { type: MoodType; label: string; icon: string; color: string; bgColor: string }[] = [
  { type: 'happy', label: 'Happy', icon: 'happy', color: '#FFFFFF', bgColor: '#9C27B0' }, // Purple
  { type: 'calm', label: 'Calm', icon: 'yin-yang', color: '#FFFFFF', bgColor: '#42A5F5' }, // Blue
  { type: 'relax', label: 'Relax', icon: 'leaf', color: '#FFFFFF', bgColor: '#FF9800' }, // Orange
  { type: 'focus', label: 'Focus', icon: 'meditation', color: '#FFFFFF', bgColor: '#26A69A' }, // Teal
];

export const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onSelectMood }) => {
  return (
    <View style={styles.container}>
      {moods.map((mood) => {
        // Map icon names to Ionicons
        let iconName: any = 'happy-outline';
        if (mood.icon === 'yin-yang') iconName = 'radio-button-on-outline';
        else if (mood.icon === 'leaf') iconName = 'leaf-outline';
        else if (mood.icon === 'meditation') iconName = 'body-outline';
        else if (mood.icon === 'happy') iconName = 'happy-outline';

        return (
          <TouchableOpacity
            key={mood.type}
            style={[
              styles.moodButton,
              { backgroundColor: mood.bgColor },
              selectedMood === mood.type && styles.selectedMoodButton,
            ]}
            onPress={() => onSelectMood(mood.type)}
            activeOpacity={0.7}
          >
            <Ionicons name={iconName} size={32} color={mood.color} />
            <Text style={[styles.label, { color: mood.color }]}>{mood.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  moodButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    width: '23%',
    aspectRatio: 1,
  },
  selectedMoodButton: {
    opacity: 0.9,
    transform: [{ scale: 0.95 }],
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
});

