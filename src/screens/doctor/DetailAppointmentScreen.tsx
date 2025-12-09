import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { CustomButton } from '../../components/CustomButton';
import { AppointmentType } from '../../types';

const DetailAppointmentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedDate, setSelectedDate] = useState('2024-10-17');
  const [selectedTime, setSelectedTime] = useState('16:00');
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('in-person');

  const patientName = (route.params as any)?.patientName || 'Truc Quynh';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail appointment</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Patient Info */}
        <View style={styles.patientSection}>
          <View style={styles.patientAvatar}>
            <Ionicons name="person" size={24} color={Colors.primary} />
          </View>
          <Text style={styles.patientName}>{patientName}</Text>
        </View>

        {/* Calendar */}
        <View style={styles.section}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity>
              <Ionicons name="chevron-back" size={20} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.monthText}>October 2024</Text>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={20} color={Colors.text} />
            </TouchableOpacity>
          </View>
          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: Colors.blue,
                selectedTextColor: Colors.background,
              },
              '2024-10-17': {
                marked: true,
                dotColor: Colors.success,
                selected: true,
                selectedColor: Colors.success,
                selectedTextColor: Colors.background,
              },
              '2024-10-10': { disabled: true },
              '2024-10-11': { disabled: true },
              '2024-10-12': { disabled: true },
              '2024-10-18': { disabled: true },
              '2024-10-19': { disabled: true },
              '2024-10-24': { disabled: true },
              '2024-10-25': { disabled: true },
              '2024-10-26': { disabled: true },
              '2024-10-31': { disabled: true },
            }}
            theme={{
              todayTextColor: Colors.primary,
              arrowColor: Colors.primary,
              selectedDayBackgroundColor: Colors.success,
              selectedDayTextColor: Colors.background,
            }}
          />
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Time</Text>
          <View style={styles.timeInput}>
            <Text style={styles.timeText}>{selectedTime}</Text>
          </View>
        </View>

        {/* Appointment Type */}
        <View style={styles.section}>
          <Text style={styles.label}>Type of appointment</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[
                styles.typeOption,
                appointmentType === 'in-person' && styles.selectedTypeOption,
              ]}
              onPress={() => setAppointmentType('in-person')}
            >
              <View style={styles.radioButton}>
                {appointmentType === 'in-person' && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
              <Text
                style={[
                  styles.typeText,
                  appointmentType === 'in-person' && styles.selectedTypeText,
                ]}
              >
                In-person
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeOption,
                appointmentType === 'video-call' && styles.selectedTypeOption,
              ]}
              onPress={() => setAppointmentType('video-call')}
            >
              <View style={styles.radioButton}>
                {appointmentType === 'video-call' && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
              <Text
                style={[
                  styles.typeText,
                  appointmentType === 'video-call' && styles.selectedTypeText,
                ]}
              >
                Video call
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Location */}
        {appointmentType === 'in-person' && (
          <View style={styles.section}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.locationContainer}>
              <Text style={styles.locationText}>BK.b6</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <CustomButton
          title="Xác nhận lịch hẹn"
          onPress={() => {
            // TODO: Confirm appointment
            navigation.goBack();
          }}
        />
      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  patientSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  patientAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  timeInput: {
    backgroundColor: Colors.backgroundLight,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timeText: {
    fontSize: 16,
    color: Colors.text,
  },
  typeContainer: {
    flexDirection: 'row',
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.backgroundLight,
    marginRight: 12,
  },
  selectedTypeOption: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  typeText: {
    fontSize: 16,
    color: Colors.text,
  },
  selectedTypeText: {
    fontWeight: '600',
    color: Colors.primary,
  },
  locationContainer: {
    backgroundColor: Colors.backgroundLight,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  locationText: {
    fontSize: 16,
    color: Colors.text,
  },
  footer: {
    padding: 16,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
});

export default DetailAppointmentScreen;

