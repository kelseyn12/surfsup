import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackScreenProps } from '../navigation/types';
import { COLORS } from '../constants';
import { SurfConditions } from '../types';

const SpotDetailsScreen: React.FC = () => {
  const route = useRoute<RootStackScreenProps<'SpotDetails'>['route']>();
  const navigation = useNavigation<RootStackScreenProps<'SpotDetails'>['navigation']>();
  
  // Get spot details from route params or use fallback
  const { spotId, spot } = route.params || { spotId: '0', spot: { name: 'Unknown Spot' } };
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock current conditions
  const currentConditions: SurfConditions = {
    waveHeight: 3.5,
    windSpeed: 5,
    windDirection: 'offshore',
    waterTemp: 62,
    swellPeriod: 12,
    swellDirection: 'W',
    tide: 'rising',
  };

  // Mock forecast data
  const forecast = [
    { day: 'Today', waveHeight: '3-4ft', period: '12s', wind: 'Offshore', rating: 'Good' },
    { day: 'Tomorrow', waveHeight: '2-3ft', period: '15s', wind: 'Glassy', rating: 'Excellent' },
    { day: 'Wed', waveHeight: '4-5ft', period: '10s', wind: 'Onshore', rating: 'Fair' },
    { day: 'Thu', waveHeight: '3-4ft', period: '8s', wind: 'Cross-shore', rating: 'Fair' },
    { day: 'Fri', waveHeight: '1-2ft', period: '7s', wind: 'Onshore', rating: 'Poor' },
  ];

  // Toggle favorite status
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, you would persist this to storage or API
  };

  // Function to determine color based on rating
  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Excellent':
        return COLORS.surfConditions.excellent;
      case 'Good':
        return COLORS.surfConditions.good;
      case 'Fair':
        return COLORS.surfConditions.fair;
      case 'Poor':
        return COLORS.surfConditions.poor;
      default:
        return COLORS.gray;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Hero image */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/800x400' }} 
          style={styles.spotImage} 
        />
        <View style={styles.imageOverlay}>
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={toggleFavorite}
          >
            <Ionicons 
              name={isFavorite ? 'heart' : 'heart-outline'} 
              size={28} 
              color={isFavorite ? COLORS.error : COLORS.white} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Current conditions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Conditions</Text>
        <View style={styles.conditionsCard}>
          <View style={styles.conditionRow}>
            <View style={styles.conditionItem}>
              <Ionicons name="water-outline" size={24} color={COLORS.primary} />
              <Text style={styles.conditionLabel}>Wave Height</Text>
              <Text style={styles.conditionValue}>{currentConditions.waveHeight}ft</Text>
            </View>
            <View style={styles.conditionItem}>
              <Ionicons name="time-outline" size={24} color={COLORS.primary} />
              <Text style={styles.conditionLabel}>Period</Text>
              <Text style={styles.conditionValue}>{currentConditions.swellPeriod}s</Text>
            </View>
          </View>
          <View style={styles.conditionRow}>
            <View style={styles.conditionItem}>
              <Ionicons name="speedometer-outline" size={24} color={COLORS.primary} />
              <Text style={styles.conditionLabel}>Wind</Text>
              <Text style={styles.conditionValue}>{currentConditions.windSpeed}kn {currentConditions.windDirection}</Text>
            </View>
            <View style={styles.conditionItem}>
              <Ionicons name="thermometer-outline" size={24} color={COLORS.primary} />
              <Text style={styles.conditionLabel}>Water Temp</Text>
              <Text style={styles.conditionValue}>{currentConditions.waterTemp}°F</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Forecast */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Forecast</Text>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.forecastContainer}
        >
          {forecast.map((day, index) => (
            <View key={index} style={styles.forecastCard}>
              <Text style={styles.forecastDay}>{day.day}</Text>
              <Text style={[styles.forecastRating, { color: getRatingColor(day.rating) }]}>
                {day.rating}
              </Text>
              <View style={styles.forecastDetail}>
                <Ionicons name="water-outline" size={16} color={COLORS.gray} />
                <Text style={styles.forecastDetailText}>{day.waveHeight}</Text>
              </View>
              <View style={styles.forecastDetail}>
                <Ionicons name="time-outline" size={16} color={COLORS.gray} />
                <Text style={styles.forecastDetailText}>{day.period}</Text>
              </View>
              <View style={styles.forecastDetail}>
                <Ionicons name="speedometer-outline" size={16} color={COLORS.gray} />
                <Text style={styles.forecastDetailText}>{day.wind}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Additional info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About This Spot</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            {spot?.name} is a popular surf spot known for consistent waves. 
            It's suitable for intermediate to advanced surfers, with best conditions 
            during low to mid tide with offshore winds.
          </Text>
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('CheckIn', { spotId, spot })}
        >
          <Ionicons name="location-outline" size={20} color={COLORS.white} />
          <Text style={styles.actionButtonText}>Check In</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => navigation.navigate('SessionLog', { spotId, spot })}
        >
          <Ionicons name="add-circle-outline" size={20} color={COLORS.primary} />
          <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Log Session</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  spotImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 16,
  },
  favoriteButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.text.primary,
  },
  conditionsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  conditionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  conditionItem: {
    flex: 1,
    alignItems: 'center',
  },
  conditionLabel: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  conditionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginTop: 4,
  },
  forecastContainer: {
    paddingRight: 16,
  },
  forecastCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 120,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  forecastDay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  forecastRating: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  forecastDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  forecastDetailText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginLeft: 6,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text.secondary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 32,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: COLORS.primary,
  },
});

export default SpotDetailsScreen; 