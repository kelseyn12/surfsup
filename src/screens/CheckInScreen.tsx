import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Alert 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackScreenProps } from '../navigation/types';
import { COLORS, MESSAGES } from '../constants';
import { SurfConditions } from '../types';

const CheckInScreen: React.FC = () => {
  const route = useRoute<RootStackScreenProps<'CheckIn'>['route']>();
  const navigation = useNavigation<RootStackScreenProps<'CheckIn'>['navigation']>();
  
  // Get spot details from route params or use fallback
  const { spotId, spot } = route.params || { spotId: '0', spot: { name: 'Unknown Spot' } };
  
  // Current date and time
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  const formattedTime = currentDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });

  // Form state
  const [rating, setRating] = useState(3);
  const [notes, setNotes] = useState('');
  const [conditions, setConditions] = useState<Partial<SurfConditions>>({
    waveHeight: 3.0,
    windSpeed: 15,
    windDirection: 'northeast',
    swellPeriod: 6,
    waterTemp: 38,
  });

  // Submit check-in
  const handleSubmit = () => {
    // In a real app, you would save this to storage or API
    console.log('Check-in submitted', { 
      spotId, 
      spotName: spot?.name,
      date: currentDate.toISOString(),
      time: formattedTime,
      rating,
      notes,
      conditions
    });

    // Show success message and navigate back
    Alert.alert(
      'Success',
      MESSAGES.SUCCESS.CHECK_IN,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.spotName}>{spot?.name}</Text>
        <Text style={styles.dateTime}>{formattedDate} • {formattedTime}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How are the waves?</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((value) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.ratingButton,
                rating >= value ? { backgroundColor: COLORS.primary } : {}
              ]}
              onPress={() => setRating(value)}
            >
              <Ionicons
                name="star"
                size={24}
                color={rating >= value ? COLORS.white : COLORS.lightGray}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conditions</Text>
        <View style={styles.conditionsContainer}>
          <View style={styles.conditionRow}>
            <Text style={styles.conditionLabel}>Wave Height (ft)</Text>
            <View style={styles.conditionInputContainer}>
              <TouchableOpacity
                style={styles.conditionButton}
                onPress={() => setConditions({
                  ...conditions,
                  waveHeight: Math.max(0, (conditions.waveHeight || 0) - 0.5)
                })}
              >
                <Ionicons name="remove" size={20} color={COLORS.text.primary} />
              </TouchableOpacity>
              <Text style={styles.conditionValue}>{conditions.waveHeight}</Text>
              <TouchableOpacity
                style={styles.conditionButton}
                onPress={() => setConditions({
                  ...conditions,
                  waveHeight: (conditions.waveHeight || 0) + 0.5
                })}
              >
                <Ionicons name="add" size={20} color={COLORS.text.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.conditionRow}>
            <Text style={styles.conditionLabel}>Wind Speed (kn)</Text>
            <View style={styles.conditionInputContainer}>
              <TouchableOpacity
                style={styles.conditionButton}
                onPress={() => setConditions({
                  ...conditions,
                  windSpeed: Math.max(0, (conditions.windSpeed || 0) - 1)
                })}
              >
                <Ionicons name="remove" size={20} color={COLORS.text.primary} />
              </TouchableOpacity>
              <Text style={styles.conditionValue}>{conditions.windSpeed}</Text>
              <TouchableOpacity
                style={styles.conditionButton}
                onPress={() => setConditions({
                  ...conditions,
                  windSpeed: (conditions.windSpeed || 0) + 1
                })}
              >
                <Ionicons name="add" size={20} color={COLORS.text.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.conditionRow}>
            <Text style={styles.conditionLabel}>Swell Period (s)</Text>
            <View style={styles.conditionInputContainer}>
              <TouchableOpacity
                style={styles.conditionButton}
                onPress={() => setConditions({
                  ...conditions,
                  swellPeriod: Math.max(0, (conditions.swellPeriod || 0) - 1)
                })}
              >
                <Ionicons name="remove" size={20} color={COLORS.text.primary} />
              </TouchableOpacity>
              <Text style={styles.conditionValue}>{conditions.swellPeriod}</Text>
              <TouchableOpacity
                style={styles.conditionButton}
                onPress={() => setConditions({
                  ...conditions,
                  swellPeriod: (conditions.swellPeriod || 0) + 1
                })}
              >
                <Ionicons name="add" size={20} color={COLORS.text.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.conditionRow}>
            <Text style={styles.conditionLabel}>Water Temp (°F)</Text>
            <View style={styles.conditionInputContainer}>
              <TouchableOpacity
                style={styles.conditionButton}
                onPress={() => setConditions({
                  ...conditions,
                  waterTemp: Math.max(32, (conditions.waterTemp || 38) - 1)
                })}
              >
                <Ionicons name="remove" size={20} color={COLORS.text.primary} />
              </TouchableOpacity>
              <Text style={styles.conditionValue}>{conditions.waterTemp}</Text>
              <TouchableOpacity
                style={styles.conditionButton}
                onPress={() => setConditions({
                  ...conditions,
                  waterTemp: (conditions.waterTemp || 38) + 1
                })}
              >
                <Ionicons name="add" size={20} color={COLORS.text.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.conditionRow}>
            <Text style={styles.conditionLabel}>Wind Direction</Text>
            <View style={styles.windDirectionContainer}>
              {['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'].map((direction) => (
                <TouchableOpacity
                  key={direction}
                  style={[
                    styles.windDirectionButton,
                    conditions.windDirection === direction ? { backgroundColor: COLORS.primary } : {}
                  ]}
                  onPress={() => setConditions({
                    ...conditions,
                    windDirection: direction
                  })}
                >
                  <Text
                    style={[
                      styles.windDirectionText,
                      conditions.windDirection === direction ? { color: COLORS.white } : {}
                    ]}
                  >
                    {direction.charAt(0).toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Add any observations about current conditions..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          placeholderTextColor={COLORS.gray}
        />
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Submit Check-In</Text>
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
    padding: 16,
    backgroundColor: COLORS.white,
    marginBottom: 16,
  },
  spotName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  dateTime: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  section: {
    padding: 16,
    backgroundColor: COLORS.white,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: COLORS.text.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  conditionsContainer: {
    gap: 16,
  },
  conditionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conditionLabel: {
    fontSize: 16,
    color: COLORS.text.primary,
  },
  conditionInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    overflow: 'hidden',
  },
  conditionButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
  },
  conditionValue: {
    width: 50,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  windDirectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-end',
  },
  windDirectionButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  windDirectionText: {
    fontSize: 14,
    color: COLORS.text.primary,
    textTransform: 'capitalize',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
    color: COLORS.text.primary,
  },
  actionContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CheckInScreen; 