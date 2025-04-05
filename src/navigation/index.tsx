import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { COLORS, ROUTES } from '../constants';
import { MainTabParamList, RootStackParamList } from './types';

// Import screens (these will be created later)
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SpotDetailsScreen from '../screens/SpotDetailsScreen';
import CheckInScreen from '../screens/CheckInScreen';
import SessionLogScreen from '../screens/SessionLogScreen';
import SessionDetailsScreen from '../screens/SessionDetailsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AuthScreen from '../screens/AuthScreen';
import OnBoardingScreen from '../screens/OnBoardingScreen';

// Import icons
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Main tab navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'water' : 'water-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        headerShown: true,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Surf Conditions' }}
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen} 
        options={{ title: 'Spot Map' }}
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen} 
        options={{ title: 'Favorites' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

// Root stack navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Main"
        screenOptions={{
          headerShown: true,
          headerBackTitleVisible: false,
          headerTintColor: COLORS.primary,
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
          options={({ route }) => ({ 
            title: route.params?.spot?.name || 'Spot Details' 
          })}
        />
        <Stack.Screen 
          name="CheckIn" 
          component={CheckInScreen} 
          options={{ title: 'Check In' }}
        />
        <Stack.Screen 
          name="SessionLog" 
          component={SessionLogScreen} 
          options={{ title: 'Log Session' }}
        />
        <Stack.Screen 
          name="SessionDetails" 
          component={SessionDetailsScreen} 
          options={{ title: 'Session Details' }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ title: 'Settings' }}
        />
        <Stack.Screen 
          name="Auth" 
          component={AuthScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="OnBoarding" 
          component={OnBoardingScreen} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 