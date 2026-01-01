import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

// ============================================
// Theme Types
// ============================================

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeColors {
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Secondary/Accent
  accent: string;
  accentLight: string;
  
  // Priority colors
  priorityHigh: string;
  priorityHighBg: string;
  priorityMedium: string;
  priorityMediumBg: string;
  priorityLow: string;
  priorityLowBg: string;
  
  // Subject/Category colors
  math: string;
  mathBg: string;
  chemistry: string;
  chemistryBg: string;
  physics: string;
  physicsBg: string;
  literature: string;
  literatureBg: string;
  
  // Neutral colors
  white: string;
  black: string;
  background: string;
  cardBackground: string;
  border: string;
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textLight: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Tab bar
  tabBarBackground: string;
  tabBarActive: string;
  tabBarInactive: string;
  
  // Additional dark mode specific
  surfaceElevated: string;
  overlay: string;
}

// ============================================
// Light Theme Colors
// ============================================

export const lightColors: ThemeColors = {
  // Primary colors
  primary: '#4A90E2',
  primaryLight: '#E6F4FE',
  primaryDark: '#2E6BB3',
  
  // Secondary/Accent
  accent: '#FFA500',
  accentLight: '#FFF3E0',
  
  // Priority colors
  priorityHigh: '#FF4444',
  priorityHighBg: '#FFEBEE',
  priorityMedium: '#FFB74D',
  priorityMediumBg: '#FFF8E1',
  priorityLow: '#4CAF50',
  priorityLowBg: '#E8F5E9',
  
  // Subject/Category colors
  math: '#FF6B6B',
  mathBg: '#FFE5E5',
  chemistry: '#FFB74D',
  chemistryBg: '#FFF3E0',
  physics: '#4FC3F7',
  physicsBg: '#E1F5FE',
  literature: '#AB47BC',
  literatureBg: '#F3E5F5',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  background: '#F5F7FA',
  cardBackground: '#FFFFFF',
  border: '#E8E8E8',
  
  // Text colors
  textPrimary: '#1A1A1A',
  textSecondary: '#666666',
  textMuted: '#999999',
  textLight: '#CCCCCC',
  
  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Tab bar
  tabBarBackground: '#FFFFFF',
  tabBarActive: '#4A90E2',
  tabBarInactive: '#999999',
  
  // Additional
  surfaceElevated: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

// ============================================
// Dark Theme Colors
// ============================================

export const darkColors: ThemeColors = {
  // Primary colors
  primary: '#5A9FEF',
  primaryLight: '#1E3A5F',
  primaryDark: '#7BB5F5',
  
  // Secondary/Accent
  accent: '#FFB74D',
  accentLight: '#3D2E1A',
  
  // Priority colors
  priorityHigh: '#FF6B6B',
  priorityHighBg: '#3D1A1A',
  priorityMedium: '#FFCC80',
  priorityMediumBg: '#3D331A',
  priorityLow: '#81C784',
  priorityLowBg: '#1A3D1A',
  
  // Subject/Category colors
  math: '#FF8A8A',
  mathBg: '#3D1A1A',
  chemistry: '#FFCC80',
  chemistryBg: '#3D331A',
  physics: '#81D4FA',
  physicsBg: '#1A2E3D',
  literature: '#CE93D8',
  literatureBg: '#2E1A3D',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  background: '#121212',
  cardBackground: '#1E1E1E',
  border: '#2D2D2D',
  
  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textMuted: '#808080',
  textLight: '#4D4D4D',
  
  // Status colors
  success: '#81C784',
  warning: '#FFB74D',
  error: '#FF8A80',
  info: '#64B5F6',
  
  // Tab bar
  tabBarBackground: '#1E1E1E',
  tabBarActive: '#5A9FEF',
  tabBarInactive: '#808080',
  
  // Additional
  surfaceElevated: '#2D2D2D',
  overlay: 'rgba(0, 0, 0, 0.7)',
};

// ============================================
// Theme Context
// ============================================

interface ThemeContextType {
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  colors: ThemeColors;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@theme_mode';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useSystemColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeModeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, []);

  // Save theme preference
  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  // Resolve actual theme based on mode and system preference
  const resolvedTheme: ResolvedTheme = 
    themeMode === 'system' 
      ? (systemColorScheme === 'dark' ? 'dark' : 'light')
      : themeMode;

  const isDark = resolvedTheme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setThemeMode(newMode);
  };

  // Don't render until theme is loaded to prevent flash
  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        resolvedTheme,
        colors,
        isDark,
        setThemeMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// ============================================
// Hook to use theme
// ============================================

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Export default colors for backward compatibility
export default lightColors;
