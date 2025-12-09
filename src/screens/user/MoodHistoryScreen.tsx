import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { MoodType } from '../../types';

interface MoodEntry {
  id: string;
  date: string;
  mood: MoodType;
  note?: string;
}

const MoodHistoryScreen = () => {
  const navigation = useNavigation();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const moodEntries: MoodEntry[] = [
    { id: '1', date: '2023-12-20', mood: 'happy', note: 'Had a great day!' },
    { id: '2', date: '2023-12-19', mood: 'calm', note: 'Feeling peaceful' },
    { id: '3', date: '2023-12-18', mood: 'relax', note: 'Took a break' },
    { id: '4', date: '2023-12-17', mood: 'focus', note: 'Productive day' },
    { id: '5', date: '2023-12-16', mood: 'happy' },
    { id: '6', date: '2023-12-15', mood: 'calm' },
  ];

  const getMoodColor = (mood: MoodType) => {
    switch (mood) {
      case 'happy':
        return Colors.purple;
      case 'calm':
        return Colors.blue;
      case 'relax':
        return Colors.orange;
      case 'focus':
        return Colors.teal;
      default:
        return Colors.textSecondary;
    }
  };

  const getMoodIcon = (mood: MoodType) => {
    switch (mood) {
      case 'happy':
        return 'happy-outline';
      case 'calm':
        return 'radio-button-on-outline';
      case 'relax':
        return 'leaf-outline';
      case 'focus':
        return 'body-outline';
      default:
        return 'help-outline';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mood History</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Period Selector */}
      <View style={styles.periodContainer}>
        {(['week', 'month', 'year'] as const).map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.selectedPeriodButton,
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text
              style={[
                styles.periodText,
                selectedPeriod === period && styles.selectedPeriodText,
              ]}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{moodEntries.length}</Text>
          <Text style={styles.statLabel}>Total Check-ins</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {Math.round((moodEntries.filter((e) => e.mood === 'happy').length / moodEntries.length) * 100)}%
          </Text>
          <Text style={styles.statLabel}>Happy Days</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {moodEntries.map((entry) => (
            <View
              key={entry.id}
              style={[styles.moodCard, { borderLeftColor: getMoodColor(entry.mood) }]}
            >
              <View style={styles.moodHeader}>
                <View
                  style={[
                    styles.moodIconContainer,
                    { backgroundColor: getMoodColor(entry.mood) + '20' },
                  ]}
                >
                  <Ionicons
                    name={getMoodIcon(entry.mood) as any}
                    size={24}
                    color={getMoodColor(entry.mood)}
                  />
                </View>
                <View style={styles.moodInfo}>
                  <Text style={styles.moodType}>
                    {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                  </Text>
                  <Text style={styles.moodDate}>{formatDate(entry.date)}</Text>
                </View>
              </View>
              {entry.note && (
                <View style={styles.noteContainer}>
                  <Text style={styles.noteText}>{entry.note}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  placeholder: {
    width: 24,
  },
  periodContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
  },
  selectedPeriodButton: {
    backgroundColor: Colors.primary,
  },
  periodText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  selectedPeriodText: {
    color: Colors.background,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.primaryLight,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  content: {
    padding: 16,
  },
  moodCard: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  moodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  moodInfo: {
    flex: 1,
  },
  moodType: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  moodDate: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  noteContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  noteText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});

export default MoodHistoryScreen;

