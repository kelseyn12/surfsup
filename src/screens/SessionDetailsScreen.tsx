import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackScreenProps } from '../navigation/types';
import { COLORS } from '../constants';
import { SurfSession } from '../types';

const SessionDetailsScreen: React.FC = () => {
  const route = useRoute<RootStackScreenProps<'SessionDetails'>['route']>();
  const navigation = useNavigation<RootStackScreenProps<'SessionDetails'>['navigation']>();
  
  // Get session id from route params
  const { sessionId } = route.params || { sessionId: '0' };
  
  // Mock session data
  const session: SurfSession = {
    id: sessionId,
    userId: 'user123',
    surfSpotId: '2',
    surfSpotName: 'Ocean Beach',
    date: new Date('2023-09-15').toISOString(),
    startTime: '08:30',
    endTime: '10:30',
    duration: 120,
    rating: 4,
    notes: 'Fun morning session with clean conditions. Caught about 10 waves, mostly rights. The swell was consistent with occasional larger sets. Low tide made for some hollow sections. Crowd was moderate but spread out.',
    board: 'shortboard',
    conditions: {
      waveHeight: 5.5,
      windSpeed: 5,
      windDirection: 'offshore',
      waterTemp: 62,
      swellPeriod: 12,
      swellDirection: 'W',
      tide: 'rising',
    },
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Generate rating stars
  const renderRatingStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Ionicons 
        key={i} 
        name={i < rating ? 'star' : 'star-outline'} 
        size={20} 
        color={i < rating ? COLORS.primary : COLORS.gray} 
        style={{ marginRight: 4 }}
      />
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.date}>{formatDate(session.date)}</Text>
        <Text style={styles.spotName}>{session.surfSpotName}</Text>
        <View style={styles.ratingContainer}>
          {renderRatingStars(session.rating)}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Session Details</Text>
        
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>{session.startTime} - {session.endTime}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>{Math.floor(session.duration / 60)}h {session.duration % 60}m</Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Board</Text>
            <Text style={styles.detailValue}>{session.board}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conditions</Text>
        
        <View style={styles.conditionsGrid}>
          <View style={styles.conditionItem}>
            <Ionicons name="water-outline" size={24} color={COLORS.primary} />
            <Text style={styles.conditionLabel}>Wave Height</Text>
            <Text style={styles.conditionValue}>{session.conditions.waveHeight} ft</Text>
          </View>
          
          <View style={styles.conditionItem}>
            <Ionicons name="speedometer-outline" size={24} color={COLORS.primary} />
            <Text style={styles.conditionLabel}>Wind</Text>
            <Text style={styles.conditionValue}>{session.conditions.windSpeed} kn {session.conditions.windDirection}</Text>
          </View>
          
          <View style={styles.conditionItem}>
            <Ionicons name="time-outline" size={24} color={COLORS.primary} />
            <Text style={styles.conditionLabel}>Period</Text>
            <Text style={styles.conditionValue}>{session.conditions.swellPeriod} s</Text>
          </View>
          
          <View style={styles.conditionItem}>
            <Ionicons name="thermometer-outline" size={24} color={COLORS.primary} />
            <Text style={styles.conditionLabel}>Water Temp</Text>
            <Text style={styles.conditionValue}>{session.conditions.waterTemp}°F</Text>
          </View>
          
          <View style={styles.conditionItem}>
            <Ionicons name="compass-outline" size={24} color={COLORS.primary} />
            <Text style={styles.conditionLabel}>Swell Direction</Text>
            <Text style={styles.conditionValue}>{session.conditions.swellDirection}</Text>
          </View>
          
          <View style={styles.conditionItem}>
            <Ionicons name="resize-outline" size={24} color={COLORS.primary} />
            <Text style={styles.conditionLabel}>Tide</Text>
            <Text style={styles.conditionValue}>{session.conditions.tide}</Text>
          </View>
        </View>
      </View>

      {session.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.notes}>{session.notes}</Text>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('SessionLog', { 
            sessionId: session.id,
            spotId: session.surfSpotId,
            spot: { name: session.surfSpotName }
          })}
        >
          <Ionicons name="create-outline" size={20} color={COLORS.white} />
          <Text style={styles.actionButtonText}>Edit Session</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => navigation.navigate('SpotDetails', { 
            spotId: session.surfSpotId,
            spot: { name: session.surfSpotName }
          })}
        >
          <Ionicons name="location-outline" size={20} color={COLORS.primary} />
          <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>View Spot</Text>
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
  header: {
    padding: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  date: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  spotName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  section: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: COLORS.text.primary,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  conditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  conditionItem: {
    width: '33.33%',
    padding: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  conditionLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: 4,
    textAlign: 'center',
  },
  conditionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginTop: 2,
    textAlign: 'center',
  },
  notes: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text.primary,
  },
  actions: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: COLORS.primary,
  },
});

export default SessionDetailsScreen; 