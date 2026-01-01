// Environment configuration
// Change USE_MOCK_API to false when connecting to real API

export const ENV = {
  // API Configuration
  USE_MOCK_API: true, // Set to false to use real API
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  API_TIMEOUT: 10000,

  // App Configuration
  APP_NAME: 'TaskManager',
  APP_VERSION: '1.0.0',
};

export default ENV;
