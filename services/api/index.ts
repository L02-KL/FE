/**
 * API Service Entry Point
 * 
 * This file exports the appropriate API service based on environment configuration.
 * Simply change USE_MOCK_API in config/env.ts to switch between mock and real API.
 */

import ENV from '@/config/env';
import { IApiService } from './interfaces';
import { mockApiService } from './mockService';
import { realApiService } from './realService';

// Export the appropriate service based on environment
export const api: IApiService = ENV.USE_MOCK_API ? mockApiService : realApiService;

// Re-export interfaces and types for convenience
export { apiClient } from './client';
export * from './interfaces';

// Default export
export default api;
