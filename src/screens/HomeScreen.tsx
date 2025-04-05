import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MainTabScreenProps } from '../navigation/types';
import { COLORS } from '../constants';
import { SurfSpotCard } from '../components';
import { SurfSpot } from '../types';
import { fetchNearbySurfSpots, getSurferCount } from '../services/api';
import { eventEmitter, AppEvents } from '../services/events';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<MainTabScreenProps<'Home'>['navigation']>();
  const [refreshing, setRefreshing] = useState(false);
  const [nearbySpots, setNearbySpots] = useState<SurfSpot[]>([]);
  const [loading, setLoading] = useState(false);

  // Initial load of nearby spots
  useEffect(() => {
    loadNearbySpots();
  }, []);

  // Set up event listener for surfer count updates
  useEffect(() => {
    const handleSurferCountUpdate = (data: { spotId: string, count: number }) => {
      console.log(`[EVENT] HomeScreen received surfer count update for ${data.spotId}: ${data.count}`);
      
      // Update the surfer count for the specific spot
      setNearbySpots(currentSpots => 
        currentSpots.map(spot => 
          spot.id === data.spotId 
            ? { ...spot, currentSurferCount: data.count } 
            : spot
        )
      );
    };

    // Register event listener
    eventEmitter.on(AppEvents.SURFER_COUNT_UPDATED, handleSurferCountUpdate);

    // Cleanup listener on unmount
    return () => {
      eventEmitter.off(AppEvents.SURFER_COUNT_UPDATED, handleSurferCountUpdate);
    };
  }, []);

  // Always refresh the data when coming back to this screen
  useFocusEffect(
    React.useCallback(() => {
      console.log('[DEBUG] HomeScreen focused, refreshing data');
      loadNearbySpots();
      return () => {};
    }, [])
  );

  const loadNearbySpots = async () => {
    try {
      setLoading(true);
      // Using a fixed location for Lake Superior near Duluth
      const spots = await fetchNearbySurfSpots(46.7825, -92.0856);
      if (spots) {
        console.log('[DEBUG] HomeScreen loaded spots:', spots.length);
        
        // Make sure each spot shows the latest surfer count
        const updatedSpots = [...spots];
        for (let i = 0; i < updatedSpots.length; i++) {
          const latestCount = await getSurferCount(updatedSpots[i].id);
          console.log(`[DEBUG] Getting latest count for ${updatedSpots[i].name}: ${latestCount}`);
          updatedSpots[i].currentSurferCount = latestCount;
        }
        
        setNearbySpots(updatedSpots);
      }
    } catch (error) {
      console.error('Error loading nearby spots:', error);
    } finally {
      setLoading(false);
    }
  };

  // On manual refresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadNearbySpots().then(() => {
      setRefreshing(false);
    });
  }, []);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.primary]}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SurfSUP</Text>
        <Text style={styles.headerSubtitle}>Lake Superior Surf Forecast</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nearby Spots</Text>
        <View style={styles.spotsList}>
          {nearbySpots.map(spot => (
            <SurfSpotCard
              key={spot.id}
              spot={spot}
              showConditions={true}
              surferCount={spot.currentSurferCount || 0}
            />
          ))}
          
          {nearbySpots.length === 0 && !loading && (
            <Text style={styles.noSpotsText}>No spots found nearby</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Recent Activity</Text>
        <TouchableOpacity 
          style={styles.activityCard}
          onPress={() => navigation.navigate('SessionDetails', { sessionId: '123' })}
        >
          <Text style={styles.activityTitle}>Park Point Session</Text>
          <Text style={styles.activityDate}>Yesterday • 2hrs</Text>
          <Text style={styles.activityDetails}>Epic NE wind swell, caught some great rides!</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Surf Forecast</Text>
        <View style={styles.forecastContainer}>
          <View style={styles.forecastDay}>
            <Text style={styles.forecastDate}>Today</Text>
            <Text style={styles.forecastCondition}>Good</Text>
            <Text style={styles.forecastDetails}>3-4ft</Text>
          </View>
          <View style={styles.forecastDay}>
            <Text style={styles.forecastDate}>Tomorrow</Text>
            <Text style={[styles.forecastCondition, { color: COLORS.surfConditions.excellent }]}>Excellent</Text>
            <Text style={styles.forecastDetails}>4-6ft</Text>
          </View>
          <View style={styles.forecastDay}>
            <Text style={styles.forecastDate}>Wed</Text>
            <Text style={[styles.forecastCondition, { color: COLORS.surfConditions.fair }]}>Fair</Text>
            <Text style={styles.forecastDetails}>2-3ft</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 16,
    marginTop: 8,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.text.primary,
  },
  spotsList: {
    gap: 12,
  },
  noSpotsText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginVertical: 20,
  },
  activityCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  activityDate: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 4,
  },
  activityDetails: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  forecastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecastDay: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  forecastDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  forecastCondition: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.surfConditions.good,
    marginTop: 4,
  },
  forecastDetails: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
});

export default HomeScreen; 