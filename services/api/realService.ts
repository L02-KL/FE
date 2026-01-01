import {
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
// Real API Service Implementations
// ============================================

class RealAuthService implements IAuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    if (response.tokens) {
      apiClient.setToken(response.tokens.accessToken);
    }
    return response;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    if (response.tokens) {
      apiClient.setToken(response.tokens.accessToken);
    }
    return response;
  }

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    apiClient.clearToken();
  }

  async getCurrentUser(): Promise<User> {
    return await apiClient.get<User>('/auth/me');
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/refresh');
    if (response.tokens) {
      apiClient.setToken(response.tokens.accessToken);
    }
    return response;
  }
}

class RealTaskService implements ITaskService {
  async getTasks(filters?: TaskFilters, pagination?: PaginationParams): Promise<PaginatedResponse<Task>> {
    const params = new URLSearchParams();
    
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.courseId) params.append('courseId', filters.courseId);
    if (filters?.completed !== undefined) params.append('completed', String(filters.completed));
    if (pagination?.page) params.append('page', String(pagination.page));
    if (pagination?.limit) params.append('limit', String(pagination.limit));

    const query = params.toString();
    const url = `/tasks${query ? `?${query}` : ''}`;
    
    return await apiClient.get<PaginatedResponse<Task>>(url);
  }

  async getTaskById(id: string): Promise<Task> {
    return await apiClient.get<Task>(`/tasks/${id}`);
  }

  async createTask(data: CreateTaskRequest): Promise<Task> {
    return await apiClient.post<Task>('/tasks', data);
  }

  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    return await apiClient.patch<Task>(`/tasks/${id}`, data);
  }

  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  }

  async toggleTaskComplete(id: string): Promise<Task> {
    return await apiClient.post<Task>(`/tasks/${id}/toggle`);
  }

  async getUpcomingTasks(limit = 5): Promise<Task[]> {
    return await apiClient.get<Task[]>(`/tasks/upcoming?limit=${limit}`);
  }

  async getOverdueTasks(): Promise<Task[]> {
    return await apiClient.get<Task[]>('/tasks/overdue');
  }
}

class RealCourseService implements ICourseService {
  async getCourses(pagination?: PaginationParams): Promise<PaginatedResponse<Course>> {
    const params = new URLSearchParams();
    
    if (pagination?.page) params.append('page', String(pagination.page));
    if (pagination?.limit) params.append('limit', String(pagination.limit));

    const query = params.toString();
    const url = `/courses${query ? `?${query}` : ''}`;
    
    return await apiClient.get<PaginatedResponse<Course>>(url);
  }

  async getCourseById(id: string): Promise<Course> {
    return await apiClient.get<Course>(`/courses/${id}`);
  }

  async createCourse(data: CreateCourseRequest): Promise<Course> {
    return await apiClient.post<Course>('/courses', data);
  }

  async updateCourse(id: string, data: UpdateCourseRequest): Promise<Course> {
    return await apiClient.patch<Course>(`/courses/${id}`, data);
  }

  async deleteCourse(id: string): Promise<void> {
    await apiClient.delete(`/courses/${id}`);
  }

  async getCourseWithTasks(id: string): Promise<{ course: Course; tasks: Task[] }> {
    return await apiClient.get<{ course: Course; tasks: Task[] }>(`/courses/${id}/with-tasks`);
  }
}

class RealDashboardService implements IDashboardService {
  async getDashboardData(): Promise<DashboardData> {
    return await apiClient.get<DashboardData>('/dashboard');
  }

  async getStats(): Promise<DashboardStats> {
    return await apiClient.get<DashboardStats>('/dashboard/stats');
  }
}

class RealSettingsService implements ISettingsService {
  async getSettings(): Promise<UserSettings> {
    return await apiClient.get<UserSettings>('/settings');
  }

  async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    return await apiClient.patch<UserSettings>('/settings', settings);
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
