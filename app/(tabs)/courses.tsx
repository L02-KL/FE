import { Mascot } from '@/components/common/Mascot';
import { CourseCard } from '@/components/courses/CourseCard';
import { useTheme } from '@/contexts/ThemeContext';
import { useCourses, useDashboardStats } from '@/hooks/useApi';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CoursesScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { data, loading, error } = useCourses();
  const { data: stats } = useDashboardStats();
  
  const courses = data?.items || [];
  const currentSemester = courses[0]?.semester || 'Fall 2024';

  const handleCoursePress = (courseId: string) => {
    router.push(`/course/${courseId}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Mascot mood="bored" size="large" />
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 16 }} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.errorContainer}>
          <Mascot mood="angry" size="large" />
          <Text style={[styles.errorText, { color: colors.error }]}>Error loading courses</Text>
          <Text style={[styles.errorSubtext, { color: colors.textSecondary }]}>{error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <View style={[styles.headerCard, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.headerRow}>
            <View style={styles.headerTextContainer}>
              <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>My Courses</Text>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                {courses.length} courses • {currentSemester}
              </Text>
            </View>
            <Mascot mood="thinking" size="small" />
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.cardBackground }]}>
            <View style={[styles.statIconContainer, { backgroundColor: '#E3F2FD' }]}>
              <Text style={styles.statEmoji}>📚</Text>
            </View>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{courses.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active Courses</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.cardBackground }]}>
            <View style={[styles.statIconContainer, { backgroundColor: '#FFF3E0' }]}>
              <Text style={styles.statEmoji}>📝</Text>
            </View>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{stats?.tasksDue || 0}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pending Tasks</Text>
          </View>
        </View>

        {/* Section Header */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>All Courses</Text>

        {/* Course List */}
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onPress={() => handleCoursePress(course.id)}
          />
        ))}

        {courses.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="school-outline" size={64} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>No courses found</Text>
            <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
              Add your first course to get started
            </Text>
          </View>
        )}

        {/* Bottom spacing for FAB */}
        <View style={{ height: 100 }} />
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
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  headerCard: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'flex-start',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statEmoji: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
