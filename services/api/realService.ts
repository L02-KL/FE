import {
  ApiResponse,
  AuthResponse,
  Course,
  CreateCourseRequest,
  CreateTaskRequest,
  DashboardData,
  DashboardStats,
  LoginRequest,
  PaginatedResponse,
  PaginationParams,
  RegisterRequest,
  Task,
  TaskFilters,
  UpdateCourseRequest,
  UpdateTaskRequest,
  User,
  UserSettings,
} from '@/types';
import { apiClient } from './client';
import {
  IApiService,
  IAuthService,
  ICourseService,
  IDashboardService,
  ISettingsService,
  ITaskService,
} from './interfaces';

// ============================================
// Data Mappers
// ============================================

const mapTask = (data: any): Task => {
  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    courseId: data.course_id,
    courseName: data.course?.name || data.courseName || 'Unknown Course',
    courseCode: data.course?.code,
    courseColor: data.course?.color,
    courseIcon: data.course?.icon,
    dueDate: new Date(data.due_date),
    dueTime: data.due_time,
    priority: data.priority,
    status: data.status,
    category: data.category || 'other',
    completed: data.status === 'completed',
    reminders: data.reminders || [],
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
};

const mapCourse = (data: any): Course => {
  return {
    id: data.id,
    name: data.name,
    code: data.code,
    color: data.color,
    icon: data.icon,
    instructor: data.instructor,
    semester: data.semester,
    description: data.description,
    taskCount: data.taskCount || data.task_count || 0,
    completedTaskCount: data.completedTaskCount || data.completed_task_count || 0,
    activeTaskCount: data.activeTaskCount || data.active_task_count || 0,
    progress: data.progress || 0,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
};

// ============================================
// Real API Service Implementations
// ============================================

class RealAuthService implements IAuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/email/login', credentials);
    if (response.data && response.data.token) {
      apiClient.setToken(response.data.token);
      return response.data;
    }
    throw new Error('Login failed: Invalid response format');
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/email/register', data);
    if (response.data && response.data.token) {
      apiClient.setToken(response.data.token);
      return response.data;
    }
    throw new Error('Registration failed: Invalid response format');
  }

  async logout(): Promise<void> {
    apiClient.clearToken();
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/users/me');
    return response.data;
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh');
    if (response.data && response.data.token) {
      apiClient.setToken(response.data.token);
      return response.data;
    }
    return response.data;
  }

  async updatePushToken(token: string): Promise<void> {
    await apiClient.post('/users/push-token', { token });
  }
}

class RealTaskService implements ITaskService {
  async getTasks(filters?: TaskFilters, pagination?: PaginationParams): Promise<PaginatedResponse<Task>> {
    const params = new URLSearchParams();

    // Map camelCase to snake_case for backend
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.courseId) params.append('course_id', filters.courseId);
    if (filters?.completed !== undefined) {
      if (filters.completed) params.append('status', 'completed');
    }

    if (pagination?.page) params.append('page', String(pagination.page));
    if (pagination?.limit) params.append('limit', String(pagination.limit));
    if (pagination?.sortBy) {
      const sortMap: Record<string, string> = {
        'dueDate': 'due_date',
        'createdAt': 'created_at',
        'title': 'title',
        'priority': 'priority'
      };
      params.append('sort', sortMap[pagination.sortBy] || pagination.sortBy);
    }
    if (pagination?.sortOrder) params.append('order', pagination.sortOrder);

    const query = params.toString();
    const url = `/tasks${query ? `?${query}` : ''}`;

    // Expect ApiResponse<PaginatedResponse<Task>> but handle flat array
    const response = await apiClient.get<ApiResponse<any>>(url);
    if (Array.isArray(response.data)) {
      return {
        items: response.data.map(mapTask),
        total: response.data.length,
        page: pagination?.page || 1,
        limit: pagination?.limit || 100,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      };
    }
    // Fallback if response.data respects PaginatedResponse structure but with unmapped items
    if (response.data && response.data.items) {
      return {
        ...response.data,
        items: response.data.items.map(mapTask)
      };
    }

