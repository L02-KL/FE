import React from 'react';
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

interface Review {
  id: string;
  patient: string;
  rating: number;
  comment: string;
  date: string;
}

const RatingScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const navItems = [
    { name: 'Home', icon: 'home-outline', activeIcon: 'home', route: 'DoctorDashboard' },
    { name: 'Chat', icon: 'chatbubbles-outline', activeIcon: 'chatbubbles', route: 'DoctorChatList' },
    { name: 'Calendar', icon: 'calendar-outline', activeIcon: 'calendar', route: 'DoctorCalendar' },
    { name: 'Profile', icon: 'person-outline', activeIcon: 'person', route: 'DoctorProfile' },
  ];

  // Mock reviews data
  const reviews: Review[] = [
    {
      id: '1',
      patient: 'Truc Quynh',
      rating: 5,
      comment: 'He is very dedicated and understands my problem. After the consultation sessions, I feel much more comfortable.',
      date: '2024-10-15',
    },
    {
      id: '2',
      patient: 'Thuy Vi',
      rating: 5,
      comment: "The doctor's methods are very useful. I have applied them and found them to be effective!",
      date: '2024-10-12',
    },
    {
      id: '3',
      patient: 'Minh Anh',
      rating: 5,
      comment: 'Professional and caring. The sessions helped me a lot with my anxiety issues.',
      date: '2024-10-10',
    },
    {
      id: '4',
      patient: 'Hoang Nam',
      rating: 4,
      comment: 'Good doctor, very patient and understanding. Would recommend to others.',
      date: '2024-10-08',
    },
    {
      id: '5',
      patient: 'Lan Phuong',
      rating: 5,
      comment: 'Excellent service! The doctor really listens and provides practical solutions.',
      date: '2024-10-05',
    },
    {
      id: '6',
      patient: 'Duc Thang',
      rating: 5,
      comment: 'Very helpful sessions. I feel much better now after following the advice.',
      date: '2024-10-03',
    },
  ];

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rating & Reviews</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Rating Summary */}
        <View style={styles.summarySection}>
          <View style={styles.ratingCircle}>
            <Text style={styles.ratingNumber}>{averageRating.toFixed(1)}</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Ionicons key={i} name="star" size={20} color={Colors.warning} />
              ))}
            </View>
            <Text style={styles.totalReviews}>{totalReviews} reviews</Text>
          </View>
        </View>

        {/* Reviews List */}
        <View style={styles.reviewsSection}>
          <Text style={styles.sectionTitle}>All Reviews</Text>
          {reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewAvatar}>
                  <Ionicons name="person" size={24} color={Colors.primary} />
                </View>
                <View style={styles.reviewInfo}>
                  <Text style={styles.reviewPatient}>{review.patient}</Text>
                  <Text style={styles.reviewDate}>{formatDate(review.date)}</Text>
                </View>
                <View style={styles.reviewStars}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Ionicons
                      key={i}
                      name={i <= review.rating ? 'star' : 'star-outline'}
                      size={16}
                      color={Colors.warning}
                    />
                  ))}
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
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
  summarySection: {
    padding: 16,
    alignItems: 'center',
  },
  ratingCircle: {
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    borderRadius: 20,
    padding: 24,
    width: '100%',
  },
  ratingNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  totalReviews: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  reviewsSection: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  reviewCard: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewPatient: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  reviewStars: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
});

export default RatingScreen;

