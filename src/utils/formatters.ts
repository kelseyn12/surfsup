/**
 * Formatters for displaying data in a user-friendly way
 */

/**
 * Format wave height with appropriate units
 * @param height Wave height in feet or meters
 * @param unit Unit of measurement ('ft' or 'm')
 * @param showUnit Whether to include the unit in the output
 * @returns Formatted wave height string
 */
export const formatWaveHeight = (
  height: number, 
  unit: 'ft' | 'm' = 'ft', 
  showUnit = true
): string => {
  const formattedHeight = height.toFixed(1);
  return showUnit ? `${formattedHeight} ${unit}` : formattedHeight;
};

/**
 * Format wave height range
 * @param min Minimum wave height
 * @param max Maximum wave height
 * @param unit Unit of measurement ('ft' or 'm')
 * @returns Formatted wave height range
 */
export const formatWaveHeightRange = (
  min: number, 
  max: number, 
  unit: 'ft' | 'm' = 'ft'
): string => {
  return `${formatWaveHeight(min, unit, false)}-${formatWaveHeight(max, unit)}`;
};

/**
 * Format wind speed with appropriate units
 * @param speed Wind speed
 * @param unit Unit of measurement ('mph', 'kts', or 'kph')
 * @returns Formatted wind speed string
 */
export const formatWindSpeed = (
  speed: number, 
  unit: 'mph' | 'kts' | 'kph' = 'mph'
): string => {
  return `${Math.round(speed)} ${unit}`;
};

/**
 * Format wind direction from degrees to cardinal direction
 * @param degrees Wind direction in degrees
 * @returns Cardinal direction (N, NE, E, etc.)
 */
export const formatWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

/**
 * Format combined wind information
 * @param speed Wind speed
 * @param degrees Wind direction in degrees
 * @param unit Unit of measurement ('mph', 'kts', or 'kph')
 * @returns Formatted wind string (e.g., "15 mph NW")
 */
export const formatWind = (
  speed: number, 
  degrees: number, 
  unit: 'mph' | 'kts' | 'kph' = 'mph'
): string => {
  return `${formatWindSpeed(speed, unit)} ${formatWindDirection(degrees)}`;
};

/**
 * Format tide height with appropriate units
 * @param height Tide height
 * @param unit Unit of measurement ('ft' or 'm')
 * @returns Formatted tide height string
 */
export const formatTideHeight = (
  height: number, 
  unit: 'ft' | 'm' = 'ft'
): string => {
  return `${height.toFixed(1)} ${unit}`;
};

/**
 * Format temperature with appropriate units
 * @param temp Temperature
 * @param unit Unit of measurement ('F' or 'C')
 * @returns Formatted temperature string
 */
export const formatTemperature = (
  temp: number, 
  unit: 'F' | 'C' = 'F'
): string => {
  return `${Math.round(temp)}°${unit}`;
};

/**
 * Format date as relative time (e.g., "5 minutes ago")
 * @param date Date string or Date object
 * @returns Relative time string
 */
export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const pastDate = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - pastDate.getTime();
  
  // Convert milliseconds to different time units
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSec < 60) {
    return 'just now';
  } else if (diffMin < 60) {
    return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  } else {
    // For dates older than a week, display the actual date
    return pastDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: now.getFullYear() !== pastDate.getFullYear() ? 'numeric' : undefined,
    });
  }
};

/**
 * Format a date for display
 * @param date Date string or Date object
 * @param format Format type ('short', 'medium', 'long', 'time')
 * @returns Formatted date string
 */
export const formatDate = (
  date: string | Date,
  format: 'short' | 'medium' | 'long' | 'time' = 'medium'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
    case 'medium':
      return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    case 'long':
      return dateObj.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    case 'time':
      return dateObj.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    default:
      return dateObj.toLocaleString();
  }
};

/**
 * Format duration in minutes to a human-readable string
 * @param minutes Duration in minutes
 * @returns Formatted duration string
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  } else {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (mins === 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    } else {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${mins} ${mins === 1 ? 'minute' : 'minutes'}`;
    }
  }
};

import { SurfConditions } from '../types';

/**
 * Formats a date to a readable string
 * @param date Date to format
 * @param options DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string,
  options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric'
  }
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
};

/**
 * Formats a time to a readable string
 * @param date Date to format
 * @param includeSeconds Whether to include seconds
 * @returns Formatted time string
 */
