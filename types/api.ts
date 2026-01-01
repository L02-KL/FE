// ============================================
// API Response Types
// ============================================

// Generic API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ============================================
// User Types
// ============================================
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// ============================================
// Task Types
// ============================================
export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'overdue';
export type TaskCategory = 'math' | 'chemistry' | 'physics' | 'literature' | 'other';

// Reminder types
export type ReminderType = 'push' | 'email';

export interface Reminder {
  id: string;
  taskId: string;
  dateTime: Date;
  type: ReminderType;
  isActive: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  courseId: string;
  courseName: string;
  courseCode?: string;
  courseColor?: string;
  courseIcon?: CourseIconType;
  dueDate: Date;
  dueTime: string;
  priority: Priority;
  status: TaskStatus;
  category: TaskCategory;
  completed: boolean;
  reminders?: Reminder[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  courseId: string;
  dueDate: string; // ISO date string
  dueTime: string;
  priority: Priority;
  category?: TaskCategory;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  courseId?: string;
  dueDate?: string;
  dueTime?: string;
  priority?: Priority;
  status?: TaskStatus;
  completed?: boolean;
}

export interface TaskFilters {
  priority?: Priority;
  status?: TaskStatus;
  courseId?: string;
  completed?: boolean;
  dueDateFrom?: string;
  dueDateTo?: string;
}

// ============================================
// Course Types
// ============================================
export type CourseIconType = 'calculator' | 'flask' | 'book' | 'atom' | 'code' | 'palette' | 'musical-notes' | 'globe' | 'fitness' | 'briefcase';

export interface Course {
  id: string;
  name: string;
  code: string;
  color: string;
  icon: CourseIconType;
  instructor?: string;
  semester?: string;
  description?: string;
  taskCount: number;
  completedTaskCount: number;
  activeTaskCount: number;
  progress: number; // 0-100 percentage
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCourseRequest {
  name: string;
  code: string;
  color: string;
  icon?: CourseIconType;
  instructor?: string;
  semester?: string;
  description?: string;
}

export interface UpdateCourseRequest {
  name?: string;
  code?: string;
  color?: string;
  icon?: CourseIconType;
  instructor?: string;
  semester?: string;
  description?: string;
}

// ============================================
// Dashboard / Stats Types
// ============================================
export interface DashboardStats {
  tasksDue: number;
  tasksCompleted: number;
  tasksOverdue: number;
  coursesCount: number;
  upcomingDeadlines: number;
  completionRate: number;
}

export interface DashboardData {
  stats: DashboardStats;
  upcomingTasks: Task[];
  recentCourses: Course[];
}

// ============================================
// Notification Types
// ============================================
export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'task_reminder' | 'deadline' | 'system';
  read: boolean;
  taskId?: string;
  createdAt: Date;
}

// ============================================
// Settings Types
// ============================================
export interface UserSettings {
  notifications: boolean;
  darkMode: boolean;
  language: string;
  calendarSync: boolean;
  reminderTime: number; // minutes before deadline
}
