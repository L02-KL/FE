import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface Notification {
  id: string;
  type: 'appointment' | 'message';
  title: string;
  read: boolean;
}

const NotificationScreen = () => {
  const navigation = useNavigation();
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'appointment',
      title: 'A new appointment is proposed',
      read: false,
    },
    {
      id: '2',
      type: 'appointment',
      title: 'A new appointment is proposed',
      read: false,
    },
    {
      id: '3',
      type: 'message',
      title: 'A new unread message',
      read: false,
    },
    {
      id: '4',
      type: 'appointment',
      title: 'A new appointment is proposed',
      read: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return 'calendar-outline';
      case 'message':
        return 'chatbubbles-outline';
      default:
        return 'notifications-outline';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
        <TouchableOpacity style={styles.bellContainer}>
          <Ionicons name="notifications" size={24} color={Colors.text} />
          {unreadCount > 0 && <View style={styles.badge} />}
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.notificationCard,
              !notification.read && styles.unreadCard,
            ]}
            activeOpacity={0.7}
          >
            <View style={styles.notificationContent}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name={getIcon(notification.type) as any}
                  size={24}
                  color={Colors.primary}
                />
              </View>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    backgroundColor: Colors.blueLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  bellContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
  },
  unreadCard: {
    backgroundColor: Colors.backgroundLight,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationTitle: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
});

export default NotificationScreen;
