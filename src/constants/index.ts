/**
 * Application constants
 */

// Theme colors
export const COLORS = {
  primary: '#0277BD', // Ocean blue
  secondary: '#4FC3F7', // Light blue
  tertiary: '#00796B', // Teal
  background: '#F5F5F5',
  surfGood: '#4CAF50', // Green for good conditions
  surfFair: '#FFC107', // Amber for fair conditions
  surfPoor: '#F44336', // Red for poor conditions
  white: '#FFFFFF',
  black: '#000000',
  gray: '#9E9E9E',
  lightGray: '#E0E0E0',
  darkGray: '#616161',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

// Font sizes
export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  title: 28,
  header: 32,
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Border radius
export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  circle: 9999,
};

// API endpoints and keys
export const API = {
  // These would be configured via environment variables
  WINDY_API_KEY: process.env.WINDY_API_KEY || '',
  WINDY_API_URL: 'https://api.windy.com',
  
  NOAA_API_URL: 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter',
  
  NDBC_BUOY_URL: 'https://www.ndbc.noaa.gov/data/realtime2',
  
  // Base URL for our backend API (if applicable)
  BASE_URL: process.env.API_BASE_URL || 'https://api.surfsup.com',
};

// App configuration
export const APP_CONFIG = {
  // Default map region (San Diego area as an example)
  DEFAULT_REGION: {
    latitude: 32.7157,
    longitude: -117.1611,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  
  // Radius in km to search for nearby spots
  NEARBY_SPOT_RADIUS: 50,
  
  // Refresh intervals in minutes
  FORECAST_REFRESH_INTERVAL: 60, // 1 hour
  BUOY_DATA_REFRESH_INTERVAL: 30, // 30 minutes
  LOCATION_REFRESH_INTERVAL: 5, // 5 minutes
  
  // Maximum number of items
  MAX_FAVORITE_SPOTS: 20,
  MAX_RECENT_SPOTS: 10,
  MAX_SURF_SESSIONS: 50,
  
  // Time intervals for forecast display
  FORECAST_DAYS: 7,
  FORECAST_HOURS_INTERVAL: 3,
};

// Wave height categorization
export const WAVE_HEIGHT = {
  FLAT: { min: 0, max: 0.5, label: 'Flat', color: COLORS.lightGray },
  SMALL: { min: 0.5, max: 2, label: 'Small', color: COLORS.surfFair },
  MEDIUM: { min: 2, max: 4, label: 'Medium', color: COLORS.surfGood },
  LARGE: { min: 4, max: 6, label: 'Large', color: COLORS.surfFair },
  EPIC: { min: 6, max: 10, label: 'Epic', color: COLORS.surfGood },
  HUGE: { min: 10, max: 100, label: 'Huge', color: COLORS.surfPoor },
};

// Wind quality thresholds in mph
export const WIND = {
  OFFSHORE: { direction: 'offshore', label: 'Offshore', color: COLORS.surfGood },
  ONSHORE: { direction: 'onshore', label: 'Onshore', color: COLORS.surfPoor },
  CROSS_SHORE: { direction: 'cross', label: 'Cross Shore', color: COLORS.surfFair },
  LIGHT: { max: 7, label: 'Light', color: COLORS.surfGood },
  MODERATE: { min: 7, max: 15, label: 'Moderate', color: COLORS.surfFair },
  STRONG: { min: 15, label: 'Strong', color: COLORS.surfPoor },
};

// Tidal states
export const TIDE = {
  HIGH: { label: 'High Tide', color: COLORS.surfFair },
  LOW: { label: 'Low Tide', color: COLORS.surfFair },
  RISING: { label: 'Rising Tide', color: COLORS.surfGood },
  FALLING: { label: 'Falling Tide', color: COLORS.surfGood },
};

// Navigation routes
export const ROUTES = {
  HOME: 'Home',
  SPOT_DETAILS: 'SpotDetails',
  SPOT_MAP: 'SpotMap',
  FAVORITES: 'Favorites',
  SEARCH: 'Search',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
  CHECK_IN: 'CheckIn',
  SESSION_LOG: 'SessionLog',
  SESSION_HISTORY: 'SessionHistory',
  SURF_REPORT: 'SurfReport',
  NOTIFICATIONS: 'Notifications',
  ONBOARDING: 'Onboarding',
  AUTH: 'Auth',
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
  ABOUT: 'About',
}; 