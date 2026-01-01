# API Documentation for TaskMaster Mobile App

## Overview
Tài liệu này mô tả các API endpoints mà Backend cần implement để Frontend có thể kết nối.

**Base URL:** `https://api.yourdomain.com/api/v1`

---

## 📦 Response Format

Tất cả API responses nên follow format sau:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message",
  "error": "Optional error message"
}
```

### Pagination Response Format
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 🔐 Authentication APIs

### POST `/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "avatar": "https://...",
      "createdAt": "2026-01-01T00:00:00Z",
      "updatedAt": "2026-01-01T00:00:00Z"
    },
    "tokens": {
      "accessToken": "jwt_token_here",
      "refreshToken": "refresh_token_here",
      "expiresIn": 3600
    }
  }
}
```

### POST `/auth/register`
Register new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:** Same as login

### POST `/auth/logout`
Logout current user.

**Headers:** `Authorization: Bearer <accessToken>`

### GET `/auth/me`
Get current user info.

**Headers:** `Authorization: Bearer <accessToken>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://...",
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  }
}
```

### POST `/auth/refresh`
Refresh access token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

---

## 📝 Task APIs

### GET `/tasks`
Get all tasks with filters and pagination.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `sortBy` | string | Field to sort by |
| `sortOrder` | 'asc' \| 'desc' | Sort order |
| `priority` | 'high' \| 'medium' \| 'low' | Filter by priority |
| `status` | 'pending' \| 'in-progress' \| 'completed' \| 'overdue' | Filter by status |
| `courseId` | string | Filter by course |
| `completed` | boolean | Filter by completion |
| `dueDateFrom` | string (ISO) | Filter due date from |
| `dueDateTo` | string (ISO) | Filter due date to |

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "Complete homework",
        "description": "Chapter 5 exercises",
        "courseId": "course_uuid",
        "courseName": "Mathematics",
        "courseCode": "MATH101",
        "courseColor": "#4A90D9",
        "courseIcon": "calculator",
        "dueDate": "2026-01-15T00:00:00Z",
        "dueTime": "23:59",
        "priority": "high",
        "status": "pending",
        "category": "math",
        "completed": false,
        "reminders": [
          {
            "id": "reminder_uuid",
            "taskId": "uuid",
            "dateTime": "2026-01-14T10:00:00Z",
            "type": "push",
            "isActive": true
          }
        ],
        "createdAt": "2026-01-01T00:00:00Z",
        "updatedAt": "2026-01-01T00:00:00Z"
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### GET `/tasks/:id`
Get single task by ID.

### POST `/tasks`
Create new task.

**Request Body:**
```json
{
  "title": "Complete homework",
  "description": "Chapter 5 exercises",
  "courseId": "course_uuid",
  "dueDate": "2026-01-15",
  "dueTime": "23:59",
  "priority": "high",
  "category": "math"
}
```

### PUT `/tasks/:id`
Update existing task.

**Request Body:** (all fields optional)
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "courseId": "course_uuid",
  "dueDate": "2026-01-20",
  "dueTime": "18:00",
  "priority": "medium",
  "status": "in-progress",
  "completed": false
}
```

### DELETE `/tasks/:id`
Delete a task.

### PATCH `/tasks/:id/toggle`
Toggle task completion status.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "completed": true,
    "status": "completed",
    ...
  }
}
```

### GET `/tasks/upcoming`
Get upcoming tasks.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `limit` | number | Max number of tasks (default: 5) |

### GET `/tasks/overdue`
Get all overdue tasks.

---

## 📚 Course APIs

### GET `/courses`
Get all courses with pagination.

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "Mathematics",
        "code": "MATH101",
        "color": "#4A90D9",
        "icon": "calculator",
        "instructor": "Dr. Smith",
        "semester": "Fall 2026",
        "description": "Advanced calculus",
        "taskCount": 15,
        "completedTaskCount": 10,
        "activeTaskCount": 5,
        "progress": 66,
        "createdAt": "2026-01-01T00:00:00Z",
        "updatedAt": "2026-01-01T00:00:00Z"
      }
    ],
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### GET `/courses/:id`
Get single course.

### POST `/courses`
Create new course.

**Request Body:**
```json
{
  "name": "Mathematics",
  "code": "MATH101",
  "color": "#4A90D9",
  "icon": "calculator",
  "instructor": "Dr. Smith",
  "semester": "Fall 2026",
  "description": "Advanced calculus"
}
```

**Available Icons:**
- `calculator` - Math
- `flask` - Chemistry
- `book` - Literature
- `atom` - Physics
- `code` - Programming
- `palette` - Art
- `musical-notes` - Music
- `globe` - Geography
- `fitness` - Physical Education
- `briefcase` - Business

### PUT `/courses/:id`
Update course.

### DELETE `/courses/:id`
Delete course.

### GET `/courses/:id/tasks`
Get course with all its tasks.

**Response:**
```json
{
  "success": true,
  "data": {
    "course": { ... },
    "tasks": [ ... ]
  }
}
```

---

## 📊 Dashboard APIs

### GET `/dashboard`
Get dashboard data (stats + upcoming tasks + recent courses).

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "tasksDue": 5,
      "tasksCompleted": 25,
      "tasksOverdue": 2,
      "coursesCount": 6,
      "upcomingDeadlines": 3,
      "completionRate": 83
    },
    "upcomingTasks": [ ... ],
    "recentCourses": [ ... ]
  }
}
```

### GET `/dashboard/stats`
Get only stats.

---

## ⚙️ Settings APIs

### GET `/settings`
Get user settings.

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": true,
    "darkMode": false,
    "language": "vi",
    "calendarSync": true,
    "reminderTime": 30
  }
}
```

### PUT `/settings`
Update user settings.

**Request Body:** (all fields optional)
```json
{
  "notifications": true,
  "darkMode": true,
  "language": "en",
  "calendarSync": false,
  "reminderTime": 60
}
```

---

## 🔔 Notification APIs (Optional)

### GET `/notifications`
Get user notifications.

### PATCH `/notifications/:id/read`
Mark notification as read.

---

## 📋 Data Types Summary

### Priority
```typescript
type Priority = 'high' | 'medium' | 'low';
```

### TaskStatus
```typescript
type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'overdue';
```

### TaskCategory
```typescript
type TaskCategory = 'math' | 'chemistry' | 'physics' | 'literature' | 'other';
```

### CourseIconType
```typescript
type CourseIconType = 'calculator' | 'flask' | 'book' | 'atom' | 'code' | 'palette' | 'musical-notes' | 'globe' | 'fitness' | 'briefcase';
```

### ReminderType
```typescript
type ReminderType = 'push' | 'email';
```

---

## 🔗 How to Connect

Sau khi Backend hoàn thành, chỉ cần đổi URL trong file `config/env.ts`:

```typescript
export const ENV = {
  API_BASE_URL: 'https://your-api.com/api/v1', // Đổi URL này
  USE_MOCK_API: false, // Đổi thành false để dùng real API
};
```

---

## 📁 Files to Reference

1. **`types/api.ts`** - All TypeScript interfaces
2. **`services/api/interfaces.ts`** - API service contracts
3. **`data/mockData.ts`** - Sample data for testing

