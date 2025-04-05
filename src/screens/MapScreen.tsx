import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainTabScreenProps } from '../navigation/types';
import { COLORS } from '../constants';

// In a full implementation, we would import and use a map component like:
// import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
// or similar for a different map provider

const MapScreen: React.FC = () => {
  const navigation = useNavigation<MainTabScreenProps<'Map'>['navigation']>();
  const [isLoading, setIsLoading] = useState(false);

  // Placeholder for map region state - centered on Lake Superior near Duluth
  const [region, setRegion] = useState({
    latitude: 46.7867, 
    longitude: -92.0805, 
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });

  // Mock data for surf spots on Lake Superior
  const surfSpots = [
    { id: '1', name: 'Stoney Point', latitude: 46.9463, longitude: -91.8944, rating: 'Good' },
    { id: '2', name: 'Park Point', latitude: 46.7616, longitude: -92.0593, rating: 'Fair' },
    { id: '3', name: 'Lester River', latitude: 46.8330, longitude: -92.0070, rating: 'Excellent' },
    { id: '4', name: 'Brighton Beach', latitude: 46.8450, longitude: -92.0024, rating: 'Good' },
    { id: '5', name: 'The Cribs', latitude: 46.8049, longitude: -91.9949, rating: 'Fair' },
  ];

  // Placeholder function for finding user's location
  const findMyLocation = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Mock location finding - centered on Duluth
      setRegion({
        latitude: 46.7867,
        longitude: -92.0805,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      });
      setIsLoading(false);
    }, 1000);
  };

  // Placeholder for handling marker press
  const handleMarkerPress = (spotId: string, spotName: string) => {
    navigation.navigate('SpotDetails', { spotId, spot: { name: spotName } });
  };

  return (
    <View style={styles.container}>
      {/* This is a placeholder for the actual map component */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapPlaceholderText}>Lake Superior Surf Map</Text>
        <Text style={styles.mapPlaceholderSubText}>
          In a real implementation, this would be a MapView component showing Lake Superior surf spots
        </Text>
        
        {/* Placeholder for marker indicators */}
        {surfSpots.map((spot) => (
          <TouchableOpacity
            key={spot.id}
            style={[
              styles.markerPlaceholder,
              {
                backgroundColor: 
                  spot.rating === 'Excellent' 
                    ? COLORS.surfConditions.excellent 
                    : spot.rating === 'Good' 
                      ? COLORS.surfConditions.good 
                      : COLORS.surfConditions.fair,
                top: Math.random() * 200 + 100,
                left: Math.random() * 200 + 75,
              }
            ]}
            onPress={() => handleMarkerPress(spot.id, spot.name)}
          >
            <Text style={styles.markerText}>{spot.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={findMyLocation}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.controlButtonText}>Find My Location</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapPlaceholderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  mapPlaceholderSubText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginTop: 8,
  },
  markerPlaceholder: {
    position: 'absolute',
    padding: 8,
    borderRadius: 8,
    margin: 4,
  },
  markerText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  controlButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  controlButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MapScreen; 