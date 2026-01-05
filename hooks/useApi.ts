/**
 * Custom React Hooks for API Services
 * 
 * These hooks provide a clean interface for components to interact with the API.
 * They handle loading states, error states, and data fetching.
 */

import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services';
import { apiClient } from '@/services/api/client';
import {
  Course,
  CreateCourseRequest,
  CreateTaskRequest,
  DashboardData,
  DashboardStats,
  PaginatedResponse,
  PaginationParams,
  Task,
  TaskFilters,
  UpdateCourseRequest,
  UpdateTaskRequest,
  UserSettings,
} from '@/types';
import { useCallback, useEffect, useState } from 'react';

// ============================================
// Generic Hook Types
// ============================================

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// ============================================
// Dashboard Hooks
// ============================================

export function useDashboard() {
  const { user } = useAuth();
  const [state, setState] = useState<UseApiState<DashboardData>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (!user || !apiClient.hasToken()) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await api.dashboard.getDashboardData();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

export function useDashboardStats() {
  const { user } = useAuth();
  const [state, setState] = useState<UseApiState<DashboardStats>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (!user || !apiClient.hasToken()) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await api.dashboard.getStats();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

// ============================================
// Task Hooks
// ============================================

export function useTasks(filters?: TaskFilters, pagination?: PaginationParams) {
  const { user } = useAuth();
  const [state, setState] = useState<UseApiState<PaginatedResponse<Task>>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (!user || !apiClient.hasToken()) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await api.tasks.getTasks(filters, pagination);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, [filters, pagination, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

export function useTask(id: string) {
  const { user } = useAuth();
  const [state, setState] = useState<UseApiState<Task>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (!id || !user || !apiClient.hasToken()) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await api.tasks.getTaskById(id);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, [id, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

export function useUpcomingTasks(limit = 5) {
  const { user } = useAuth();
  const [state, setState] = useState<UseApiState<Task[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (!user || !apiClient.hasToken()) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await api.tasks.getUpcomingTasks(limit);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, [limit, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

export function useTaskMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createTask = useCallback(async (data: CreateTaskRequest): Promise<Task | null> => {
    setLoading(true);
    setError(null);
    try {
      const task = await api.tasks.createTask(data);
      setLoading(false);
      return task;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      return null;
    }
  }, []);

  const updateTask = useCallback(async (id: string, data: UpdateTaskRequest): Promise<Task | null> => {
    setLoading(true);
    setError(null);
    try {
      const task = await api.tasks.updateTask(id, data);
      setLoading(false);
      return task;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      return null;
    }
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await api.tasks.deleteTask(id);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      return false;
    }
  }, []);

  const toggleComplete = useCallback(async (id: string): Promise<Task | null> => {
    setLoading(true);
    setError(null);
    try {
      const task = await api.tasks.toggleTaskComplete(id);
      setLoading(false);
      return task;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      return null;
    }
  }, []);

  return {
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
  };
}

// ============================================
// Course Hooks
// ============================================

export function useCourses(pagination?: PaginationParams) {
  const { user } = useAuth();
  const [state, setState] = useState<UseApiState<PaginatedResponse<Course>>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (!user || !apiClient.hasToken()) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await api.courses.getCourses(pagination);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, [pagination, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

export function useCourse(id: string) {
  const { user } = useAuth();
  const [state, setState] = useState<UseApiState<Course>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (!id || !user || !apiClient.hasToken()) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await api.courses.getCourseById(id);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, [id, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

export function useCourseMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createCourse = useCallback(async (data: CreateCourseRequest): Promise<Course | null> => {
    setLoading(true);
    setError(null);
    try {
      const course = await api.courses.createCourse(data);
      setLoading(false);
      return course;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      return null;
    }
  }, []);

  const updateCourse = useCallback(async (id: string, data: UpdateCourseRequest): Promise<Course | null> => {
    setLoading(true);
    setError(null);
    try {
      const course = await api.courses.updateCourse(id, data);
      setLoading(false);
      return course;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      return null;
    }
  }, []);

  const deleteCourse = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await api.courses.deleteCourse(id);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      return false;
    }
  }, []);

  return {
    loading,
    error,
    createCourse,
    updateCourse,
    deleteCourse,
  };
}

// ============================================
// Settings Hooks
// ============================================

export function useSettings() {
  const { user } = useAuth();
  const [state, setState] = useState<UseApiState<UserSettings>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (!user || !apiClient.hasToken()) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await api.settings.getSettings();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateSettings = useCallback(async (settings: Partial<UserSettings>): Promise<UserSettings | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await api.settings.updateSettings(settings);
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error as Error }));
      return null;
    }
  }, []);

  return { ...state, refetch: fetchData, updateSettings };
}
