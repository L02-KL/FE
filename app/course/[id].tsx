import { getCourseIcon } from '@/components/courses/CourseCard';
import { useTheme } from '@/contexts/ThemeContext';
import { useCourse, useTasks } from '@/hooks/useApi';
import { Priority, Task, TaskStatus } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Task Card Component for Course Detail
function CourseTaskCard({ task, onPress }: { task: Task; onPress: () => void }) {
  const { colors } = useTheme();

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return colors.priorityHigh;
      case 'medium': return colors.priorityMedium;
      case 'low': return colors.priorityLow;
      default: return colors.textMuted;
    }
  };

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getStatusStyle = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return { bg: '#FFEBEE', text: '#F44336', label: 'Pending' };
      case 'in-progress':
        return { bg: '#FFF8E1', text: '#FF9800', label: 'In Progress' };
      case 'done':
        return { bg: '#E8F5E9', text: '#4CAF50', label: 'Completed' };
      default:
        return { bg: colors.border, text: colors.textMuted, label: status };
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const statusStyle = getStatusStyle(task.status);

  return (
    <TouchableOpacity
      style={[styles.taskCard, { backgroundColor: colors.cardBackground }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Top Color Border */}
      <View style={[styles.taskColorBorder, { backgroundColor: getPriorityColor(task.priority) }]} />
      
      <View style={styles.taskContent}>
        <View style={styles.taskHeader}>
          <Text style={[styles.taskTitle, { color: colors.textPrimary }]} numberOfLines={2}>
            {task.title}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </View>

        {/* Status and Priority */}
        <View style={styles.taskBadges}>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>{statusStyle.label}</Text>
          </View>
          <View style={styles.priorityBadge}>
            <Text style={styles.priorityIcon}>{getPriorityIcon(task.priority)}</Text>
            <Text style={[styles.priorityText, { color: colors.textSecondary }]}>{task.priority}</Text>
          </View>
        </View>

        {/* Date and Time */}
        <View style={styles.taskMeta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaEmoji}>📅</Text>
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{formatDate(task.dueDate)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaEmoji}>🕐</Text>
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{task.dueTime}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function CourseDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const { data: course, loading: courseLoading } = useCourse(id);
  const { data: tasksData, loading: tasksLoading } = useTasks({ courseId: id });

  const courseTasks = tasksData?.items || [];
  const totalTasks = courseTasks.length;
  const activeTasks = courseTasks.filter(t => t.status !== 'done').length;
  const doneTasks = courseTasks.filter(t => t.status === 'done').length;

  const handleBack = () => {
    router.back();
  };

  const handleTaskPress = (taskId: string) => {
    router.push(`/task/${taskId}`);
  };

  if (courseLoading || tasksLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!course) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>Course not found</Text>
          <TouchableOpacity onPress={handleBack}>
            <Text style={[styles.backLink, { color: colors.primary }]}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <View style={[styles.headerCard, { backgroundColor: colors.cardBackground }]}>
          {/* Back Button */}
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color={colors.textSecondary} />
            <Text style={[styles.backText, { color: colors.textSecondary }]}>Back</Text>
          </TouchableOpacity>

          {/* Course Header with Color */}
          <View style={[styles.courseHeader, { backgroundColor: course.color }]}>
            <View style={styles.courseIconContainer}>
              {getCourseIcon(course.icon, 32, 'rgba(255,255,255,0.9)')}
            </View>
            <View style={styles.courseInfo}>
              <Text style={styles.courseTitle}>{course.name}</Text>
              <Text style={styles.courseCode}>{course.code}</Text>
            </View>
          </View>

          {/* Course Details */}
          <View style={styles.courseDetails}>
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Semester</Text>
                <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{course.semester}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Instructor</Text>
                <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{course.instructor}</Text>
              </View>
            </View>

            {/* Progress */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Course Progress</Text>
                <Text style={[styles.progressPercent, { color: colors.textPrimary }]}>{course.progress}%</Text>
              </View>
              <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
                <View 
                  style={[styles.progressFill, { backgroundColor: colors.textPrimary, width: `${course.progress}%` }]} 
                />
              </View>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={styles.statEmoji}>📝</Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{totalTasks}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={styles.statEmoji}>⏳</Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{activeTasks}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={styles.statEmoji}>✅</Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{doneTasks}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Done</Text>
          </View>
        </View>

        {/* Course Tasks Section */}
        <View style={styles.tasksSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Course Tasks</Text>
          
          {courseTasks.length === 0 ? (
            <View style={[styles.emptyTasks, { backgroundColor: colors.cardBackground }]}>
              <Text style={styles.emptyEmoji}>📋</Text>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No tasks yet</Text>
              <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
                Add your first task for this course
              </Text>
            </View>
          ) : (
            courseTasks.map((task) => (
              <CourseTaskCard
                key={task.id}
                task={task}
                onPress={() => handleTaskPress(task.id)}
              />
            ))
          )}
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
  headerCard: {
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  backText: {
    fontSize: 16,
    marginLeft: 8,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 0,
  },
  courseIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  courseCode: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  courseDetails: {
    padding: 20,
    paddingTop: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressSection: {
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
  },
  tasksSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyTasks: {
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  // Task Card Styles
  taskCard: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  taskColorBorder: {
    height: 4,
  },
  taskContent: {
    padding: 16,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  taskBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priorityIcon: {
    fontSize: 12,
  },
  priorityText: {
    fontSize: 13,
    fontWeight: '500',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaEmoji: {
    fontSize: 14,
  },
  metaText: {
    fontSize: 13,
  },
});
