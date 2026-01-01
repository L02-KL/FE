import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { useTheme } from '@/contexts/ThemeContext';

// Custom Tab Icon Component using Ionicons
function TabIcon({ name, color, focused }: { name: string; color: string; focused: boolean }) {
  const { colors } = useTheme();
  const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    home: focused ? 'home' : 'home-outline',
    tasks: focused ? 'checkbox' : 'checkbox-outline',
    courses: focused ? 'book' : 'book-outline',
    settings: focused ? 'settings' : 'settings-outline',
  };
  
  return (
    <View style={[styles.iconContainer, focused && { backgroundColor: colors.primaryLight }]}>
      <Ionicons name={iconMap[name] || 'apps-outline'} size={24} color={color} />
    </View>
  );
}

// Add Task Button Component
function AddTaskButton() {
  const router = useRouter();
  const { colors } = useTheme();
  
  return (
    <View style={styles.addButtonContainer}>
      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: colors.accent, shadowColor: colors.accent }]}
        onPress={() => router.push('/modal')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
}

export default function TabLayout() {
  const { colors } = useTheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabBarInactive,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: [styles.tabBar, { backgroundColor: colors.tabBarBackground }],
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <TabIcon name="home" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, focused }) => <TabIcon name="tasks" color={color} focused={focused} />,
        }}
      />
      {/* Add Task Button in center */}
      <Tabs.Screen
        name="add-task"
        options={{
          title: '',
          tabBarButton: () => <AddTaskButton />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
          },
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: 'Courses',
          tabBarIcon: ({ color, focused }) => <TabIcon name="courses" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => <TabIcon name="settings" color={color} focused={focused} />,
        }}
      />
      {/* Hide explore tab */}
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    height: 85,
    paddingTop: 8,
    paddingBottom: 24,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: -4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
