import { API, TIMEOUTS } from '../constants';
import { SurfConditions, SurfSpot, WindyApiResponse, NoaaApiResponse, NdbcBuoyResponse } from '../types';

/**
 * API Service
 * Handles all external API calls for surf conditions data
 */

const ENDPOINTS = {
  WINDY: {
    FORECAST: '/forecast',
  },
  NOAA: {
    FORECAST: '/forecasts/point',
  },
  NDBC: {
    REALTIME: '/realtime2',
  },
};

// Helper function to handle fetch requests with timeout
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = TIMEOUTS.API_CALL) => {
  const controller = new AbortController();
  const { signal } = controller;
  
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { ...options, signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
};

/**
 * Fetches current surf conditions for a specific spot
 * This is a mock implementation that would be replaced with actual API calls
 */
export const fetchSurfConditions = async (spotId: string): Promise<SurfConditions | null> => {
  try {
    // In a real implementation, this would call actual APIs
    // For now, we'll simulate a response
    
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response based on spot ID
    // In production, this would make real API calls to Windy, NOAA, or NDBC
    const mockCondition: SurfConditions = {
      spotId,
      timestamp: new Date().toISOString(),
      waveHeight: {
        min: 1.5,
        max: 3.0,
        unit: 'ft',
      },
      wind: {
        speed: 10,
        direction: 'NW',
        unit: 'mph',
      },
      swell: [
        {
          height: 2.5,
          period: 8,
          direction: 'N',
        },
      ],
      tide: {
        current: 1.2,
        nextHighTime: new Date(Date.now() + 3600000).toISOString(),
        nextHighHeight: 2.1,
        nextLowTime: new Date(Date.now() + 10800000).toISOString(),
        nextLowHeight: 0.3,
        unit: 'ft',
      },
      weather: {
        temperature: 52,
        condition: 'partly-cloudy',
        unit: 'F',
      },
      rating: 7,
      source: 'mock-data',
    };
    
    return mockCondition;
  } catch (error) {
    console.error('Error fetching surf conditions:', error);
    return null;
  }
};

/**
 * Fetches a forecast for multiple days for a specific spot
 */
export const fetchSurfForecast = async (spotId: string, days = 7): Promise<SurfConditions[] | null> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create a mock forecast for the next few days
    const forecast: SurfConditions[] = [];
    const now = new Date();
    
    for (let i = 0; i < days * 8; i++) { // 8 readings per day (every 3 hours)
      const forecastTime = new Date(now.getTime() + i * 3 * 60 * 60 * 1000);
      
      // Create some variation in the forecast
      const waveVariation = Math.sin(i / 4) * 1.5 + 2; // Creates a wave-like pattern in the forecast
      const windVariation = 5 + Math.random() * 15;
      const windDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      const windDirectionIndex = Math.floor(i / 3) % windDirections.length;
      
      forecast.push({
        spotId,
        timestamp: forecastTime.toISOString(),
        waveHeight: {
          min: Math.max(0.5, waveVariation - 0.5),
          max: waveVariation + 0.5,
          unit: 'ft',
        },
        wind: {
          speed: windVariation,
          direction: windDirections[windDirectionIndex],
          unit: 'mph',
        },
        swell: [
          {
            height: waveVariation,
            period: 7 + Math.random() * 5,
            direction: windDirections[(windDirectionIndex + 2) % windDirections.length],
          },
        ],
        tide: {
          current: 1.0 + Math.sin(i / 2) * 1.0,
          unit: 'ft',
        },
        weather: {
          temperature: 50 + Math.random() * 10,
          condition: i % 8 === 0 ? 'rainy' : i % 5 === 0 ? 'cloudy' : 'sunny',
          unit: 'F',
        },
        rating: Math.round(5 + Math.sin(i / 4) * 3),
        source: 'mock-forecast',
      });
    }
    
    return forecast;
  } catch (error) {
    console.error('Error fetching surf forecast:', error);
    return null;
  }
};

/**
 * Fetches nearby surf spots based on location
 */
