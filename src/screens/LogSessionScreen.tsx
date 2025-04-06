import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Switch,
  Modal,
  FlatList
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackScreenProps } from '../navigation/types';
import { COLORS } from '../constants';
import { SurfSession, SurfSpot } from '../types';
import { logSurfSession, fetchNearbySurfSpots } from '../services/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import { HeaderBar } from '../components';

const LogSessionScreen: React.FC = () => {
  const route = useRoute<RootStackScreenProps<'LogSession'>['route']>();
  const navigation = useNavigation<RootStackScreenProps<'LogSession'>['navigation']>();
  
  // Get parameters from route
  const { spotId, checkInTime } = route.params || { spotId: null, checkInTime: null };
  const [spot, setSpot] = useState<SurfSpot | null>(null);

  // Session details
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [startTime, setStartTime] = useState<Date>(checkInTime ? new Date(checkInTime) : new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [boardType, setBoardType] = useState<SurfSession['board']['type']>('shortboard');
  const [boardDetails, setBoardDetails] = useState<string>('');
  const [waveHeight, setWaveHeight] = useState<string>('');
  const [quality, setQuality] = useState<SurfSession['conditions']['quality']>('good');
  const [wavesRidden, setWavesRidden] = useState<string>('');
  const [longestRide, setLongestRide] = useState<string>('');
  const [bestWave, setBestWave] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [includeInPublicActivity, setIncludeInPublicActivity] = useState(false);

  // New state for spot picker
  const [spotSearchText, setSpotSearchText] = useState('');
  const [showSpotPicker, setShowSpotPicker] = useState(false);
  const [availableSpots, setAvailableSpots] = useState<SurfSpot[]>([]);

  // Load spot details when component mounts
  useEffect(() => {
    if (spotId) {
      loadSpotDetails();
    }
  }, [spotId]);

  // Load available spots
  useEffect(() => {
    const loadSpots = async () => {
      try {
        // Using hard-coded coordinates for Lake Superior for demo
        const spots = await fetchNearbySurfSpots(46.7825, -92.0856);
        if (spots) {
          setAvailableSpots(spots);
        }
      } catch (error) {
        console.error('Error loading available spots:', error);
      }
    };
    
    loadSpots();
  }, []);

  const loadSpotDetails = async () => {
    setIsLoading(true);
    try {
      // Using hard-coded coordinates for Lake Superior for demo
      const spots = await fetchNearbySurfSpots(46.7825, -92.0856);
      if (spots) {
        const foundSpot = spots.find(s => s.id === spotId);
        if (foundSpot) {
          setSpot(foundSpot);
        }
      }
    } catch (error) {
      console.error('Error loading spot details:', error);
      Alert.alert('Error', 'Failed to load spot details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartTime(selectedDate);
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndTime(selectedDate);
    }
  };

  const handleBoardTypeSelect = (type: SurfSession['board']['type']) => {
    setBoardType(type);
  };

  const handleQualitySelect = (quality: SurfSession['conditions']['quality']) => {
    setQuality(quality);
  };

  // Handle navigation back
  const handleBack = useCallback(() => {
    console.log('Back button pressed, navigating back');
    navigation.goBack();
  }, [navigation]);

  // Handle save validation
  const validateSessionData = useCallback(() => {
    if (!spot) {
      Alert.alert('Error', 'Please select a surf spot.');
      return false;
    }

    if (startTime >= endTime) {
      Alert.alert('Error', 'End time must be after start time.');
      return false;
    }

    return true;
  }, [spot, startTime, endTime]);

  const handleSaveSession = async () => {
    // Validate required fields
    if (!validateSessionData()) {
      return;
    }

    setIsSaving(true);
    try {
      // Calculate duration in minutes
      const durationMs = endTime.getTime() - startTime.getTime();
      const durationMinutes = Math.floor(durationMs / 60000);

      const sessionData: Omit<SurfSession, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: 'test-user-id', // In a real app, get this from auth
        spotId: spot?.id || '', // Use the selected spot ID
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: durationMinutes,
        board: {
          type: boardType,
          details: boardDetails.trim() || undefined
        },
        conditions: {
          waveHeight: parseFloat(waveHeight) || 0,
          quality
        },
        performance: {
          wavesRidden: parseInt(wavesRidden) || 0,
          longestRide: parseInt(longestRide) || undefined,
          bestWave: parseInt(bestWave) || undefined
        },
        notes: notes.trim() || undefined,
        imageUrls: [] // Would handle image uploads in a real app
      };

      const result = await logSurfSession(sessionData);
      
      if (result) {
        Alert.alert(
          'Session Logged', 
          'Your surf session has been successfully saved!',
          [
            { 
              text: 'OK', 
              onPress: () => navigation.navigate('Main')
            }
          ]
        );
      } else {
        throw new Error('Failed to save session');
      }
    } catch (error) {
      console.error('Error saving session:', error);
      Alert.alert('Error', 'Failed to save your surf session. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const selectSpot = (selectedSpot: SurfSpot) => {
    setSpot(selectedSpot);
    setShowSpotPicker(false);
  };

  const filteredSpots = spotSearchText.trim() === '' 
    ? availableSpots 
    : availableSpots.filter(spot => 
        spot.name.toLowerCase().includes(spotSearchText.toLowerCase()) ||
        (spot.location?.city && spot.location.city.toLowerCase().includes(spotSearchText.toLowerCase()))
      );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading spot information...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        <HeaderBar 
          title="Log Surf Session" 
          onBackPress={() => {
            console.log('Back button pressed in LogSessionScreen');
            navigation.goBack();
          }}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spot</Text>
          <TouchableOpacity 
            style={styles.spotSelector}
            onPress={() => setShowSpotPicker(true)}
          >
            <View>
              <Text style={styles.spotName}>{spot?.name || 'Select a Surf Spot'}</Text>
              {spot?.location && (
                <Text style={styles.spotLocation}>
                  {spot.location.city}{spot.location.state ? `, ${spot.location.state}` : ''}
                </Text>
              )}
            </View>
            <Ionicons name="chevron-down" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Spot Picker Modal */}
        <Modal
          visible={showSpotPicker}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Surf Spot</Text>
                <TouchableOpacity onPress={() => setShowSpotPicker(false)}>
                  <Ionicons name="close" size={24} color={COLORS.text.primary} />
                </TouchableOpacity>
              </View>
              
              <TextInput
                style={styles.searchInput}
                placeholder="Search spots..."
                value={spotSearchText}
                onChangeText={setSpotSearchText}
              />
              
              <FlatList
                data={filteredSpots}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.spotItem}
                    onPress={() => selectSpot(item)}
                  >
                    <Text style={styles.spotItemName}>{item.name}</Text>
                    {item.location && (
                      <Text style={styles.spotItemLocation}>
                        {item.location.city}{item.location.state ? `, ${item.location.state}` : ''}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
                style={styles.spotList}
              />
            </View>
          </View>
        </Modal>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Time</Text>
          
          <View style={styles.timeContainer}>
            <Text style={styles.timeLabel}>Start:</Text>
            <TouchableOpacity 
              style={styles.timePicker} 
              onPress={() => setShowStartPicker(true)}
            >
              <Text style={styles.timeText}>
                {startTime.toLocaleString()}
              </Text>
              <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.timeContainer}>
            <Text style={styles.timeLabel}>End:</Text>
            <TouchableOpacity 
              style={styles.timePicker} 
              onPress={() => setShowEndPicker(true)}
            >
              <Text style={styles.timeText}>
                {endTime.toLocaleString()}
              </Text>
              <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {showStartPicker && (
            <DateTimePicker
              value={startTime}
              mode="datetime"
              display="default"
              onChange={handleStartDateChange}
            />
          )}

          {showEndPicker && (
            <DateTimePicker
              value={endTime}
              mode="datetime"
              display="default"
              onChange={handleEndDateChange}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Board</Text>
          <View style={styles.boardTypeContainer}>
            {['shortboard', 'longboard', 'fish', 'funboard', 'sup', 'other'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.boardTypeButton,
                  boardType === type && styles.boardTypeButtonSelected
                ]}
                onPress={() => handleBoardTypeSelect(type as SurfSession['board']['type'])}
              >
                <Text 
                  style={[
                    styles.boardTypeText,
                    boardType === type && styles.boardTypeTextSelected
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TextInput
            style={styles.input}
            placeholder="Board details (optional)"
            value={boardDetails}
            onChangeText={setBoardDetails}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conditions</Text>
          
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Wave Height (ft):</Text>
            <TextInput
              style={[styles.input, styles.shortInput]}
              placeholder="0.0"
              value={waveHeight}
              onChangeText={setWaveHeight}
              keyboardType="decimal-pad"
            />
          </View>

          <Text style={styles.inputLabel}>Quality:</Text>
          <View style={styles.qualityContainer}>
            {['poor', 'fair', 'good', 'excellent'].map((q) => (
              <TouchableOpacity
                key={q}
                style={[
                  styles.qualityButton,
                  quality === q && styles.qualityButtonSelected,
                  { backgroundColor: getQualityColor(q as SurfSession['conditions']['quality']) }
                ]}
                onPress={() => handleQualitySelect(q as SurfSession['conditions']['quality'])}
              >
                <Text 
                  style={[
                    styles.qualityText,
                    quality === q && styles.qualityTextSelected
                  ]}
                >
                  {q.charAt(0).toUpperCase() + q.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance</Text>
          
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Waves Ridden:</Text>
            <TextInput
              style={[styles.input, styles.shortInput]}
              placeholder="0"
              value={wavesRidden}
              onChangeText={setWavesRidden}
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Longest Ride (seconds):</Text>
            <TextInput
              style={[styles.input, styles.shortInput]}
              placeholder="0"
              value={longestRide}
              onChangeText={setLongestRide}
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Best Wave (1-10):</Text>
            <TextInput
              style={[styles.input, styles.shortInput]}
              placeholder="0"
              value={bestWave}
              onChangeText={setBestWave}
              keyboardType="number-pad"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Add notes about your session..."
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </View>

        <View style={styles.section}>
          <View style={styles.privacyRow}>
            <Text style={styles.privacyText}>Include in public activity feed</Text>
            <Switch
              value={includeInPublicActivity}
              onValueChange={setIncludeInPublicActivity}
              trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]} 
            onPress={() => {
              console.log('Cancel button pressed');
              try {
                navigation.goBack();
              } catch (error) {
                console.error('Navigation error in Cancel:', error);
                navigation.navigate('Main');
              }
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.saveButton]} 
            onPress={handleSaveSession}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.saveButtonText}>Save Session</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Emergency back button */}
        <View style={styles.emergencyBackContainer}>
          <TouchableOpacity 
            style={styles.emergencyBackButton}
            onPress={() => navigation.navigate('Main')}
          >
            <Ionicons name="home" size={24} color={COLORS.white} />
            <Text style={styles.emergencyBackText}>Return to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Helper function to get color based on quality
const getQualityColor = (quality: SurfSession['conditions']['quality']): string => {
  switch (quality) {
    case 'poor': return COLORS.surfConditions.poor;
    case 'fair': return COLORS.surfConditions.fair;
    case 'good': return COLORS.surfConditions.good;
    case 'excellent': return COLORS.surfConditions.excellent;
    default: return COLORS.gray;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    padding: 8,
  },
  backButtonEnhanced: {
    padding: 15,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginLeft: 16,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  spotCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  spotName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  spotLocation: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeLabel: {
    width: 60,
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  timePicker: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  timeText: {
    fontSize: 16,
    color: COLORS.text.primary,
  },
  boardTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  boardTypeButton: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginRight: 8,
    marginBottom: 8,
  },
  boardTypeButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  boardTypeText: {
    fontSize: 14,
    color: COLORS.text.primary,
  },
  boardTypeTextSelected: {
    color: COLORS.white,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  shortInput: {
    width: 100,
    textAlign: 'center',
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  qualityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  qualityButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  qualityButtonSelected: {
    borderWidth: 2,
    borderColor: COLORS.black,
  },
  qualityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  qualityTextSelected: {
    // No specific styles needed, the border makes it clear
  },
  privacyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  privacyText: {
    fontSize: 16,
    color: COLORS.text.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 32, // Extra padding at the bottom for safety
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  spotSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  searchInput: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  spotList: {
    maxHeight: 400,
  },
  spotItem: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  spotItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  spotItemLocation: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  emergencyBackContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  emergencyBackButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
  },
  emergencyBackText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default LogSessionScreen; 