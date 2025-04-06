import React, { useRef, useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { enableScreens } from 'react-native-screens';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SpotDetailsScreen from '../screens/SpotDetailsScreen';
import LogSessionScreen from '../screens/LogSessionScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { RootStackParamList, MainTabParamList } from './types';
import { View, Text, TouchableOpacity, Platform } from 'react-native';

// Enable screens for better navigation performance
enableScreens(true);

// Add debugging for the LogSessionScreen import
console.log('LogSessionScreen imported in AppNavigator:', LogSessionScreen ? 'YES' : 'NO');

// Create a theme with better screen transition behavior
const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.background,
    primary: COLORS.primary,
  },
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Bottom tab navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.lightGray,
          paddingTop: 5,
          paddingBottom: 5,
          height: 60,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Main stack navigator
const AppNavigator = () => {
  const navigationRef = useRef(null);
  
  // Monitor navigation state changes for debugging
  const onStateChange = () => {
    const currentRoute = navigationRef.current?.getCurrentRoute();
    const canGoBack = navigationRef.current?.canGoBack();
    
    console.log(
      '[Navigation] Current route:',
      currentRoute?.name,
      'Params:',
      currentRoute?.params,
      'Can go back:',
      canGoBack
    );
  };
  
  // Wrap in try-catch for safe error handling
  try {
    return (
      <NavigationContainer 
        theme={AppTheme}
        ref={navigationRef}
        onStateChange={onStateChange}
      >
        <Stack.Navigator 
          initialRouteName="Main"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            gestureEnabled: true,
            fullScreenGestureEnabled: true,
          }}
        >
          <Stack.Screen 
            name="Main" 
            component={MainTabNavigator} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="SpotDetails" 
            component={SpotDetailsScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="LogSession" 
            component={LogSessionScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } catch (error) {
    console.error('Error in AppNavigator:', error);
    // Return a minimal fallback UI
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <Text style={{ fontSize: 18, color: COLORS.text.primary, marginBottom: 20 }}>
          Navigation error occurred
        </Text>
        <TouchableOpacity 
          style={{ 
            backgroundColor: COLORS.primary, 
            padding: 15, 
            borderRadius: 8 
          }}
          onPress={() => {
            // Force restart app
            if (Platform.OS === 'web') {
              window.location.reload();
            }
          }}
        >
          <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>Restart App</Text>
        </TouchableOpacity>
      </View>
    );
  }
};

export default AppNavigator; 