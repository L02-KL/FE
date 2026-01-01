import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ThemeColors, useTheme } from '@/contexts/ThemeContext';
import { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
}

const getCategoryIcon = (category: Task['category'], colors: ThemeColors): { name: keyof typeof MaterialCommunityIcons.glyphMap; color: string } => {
  switch (category) {
    case 'math':
      return { name: 'calculator-variant', color: colors.math };
    case 'chemistry':
      return { name: 'flask', color: colors.chemistry };
    case 'physics':
      return { name: 'atom', color: colors.physics };
    case 'literature':
      return { name: 'book-open-page-variant', color: colors.literature };
    default:
      return { name: 'file-document-outline', color: colors.primary };
  }
};

const getCategoryColor = (category: Task['category'], colors: ThemeColors) => {
  switch (category) {
    case 'math':
      return { bg: colors.mathBg, icon: colors.math };
    case 'chemistry':
      return { bg: colors.chemistryBg, icon: colors.chemistry };
    case 'physics':
      return { bg: colors.physicsBg, icon: colors.physics };
    case 'literature':
      return { bg: colors.literatureBg, icon: colors.literature };
    default:
      return { bg: colors.primaryLight, icon: colors.primary };
  }
};

const getPriorityStyle = (priority: Task['priority'], colors: ThemeColors) => {
  switch (priority) {
    case 'high':
      return { bg: colors.priorityHighBg, text: colors.priorityHigh };
    case 'medium':
      return { bg: colors.priorityMediumBg, text: colors.priorityMedium };
    case 'low':
      return { bg: colors.priorityLowBg, text: colors.priorityLow };
  }
};

const getStatusStyle = (status: Task['status'], colors: ThemeColors) => {
  switch (status) {
    case 'pending':
      return { bg: '#FFEBEE', text: '#F44336', label: 'Pending' };
    case 'in-progress':
      return { bg: '#FFF8E1', text: '#FF9800', label: 'In Progress' };
    case 'completed':
      return { bg: '#E8F5E9', text: '#4CAF50', label: 'Completed' };
    default:
      return { bg: colors.border, text: colors.textMuted, label: status };
  }
};

const formatDate = (date: Date) => {
  const d = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
};

export function TaskCard({ task, onPress }: TaskCardProps) {
  const { colors } = useTheme();
  const priorityStyle = getPriorityStyle(task.priority, colors);
  const statusStyle = getStatusStyle(task.status, colors);

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.cardBackground }]} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      {/* Top Color Border based on priority */}
      <View style={[styles.topBorder, { backgroundColor: priorityStyle.text }]} />
      
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>{task.title}</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </View>

        {/* Status and Priority */}
        <View style={styles.badgeRow}>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>{statusStyle.label}</Text>
          </View>
          <View style={styles.priorityBadge}>
            <Text style={styles.priorityIcon}>{getPriorityIcon(task.priority)}</Text>
            <Text style={[styles.priorityText, { color: colors.textSecondary }]}>{task.priority}</Text>
          </View>
        </View>

        {/* Date and Time */}
        <View style={styles.dateRow}>
          <Text style={styles.dateEmoji}>📅</Text>
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>{formatDate(task.dueDate)}</Text>
          <Text style={[styles.separator, { color: colors.textMuted }]}>•</Text>
          <Text style={styles.timeEmoji}>🕐</Text>
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>{task.dueTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  topBorder: {
    height: 4,
    width: '100%',
  },
  content: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
    lineHeight: 22,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priorityIcon: {
    fontSize: 10,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  dateText: {
    fontSize: 13,
  },
  separator: {
    marginHorizontal: 8,
    fontSize: 12,
  },
  timeEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  timeText: {
    fontSize: 13,
  },
});

export default TaskCard;