    // Last resort, try to map directly if it looks like a single item (unlikely for getTasks) or unknown
    return response.data;
  }

  async getTaskById(id: string): Promise<Task> {
    const response = await apiClient.get<ApiResponse<any>>(`/tasks?id=${id}`);
    return mapTask(response.data);
  }

  async createTask(data: CreateTaskRequest): Promise<Task> {
    const payload = {
      title: data.title,
      description: data.description,
      course_id: data.courseId,
      due_date: data.dueDate,
      due_time: data.dueTime,
      priority: data.priority,
      status: 'pending'
    };
    const response = await apiClient.post<ApiResponse<any>>('/tasks', payload);
    return mapTask(response.data);
  }

  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    const payload: any = {};
    if (data.title) payload.title = data.title;
    if (data.description) payload.description = data.description;
    if (data.courseId) payload.course_id = data.courseId;
    if (data.dueDate) payload.due_date = data.dueDate;
    if (data.dueTime) payload.due_time = data.dueTime;
    if (data.priority) payload.priority = data.priority;
    if (data.status) payload.status = data.status;
    if (data.completed !== undefined) payload.status = data.completed ? 'completed' : 'pending';

    const response = await apiClient.patch<ApiResponse<any>>(`/tasks?id=${id}`, payload);
    return mapTask(response.data);
  }

  async deleteTask(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<any>>(`/tasks?id=${id}`);
  }

  async toggleTaskComplete(id: string): Promise<Task> {
    const task = await this.getTaskById(id);
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    // Note: updateTask will map the response
    return await this.updateTask(id, { status: newStatus });
  }

  async getUpcomingTasks(limit = 5): Promise<Task[]> {
    const response = await this.getTasks(
      { status: 'pending' },
      { limit, sortBy: 'dueDate', sortOrder: 'asc' }
    );
    return response.items || [];
  }

  async getOverdueTasks(): Promise<Task[]> {
    const response = await this.getTasks({ status: 'overdue' });
    return response.items || [];
  }
}

class RealCourseService implements ICourseService {
  async getCourses(pagination?: PaginationParams): Promise<PaginatedResponse<Course>> {
    const params = new URLSearchParams();

    if (pagination?.page) params.append('page', String(pagination.page));
    if (pagination?.limit) params.append('limit', String(pagination.limit));

    const query = params.toString();
    const url = `/courses${query ? `?${query}` : ''}`;

    const response = await apiClient.get<ApiResponse<any>>(url);
    if (Array.isArray(response.data)) {
      return {
        items: response.data.map(mapCourse),
        total: response.data.length,
        page: pagination?.page || 1,
        limit: pagination?.limit || 100,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      };
    }

    if (response.data && response.data.items) {
      return {
        ...response.data,
        items: response.data.items.map(mapCourse)
      };
    }

    return response.data;
  }

  async getCourseById(id: string): Promise<Course> {
    const response = await apiClient.get<ApiResponse<any>>(`/courses?id=${id}`);
    return mapCourse(response.data);
  }

  async createCourse(data: CreateCourseRequest): Promise<Course> {
    const response = await apiClient.post<ApiResponse<any>>('/courses', data);
    return mapCourse(response.data);
  }

  async updateCourse(id: string, data: UpdateCourseRequest): Promise<Course> {
    const response = await apiClient.patch<ApiResponse<any>>(`/courses?id=${id}`, data);
    return mapCourse(response.data);
  }

  async deleteCourse(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<any>>(`/courses?id=${id}`);
  }

  async getCourseWithTasks(id: string): Promise<{ course: Course; tasks: Task[] }> {
    // Safer approach using separate calls and mapping
    const course = await this.getCourseById(id);
    const tasksResponse = await new RealTaskService().getTasks({ courseId: id });
    return { course, tasks: tasksResponse.items };
  }
}

class RealDashboardService implements IDashboardService {
  private tasksService = new RealTaskService();
  private coursesService = new RealCourseService();

  async getDashboardData(): Promise<DashboardData> {
    try {
      const [upcomingTasks, overdueTasks, coursesResponse, allTasksResponse] = await Promise.all([
        this.tasksService.getUpcomingTasks(5),
        this.tasksService.getOverdueTasks(),
        this.coursesService.getCourses({ limit: 5 }),
        this.tasksService.getTasks({}, { limit: 100 })
      ]);

      const tasks = allTasksResponse.items || [];
      const completedTasks = tasks.filter(t => t.status === 'completed').length;

      const stats: DashboardStats = {
        tasksDue: upcomingTasks.length,
        tasksCompleted: completedTasks,
        tasksOverdue: overdueTasks.length,
        coursesCount: coursesResponse.total || coursesResponse.items?.length || 0,
        upcomingDeadlines: upcomingTasks.length,
        completionRate: tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0,
      };

      return {
        stats,
        upcomingTasks,
        recentCourses: coursesResponse.items || [],
      };
    } catch (error) {
      console.error('Error constructing dashboard data:', error);
      throw error;
    }
  }

  async getStats(): Promise<DashboardStats> {
    const data = await this.getDashboardData();
    return data.stats;
  }
}

class RealSettingsService implements ISettingsService {
  async getSettings(): Promise<UserSettings> {
    const response = await apiClient.get<ApiResponse<UserSettings>>('/users/settings');
    return response.data;
  }

  async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    const payload: any = { ...settings };
    const response = await apiClient.patch<ApiResponse<UserSettings>>('/users/settings', payload);
    return response.data;
  }
}

// ============================================
// Export Real API Service
// ============================================

export const realApiService: IApiService = {
  auth: new RealAuthService(),
  tasks: new RealTaskService(),
  courses: new RealCourseService(),
  dashboard: new RealDashboardService(),
  settings: new RealSettingsService(),
};

export default realApiService;
