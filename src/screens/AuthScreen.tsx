import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '../navigation/types';
import { COLORS } from '../constants';

const AuthScreen: React.FC = () => {
  const navigation = useNavigation<RootStackScreenProps<'Auth'>['navigation']>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SurfSUP</Text>
      <Text style={styles.subtitle}>Your daily surf companion</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Main')}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('OnBoarding')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.text.secondary,
    marginBottom: 48,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: COLORS.primary,
  },
});

export default AuthScreen; 