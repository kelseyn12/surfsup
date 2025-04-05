import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Platform,
  Alert 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackScreenProps } from '../navigation/types';
import { COLORS, MESSAGES } from '../constants';
import { SurfConditions } from '../types';

// In a real app, you would use a proper date/time picker
const TimeInput = ({ 
  label, 
  value, 
  onChangeText 
}: { 
  label: string; 
  value: string; 
  onChangeText: (text: string) => void; 
}) => (
  <View style={styles.inputRow}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.timeInput}
      value={value}
      onChangeText={onChangeText}
      placeholder="00:00"
      placeholderTextColor={COLORS.gray}
      keyboardType="numbers-and-punctuation"
    />
  </View>
);

const BoardTypeSelector = ({ 
  selected, 
  onSelect 
}: { 
  selected: string; 
  onSelect: (boardType: string) => void; 
}) => {
  const boardTypes = ['shortboard', 'longboard', 'fish', 'funboard', 'other'];
  
  return (
    <View style={styles.boardTypesContainer}>
      {boardTypes.map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            styles.boardTypeButton,
            selected === type ? { backgroundColor: COLORS.primary } : {}
          ]}
          onPress={() => onSelect(type)}
        >
          <Text
            style={[
              styles.boardTypeText,
              selected === type ? { color: COLORS.white } : {}
            ]}
          >
            {type}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const SessionLogScreen: React.FC = () => {
  const route = useRoute<RootStackScreenProps<'SessionLog'>['route']>();
  const navigation = useNavigation<RootStackScreenProps<'SessionLog'>['navigation']>();
  
  // Get spot details from route params or use fallback
  const { spotId, spot } = route.params || { spotId: '0', spot: { name: 'Unknown Spot' } };
  
  // Current date
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  // Form state
  const [date, setDate] = useState(formattedDate);
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('09:00');
  const [rating, setRating] = useState(4);
  const [board, setBoard] = useState('shortboard');
  const [notes, setNotes] = useState('');
  const [conditions, setConditions] = useState<Partial<SurfConditions>>({
    waveHeight: 3.0,
    windSpeed: 5,
    windDirection: 'offshore',
    waterTemp: 62,
    swellPeriod: 12,
    swellDirection: 'W',
    tide: 'rising',
  });

  // Calculate duration (simplified)
  const calculateDuration = () => {
    try {
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      
      let durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
      if (durationMinutes < 0) {
        durationMinutes += 24 * 60; // Assuming session spans to next day
      }
      
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      
      return `${hours}h ${minutes}m`;
    } catch (e) {
      return 'Invalid time';
    }
  };

  // Submit session log
  const handleSubmit = () => {
    // Validate times
    if (!startTime || !endTime) {
      Alert.alert('Error', 'Please enter start and end times');
      return;
    }

    // In a real app, you would save this to storage or API
    console.log('Session logged', { 
      spotId, 
      spotName: spot?.name,
      date: currentDate.toISOString(),
      startTime,
      endTime,
      duration: calculateDuration(),
      rating,
      board,
      notes,
      conditions
    });

    // Show success message and navigate back
    Alert.alert(
      'Success',
      MESSAGES.SUCCESS.SESSION_LOGGED,
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
        <Text style={styles.dateTime}>{formattedDate}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Session Details</Text>
        
        <TimeInput
          label="Start Time"
          value={startTime}
          onChangeText={setStartTime}
        />
        
        <TimeInput
          label="End Time"
          value={endTime}
          onChangeText={setEndTime}
        />

        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Duration</Text>
          <Text style={styles.durationText}>{calculateDuration()}</Text>
        </View>
        
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Rating</Text>
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
                  size={20}
                  color={rating >= value ? COLORS.white : COLORS.lightGray}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Board Type</Text>
        </View>
        <BoardTypeSelector selected={board} onSelect={setBoard} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conditions</Text>
        <View style={styles.conditionsGrid}>
          <View style={styles.conditionItem}>
            <Text style={styles.conditionLabel}>Wave Height</Text>
            <View style={styles.conditionInputContainer}>
              <TextInput
                style={styles.conditionInput}
                value={conditions.waveHeight?.toString()}
                onChangeText={(text) => setConditions({
                  ...conditions,
                  waveHeight: parseFloat(text) || 0
                })}
                keyboardType="numeric"
                placeholder="0.0"
                placeholderTextColor={COLORS.gray}
              />
              <Text style={styles.conditionUnit}>ft</Text>
            </View>
          </View>

          <View style={styles.conditionItem}>
            <Text style={styles.conditionLabel}>Wind Speed</Text>
            <View style={styles.conditionInputContainer}>
              <TextInput
                style={styles.conditionInput}
                value={conditions.windSpeed?.toString()}
                onChangeText={(text) => setConditions({
                  ...conditions,
                  windSpeed: parseInt(text) || 0
                })}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={COLORS.gray}
              />
              <Text style={styles.conditionUnit}>kn</Text>
            </View>
          </View>

          <View style={styles.conditionItem}>
            <Text style={styles.conditionLabel}>Water Temp</Text>
            <View style={styles.conditionInputContainer}>
              <TextInput
                style={styles.conditionInput}
                value={conditions.waterTemp?.toString()}
                onChangeText={(text) => setConditions({
                  ...conditions,
                  waterTemp: parseInt(text) || 0
                })}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={COLORS.gray}
              />
              <Text style={styles.conditionUnit}>°F</Text>
            </View>
          </View>

          <View style={styles.conditionItem}>
            <Text style={styles.conditionLabel}>Swell Period</Text>
            <View style={styles.conditionInputContainer}>
              <TextInput
                style={styles.conditionInput}
                value={conditions.swellPeriod?.toString()}
                onChangeText={(text) => setConditions({
                  ...conditions,
                  swellPeriod: parseInt(text) || 0
                })}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={COLORS.gray}
              />
              <Text style={styles.conditionUnit}>s</Text>
            </View>
          </View>
        </View>

        <View style={[styles.inputRow, { marginTop: 16 }]}>
          <Text style={styles.inputLabel}>Wind Direction</Text>
          <View style={styles.selectContainer}>
            {['offshore', 'cross-shore', 'onshore'].map((direction) => (
              <TouchableOpacity
                key={direction}
                style={[
                  styles.selectOption,
                  conditions.windDirection === direction ? { backgroundColor: COLORS.primary } : {}
                ]}
                onPress={() => setConditions({
                  ...conditions,
                  windDirection: direction
                })}
              >
                <Text
                  style={[
                    styles.selectOptionText,
                    conditions.windDirection === direction ? { color: COLORS.white } : {}
                  ]}
                >
                  {direction.replace('-', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.inputRow, { marginTop: 12 }]}>
          <Text style={styles.inputLabel}>Tide</Text>
          <View style={styles.selectContainer}>
            {['low', 'rising', 'high', 'falling'].map((tideType) => (
              <TouchableOpacity
                key={tideType}
                style={[
                  styles.selectOption,
                  conditions.tide === tideType ? { backgroundColor: COLORS.primary } : {}
                ]}
                onPress={() => setConditions({
                  ...conditions,
                  tide: tideType
                })}
              >
                <Text
                  style={[
                    styles.selectOptionText,
                    conditions.tide === tideType ? { color: COLORS.white } : {}
                  ]}
                >
                  {tideType}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Add notes about your session..."
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
          <Text style={styles.submitButtonText}>Save Session</Text>
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
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: COLORS.text.primary,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 8,
    width: 100,
    textAlign: 'center',
    fontSize: 16,
    color: COLORS.text.primary,
  },
  durationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  ratingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  boardTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 8,
  },
  boardTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginBottom: 8,
  },
  boardTypeText: {
    fontSize: 14,
    color: COLORS.text.primary,
    textTransform: 'capitalize',
  },
  conditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  conditionItem: {
    width: '48%',
    marginBottom: 16,
  },
  conditionLabel: {
    fontSize: 14,
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  conditionInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  conditionInput: {
    flex: 1,
    padding: 8,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  conditionUnit: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginLeft: 4,
    width: 24,
  },
  selectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 8,
  },
  selectOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  selectOptionText: {
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

export default SessionLogScreen; 