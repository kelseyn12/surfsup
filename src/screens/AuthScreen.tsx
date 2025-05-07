import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '../navigation/types';
import { COLORS } from '../constants';
import { useAuthStore } from '../services/auth';

const AuthScreen: React.FC = () => {
  const navigation = useNavigation<RootStackScreenProps<'Auth'>['navigation']>();
  const { login, register, isLoading, error, clearError } = useAuthStore();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [validationError, setValidationError] = useState('');

  const validateForm = () => {
    if (!email || !password) {
      setValidationError('Please fill in all required fields');
      return false;
    }
    if (!isLogin && !name) {
      setValidationError('Please fill in all required fields');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationError('Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setValidationError('');
    clearError();
    
    if (!validateForm()) return;
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      navigation.navigate('Main', { screen: 'Home' });
    } catch (err) {
      // Error is handled by the auth store
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>SurfSUP</Text>
          <Text style={styles.subtitle}>Your daily surf companion</Text>
          
          <View style={styles.form}>
            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            )}
            
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            
            {(validationError || error) && (
              <Text style={styles.errorText}>
                {validationError || error}
              </Text>
            )}
            
            <TouchableOpacity 
              style={styles.button}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.switchButton}
              onPress={() => setIsLogin(!isLogin)}
            >
              <Text style={styles.switchText}>
                {isLogin 
                  ? "Don't have an account? Create one" 
                  : 'Already have an account? Sign in'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  form: {
    width: '100%',
    maxWidth: 300,
  },
  input: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    alignItems: 'center',
  },
  switchText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  errorText: {
    color: COLORS.error,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default AuthScreen; 