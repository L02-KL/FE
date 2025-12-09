import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { CustomButton } from '../../components/CustomButton';
import { mockDoctors } from '../../constants/data';
import { AppointmentType } from '../../types';
import { db } from '../../config/firebase';

const AppointmentScreen = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('in-person');
  const [loading, setLoading] = useState(false);

  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !selectedDoctor) {
      Alert.alert('Thiếu thông tin', 'Vui lòng chọn đầy đủ: bác sĩ, ngày và giờ');
      return;
    }

    setLoading(true);
    try {
      const appointment = {
        doctorId: selectedDoctor,
        patientId: 'user1', // TODO: Get from auth context
        date: selectedDate,
        time: selectedTime,
        type: appointmentType,
        location: appointmentType === 'in-person' ? 'BK.D6' : undefined,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      await db.collection('appointments').add(appointment);

      Alert.alert(
        'Thành công',
        'Lịch hẹn của bạn đã được gửi. Chúng tôi sẽ xác nhận sớm nhất có thể.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error booking appointment:', error);
      Alert.alert('Lỗi', 'Không thể đặt lịch. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const doctor = mockDoctors.find((d) => d.id === selectedDoctor);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đặt lịch hẹn</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Doctor Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn bác sĩ</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {mockDoctors.map((doc) => (
              <TouchableOpacity
                key={doc.id}
                style={[
                  styles.doctorCard,
                  selectedDoctor === doc.id && styles.selectedDoctorCard,
                ]}
                onPress={() => setSelectedDoctor(doc.id)}
              >
                <View style={styles.doctorAvatarContainer}>
                  <Ionicons name="person" size={32} color={Colors.primary} />
                </View>
                <Text style={styles.doctorName}>{doc.name}</Text>
                <Text style={styles.doctorSpecialty}>{doc.specialization}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={12} color={Colors.warning} />
                  <Text style={styles.rating}>{doc.rating}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Calendar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn ngày</Text>
          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: Colors.success,
                selectedTextColor: Colors.background,
              },
            }}
            theme={{
              todayTextColor: Colors.primary,
              arrowColor: Colors.primary,
              selectedDayBackgroundColor: Colors.success,
              selectedDayTextColor: Colors.background,
            }}
            minDate={new Date().toISOString().split('T')[0]}
          />
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn giờ</Text>
          <View style={styles.timeGrid}>
            {timeSlots.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.selectedTimeSlot,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text
                  style={[
                    styles.timeText,
                    selectedTime === time && styles.selectedTimeText,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Appointment Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loại cuộc hẹn</Text>
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
                Trực tiếp
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
          {appointmentType === 'in-person' && (
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={20} color={Colors.primary} />
              <Text style={styles.locationText}>Địa điểm: BK.D6</Text>
            </View>
          )}
        </View>

        {/* Summary */}
        {selectedDate && selectedTime && selectedDoctor && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Tóm tắt</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Bác sĩ:</Text>
              <Text style={styles.summaryValue}>{doctor?.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Ngày:</Text>
              <Text style={styles.summaryValue}>
                {new Date(selectedDate).toLocaleDateString('vi-VN')}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Giờ:</Text>
              <Text style={styles.summaryValue}>{selectedTime}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Loại:</Text>
              <Text style={styles.summaryValue}>
                {appointmentType === 'in-person' ? 'Trực tiếp' : 'Video call'}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <CustomButton
          title="Đặt lịch hẹn"
          onPress={handleBookAppointment}
          disabled={!selectedDate || !selectedTime || !selectedDoctor}
          loading={loading}
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
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  doctorCard: {
    width: 140,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
  },
  selectedDoctorCard: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  doctorAvatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  doctorName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  doctorSpecialty: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: Colors.text,
    marginLeft: 4,
    fontWeight: '600',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlot: {
    width: '22%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedTimeSlot: {
    backgroundColor: Colors.success,
  },
  timeText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  selectedTimeText: {
    color: Colors.background,
  },
  typeContainer: {
    flexDirection: 'row',
    marginBottom: 12,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 12,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
  },
  locationText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
  },
  summaryCard: {
    margin: 16,
    padding: 16,
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
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

export default AppointmentScreen;

