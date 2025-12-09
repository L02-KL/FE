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
import { Colors } from '../../constants/colors';

const MentalHealthTestScreen = () => {
  const navigation = useNavigation();
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  const tests = [
    {
      id: '1',
      title: 'Depression Screening (PHQ-9)',
      description: 'A 9-question screening tool to assess depression symptoms',
      duration: '5 min',
      icon: 'heart-outline',
    },
    {
      id: '2',
      title: 'Anxiety Screening (GAD-7)',
      description: 'A 7-question screening tool to assess anxiety symptoms',
      duration: '5 min',
      icon: 'flame-outline',
    },
    {
      id: '3',
      title: 'Stress Assessment',
      description: 'Evaluate your stress levels and coping strategies',
      duration: '10 min',
      icon: 'pulse-outline',
    },
    {
      id: '4',
      title: 'Sleep Quality Assessment',
      description: 'Assess your sleep patterns and quality',
      duration: '5 min',
      icon: 'moon-outline',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mental Health Test</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.introText}>
            Take professional mental health assessments designed for students. 
            These tests can help you understand your mental health better.
          </Text>

          {tests.map((test) => (
            <TouchableOpacity
              key={test.id}
              style={[
                styles.testCard,
                selectedTest === test.id && styles.selectedTestCard,
              ]}
              onPress={() => setSelectedTest(test.id)}
            >
              <View style={styles.testIcon}>
                <Ionicons name={test.icon as any} size={32} color={Colors.primary} />
              </View>
              <View style={styles.testContent}>
                <Text style={styles.testTitle}>{test.title}</Text>
                <Text style={styles.testDescription}>{test.description}</Text>
                <View style={styles.testFooter}>
                  <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
                  <Text style={styles.testDuration}>{test.duration}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          ))}

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={24} color={Colors.primary} />
            <Text style={styles.infoText}>
              These assessments are for screening purposes only and do not replace 
              professional diagnosis. Please consult with a mental health professional 
              for a comprehensive evaluation.
            </Text>
          </View>
        </View>
      </ScrollView>

      {selectedTest && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => {
              // TODO: Navigate to test questions
            }}
          >
            <Text style={styles.startButtonText}>Start Test</Text>
          </TouchableOpacity>
        </View>
      )}
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
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  placeholder: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  introText: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  testCard: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  selectedTestCard: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  testIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  testContent: {
    flex: 1,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  testDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  testFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testDuration: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: Colors.blueLight,
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    marginLeft: 12,
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  startButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.background,
  },
});

export default MentalHealthTestScreen;