export const formatTime = (
  date: Date | string,
  includeSeconds = false
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: includeSeconds ? '2-digit' : undefined,
    hour12: true,
  }).format(dateObj);
};

/**
 * Formats a date and time to a readable string
 * @param date Date to format
 * @param includeSeconds Whether to include seconds
 * @returns Formatted date and time string
 */
export const formatDateTime = (
  date: Date | string,
  includeSeconds = false
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return `${formatDate(dateObj)} at ${formatTime(dateObj, includeSeconds)}`;
};

/**
 * Formats a relative time (e.g., "2 hours ago")
 * @param date Date to format
 * @returns Formatted relative time string
 */
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  
  // Convert to seconds
  const diffSec = Math.floor(diffMs / 1000);
  
  if (diffSec < 60) {
    return diffSec <= 1 ? 'just now' : `${diffSec} seconds ago`;
  }
  
  // Convert to minutes
  const diffMin = Math.floor(diffSec / 60);
  
  if (diffMin < 60) {
    return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`;
  }
  
  // Convert to hours
  const diffHours = Math.floor(diffMin / 60);
  
  if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  }
  
  // Convert to days
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays < 7) {
    return diffDays === 1 ? 'yesterday' : `${diffDays} days ago`;
  }
  
  // If more than a week, return the actual date
  return formatDate(dateObj);
};

/**
 * Formats temperature with unit
 * @param temp Temperature value
 * @param unit Temperature unit (C or F)
 * @returns Formatted temperature string
 */
export const formatTemperature = (temp: number, unit: 'C' | 'F' = 'F'): string => {
  const roundedTemp = Math.round(temp);
  return `${roundedTemp}°${unit}`;
};

/**
 * Formats wave height with unit
 * @param min Minimum wave height
 * @param max Maximum wave height (optional)
 * @param unit Wave height unit (ft or m)
 * @returns Formatted wave height string
 */
export const formatWaveHeight = (
  min: number,
  max?: number,
  unit: 'ft' | 'm' = 'ft'
): string => {
  const roundedMin = Math.round(min * 10) / 10;
  
  if (max === undefined || min === max) {
    return `${roundedMin} ${unit}`;
  }
  
  const roundedMax = Math.round(max * 10) / 10;
  return `${roundedMin}-${roundedMax} ${unit}`;
};

/**
 * Formats wind information
 * @param speed Wind speed
 * @param direction Wind direction
 * @param unit Wind speed unit (mph, kts, kph)
 * @returns Formatted wind string
 */
export const formatWind = (
  speed: number,
  direction: string,
  unit: 'mph' | 'kts' | 'kph' = 'mph'
): string => {
  const roundedSpeed = Math.round(speed);
  return `${direction} ${roundedSpeed} ${unit}`;
};

/**
 * Formats rating as stars
 * @param rating Rating value (1-10)
 * @param maxRating Maximum possible rating
 * @returns String of stars representing the rating
 */
export const formatRatingStars = (
  rating: number,
  maxRating: number = 5
): string => {
  const normalizedRating = Math.round((rating / 10) * maxRating);
  return '★'.repeat(normalizedRating) + '☆'.repeat(maxRating - normalizedRating);
};

/**
 * Formats a duration in minutes to hours and minutes
 * @param durationMinutes Duration in minutes
 * @returns Formatted duration string
 */
export const formatDuration = (durationMinutes: number): string => {
  if (!durationMinutes) return '0 min';
  
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  if (hours === 0) {
    return `${minutes} min`;
  }
  
  if (minutes === 0) {
    return `${hours} hr`;
  }
  
  return `${hours} hr ${minutes} min`;
};

/**
 * Returns a description of surf conditions
 * @param conditions SurfConditions object
 * @returns A human-readable description of the conditions
 */
export const describeSurfConditions = (conditions: SurfConditions): string => {
  const waveDescription = formatWaveHeight(
    conditions.waveHeight.min,
    conditions.waveHeight.max,
    conditions.waveHeight.unit
  );
  
  const windDescription = formatWind(
    conditions.wind.speed,
    conditions.wind.direction,
    conditions.wind.unit
  );
  
  return `${waveDescription} waves with ${windDescription} winds. ${formatTemperature(
    conditions.weather.temperature,
    conditions.weather.unit
  )} and ${conditions.weather.condition}.`;
}; 