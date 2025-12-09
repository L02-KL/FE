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

interface Patient {
  id: string;
  name: string;
  status: string;
  firstVisit: string;
  lastVisit: string;
  totalSessions: number;
  tags: string[];
}

const PatientStatsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'completed'>('all');

  const navItems = [
    { name: 'Home', icon: 'home-outline', activeIcon: 'home', route: 'DoctorDashboard' },
    { name: 'Chat', icon: 'chatbubbles-outline', activeIcon: 'chatbubbles', route: 'DoctorChatList' },
    { name: 'Calendar', icon: 'calendar-outline', activeIcon: 'calendar', route: 'DoctorCalendar' },
    { name: 'Profile', icon: 'person-outline', activeIcon: 'person', route: 'DoctorProfile' },
  ];

  // Mock patients data
  const allPatients: Patient[] = [
    {
      id: '1',
      name: 'Truc Quynh',
      status: 'active',
      firstVisit: '2024-01-15',
      lastVisit: '2024-10-15',
      totalSessions: 24,
      tags: ['Anxiety'],
    },
    {
      id: '2',
      name: 'Thuy Vi',
      status: 'active',
      firstVisit: '2024-02-20',
      lastVisit: '2024-10-12',
      totalSessions: 18,
      tags: ['Pressure'],
    },
    {
      id: '3',
      name: 'Minh Anh',
      status: 'active',
      firstVisit: '2024-03-10',
      lastVisit: '2024-10-10',
      totalSessions: 15,
      tags: ['Anxiety', 'Stress'],
    },
    {
      id: '4',
      name: 'Hoang Nam',
      status: 'completed',
      firstVisit: '2023-11-05',
      lastVisit: '2024-09-20',
      totalSessions: 32,
      tags: ['Depression'],
    },
    {
      id: '5',
      name: 'Lan Phuong',
      status: 'active',
      firstVisit: '2024-04-12',
      lastVisit: '2024-10-05',
      totalSessions: 12,
      tags: ['Stress'],
    },
    {
      id: '6',
      name: 'Duc Thang',
      status: 'completed',
      firstVisit: '2023-12-18',
      lastVisit: '2024-08-30',
      totalSessions: 28,
      tags: ['Anxiety', 'Pressure'],
    },
  ];

  const filteredPatients = allPatients.filter((patient) => {
    if (selectedFilter === 'all') return true;
    return patient.status === selectedFilter;
  });

  const totalPatients = allPatients.length;
  const activePatients = allPatients.filter((p) => p.status === 'active').length;
  const completedPatients = allPatients.filter((p) => p.status === 'completed').length;
  const totalSessions = allPatients.reduce((sum, p) => sum + p.totalSessions, 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getTagColor = (tag: string) => {
    const tagColors: { [key: string]: string } = {
      'Anxiety': Colors.blue,
      'Pressure': Colors.purple,
      'Stress': Colors.success,
      'Depression': Colors.error,
    };
    return tagColors[tag] || Colors.primary;
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? Colors.success : Colors.textSecondary;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patient Statistics</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Statistics Cards */}
        <View style={styles.statsSection}>
          <View style={[styles.statCard, { backgroundColor: Colors.purpleLight }]}>
            <Ionicons name="people" size={32} color={Colors.purple} />
            <Text style={styles.statNumber}>{totalPatients}</Text>
            <Text style={styles.statLabel}>Total Patients</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: Colors.greenLight }]}>
            <Ionicons name="checkmark-circle" size={32} color={Colors.success} />
            <Text style={styles.statNumber}>{activePatients}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: Colors.blueLight }]}>
            <Ionicons name="checkmark-done-circle" size={32} color={Colors.blue} />
            <Text style={styles.statNumber}>{completedPatients}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: Colors.orangeLight }]}>
            <Ionicons name="calendar" size={32} color={Colors.orange} />
            <Text style={styles.statNumber}>{totalSessions}</Text>
            <Text style={styles.statLabel}>Total Sessions</Text>
          </View>
        </View>

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
            style={[styles.filterButton, selectedFilter === 'active' && styles.filterButtonActive]}
            onPress={() => setSelectedFilter('active')}
          >
            <Text style={[styles.filterText, selectedFilter === 'active' && styles.filterTextActive]}>
              Active
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
        </View>

        {/* Patients List */}
        <View style={styles.patientsSection}>
          <Text style={styles.sectionTitle}>
            {selectedFilter === 'all' ? 'All Patients' : selectedFilter === 'active' ? 'Active Patients' : 'Completed Patients'}
          </Text>
          {filteredPatients.map((patient) => (
            <TouchableOpacity
              key={patient.id}
              style={styles.patientCard}
              onPress={() => {
                // Navigate to patient detail if needed
              }}
              activeOpacity={0.7}
            >
              <View style={styles.patientHeader}>
                <View style={styles.patientAvatar}>
                  <Ionicons name="person" size={24} color={Colors.primary} />
                </View>
                <View style={styles.patientInfo}>
                  <View style={styles.patientNameRow}>
                    <Text style={styles.patientName}>{patient.name}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(patient.status) + '20' }]}>
                      <View style={[styles.statusDot, { backgroundColor: getStatusColor(patient.status) }]} />
                      <Text style={[styles.statusText, { color: getStatusColor(patient.status) }]}>
                        {patient.status === 'active' ? 'Active' : 'Completed'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.patientTags}>
                    {patient.tags.map((tag, index) => (
                      <View key={index} style={[styles.tag, { backgroundColor: getTagColor(tag) }]}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
              <View style={styles.patientStats}>
                <View style={styles.statItem}>
                  <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} />
                  <Text style={styles.statItemText}>First: {formatDate(patient.firstVisit)}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="calendar" size={16} color={Colors.textSecondary} />
                  <Text style={styles.statItemText}>Last: {formatDate(patient.lastVisit)}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
                  <Text style={styles.statItemText}>{patient.totalSessions} sessions</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  statsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
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
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: Colors.primaryLight,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.primary,
  },
  patientsSection: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  patientCard: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  patientHeader: {
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
  patientInfo: {
    flex: 1,
  },
  patientNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
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
  patientTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.background,
  },
  patientStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statItemText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});

export default PatientStatsScreen;

