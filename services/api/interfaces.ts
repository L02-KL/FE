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
  UserSettings
} from '@/types';

// ============================================
// Service Interfaces
// Define contracts that both mock and real API must implement
// ============================================

export interface IAuthService {
  login(credentials: LoginRequest): Promise<AuthResponse>;
  register(data: RegisterRequest): Promise<AuthResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User>;
  refreshToken(): Promise<AuthResponse>;
  updatePushToken(token: string): Promise<void>;
}

export interface ITaskService {
  getTasks(filters?: TaskFilters, pagination?: PaginationParams): Promise<PaginatedResponse<Task>>;
  getTaskById(id: string): Promise<Task>;
  createTask(data: CreateTaskRequest): Promise<Task>;
  updateTask(id: string, data: UpdateTaskRequest): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  toggleTaskComplete(id: string): Promise<Task>;
  getUpcomingTasks(limit?: number): Promise<Task[]>;
  getOverdueTasks(): Promise<Task[]>;
}

export interface ICourseService {
  getCourses(pagination?: PaginationParams): Promise<PaginatedResponse<Course>>;
  getCourseById(id: string): Promise<Course>;
  createCourse(data: CreateCourseRequest): Promise<Course>;
  updateCourse(id: string, data: UpdateCourseRequest): Promise<Course>;
  deleteCourse(id: string): Promise<void>;
  getCourseWithTasks(id: string): Promise<{ course: Course; tasks: Task[] }>;
}

export interface IDashboardService {
  getDashboardData(): Promise<DashboardData>;
  getStats(): Promise<DashboardStats>;
}

export interface ISettingsService {
  getSettings(): Promise<UserSettings>;
  updateSettings(settings: Partial<UserSettings>): Promise<UserSettings>;
}

// Combined API interface
export interface IApiService {
  auth: IAuthService;
  tasks: ITaskService;
  courses: ICourseService;
  dashboard: IDashboardService;
  settings: ISettingsService;
}
