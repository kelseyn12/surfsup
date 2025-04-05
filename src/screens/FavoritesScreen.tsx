import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  RefreshControl,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MainTabScreenProps } from '../navigation/types';
import { COLORS } from '../constants';
import { SurfSpot } from '../types';

const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<MainTabScreenProps<'Favorites'>['navigation']>();
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for favorite spots
  const [favoriteSpots, setFavoriteSpots] = useState<SurfSpot[]>([
    {
      id: '1',
      name: 'Stoney Point',
      location: { latitude: 46.9463, longitude: -91.8944 },
      type: 'point-break',
      difficulty: 'intermediate',
      isFavorite: true,
    },
    {
      id: '2',
      name: 'Park Point',
      location: { latitude: 46.7616, longitude: -92.0593 },
      type: 'beach-break',
      difficulty: 'beginner',
      isFavorite: true,
    },
    {
      id: '3',
      name: 'Lester River',
      location: { latitude: 46.8330, longitude: -92.0070 },
      type: 'river-mouth',
      difficulty: 'advanced',
      isFavorite: true,
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    // In a real app, you'd fetch fresh data here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleRemoveFavorite = (spotId: string) => {
    Alert.alert(
      'Remove Favorite',
      'Are you sure you want to remove this spot from favorites?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: () => {
            setFavoriteSpots(favoriteSpots.filter(spot => spot.id !== spotId));
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderSpotItem = ({ item }: { item: SurfSpot }) => (
    <TouchableOpacity
      style={styles.spotCard}
      onPress={() => navigation.navigate('SpotDetails', { spotId: item.id, spot: item })}
    >
      <View style={styles.spotInfo}>
        <Text style={styles.spotName}>{item.name}</Text>
        <Text style={styles.spotType}>{item.type.replace('-', ' ')} • {item.difficulty}</Text>
      </View>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => handleRemoveFavorite(item.id)}
      >
        <Ionicons name="heart" size={24} color={COLORS.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={favoriteSpots}
        keyExtractor={(item) => item.id}
        renderItem={renderSpotItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Favorite Spots</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={64} color={COLORS.gray} />
            <Text style={styles.emptyText}>No favorite spots yet</Text>
            <Text style={styles.emptySubText}>
              Add spots to your favorites to see them here
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => navigation.navigate('Map')}
            >
              <Text style={styles.exploreButtonText}>Find Spots</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  spotCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  spotInfo: {
    flex: 1,
  },
  spotName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  spotType: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  favoriteButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: 8,
    marginHorizontal: 32,
  },
  exploreButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 24,
  },
  exploreButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default FavoritesScreen; 