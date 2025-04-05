import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainTabScreenProps } from '../navigation/types';
import { COLORS } from '../constants';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<MainTabScreenProps<'Home'>['navigation']>();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // In a real app, you would fetch fresh data here
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
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
        <Text style={styles.headerSubtitle}>Your Daily Surf Forecast</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nearby Spots</Text>
        <View style={styles.spotsList}>
          {/* This would be a FlatList in the actual implementation */}
          <TouchableOpacity 
            style={styles.spotCard}
            onPress={() => navigation.navigate('SpotDetails', { spotId: '1', spot: { name: 'Pacifica' } })}
          >
            <Text style={styles.spotName}>Pacifica</Text>
            <Text style={styles.spotCondition}>Good</Text>
            <Text style={styles.spotDetails}>3-4ft • 12s • Light offshore</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.spotCard}
            onPress={() => navigation.navigate('SpotDetails', { spotId: '2', spot: { name: 'Ocean Beach' } })}
          >
            <Text style={styles.spotName}>Ocean Beach</Text>
            <Text style={[styles.spotCondition, { color: COLORS.surfConditions.fair }]}>Fair</Text>
            <Text style={styles.spotDetails}>4-5ft • 10s • Moderate onshore</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.spotCard}
            onPress={() => navigation.navigate('SpotDetails', { spotId: '3', spot: { name: 'Half Moon Bay' } })}
          >
            <Text style={styles.spotName}>Half Moon Bay</Text>
            <Text style={[styles.spotCondition, { color: COLORS.surfConditions.excellent }]}>Excellent</Text>
            <Text style={styles.spotDetails}>2-3ft • 15s • Glassy</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Recent Activity</Text>
        <TouchableOpacity 
          style={styles.activityCard}
          onPress={() => navigation.navigate('SessionDetails', { sessionId: '123' })}
        >
          <Text style={styles.activityTitle}>Ocean Beach Session</Text>
          <Text style={styles.activityDate}>Yesterday • 2hrs</Text>
          <Text style={styles.activityDetails}>Fun morning session with clean conditions</Text>
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
            <Text style={styles.forecastDetails}>2-3ft</Text>
          </View>
          <View style={styles.forecastDay}>
            <Text style={styles.forecastDate}>Wed</Text>
            <Text style={[styles.forecastCondition, { color: COLORS.surfConditions.fair }]}>Fair</Text>
            <Text style={styles.forecastDetails}>4-5ft</Text>
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
  spotCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  spotName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  spotCondition: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.surfConditions.good,
    marginTop: 4,
  },
  spotDetails: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 4,
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