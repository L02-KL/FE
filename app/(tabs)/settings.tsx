import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import { ThemeColors, ThemeMode, useTheme } from '@/contexts/ThemeContext';

interface SettingItemProps {
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  title: string;
  subtitle?: string;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
  colors: ThemeColors;
}

function SettingItem({
  iconName,
  iconColor,
  title,
  subtitle,
  hasSwitch,
  switchValue,
  onSwitchChange,
  onPress,
  colors,
}: SettingItemProps) {
  return (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={hasSwitch}
      activeOpacity={0.7}
    >
      <View style={[styles.settingIcon, { backgroundColor: colors.background }]}>
        <Ionicons name={iconName} size={22} color={iconColor || colors.textSecondary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>{title}</Text>
        {subtitle && <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
      </View>
      {hasSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.white}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const { colors, isDark, themeMode, setThemeMode, toggleTheme } = useTheme();
  const [notifications, setNotifications] = React.useState(true);

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            await logout();
            // Router redirection is handled by useProtectedRoute in _layout
          }
        }
      ]
    );
  };

  const getThemeModeLabel = (mode: ThemeMode): string => {
    switch (mode) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'system': return 'System';
    }
  };

  const cycleThemeMode = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(themeMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setThemeMode(modes[nextIndex]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Settings</Text>
      </View>

      <ScrollView
        style={styles.settingsList}
        contentContainerStyle={styles.settingsListContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Account</Text>
          <View style={[styles.sectionContent, { backgroundColor: colors.cardBackground }]}>
            <SettingItem
              iconName="person-outline"
              iconColor={colors.primary}
              title="Profile"
              subtitle="Edit your profile"
              onPress={() => router.push('/profile')}
              colors={colors}
            />
            <SettingItem
              iconName="notifications-outline"
              iconColor={colors.accent}
              title="Notifications"
              hasSwitch
              switchValue={notifications}
              onSwitchChange={setNotifications}
              colors={colors}
            />
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Appearance</Text>
          <View style={[styles.sectionContent, { backgroundColor: colors.cardBackground }]}>
            <SettingItem
              iconName="moon-outline"
              iconColor="#6B5CE7"
              title="Dark Mode"
              hasSwitch
              switchValue={isDark}
              onSwitchChange={toggleTheme}
              colors={colors}
            />
            <SettingItem
              iconName="color-palette-outline"
              iconColor="#E91E63"
              title="Theme Mode"
              subtitle={getThemeModeLabel(themeMode)}
              onPress={cycleThemeMode}
              colors={colors}
            />
          </View>
        </View>

        {/* General Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>General</Text>
          <View style={[styles.sectionContent, { backgroundColor: colors.cardBackground }]}>
            <SettingItem
              iconName="globe-outline"
              iconColor="#00BCD4"
              title="Language"
              subtitle="English"
              onPress={() => console.log('Language')}
              colors={colors}
            />
            <SettingItem
              iconName="calendar-outline"
              iconColor="#4CAF50"
              title="Calendar"
              subtitle="Sync settings"
              onPress={() => console.log('Calendar')}
              colors={colors}
            />
            <SettingItem
              iconName="cloud-download-outline"
              iconColor="#FF9800"
              title="Data & Storage"
              onPress={() => console.log('Data')}
              colors={colors}
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Support</Text>
          <View style={[styles.sectionContent, { backgroundColor: colors.cardBackground }]}>
            <SettingItem
              iconName="help-circle-outline"
              iconColor="#9C27B0"
              title="Help Center"
              onPress={() => console.log('Help')}
              colors={colors}
            />
            <SettingItem
              iconName="mail-outline"
              iconColor="#2196F3"
              title="Contact Us"
              onPress={() => console.log('Contact')}
              colors={colors}
            />
            <SettingItem
              iconName="information-circle-outline"
              iconColor="#607D8B"
              title="About"
              subtitle="Version 1.0.0"
              onPress={() => console.log('About')}
              colors={colors}
            />
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.cardBackground }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.error} style={{ marginRight: 8 }} />
          <Text style={[styles.logoutText, { color: colors.error }]}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  settingsList: {
    flex: 1,
  },
  settingsListContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionContent: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