export const fetchNearbySurfSpots = async (
  latitude: number,
  longitude: number,
  radius = 50, // radius in km
): Promise<SurfSpot[] | null> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real implementation, this would query a database
    // or external API for spots near the provided coordinates
    
    // Mock data for Lake Superior spots
    const lakeSuperiorSpots: SurfSpot[] = [
      {
        id: 'stonypoint',
        name: 'Stony Point',
        location: {
          latitude: 46.9419,
          longitude: -91.8061,
          city: 'Duluth',
          state: 'MN',
          country: 'USA',
        },
        difficulty: 'intermediate',
        type: ['beach-break', 'point-break'],
        amenities: ['parking'],
        description: 'Popular spot for Lake Superior surfers with consistent waves during NE winds.',
        imageUrls: ['https://example.com/stonypoint.jpg'],
        createdAt: '2023-01-15T00:00:00.000Z',
        updatedAt: '2023-01-15T00:00:00.000Z',
      },
      {
        id: 'parkpoint',
        name: 'Park Point',
        location: {
          latitude: 46.7825,
          longitude: -92.0856,
          city: 'Duluth',
          state: 'MN',
          country: 'USA',
        },
        difficulty: 'beginner',
        type: ['beach-break'],
        amenities: ['parking', 'restrooms'],
        description: 'Long sandy beach with gentle waves, perfect for beginners during calm conditions.',
        imageUrls: ['https://example.com/parkpoint.jpg'],
        createdAt: '2023-01-15T00:00:00.000Z',
        updatedAt: '2023-01-15T00:00:00.000Z',
      },
      {
        id: 'lesterriver',
        name: 'Lester River',
        location: {
          latitude: 46.8331,
          longitude: -92.0217,
          city: 'Duluth',
          state: 'MN',
          country: 'USA',
        },
        difficulty: 'advanced',
        type: ['river-mouth', 'reef'],
        amenities: ['parking'],
        description: 'River mouth break that works well during strong winds and storms.',
        imageUrls: ['https://example.com/lesterriver.jpg'],
        createdAt: '2023-01-15T00:00:00.000Z',
        updatedAt: '2023-01-15T00:00:00.000Z',
      },
      {
        id: 'superiorentry',
        name: 'Superior Entry',
        location: {
          latitude: 46.7156,
          longitude: -92.0595,
          city: 'Superior',
          state: 'WI',
          country: 'USA',
        },
        difficulty: 'expert',
        type: ['point-break'],
        amenities: ['parking'],
        description: 'Powerful break near the canal entrance. For experienced surfers only.',
        imageUrls: ['https://example.com/superiorentry.jpg'],
        createdAt: '2023-01-15T00:00:00.000Z',
        updatedAt: '2023-01-15T00:00:00.000Z',
      },
    ];
    
    // Return all spots for this mock implementation
    // In a real app, we would filter based on distance from provided coordinates
    return lakeSuperiorSpots;
  } catch (error) {
    console.error('Error fetching nearby surf spots:', error);
    return null;
  }
};

/**
 * Submits a check-in to the backend
 * This is a mock implementation
 */
export const submitCheckIn = async (checkInData: Omit<CheckIn, 'id' | 'timestamp'>): Promise<CheckIn | null> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // In a real implementation, this would post to a backend API
    // For now, we'll create a mock response
    
    const checkIn: CheckIn = {
      id: `checkin-${Date.now()}`,
      userId: checkInData.userId,
      spotId: checkInData.spotId,
      timestamp: new Date().toISOString(),
      conditions: checkInData.conditions,
      comment: checkInData.comment,
      imageUrls: checkInData.imageUrls,
    };
    
    return checkIn;
  } catch (error) {
    console.error('Error submitting check-in:', error);
    return null;
  }
};

/**
 * Logs a surf session to the backend
 * This is a mock implementation
 */
export const logSurfSession = async (sessionData: Omit<SurfSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<SurfSession | null> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // In a real implementation, this would post to a backend API
    // For now, we'll create a mock response
    
    const now = new Date().toISOString();
    
    const session: SurfSession = {
      id: `session-${Date.now()}`,
      userId: sessionData.userId,
      spotId: sessionData.spotId,
      startTime: sessionData.startTime,
      endTime: sessionData.endTime,
      duration: sessionData.duration,
      board: sessionData.board,
      conditions: sessionData.conditions,
      performance: sessionData.performance,
      notes: sessionData.notes,
      imageUrls: sessionData.imageUrls,
      createdAt: now,
      updatedAt: now,
    };
    
    return session;
  } catch (error) {
    console.error('Error logging surf session:', error);
    return null;
  }
}; 