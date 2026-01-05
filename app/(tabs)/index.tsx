import { Mascot } from '@/components/common/Mascot';
import { SectionHeader } from '@/components/common/SectionHeader';
import { HeaderGreeting } from '@/components/home/HeaderGreeting';
import { StatsCard } from '@/components/home/StatsCard';
import { TaskCard } from '@/components/tasks/TaskCard';
import { useTheme } from '@/contexts/ThemeContext';
import { useDashboard } from '@/hooks/useApi';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { data, loading, error, refetch } = useDashboard();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleViewAllTasks = () => {
    router.push('/tasks');
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Mascot mood="bored" size="large" />
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 16 }} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Mascot mood="angry" size="large" />
        <Text style={[styles.errorText, { color: colors.error }]}>Error loading dashboard</Text>
        <Text style={[styles.errorSubtext, { color: colors.textSecondary }]}>{error.message}</Text>
      </View>
    );
  }

  const stats = data?.stats;
  const upcomingTasks = data?.upcomingTasks || [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <View style={[styles.headerCard, { backgroundColor: colors.primaryLight }]}>
          <HeaderGreeting />

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <StatsCard
              iconName="checkbox"
              iconColor={colors.primary}
              label="Tasks Due"
              value={stats?.tasksDue || 0}
              iconBackgroundColor={colors.primaryLight}
            />
            <StatsCard
              iconName="school"
              iconColor={colors.accent}
              label="Courses"
              value={stats?.coursesCount || 0}
              iconBackgroundColor={colors.accentLight}
            />
          </View>
        </View>

        {/* Upcoming Tasks Section */}
        <View style={styles.section}>
          <SectionHeader
            title="Upcoming Tasks"
            actionText="View All"
            onActionPress={handleViewAllTasks}
          />

          {upcomingTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => router.push(`/task/${task.id}`)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
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
    marginTop: 16,
  },
  errorSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerCard: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 20,
    marginHorizontal: -6,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
});
