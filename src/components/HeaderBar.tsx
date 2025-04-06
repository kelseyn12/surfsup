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
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.header}>
        {onBackPress ? (
          <BackButton onPress={onBackPress} />
        ) : (
          <View style={styles.placeholderButton} />
        )}
        
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        
        <View style={styles.rightComponentContainer}>
          {rightComponent || <View style={styles.placeholderButton} />}
        </View>
      </View>
    </View>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  rightComponentContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HeaderBar; 