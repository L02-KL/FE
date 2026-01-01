/**
 * Services Entry Point
 * 
 * This file provides a clean API for accessing all services in the application.
 */

// Export API service and all related types/interfaces
export { api, apiClient } from './api';
export type {
    IApiService,
    IAuthService, ICourseService,
    IDashboardService,
    ISettingsService, ITaskService
} from './api';

// Default export is the main API service
export { default } from './api';
