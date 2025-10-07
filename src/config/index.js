// Environment configuration
export const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  
  // App Configuration
  APP_NAME: 'Kanban Board',
  APP_VERSION: '1.0.0',
  
  // Feature Flags
  FEATURES: {
    ENABLE_DARK_MODE: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
    ENABLE_NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== 'false',
    ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  },
  
  // UI Configuration
  UI: {
    TOAST_DURATION: 4000,
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 500,
  },
  
  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },
  
  // File Upload
  UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
};

// Validation
if (!config.API_BASE_URL) {
  throw new Error('API_BASE_URL is required');
}

export default config;