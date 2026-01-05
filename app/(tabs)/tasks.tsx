import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Mascot } from '@/components/common/Mascot';
import { TaskCard } from '@/components/tasks/TaskCard';
import { useTheme } from '@/contexts/ThemeContext';
import { useTasks } from '@/hooks/useApi';
import { Priority } from '@/types';

type FilterType = 'all' | Priority;

export default function TasksScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const { colors } = useTheme();
  const { data, loading, error, refetch } = useTasks();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const filters: { key: FilterType; label: string; color?: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'high', label: 'High', color: colors.priorityHigh },
    { key: 'medium', label: 'Medium', color: colors.priorityMedium },
    { key: 'low', label: 'Low', color: colors.priorityLow },
  ];

  const allTasks = data?.items || [];

  const filteredTasks = useMemo(() => {
    if (activeFilter === 'all') return allTasks;
    return allTasks.filter(task => task.priority === activeFilter);
  }, [allTasks, activeFilter]);

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
          <Text style={[styles.errorText, { color: colors.error }]}>Error loading tasks</Text>
          <Text style={[styles.errorSubtext, { color: colors.textSecondary }]}>{error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>All Tasks</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{allTasks.length} tasks total</Text>
          </View>
          <Mascot mood="willing" size="small" />
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              { backgroundColor: colors.cardBackground, borderColor: colors.border },
              activeFilter === filter.key && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => setActiveFilter(filter.key)}
          >
            {filter.color && (
              <View style={[styles.filterDot, { backgroundColor: filter.color }]} />
            )}
            <Text
              style={[
                styles.filterText,
                { color: colors.textSecondary },
                activeFilter === filter.key && { color: colors.white },
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.taskList}
        contentContainerStyle={styles.taskListContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onPress={() => router.push(`/task/${task.id}`)}
          />
        ))}

        {filteredTasks.length === 0 && (
          <View style={styles.emptyState}>
            <Mascot mood="sad" size="large" />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>No tasks found</Text>
            <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>Add a new task to get started!</Text>
          </View>
        )}
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  filterContainer: {
    maxHeight: 50,
  },
  filterContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
  },
  filterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  taskList: {
    flex: 1,
  },
  taskListContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
  },
});
