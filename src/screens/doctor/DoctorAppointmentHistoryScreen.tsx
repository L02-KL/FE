import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import BottomNavigationBar from '../../components/BottomNavigationBar';

interface Appointment {
  id: string;
  patient: string;
  date: string;
  time: string;
  type: 'in-person' | 'video-call';
  status: 'confirmed' | 'completed' | 'cancelled';
  duration: string;
}

const DoctorAppointmentHistoryScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'confirmed' | 'completed' | 'cancelled'>('all');

  const navItems = [
    { name: 'Home', icon: 'home-outline', activeIcon: 'home', route: 'DoctorDashboard' },
    { name: 'Chat', icon: 'chatbubbles-outline', activeIcon: 'chatbubbles', route: 'DoctorChatList' },
    { name: 'Calendar', icon: 'calendar-outline', activeIcon: 'calendar', route: 'DoctorCalendar' },
    { name: 'Profile', icon: 'person-outline', activeIcon: 'person', route: 'DoctorProfile' },
  ];

  // Mock appointments
  const appointments: Appointment[] = [
    {
      id: '1',
      patient: 'Truc Quynh',
      date: '2024-10-15',
      time: '09:00',
      type: 'in-person',
      status: 'completed',
      duration: '60 minutes',
    },
    {
      id: '2',
      patient: 'Thuy Vi',
      date: '2024-10-12',
      time: '14:00',
      type: 'in-person',
      status: 'completed',
      duration: '45 minutes',
    },
    {
      id: '3',
      patient: 'Minh Anh',
      date: '2024-10-20',
      time: '10:00',
      type: 'video-call',
      status: 'confirmed',
      duration: '60 minutes',
    },
    {
      id: '4',
      patient: 'Hoang Nam',
      date: '2024-10-08',
      time: '16:00',
      type: 'in-person',
      status: 'cancelled',
      duration: '30 minutes',
    },
    {
      id: '5',
      patient: 'Lan Phuong',
      date: '2024-10-05',
      time: '11:00',
      type: 'video-call',
      status: 'completed',
      duration: '45 minutes',
    },
  ];

  const filteredAppointments = appointments.filter((apt) => {
    if (selectedFilter === 'all') return true;
    return apt.status === selectedFilter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return Colors.warning;
      case 'completed':
        return Colors.success;
      case 'cancelled':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appointment History</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Filter Buttons */}
        <View style={styles.filterSection}>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text style={[styles.filterText, selectedFilter === 'all' && styles.filterTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'confirmed' && styles.filterButtonActive]}
            onPress={() => setSelectedFilter('confirmed')}
          >
            <Text style={[styles.filterText, selectedFilter === 'confirmed' && styles.filterTextActive]}>
              Confirmed
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'completed' && styles.filterButtonActive]}
            onPress={() => setSelectedFilter('completed')}
          >
            <Text style={[styles.filterText, selectedFilter === 'completed' && styles.filterTextActive]}>
              Completed
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'cancelled' && styles.filterButtonActive]}
            onPress={() => setSelectedFilter('cancelled')}
          >
            <Text style={[styles.filterText, selectedFilter === 'cancelled' && styles.filterTextActive]}>
              Cancelled
            </Text>
          </TouchableOpacity>
        </View>

        {/* Appointments List */}
        <View style={styles.appointmentsSection}>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <TouchableOpacity
                key={appointment.id}
                style={styles.appointmentCard}
                onPress={() => {
                  // Navigate to appointment detail if needed
                }}
                activeOpacity={0.7}
              >
                <View style={styles.appointmentHeader}>
                  <View style={styles.patientAvatar}>
                    <Ionicons name="person" size={24} color={Colors.primary} />
                  </View>
                  <View style={styles.appointmentInfo}>
                    <Text style={styles.patientName}>{appointment.patient}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) + '20' }]}>
                      <View style={[styles.statusDot, { backgroundColor: getStatusColor(appointment.status) }]} />
                      <Text style={[styles.statusText, { color: getStatusColor(appointment.status) }]}>
                        {getStatusText(appointment.status)}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.appointmentDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} />
                    <Text style={styles.detailText}>{formatDate(appointment.date)}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
                    <Text style={styles.detailText}>{appointment.time}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons
                      name={appointment.type === 'video-call' ? 'videocam-outline' : 'location-outline'}
                      size={16}
                      color={Colors.textSecondary}
                    />
                    <Text style={styles.detailText}>
                      {appointment.type === 'video-call' ? 'Video call' : 'In-person'}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="hourglass-outline" size={16} color={Colors.textSecondary} />
                    <Text style={styles.detailText}>{appointment.duration}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={64} color={Colors.textSecondary} />
              <Text style={styles.emptyStateText}>No appointments found</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigationBar items={navItems} activeColor={Colors.success} />
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
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  filterSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: Colors.primaryLight,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.primary,
  },
  appointmentsSection: {
    padding: 16,
    paddingTop: 0,
  },
  appointmentCard: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  appointmentHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  patientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  appointmentInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  appointmentDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
  },
});

export default DoctorAppointmentHistoryScreen;

