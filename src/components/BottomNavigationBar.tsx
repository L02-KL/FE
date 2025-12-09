import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface NavItem {
  name: string;
  icon: string;
  route: string;
  activeIcon?: string;
}

interface BottomNavigationBarProps {
  items: NavItem[];
  activeColor?: string;
  inactiveColor?: string;
}

const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
  items,
  activeColor = Colors.success,
  inactiveColor = Colors.textSecondary,
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const isActive = (routeName: string) => {
    return route.name === routeName;
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {items.map((item) => {
        const active = isActive(item.route);
        const iconName = active && item.activeIcon ? item.activeIcon : item.icon;
        
        return (
          <TouchableOpacity
            key={item.route}
            style={styles.navItem}
            onPress={() => navigation.navigate(item.route as never)}
          >
            <Ionicons
              name={iconName as any}
              size={24}
              color={active ? activeColor : inactiveColor}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: Colors.lightGreen,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navItem: {
    padding: 8,
  },
});

export default BottomNavigationBar;

