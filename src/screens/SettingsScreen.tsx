import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Switch, 
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackScreenProps } from '../navigation/types';
import { COLORS } from '../constants';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<RootStackScreenProps<'Settings'>['navigation']>();
  
  // Mock settings state
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    units: 'imperial', // imperial or metric
    homeSpot: 'Ocean Beach',
    saveSessionData: true,
  });

  const toggleSetting = (setting: keyof typeof settings, value?: any) => {
    if (value !== undefined) {
      setSettings({
        ...settings,
        [setting]: value
      });
    } else {
      setSettings({
        ...settings,
        [setting]: !settings[setting]
      });
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => navigation.navigate('Auth'),
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Text style={styles.settingDescription}>Receive alerts about surf conditions</Text>
          </View>
          <Switch
            value={settings.notifications}
            onValueChange={() => toggleSetting('notifications')}
            trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
            thumbColor={COLORS.white}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Text style={styles.settingDescription}>Use dark theme throughout the app</Text>
          </View>
          <Switch
            value={settings.darkMode}
            onValueChange={() => toggleSetting('darkMode')}
            trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
            thumbColor={COLORS.white}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Save Session Data</Text>
            <Text style={styles.settingDescription}>Store your surfing sessions history</Text>
          </View>
          <Switch
            value={settings.saveSessionData}
            onValueChange={() => toggleSetting('saveSessionData')}
            trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
            thumbColor={COLORS.white}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Units</Text>
        
        <View style={styles.unitSelector}>
          <TouchableOpacity
            style={[
              styles.unitButton,
              settings.units === 'imperial' ? styles.activeUnitButton : {}
            ]}
            onPress={() => toggleSetting('units', 'imperial')}
          >
            <Text
              style={[
                styles.unitButtonText,
                settings.units === 'imperial' ? styles.activeUnitButtonText : {}
              ]}
            >
              Imperial (ft, F)
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.unitButton,
              settings.units === 'metric' ? styles.activeUnitButton : {}
            ]}
            onPress={() => toggleSetting('units', 'metric')}
          >
            <Text
              style={[
                styles.unitButtonText,
                settings.units === 'metric' ? styles.activeUnitButtonText : {}
              ]}
            >
              Metric (m, C)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemContent}>
            <Ionicons name="person-outline" size={24} color={COLORS.text.primary} />
            <Text style={styles.menuItemText}>Edit Profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.gray} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemContent}>
            <Ionicons name="lock-closed-outline" size={24} color={COLORS.text.primary} />
            <Text style={styles.menuItemText}>Change Password</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.gray} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemContent}>
            <Ionicons name="cloud-download-outline" size={24} color={COLORS.text.primary} />
            <Text style={styles.menuItemText}>Export Data</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.gray} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemContent}>
            <Ionicons name="help-circle-outline" size={24} color={COLORS.text.primary} />
            <Text style={styles.menuItemText}>Help & FAQ</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.gray} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemContent}>
            <Ionicons name="mail-outline" size={24} color={COLORS.text.primary} />
            <Text style={styles.menuItemText}>Contact Us</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.gray} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemContent}>
            <Ionicons name="document-text-outline" size={24} color={COLORS.text.primary} />
            <Text style={styles.menuItemText}>Terms & Privacy</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.gray} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.version}>
        <Text style={styles.versionText}>SurfSUP v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  section: {
    marginBottom: 24,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: COLORS.text.primary,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  unitSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  activeUnitButton: {
    backgroundColor: COLORS.primary,
  },
  unitButtonText: {
    fontSize: 14,
    color: COLORS.text.primary,
  },
  activeUnitButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: COLORS.text.primary,
    marginLeft: 16,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginVertical: 24,
    backgroundColor: COLORS.error,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  version: {
    alignItems: 'center',
    marginBottom: 40,
  },
  versionText: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
});

export default SettingsScreen; 