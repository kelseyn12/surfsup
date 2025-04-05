import { API, TIMEOUTS } from '../constants';
import { SurfConditions, SurfSpot, WindyApiResponse, NoaaApiResponse, NdbcBuoyResponse, CheckIn } from '../types';
import { emitSurferCountUpdated, emitCheckInStatusChanged } from './events';

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

// Add a mock database for storing active check-ins and surfer counts
let activeSurferCounts: Record<string, number> = {
  'stonypoint': 0,
  'parkpoint': 0,
  'lesterriver': 0,
  'superiorentry': 0,
};

// Initialize with empty arrays for all spots to avoid undefined
let activeCheckIns: Record<string, CheckIn[]> = {
  'stonypoint': [],
  'parkpoint': [],
  'lesterriver': [],
  'superiorentry': [],
};

// Function to update a spot's surfer count and emit the event
const updateSurferCount = (spotId: string, count: number) => {
  // Update the count
  activeSurferCounts[spotId] = count;
  
  // Emit the event
  console.log(`[DEBUG] Broadcasting surfer count update for ${spotId}: ${count}`);
  emitSurferCountUpdated(spotId, count);
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
    
    // Get current surfer count
    const surferCount = await getSurferCount(spotId);
    
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
      surferCount,
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
        surferCount: i === 0 ? await getSurferCount(spotId) : undefined, // Only include current surfer count for the first timestamp
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
        currentSurferCount: activeSurferCounts['stonypoint'] || 0, // Use the shared surfer count value
        lastActivityUpdate: new Date().toISOString(),
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
        currentSurferCount: activeSurferCounts['parkpoint'] || 0, // Use the shared surfer count value
        lastActivityUpdate: new Date().toISOString(),
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
        currentSurferCount: activeSurferCounts['lesterriver'] || 0, // Use the shared surfer count value
        lastActivityUpdate: new Date().toISOString(),
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
        currentSurferCount: activeSurferCounts['superiorentry'] || 0, // Use the shared surfer count value
        lastActivityUpdate: new Date().toISOString(),
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
 * Get the current active surfer count for a spot
 * This is a mock implementation
 */
export const getSurferCount = async (spotId: string): Promise<number> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log(`[DEBUG] Getting surfer count for ${spotId}:`, activeSurferCounts[spotId] || 0);
    
    // In a real implementation, this would query active check-ins
    return activeSurferCounts[spotId] || 0;
  } catch (error) {
    console.error('Error getting surfer count:', error);
    return 0;
  }
};

/**
 * Check in to a surf spot
 * This will increment the surfer count for the spot
 */
export const checkInToSpot = async (
  userId: string, 
  spotId: string, 
  data?: Partial<CheckIn>
): Promise<CheckIn | null> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Calculate expiration time (2 hours from now by default)
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString();
    
    const checkIn: CheckIn = {
      id: `checkin-${Date.now()}`,
      userId,
      spotId,
      timestamp: now.toISOString(),
      expiresAt,
      isActive: true,
      conditions: data?.conditions,
      comment: data?.comment,
      imageUrls: data?.imageUrls,
    };
    
    // Add to active check-ins
    if (!activeCheckIns[spotId]) {
      activeCheckIns[spotId] = [];
    }
    activeCheckIns[spotId].push(checkIn);
    
    // Increment surfer count
    if (!activeSurferCounts[spotId]) {
      activeSurferCounts[spotId] = 0;
    }
    activeSurferCounts[spotId]++;
    
    console.log(`[DEBUG] User ${userId} checked in at ${spotId}. Current check-ins:`, activeCheckIns);
    console.log(`[DEBUG] Updated surfer counts:`, activeSurferCounts);
    
    // Emit events to notify other parts of the app
    emitCheckInStatusChanged(spotId, true);
    updateSurferCount(spotId, activeSurferCounts[spotId]);
    
    return checkIn;
  } catch (error) {
    console.error('Error checking in to spot:', error);
    return null;
  }
};

/**
 * Check out from a surf spot
 * This will decrement the surfer count for the spot
 */
export const checkOutFromSpot = async (checkInId: string): Promise<boolean> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 800));
    
    console.log(`[DEBUG] Checking out with ID: ${checkInId}`);
    console.log(`[DEBUG] Current check-ins before checkout:`, activeCheckIns);
    
    // Find the check-in
    let foundSpotId: string | null = null;
    let foundCheckIn: CheckIn | null = null;
    
    for (const spotId in activeCheckIns) {
      const checkInIndex = activeCheckIns[spotId].findIndex(checkin => checkin.id === checkInId);
      if (checkInIndex >= 0) {
        foundSpotId = spotId;
        foundCheckIn = activeCheckIns[spotId][checkInIndex];
        // Remove from active check-ins
        activeCheckIns[spotId].splice(checkInIndex, 1);
        break;
      }
    }
    
    if (foundSpotId && foundCheckIn) {
      // Decrement surfer count
      if (activeSurferCounts[foundSpotId] > 0) {
        activeSurferCounts[foundSpotId]--;
      }
      
      console.log(`[DEBUG] Successfully checked out from ${foundSpotId}. Updated check-ins:`, activeCheckIns);
      console.log(`[DEBUG] Updated surfer counts:`, activeSurferCounts);
      
      // Emit events to notify other parts of the app
      emitCheckInStatusChanged(foundSpotId, false);
      updateSurferCount(foundSpotId, activeSurferCounts[foundSpotId]);
      
      return true;
    }
    
    console.log(`[DEBUG] Check-in not found for ID: ${checkInId}`);
    return false;
  } catch (error) {
    console.error('Error checking out from spot:', error);
    return false;
  }
};

/**
 * Submits a check-in to the backend
 * This is a mock implementation
 */
export const submitCheckIn = async (checkInData: Omit<CheckIn, 'id' | 'timestamp' | 'expiresAt' | 'isActive'>): Promise<CheckIn | null> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // In a real implementation, this would post to a backend API
    // For now, we'll create a mock response
    
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString();
    
    const checkIn: CheckIn = {
      id: `checkin-${Date.now()}`,
      userId: checkInData.userId,
      spotId: checkInData.spotId,
      timestamp: now.toISOString(),
      expiresAt,
      isActive: true,
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

/**
 * Get active check-in for a user at a specific spot
 * This is used to retrieve the current check-in state
 */
export const getActiveCheckInForUser = async (
  userId: string, 
  spotId: string
): Promise<CheckIn | null> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if this spot has active check-ins
    if (!activeCheckIns[spotId]) {
      return null;
    }
    
    // Find active check-in for this user at this spot
    const activeCheckIn = activeCheckIns[spotId].find(
      checkin => checkin.userId === userId && checkin.isActive
    );
    
    return activeCheckIn || null;
  } catch (error) {
    console.error('Error getting active check-in:', error);
    return null;
  }
};

/**
 * Get active check-in for a user at any spot
 * This is used to prevent a user from being checked in at multiple spots
 */
export const getActiveCheckInForUserAnywhere = async (
  userId: string
): Promise<CheckIn | null> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check all spots for an active check-in by this user
    for (const spotId in activeCheckIns) {
      const checkIn = activeCheckIns[spotId].find(
        checkin => checkin.userId === userId && checkin.isActive
      );
      
      if (checkIn) {
        return checkIn;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting active check-in anywhere:', error);
    return null;
  }
};

/**
 * Import the fetchNearbySurfSpots function to allow the SpotDetailsScreen to use it
 */
export { fetchNearbySurfSpots }; 