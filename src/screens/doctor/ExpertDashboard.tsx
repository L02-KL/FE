import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

interface Patient {
  id: string;
  name: string;
  tag: string;
  tagColor: string;
  backgroundColor: string;
}

const ExpertDashboard = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const patients: Patient[] = [
    {
      id: '1',
      name: 'Truc Quynh',
      tag: 'Academy',
      tagColor: Colors.blue,
      backgroundColor: Colors.blueLight,
    },
    {
      id: '2',
      name: 'Thuy Vi',
      tag: 'Premium',
      tagColor: Colors.purple,
      backgroundColor: Colors.purpleLight,
    },
    {
      id: '3',
      name: 'Anonymous Chat',
      tag: 'Mo moi',
      tagColor: Colors.success,
      backgroundColor: Colors.greenLight,
    },
  ];

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePatientPress = (patientId: string) => {
    if (patientId === '3') {
      navigation.navigate('DoctorChat' as never, {
        chatId: 'anonymous-chat-1',
        doctorId: '1',
        doctorName: 'Hoang Le Hai Thanh',
        doctorAvatar: undefined,
        isAnonymous: true,
      } as any);
    } else {
      navigation.navigate('DetailAppointment' as never, { patientId } as never);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBar}>
          <View style={styles.profileIcon}>
            <Ionicons name="person" size={20} color={Colors.primary} />
          </View>
          <Text style={styles.headerTitle}>BKMindCare Expert Dashboard</Text>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="people" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patients..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Patient List */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {filteredPatients.map((patient) => (
          <TouchableOpacity
            key={patient.id}
            style={[styles.patientCard, { backgroundColor: patient.backgroundColor }]}
            onPress={() => handlePatientPress(patient.id)}
            activeOpacity={0.7}
          >
            <View style={styles.patientContent}>
              <View style={styles.patientAvatar}>
                {patient.id === '3' ? (
                  <Ionicons name="person" size={24} color={Colors.textSecondary} />
                ) : (
                  <Ionicons name="person" size={24} color={Colors.primary} />
                )}
              </View>
              <View style={styles.patientInfo}>
                <Text style={styles.patientName}>{patient.name}</Text>
                {patient.id !== '3' && (
                  <View style={[styles.tag, { backgroundColor: patient.tagColor }]}>
                    <Text style={styles.tagText}>{patient.tag}</Text>
                  </View>
                )}
                {patient.id === '3' && (
                  <View style={styles.anonymousTags}>
                    <View style={[styles.tag, { backgroundColor: Colors.success }]}>
                      <Text style={styles.tagText}>Mo moi</Text>
                    </View>
                    <View style={[styles.tag, { backgroundColor: Colors.pink }]}>
                      <Text style={styles.tagText}>Anonymous Chat</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
            <TouchableOpacity style={styles.arrowButton}>
              <Ionicons name="chevron-forward" size={20} color={Colors.text} />
            </TouchableOpacity>
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
    padding: 16,
    paddingTop: 50,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    padding: 12,
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
  },
  patientContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  patientAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.background,
  },
  anonymousTags: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ExpertDashboard;
