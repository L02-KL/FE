import { mockCourses, mockTasks } from '@/data/mockData';
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
import {
    IApiService,
    IAuthService,
    ICourseService,
    IDashboardService,
    ISettingsService,
    ITaskService,
} from './interfaces';

// ============================================
// Mock Data
// ============================================

const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  name: 'John Doe',
  avatar: undefined,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Use imported mock data - create mutable copies
let tasks: Task[] = [...mockTasks];
let courses: Course[] = [...mockCourses];

const mockSettings: UserSettings = {
  notifications: true,
  darkMode: false,
  language: 'en',
  calendarSync: false,
  reminderTime: 30,
};

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// Mock Service Implementations
// ============================================

class MockAuthService implements IAuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    await delay(500);
    return {
      user: mockUser,
      tokens: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresIn: 3600,
      },
    };
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    await delay(500);
    return {
      user: { ...mockUser, email: data.email, name: data.name },
      tokens: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresIn: 3600,
      },
    };
  }

  async logout(): Promise<void> {
    await delay(200);
  }

  async getCurrentUser(): Promise<User> {
    await delay(300);
    return mockUser;
  }

  async refreshToken(): Promise<AuthResponse> {
    await delay(300);
    return {
      user: mockUser,
      tokens: {
        accessToken: 'new-mock-access-token',
        refreshToken: 'new-mock-refresh-token',
        expiresIn: 3600,
      },
    };
  }
}

class MockTaskService implements ITaskService {
  async getTasks(filters?: TaskFilters, pagination?: PaginationParams): Promise<PaginatedResponse<Task>> {
    await delay(300);
    
    let filtered = [...tasks];
    
    if (filters?.priority) {
      filtered = filtered.filter(t => t.priority === filters.priority);
    }
    if (filters?.status) {
      filtered = filtered.filter(t => t.status === filters.status);
    }
    if (filters?.courseId) {
      filtered = filtered.filter(t => t.courseId === filters.courseId);
    }
    if (filters?.completed !== undefined) {
      filtered = filtered.filter(t => t.completed === filters.completed);
    }

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const items = filtered.slice(start, end);

    return {
      items,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
      hasNext: end < filtered.length,
      hasPrev: page > 1,
    };
  }

  async getTaskById(id: string): Promise<Task> {
    await delay(200);
    const task = tasks.find(t => t.id === id);
    if (!task) throw new Error('Task not found');
    return task;
  }

  async createTask(data: CreateTaskRequest): Promise<Task> {
    await delay(300);
    const course = courses.find(c => c.id === data.courseId);
    const newTask: Task = {
      id: String(Date.now()),
      title: data.title,
      description: data.description,
      courseId: data.courseId,
      courseName: course?.name || 'Unknown Course',
      courseCode: course?.code,
      courseColor: course?.color,
      courseIcon: course?.icon,
      dueDate: new Date(data.dueDate),
      dueTime: data.dueTime,
      priority: data.priority,
      status: 'pending',
      category: data.category || 'other',
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    tasks.push(newTask);
    return newTask;
  }

  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    await delay(300);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    tasks[index] = {
      ...tasks[index],
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : tasks[index].dueDate,
      updatedAt: new Date(),
    };
    return tasks[index];
  }

  async deleteTask(id: string): Promise<void> {
    await delay(200);
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks.splice(index, 1);
    }
  }

  async toggleTaskComplete(id: string): Promise<Task> {
    await delay(200);
    const task = tasks.find(t => t.id === id);
    if (!task) throw new Error('Task not found');
    task.completed = !task.completed;
    task.status = task.completed ? 'completed' : 'pending';
    task.updatedAt = new Date();
    return task;
  }

  async getUpcomingTasks(limit = 5): Promise<Task[]> {
    await delay(200);
    return tasks
      .filter(t => !t.completed)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, limit);
  }

  async getOverdueTasks(): Promise<Task[]> {
    await delay(200);
    const now = new Date();
    return tasks.filter(t => !t.completed && new Date(t.dueDate) < now);
  }
}

class MockCourseService implements ICourseService {
  async getCourses(pagination?: PaginationParams): Promise<PaginatedResponse<Course>> {
    await delay(300);
    
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const items = courses.slice(start, end);

    return {
      items,
      total: courses.length,
      page,
      limit,
      totalPages: Math.ceil(courses.length / limit),
      hasNext: end < courses.length,
      hasPrev: page > 1,
    };
  }

  async getCourseById(id: string): Promise<Course> {
    await delay(200);
    const course = courses.find(c => c.id === id);
    if (!course) throw new Error('Course not found');
    return course;
  }

  async createCourse(data: CreateCourseRequest): Promise<Course> {
    await delay(300);
    const newCourse: Course = {
      id: String(Date.now()),
      ...data,
      icon: data.icon || 'book',
      taskCount: 0,
      completedTaskCount: 0,
      activeTaskCount: 0,
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    courses.push(newCourse);
    return newCourse;
  }

  async updateCourse(id: string, data: UpdateCourseRequest): Promise<Course> {
    await delay(300);
    const index = courses.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Course not found');
    
    courses[index] = {
      ...courses[index],
      ...data,
      updatedAt: new Date(),
    };
    return courses[index];
  }

  async deleteCourse(id: string): Promise<void> {
    await delay(200);
    const index = courses.findIndex(c => c.id === id);
    if (index !== -1) {
      courses.splice(index, 1);
    }
  }

  async getCourseWithTasks(id: string): Promise<{ course: Course; tasks: Task[] }> {
    await delay(300);
    const course = await this.getCourseById(id);
    const courseTasks = tasks.filter(t => t.courseId === id);
    return { course, tasks: courseTasks };
  }
}

class MockDashboardService implements IDashboardService {
  async getDashboardData(): Promise<DashboardData> {
    await delay(300);
    const stats = await this.getStats();
    const taskService = new MockTaskService();
    const upcomingTasks = await taskService.getUpcomingTasks(3);
    
    return {
      stats,
      upcomingTasks,
      recentCourses: courses.slice(0, 4),
    };
  }

  async getStats(): Promise<DashboardStats> {
    await delay(200);
    const pendingTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);
    const now = new Date();
    const overdueTasks = tasks.filter(t => !t.completed && new Date(t.dueDate) < now);
    
    return {
      tasksDue: pendingTasks.length,
      tasksCompleted: completedTasks.length,
      tasksOverdue: overdueTasks.length,
      coursesCount: courses.length,
      upcomingDeadlines: pendingTasks.filter(t => {
        const daysUntilDue = (new Date(t.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return daysUntilDue <= 7;
      }).length,
      completionRate: tasks.length > 0 
        ? Math.round((completedTasks.length / tasks.length) * 100) 
        : 0,
    };
  }
}

class MockSettingsService implements ISettingsService {
  private settings = { ...mockSettings };

  async getSettings(): Promise<UserSettings> {
    await delay(200);
    return this.settings;
  }

  async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    await delay(300);
    this.settings = { ...this.settings, ...settings };
    return this.settings;
  }
}

// ============================================
// Export Mock API Service
// ============================================

export const mockApiService: IApiService = {
  auth: new MockAuthService(),
  tasks: new MockTaskService(),
  courses: new MockCourseService(),
  dashboard: new MockDashboardService(),
  settings: new MockSettingsService(),
};

export default mockApiService;
