import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { mockAppointments, mockDoctors } from '../../constants/data';
import { Appointment } from '../../types';
import BottomNavigationBar from '../../components/BottomNavigationBar';

const AppointmentDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const appointmentId = (route.params as any)?.appointmentId as string;
  
  const appointment = mockAppointments.find((apt) => apt.id === appointmentId) || mockAppointments[0];
  const doctor = mockDoctors.find((doc) => doc.id === appointment.doctorId) || mockDoctors[0];

  const navItems = [
    { name: 'Home', icon: 'home-outline', activeIcon: 'home', route: 'UserDashboard' },
    { name: 'Chat', icon: 'chatbubbles-outline', activeIcon: 'chatbubbles', route: 'ChatList' },
    { name: 'Calendar', icon: 'calendar-outline', activeIcon: 'calendar', route: 'Calendar' },
    { name: 'Profile', icon: 'person-outline', activeIcon: 'person', route: 'Profile' },
  ];

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return Colors.success;
      case 'pending':
        return Colors.warning;
      case 'completed':
        return Colors.primary;
      case 'cancelled':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Đang chờ';
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const handleCancel = () => {
    // TODO: Implement cancel appointment
    navigation.goBack();
  };

  const handleReschedule = () => {
    navigation.navigate('Appointment' as never, { appointmentId: appointment.id } as any);
  };

  const handleJoinCall = () => {
    // TODO: Implement join video call
    console.log('Join video call');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết cuộc hẹn</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Badge */}
        <View style={styles.statusSection}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) + '20' }]}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(appointment.status) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(appointment.status) }]}>
              {getStatusText(appointment.status)}
            </Text>
          </View>
        </View>

        {/* Doctor Info */}
        <View style={styles.doctorSection}>
          <View style={styles.doctorAvatarContainer}>
            {doctor.avatar ? (
              <Image
                source={{ uri: doctor.avatar }}
                style={styles.doctorAvatar}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.doctorAvatarPlaceholder}>
                <Ionicons name="person" size={40} color={Colors.primary} />
              </View>
            )}
          </View>
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{appointment.doctorName}</Text>
            <Text style={styles.doctorSpecialization}>{doctor.specialization}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={Colors.warning} />
              <Text style={styles.rating}>{doctor.rating}</Text>
            </View>
          </View>
        </View>

        {/* Appointment Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Thông tin cuộc hẹn</Text>

          {/* Date */}
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Ngày</Text>
              <Text style={styles.detailValue}>{appointment.date}</Text>
            </View>
          </View>

          {/* Time */}
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons name="time-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Giờ</Text>
              <Text style={styles.detailValue}>{appointment.time}</Text>
            </View>
          </View>

          {/* Duration */}
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons name="hourglass-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Thời lượng</Text>
              <Text style={styles.detailValue}>60 phút</Text>
            </View>
          </View>

          {/* Type */}
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons
                name={appointment.type === 'video-call' ? 'videocam-outline' : 'location-outline'}
                size={20}
                color={Colors.primary}
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Loại cuộc hẹn</Text>
              <Text style={styles.detailValue}>
                {appointment.type === 'video-call' ? 'Video call' : 'Trực tiếp'}
              </Text>
            </View>
          </View>

          {/* Location (if in-person) */}
          {appointment.type === 'in-person' && appointment.location && (
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Ionicons name="location-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Địa điểm</Text>
                <Text style={styles.detailValue}>{appointment.location}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Session Details */}
        <View style={styles.sessionSection}>
          <Text style={styles.sectionTitle}>Chi tiết phiên tư vấn</Text>
          <View style={styles.sessionCard}>
            <Text style={styles.sessionText}>Session detail chat</Text>
            <Text style={styles.sessionDescription}>
              Cuộc tư vấn tâm lý về các vấn đề học tập và cuộc sống. 
              Bạn có thể chia sẻ bất kỳ điều gì bạn đang gặp phải.
            </Text>
          </View>
        </View>

        {/* Actions */}
        {appointment.status === 'confirmed' && (
          <View style={styles.actionsSection}>
            {appointment.type === 'video-call' && (
              <TouchableOpacity
                style={[styles.actionButton, styles.joinButton]}
                onPress={handleJoinCall}
              >
                <Ionicons name="videocam" size={20} color={Colors.background} />
                <Text style={styles.joinButtonText}>Tham gia cuộc gọi</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.actionButton, styles.rescheduleButton]}
              onPress={handleReschedule}
            >
              <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
              <Text style={styles.rescheduleButtonText}>Đổi lịch</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Ionicons name="close-circle-outline" size={20} color={Colors.error} />
              <Text style={styles.cancelButtonText}>Hủy cuộc hẹn</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigationBar items={navItems} />
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
  statusSection: {
    padding: 16,
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  doctorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.backgroundLight,
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  doctorAvatarContainer: {
    marginRight: 16,
  },
  doctorAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  doctorAvatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  doctorSpecialization: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 4,
  },
  detailsSection: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  sessionSection: {
    padding: 16,
    paddingTop: 0,
  },
  sessionCard: {
    backgroundColor: Colors.backgroundLight,
    padding: 16,
    borderRadius: 12,
  },
  sessionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  sessionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  actionsSection: {
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  joinButton: {
    backgroundColor: Colors.primary,
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.background,
  },
  rescheduleButton: {
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  rescheduleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  cancelButton: {
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
  },
});

export default AppointmentDetailScreen;

