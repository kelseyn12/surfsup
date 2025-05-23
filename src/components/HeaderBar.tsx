import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform, 
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import BackButton from './BackButton';
import { useWebSocketStatus } from '../services/WebSocketStatusContext';

interface HeaderBarProps {
  title: string;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

/**
 * A standardized header component for screens with optional back button
 */
const HeaderBar: React.FC<HeaderBarProps> = ({ 
  title, 
  onBackPress, 
  rightComponent 
}) => {
  const { connected, error } = useWebSocketStatus();
  let statusColor = COLORS.success;
  if (error) statusColor = COLORS.error;
  else if (!connected) statusColor = COLORS.warning;

  return (
    <>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
        <View style={styles.header}>
          {onBackPress ? (
            <BackButton onPress={onBackPress} />
          ) : (
            <View style={styles.placeholderButton} />
          )}
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          </View>
          <View style={styles.rightComponentContainer}>
            {rightComponent || <View style={styles.placeholderButton} />}
          </View>
        </View>
      </View>
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>
            Real-time connection lost. Some features may be unavailable. Retrying...
          </Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight || 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  placeholderButton: {
    width: 44,
    height: 44,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    textAlign: 'center',
    marginRight: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 2,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  rightComponentContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBanner: {
    backgroundColor: COLORS.error,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  errorBannerText: {
    color: COLORS.white,
    fontSize: 13,
    textAlign: 'center',
  },
});

export default HeaderBar; 