import { getCourseIcon } from '@/components/courses/CourseCard';
import { useTheme } from '@/contexts/ThemeContext';
import { useTask, useTaskMutations } from '@/hooks/useApi';
import { CourseIconType, Priority, ReminderType, TaskStatus } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TaskDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: task, loading, refetch } = useTask(id);
  const { updateTask, deleteTask, loading: mutating } = useTaskMutations();

  // Reminder form state
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newReminderDate, setNewReminderDate] = useState('');
  const [newReminderType, setNewReminderType] = useState<ReminderType>('push');

  const handleBack = () => {
    router.back();
  };

  const handleMarkComplete = async () => {
    if (!task) return;

    Alert.alert(
      'Mark as Complete',
      'Are you sure you want to mark this task as complete?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            await updateTask(task.id, { status: 'done', completed: true });
            refetch();
          },
        },
      ]
    );
  };

  const handleDeleteTask = async () => {
    if (!task) return;

    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTask(task.id);
            router.back();
          },
        },
      ]
    );
  };

  const getPriorityStyle = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return { color: colors.priorityHigh, label: 'High Priority', icon: '🔴' };
      case 'medium':
        return { color: colors.priorityMedium, label: 'Medium Priority', icon: '🟡' };
      case 'low':
        return { color: colors.priorityLow, label: 'Low Priority', icon: '🟢' };
      default:
        return { color: colors.textMuted, label: priority, icon: '⚪' };
    }
  };

  const getStatusStyle = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return { bg: '#FFEBEE', text: '#F44336', label: 'Pending', icon: '📝' };
      case 'in-progress':
        return { bg: '#FFF8E1', text: '#FF9800', label: 'In Progress', icon: '🔄' };
      case 'done':
        return { bg: '#E8F5E9', text: '#4CAF50', label: 'Completed', icon: '✅' };
      default:
        return { bg: colors.border, text: colors.textMuted, label: status, icon: '📋' };
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatReminderDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
      ', ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!task) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>Task not found</Text>
          <TouchableOpacity onPress={handleBack}>
            <Text style={[styles.backLink, { color: colors.primary }]}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const priorityStyle = getPriorityStyle(task.priority);
  const statusStyle = getStatusStyle(task.status);
  const reminders = task.reminders || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top Color Bar */}
        <View style={[styles.topColorBar, { backgroundColor: task.courseColor || colors.primary }]} />

        {/* Header Card */}
        <View style={[styles.headerCard, { backgroundColor: colors.cardBackground }]}>
          {/* Back Button */}
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color={colors.textSecondary} />
            <Text style={[styles.backText, { color: colors.textSecondary }]}>Back</Text>
          </TouchableOpacity>

          {/* Task Info */}
          <View style={styles.taskInfo}>
            <View style={[styles.courseIconBox, { backgroundColor: `${task.courseColor || colors.primary}20` }]}>
              {getCourseIcon((task.courseIcon as CourseIconType) || 'book', 28, task.courseColor || colors.primary)}
            </View>
            <View style={styles.taskTitleContainer}>
              <Text style={[styles.taskTitle, { color: colors.textPrimary }]}>{task.title}</Text>
              <Text style={[styles.courseName, { color: colors.textSecondary }]}>
                {task.courseName} • {task.courseCode}
              </Text>
            </View>
          </View>

          {/* Status and Priority Badges */}
          <View style={styles.badgeRow}>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
              <Text style={styles.badgeIcon}>{statusStyle.icon}</Text>
              <Text style={[styles.badgeText, { color: statusStyle.text }]}>{statusStyle.label}</Text>
            </View>
            <View style={[styles.priorityBadge, { borderColor: priorityStyle.color }]}>
              <Text style={styles.badgeIcon}>{priorityStyle.icon}</Text>
              <Text style={[styles.badgeText, { color: priorityStyle.color }]}>{priorityStyle.label}</Text>
            </View>
          </View>
        </View>

        {/* Deadline Section */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}>⏰</Text>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Deadline</Text>
          </View>

          <View style={styles.deadlineRow}>
            <View style={[styles.deadlineItem, { backgroundColor: colors.background }]}>
              <View style={[styles.deadlineIconBox, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="calendar" size={20} color="#2196F3" />
              </View>
              <View style={styles.deadlineInfo}>
                <Text style={[styles.deadlineLabel, { color: colors.textMuted }]}>Due Date</Text>
                <View style={styles.deadlineValueRow}>
                  <Text style={[styles.deadlineValue, { color: colors.textPrimary }]}>
                    {formatDate(task.dueDate)}
                  </Text>
                  <Ionicons name="pencil-outline" size={16} color={colors.textMuted} />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.deadlineRow}>
            <View style={[styles.deadlineItem, { backgroundColor: colors.background }]}>
              <View style={[styles.deadlineIconBox, { backgroundColor: '#FFF8E1' }]}>
                <Ionicons name="time" size={20} color="#FF9800" />
              </View>
              <View style={styles.deadlineInfo}>
                <Text style={[styles.deadlineLabel, { color: colors.textMuted }]}>Due Time</Text>
                <View style={styles.deadlineValueRow}>
                  <Text style={[styles.deadlineValue, { color: colors.textPrimary }]}>{task.dueTime}</Text>
                  <Ionicons name="pencil-outline" size={16} color={colors.textMuted} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Description Section */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}>📄</Text>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Description</Text>
          </View>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {task.description || 'No description provided.'}
          </Text>
          {task.description && (
            <Text style={[styles.motivationalText, { color: colors.textMuted }]}>
              Keep going! You're making great progress 💪
            </Text>
          )}
        </View>

        {/* Reminders Section - Hidden for Local Notification Mode
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          ...
        </View>
        */}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.completeButton, { backgroundColor: '#4CAF50' }]}
            onPress={handleMarkComplete}
            disabled={mutating || task.status === 'done'}
          >
            <Ionicons name="checkmark-circle-outline" size={22} color="#FFFFFF" />
            <Text style={styles.completeButtonText}>
              {task.status === 'done' ? 'Completed' : 'Mark as Complete'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: colors.cardBackground }]}
            onPress={handleDeleteTask}
            disabled={mutating}
          >
            <Ionicons name="trash-outline" size={20} color={colors.error} />
            <Text style={[styles.deleteButtonText, { color: colors.error }]}>Delete Task</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  backLink: {
    fontSize: 16,
    fontWeight: '500',
  },
  topColorBar: {
    height: 6,
  },
  headerCard: {
    margin: 16,
    marginTop: 0,
    borderRadius: 20,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    marginLeft: 8,
  },
  taskInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  courseIconBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  taskTitleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  taskTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  courseName: {
    fontSize: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  badgeIcon: {
    fontSize: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionEmoji: {
    fontSize: 22,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  deadlineRow: {
    marginBottom: 12,
  },
  deadlineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
  },
  deadlineIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  deadlineInfo: {
    flex: 1,
  },
  deadlineLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  deadlineValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deadlineValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
  },
  motivationalText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 16,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  reminderIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderDate: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  reminderType: {
    fontSize: 13,
  },
  reminderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  reminderAction: {
    padding: 6,
  },
  addReminderForm: {
    borderWidth: 2,
    borderRadius: 14,
    borderStyle: 'dashed',
    padding: 14,
    marginTop: 8,
  },
  reminderInput: {
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  reminderTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addReminderIcon: {
    marginRight: 10,
  },
  reminderTypeSelect: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  reminderTypeIcon: {
    fontSize: 16,
  },
  reminderTypeText: {
    flex: 1,
    fontSize: 15,
  },
  addReminderButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  addReminderBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    gap: 6,
  },
  addReminderBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelReminderBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    paddingHorizontal: 16,
    gap: 12,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 10,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
