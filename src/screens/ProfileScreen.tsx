import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Image 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MainTabScreenProps } from '../navigation/types';
import { COLORS } from '../constants';
import { User, SurfSession } from '../types';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<MainTabScreenProps<'Profile'>['navigation']>();

  // Mock user data
  const user: User = {
    id: 'user123',
    username: 'lake_surfer',
    email: 'lakesurfer@example.com',
    name: 'Sarah Johnson',
    preferences: {
      preferredBoard: 'shortboard',
      units: 'imperial',
      notifications: true,
      homeSpot: '2',
    },
    stats: {
      totalSessions: 48,
      favoriteSurfSpot: 'Park Point',
      averageSessionLength: 120, // minutes
      longestSession: 180, // minutes
      startDate: new Date('2023-01-15').toISOString(),
    },
    profileImageUrl: 'https://via.placeholder.com/150',
  };

  // Mock recent sessions
  const recentSessions: SurfSession[] = [
    {
      id: 'session1',
      userId: user.id,
      surfSpotId: '2',
      surfSpotName: 'Park Point',
      date: new Date('2023-09-15').toISOString(),
      startTime: '08:30',
      endTime: '10:30',
      duration: 120,
      rating: 4,
      notes: 'Great northeast wind swell. Lake was churning with clean 4ft faces.',
      board: 'shortboard',
      conditions: {
        waveHeight: 4.0,
        windSpeed: 15,
        windDirection: 'northeast',
        waterTemp: 38,
        swellPeriod: 6,
        swellDirection: 'NE',
        tide: 'n/a', // Lake Superior doesn't have significant tides
      },
    },
    {
      id: 'session2',
      userId: user.id,
      surfSpotId: '1',
      surfSpotName: 'Stoney Point',
      date: new Date('2023-09-10').toISOString(),
      startTime: '07:00',
      endTime: '08:30',
      duration: 90,
      rating: 3,
      notes: 'Choppy but still caught some good waves. Water was cold!',
      board: 'fish',
      conditions: {
        waveHeight: 3.0,
        windSpeed: 12,
        windDirection: 'north',
        waterTemp: 37,
        swellPeriod: 5,
        swellDirection: 'N',
        tide: 'n/a',
      },
    },
  ];

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: user.profileImageUrl }} style={styles.profileImage} />
        <Text style={styles.profileName}>{user.name}</Text>
        <Text style={styles.profileUsername}>@{user.username}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.stats.totalSessions}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{Math.floor(user.stats.averageSessionLength / 60)}h {user.stats.averageSessionLength % 60}m</Text>
          <Text style={styles.statLabel}>Avg Session</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {new Date().getFullYear() - new Date(user.stats.startDate).getFullYear()}
          </Text>
          <Text style={styles.statLabel}>Years</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Sessions</Text>
        {recentSessions.map((session) => (
          <TouchableOpacity 
            key={session.id}
            style={styles.sessionCard}
            onPress={() => navigation.navigate('SessionDetails', { sessionId: session.id })}
          >
            <View style={styles.sessionHeader}>
              <Text style={styles.sessionSpot}>{session.surfSpotName}</Text>
              <Text style={styles.sessionDate}>{formatDate(session.date)}</Text>
            </View>
            <View style={styles.sessionDetails}>
              <View style={styles.sessionDetail}>
                <Ionicons name="time-outline" size={16} color={COLORS.gray} />
                <Text style={styles.sessionDetailText}>
                  {Math.floor(session.duration / 60)}h {session.duration % 60}m
                </Text>
              </View>
              <View style={styles.sessionDetail}>
                <Ionicons name="water-outline" size={16} color={COLORS.gray} />
                <Text style={styles.sessionDetailText}>
                  {session.conditions.waveHeight}ft • {session.conditions.swellPeriod}s
                </Text>
              </View>
              <View style={styles.sessionDetail}>
                <Ionicons name="star-outline" size={16} color={COLORS.gray} />
                <Text style={styles.sessionDetailText}>
                  {session.rating}/5
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => navigation.navigate('LogSession', { spotId: 'stonypoint' })}
        >
          <Text style={styles.viewAllButtonText}>View All Sessions</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('LogSession', { spotId: 'stonypoint' })}
        >
          <Ionicons name="add-circle-outline" size={20} color={COLORS.white} />
          <Text style={styles.actionButtonText}>Log Session</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings-outline" size={20} color={COLORS.primary} />
          <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Settings</Text>
        </TouchableOpacity>
      </View>
      
      {/* Debug Button - only visible in development */}
      <View style={styles.debugSection}>
        <TouchableOpacity 
          style={styles.debugButton}
          onPress={() => navigation.navigate('Debug')}
        >
          <Ionicons name="bug-outline" size={20} color={COLORS.white} />
          <Text style={styles.debugButtonText}>Debug Panel</Text>
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  profileUsername: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  statDivider: {
    height: 30,
    width: 1,
    backgroundColor: COLORS.lightGray,
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: COLORS.text.primary,
  },
  sessionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sessionSpot: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  sessionDate: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  sessionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sessionDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionDetailText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginLeft: 4,
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  viewAllButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
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
  debugSection: {
    alignItems: 'center',
    padding: 16,
  },
  debugButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  debugButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProfileScreen; 