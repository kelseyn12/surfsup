/**
 * Location utilities for calculating distances and finding nearby spots
 */
import type { SurfSpot } from '../types';

/**
 * Calculate distance between two coordinates using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  
  return distance;
};

/**
 * Convert degrees to radians
 * @param degrees Angle in degrees
 * @returns Angle in radians
 */
export const degreesToRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Find surf spots within a certain radius of a location
 * @param spots Array of surf spots
 * @param latitude Current latitude
 * @param longitude Current longitude
 * @param radius Radius in kilometers
 * @returns Array of nearby surf spots with distance
 */
export const findNearbySpots = (
  spots: SurfSpot[],
  latitude: number,
  longitude: number,
  radius: number
): Array<SurfSpot & { distance: number }> => {
  return spots
    .map(spot => {
      const distance = calculateDistance(
        latitude,
        longitude,
        spot.location.latitude,
        spot.location.longitude
      );
      
      return {
        ...spot,
        distance,
      };
    })
    .filter(spot => spot.distance <= radius)
    .sort((a, b) => a.distance - b.distance);
};

/**
 * Format distance for display
 * @param distance Distance in kilometers
 * @param useImperial Whether to use miles (true) or kilometers (false)
 * @returns Formatted distance string
 */
export const formatDistance = (
  distance: number,
  useImperial = true
): string => {
  if (useImperial) {
    // Convert to miles
    const miles = distance * 0.621371;
    
    if (miles < 0.1) {
      return 'Nearby';
    } else if (miles < 10) {
      return `${miles.toFixed(1)} mi`;
    } else {
      return `${Math.round(miles)} mi`;
    }
  } else {
    // Use kilometers
    if (distance < 0.1) {
      return 'Nearby';
    } else if (distance < 10) {
      return `${distance.toFixed(1)} km`;
    } else {
      return `${Math.round(distance)} km`;
    }
  }
};

/**
 * Determine cardinal direction between two points
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Cardinal direction (N, NE, E, etc.)
 */
export const getDirectionBetweenPoints = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): string => {
  const dLon = lon2 - lon1;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  
  let bearing = Math.atan2(y, x);
  bearing = bearing * (180 / Math.PI);
  bearing = (bearing + 360) % 360;
  
  // Convert bearing to compass direction
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
  const index = Math.round(bearing / 45);
  
  return directions[index];
};

/**
 * Get a map region for a list of coordinates
 * @param coordinates Array of coordinate points
 * @param padding Padding percentage (0-1)
 * @returns Map region with proper zoom level
 */
export const getRegionForCoordinates = (
  coordinates: Array<{ latitude: number; longitude: number }>,
  padding = 0.2
) => {
  if (coordinates.length === 0) {
    return null;
  }
  
  // Fallback for single coordinate
  if (coordinates.length === 1) {
    return {
      latitude: coordinates[0].latitude,
      longitude: coordinates[0].longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  }
  
  // Calculate min and max for lat and long
  let minLat = coordinates[0].latitude;
  let maxLat = coordinates[0].latitude;
  let minLng = coordinates[0].longitude;
  let maxLng = coordinates[0].longitude;
  
  coordinates.forEach(coord => {
    minLat = Math.min(minLat, coord.latitude);
    maxLat = Math.max(maxLat, coord.latitude);
    minLng = Math.min(minLng, coord.longitude);
    maxLng = Math.max(maxLng, coord.longitude);
  });
  
  // Calculate center
  const midLat = (minLat + maxLat) / 2;
  const midLng = (minLng + maxLng) / 2;
  
  // Calculate deltas
  let latDelta = (maxLat - minLat) * (1 + padding);
  let lngDelta = (maxLng - minLng) * (1 + padding);
  
  // Ensure minimum zoom level
  latDelta = Math.max(latDelta, 0.01);
  lngDelta = Math.max(lngDelta, 0.01);
  
  return {
    latitude: midLat,
    longitude: midLng,
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta,
  };
}; 