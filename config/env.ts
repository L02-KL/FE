// Environment configuration
// Change USE_MOCK_API to false when connecting to real API

export const ENV = {
    // API Configuration
    USE_MOCK_API: false, // Set to false to use real API
    // API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://52.63.73.7:3000/api',
    API_BASE_URL:
        process.env.EXPO_PUBLIC_API_URL ||
        "https://mariann-nettlelike-rustlingly.ngrok-free.dev/api",
    API_TIMEOUT: 30000,

    // App Configuration
    APP_NAME: "DeadTood",
    APP_VERSION: "1.0.0",
};

export default ENV;
