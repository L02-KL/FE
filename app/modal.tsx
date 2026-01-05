import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/contexts/ThemeContext';
import { useCourses, useTaskMutations } from '@/hooks/useApi';
import { Priority, TaskStatus } from '@/types';

export default function AddTaskModal() {
  const router = useRouter();
  const { colors } = useTheme();
  const { data: coursesData } = useCourses();
  const { createTask, loading } = useTaskMutations();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [dueTime, setDueTime] = useState<Date | null>(null);
  const [enableReminder, setEnableReminder] = useState(false);
  const [reminderOffset, setReminderOffset] = useState(60); // Default 60 mins (1 hour)

  // Picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCoursePicker, setShowCoursePicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false); // New Picker

  const courses = coursesData?.items || [];

  // Reminder Options
  const reminderOptions = [
    { key: 15, label: '15 minutes before', icon: '⚡' },
    { key: 60, label: '1 hour before', icon: '⏰' },
    { key: 1440, label: '1 day before', icon: '📅' },
  ];
  const selectedReminder = reminderOptions.find(r => r.key === reminderOffset);

  const priorities: { key: Priority; label: string; color: string; icon: string }[] = [
    { key: 'high', label: 'High', color: colors.priorityHigh, icon: '🔴' },
    { key: 'medium', label: 'Medium', color: colors.priorityMedium, icon: '🟡' },
    { key: 'low', label: 'Low', color: colors.priorityLow, icon: '🟢' },
  ];

  const statuses: { key: TaskStatus; label: string; icon: string }[] = [
    { key: 'pending', label: 'Pending', icon: '📝' },
    { key: 'in-progress', label: 'In Progress', icon: '🔄' },
    { key: 'completed', label: 'Completed', icon: '✅' },
  ];

  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  const selectedPriority = priorities.find(p => p.key === priority);
  const selectedStatus = statuses.find(s => s.key === status);

  const formatDate = (date: Date | null) => {
    if (!date) return 'dd/mm/yyyy';
    return date.toLocaleDateString('en-GB');
  };

  const formatTime = (time: Date | null) => {
    if (!time) return '--:--';
    return time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // On iOS, we don't close immediately. On Android, the picker closes itself.
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (selectedTime) {
      setDueTime(selectedTime);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const scheduleLocalNotification = async (taskId: string, taskTitle: string, due: Date) => {
    if (!enableReminder) return;

    const triggerDate = new Date(due.getTime() - reminderOffset * 60 * 1000);
    const seconds = Math.floor((triggerDate.getTime() - Date.now()) / 1000);

    // Don't schedule if time has passed
    if (seconds <= 0) {
      console.log('❌ Reminder time passed. Trigger:', triggerDate.toLocaleTimeString(), 'Now:', new Date().toLocaleTimeString());
      Alert.alert(
        'Reminder Skipped',
        'The reminder time you selected has already passed, so no notification will be sent.\n\nTip: Choose a later deadline or a shorter reminder time.'
      );
      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "⏰ Task Reminder",
          body: `"${taskTitle}" is due in ${selectedReminder?.label.replace(' before', '')}!`,
          data: { taskId },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: seconds,
          repeats: false,
        },
      });
      console.log('Notification scheduled for:', triggerDate);
    } catch (error) {
      console.error('Failed to schedule notification:', error);
    }
  };

  const handleCreateTask = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }
    if (!selectedCourseId) {
      Alert.alert('Error', 'Please select a course');
      return;
    }
    if (!dueDate) {
      Alert.alert('Error', 'Please select a due date');
      return;
    }

    // Combine Date and Time
    const finalDueDate = new Date(dueDate);
    console.log('🔹 [Debug] Initial dueDate:', dueDate?.toISOString());
    console.log('🔹 [Debug] dueTime state:', dueTime);

    if (dueTime) {
      finalDueDate.setHours(dueTime.getHours(), dueTime.getMinutes(), 0, 0);
    } else {
      console.log('🔹 [Debug] No dueTime set, defaulting to 23:59');
      finalDueDate.setHours(23, 59, 0, 0); // Default end of day
    }
    console.log('🔹 [Debug] finalDueDate calculated:', finalDueDate.toISOString());

    const task = await createTask({
      title: title.trim(),
      description: description.trim(),
      courseId: selectedCourseId,
      priority,
      dueDate: finalDueDate.toISOString(), // Use combined date
      dueTime: dueTime ? formatTime(dueTime) : '23:59',
      category: 'other',
    });

    if (task) {
      // Schedule Notification Locally
      if (enableReminder) {
        await scheduleLocalNotification(task.id, task.title, finalDueDate);
      }
      router.back();
    }
  };

  const handleCreateNewCourse = () => {
    Alert.alert('Coming Soon', 'Create new course feature coming soon!');
  };

  // Picker Modal Component
  const PickerModal = ({
    visible,
    onClose,
    title: modalTitle,
    options,
    selectedValue,
    onSelect,
    renderOption,
  }: {
    visible: boolean;
    onClose: () => void;
    title: string;
    options: any[];
    selectedValue: any;
    onSelect: (value: any) => void;
    renderOption: (option: any, isSelected: boolean) => React.ReactNode;
  }) => (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[styles.pickerModal, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.pickerTitle, { color: colors.textPrimary }]}>{modalTitle}</Text>
          {options.map((option) => (
            <TouchableOpacity
              key={option.key || option.id}
              style={[
                styles.pickerOption,
                { borderBottomColor: colors.border },
                (option.key || option.id) === selectedValue && { backgroundColor: colors.primaryLight },
              ]}
              onPress={() => {
                onSelect(option.key || option.id);
                onClose();
              }}
            >
              {renderOption(option, (option.key || option.id) === selectedValue)}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header Card */}
          <View style={[styles.headerCard, { backgroundColor: colors.cardBackground }]}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={20} color={colors.textSecondary} />
              <Text style={[styles.backText, { color: colors.textSecondary }]}>Back</Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Add New Task</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Create a new assignment ✏️
            </Text>
          </View>

          {/* Task Details Section */}
          <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📝</Text>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Task Details</Text>
            </View>

            {/* Task Title */}
            <Text style={[styles.label, { color: colors.textPrimary }]}>
              Task Title <Text style={{ color: colors.error }}>*</Text>
            </Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.textPrimary }]}
                placeholder="e.g., Math Assignment 2"
                placeholderTextColor={colors.textMuted}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Course Selector */}
            <Text style={[styles.label, { color: colors.textPrimary }]}>
              Course <Text style={{ color: colors.error }}>*</Text>
            </Text>
            <TouchableOpacity
              style={[styles.selectWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}
              onPress={() => setShowCoursePicker(true)}
            >
              <Text style={[
                styles.selectText,
                { color: selectedCourse ? colors.textPrimary : colors.textMuted }
              ]}>
                {selectedCourse?.name || 'Select a course'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
            </TouchableOpacity>

            {/* Create New Course Button */}
            <TouchableOpacity style={styles.createCourseButton} onPress={handleCreateNewCourse}>
              <Ionicons name="add" size={20} color={colors.primary} />
              <Text style={[styles.createCourseText, { color: colors.primary }]}>Create new course</Text>
            </TouchableOpacity>

            {/* Description */}
            <Text style={[styles.label, { color: colors.textPrimary }]}>Description</Text>
            <View style={[styles.textAreaWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <TextInput
                style={[styles.textArea, { color: colors.textPrimary }]}
                placeholder="Add notes or instructions..."
                placeholderTextColor={colors.textMuted}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Deadline Section */}
          <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📅</Text>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Deadline</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
              {/* Due Date */}
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>
                  Due Date <Text style={{ color: colors.error }}>*</Text>
                </Text>
                <TouchableOpacity
                  style={[styles.dateTimeWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
                  <Text style={[styles.dateTimeText, { color: dueDate ? colors.textPrimary : colors.textMuted }]} numberOfLines={1}>
                    {formatDate(dueDate)}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Due Time */}
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Due Time</Text>
                <TouchableOpacity
                  style={[styles.dateTimeWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Ionicons name="time-outline" size={20} color={colors.textMuted} />
                  <Text style={[styles.dateTimeText, { color: dueTime ? colors.textPrimary : colors.textMuted }]}>
                    {formatTime(dueTime)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Settings Section */}
          <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>⚡</Text>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Settings</Text>
            </View>

            {/* Priority */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>Priority</Text>
            <TouchableOpacity
              style={[styles.selectWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}
              onPress={() => setShowPriorityPicker(true)}
            >
              <View style={styles.selectContent}>
                <Text style={styles.selectIcon}>{selectedPriority?.icon}</Text>
                <Text style={[styles.selectText, { color: colors.textPrimary }]}>
                  {selectedPriority?.label}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
            </TouchableOpacity>

            {/* Status */}
            <Text style={[styles.label, { color: colors.textSecondary }]}>Status</Text>
            <TouchableOpacity
              style={[styles.selectWrapper, { backgroundColor: colors.background, borderColor: colors.border }]}
              onPress={() => setShowStatusPicker(true)}
            >
              <View style={styles.selectContent}>
                <Text style={styles.selectIcon}>{selectedStatus?.icon}</Text>
                <Text style={[styles.selectText, { color: colors.textPrimary }]}>
                  {selectedStatus?.label}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Reminders Section */}
          <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.reminderRow}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>🔔</Text>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Reminders</Text>
              </View>
              <Switch
                value={enableReminder}
                onValueChange={setEnableReminder}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
            <Text style={[styles.reminderDescription, { color: colors.textSecondary }]}>
              Enable reminders to get notified before deadlines
            </Text>

            {enableReminder && (
              <TouchableOpacity
                style={[styles.selectWrapper, { backgroundColor: colors.background, borderColor: colors.border, marginTop: 16 }]}
                onPress={() => setShowReminderPicker(true)}
              >
                <View style={styles.selectContent}>
                  <Text style={styles.selectIcon}>{selectedReminder?.icon}</Text>
                  <Text style={[styles.selectText, { color: colors.textPrimary }]}>
                    {selectedReminder?.label}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Bottom spacing */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Create Task Button */}
        <View style={[styles.footer, { backgroundColor: colors.background }]}>
          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: colors.primary }]}
            onPress={handleCreateTask}
            disabled={loading}
          >
            <Text style={styles.createButtonText}>
              {loading ? 'Creating...' : 'Create Task'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Platform-specific Date Picker Handling */}
      {Platform.OS === 'ios' ? (
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowDatePicker(false)}
          >
            <View style={[styles.datePickerContainer, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.datePickerHeader}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={[styles.doneButton, { color: colors.primary }]}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={dueDate || new Date()}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                minimumDate={new Date()}
                textColor={colors.textPrimary}
                themeVariant={colors.textPrimary === '#FFFFFF' ? 'dark' : 'light'}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      ) : (
        showDatePicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) setDueDate(date);
            }}
            minimumDate={new Date()}
          />
        )
      )}

      {/* Platform-specific Time Picker Handling */}
      {Platform.OS === 'ios' ? (
        <Modal
          visible={showTimePicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowTimePicker(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowTimePicker(false)}
          >
            <View style={[styles.datePickerContainer, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.datePickerHeader}>
                <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                  <Text style={[styles.doneButton, { color: colors.primary }]}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={dueTime || new Date()}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
                textColor={colors.textPrimary}
                themeVariant={colors.textPrimary === '#FFFFFF' ? 'dark' : 'light'}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      ) : (
        showTimePicker && (
          <DateTimePicker
            value={dueTime || new Date()}
            mode="time"
            display="default"
            onChange={(event, time) => {
              setShowTimePicker(false);
              if (time) setDueTime(time);
            }}
          />
        )
      )}

      {/* Course Picker Modal */}
      <PickerModal
        visible={showCoursePicker}
        onClose={() => setShowCoursePicker(false)}
        title="Select Course"
        options={courses}
        selectedValue={selectedCourseId}
        onSelect={setSelectedCourseId}
        renderOption={(course) => (
          <View style={styles.courseOption}>
            <View style={[styles.courseColorDot, { backgroundColor: course.color }]} />
            <View>
              <Text style={[styles.courseOptionName, { color: colors.textPrimary }]}>{course.name}</Text>
              <Text style={[styles.courseOptionCode, { color: colors.textSecondary }]}>{course.code}</Text>
            </View>
          </View>
        )}
      />

      {/* Priority Picker Modal */}
      <PickerModal
        visible={showPriorityPicker}
        onClose={() => setShowPriorityPicker(false)}
        title="Select Priority"
        options={priorities}
        selectedValue={priority}
        onSelect={setPriority}
        renderOption={(p) => (
          <View style={styles.priorityOption}>
            <Text style={styles.priorityOptionIcon}>{p.icon}</Text>
            <Text style={[styles.priorityOptionText, { color: colors.textPrimary }]}>{p.label}</Text>
          </View>
        )}
      />

      {/* Status Picker Modal */}
      <PickerModal
        visible={showStatusPicker}
        onClose={() => setShowStatusPicker(false)}
        title="Select Status"
        options={statuses}
        selectedValue={status}
        onSelect={setStatus}
        renderOption={(s) => (
          <View style={styles.priorityOption}>
            <Text style={styles.priorityOptionIcon}>{s.icon}</Text>
            <Text style={[styles.priorityOptionText, { color: colors.textPrimary }]}>{s.label}</Text>
          </View>
        )}
      />

      {/* Reminder Picker Modal */}
      <PickerModal
        visible={showReminderPicker}
        onClose={() => setShowReminderPicker(false)}
        title="Remind me"
        options={reminderOptions}
        selectedValue={reminderOffset}
        onSelect={setReminderOffset}
        renderOption={(r) => (
          <View style={styles.priorityOption}>
            <Text style={styles.priorityOptionIcon}>{r.icon}</Text>
            <Text style={[styles.priorityOptionText, { color: colors.textPrimary }]}>{r.label}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  headerCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  input: {
    fontSize: 16,
    paddingVertical: 14,
  },
  textAreaWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  textArea: {
    fontSize: 16,
    minHeight: 100,
  },
  selectWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  selectContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  selectText: {
    fontSize: 16,
  },
  createCourseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  createCourseText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  dateTimeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  dateTimeText: {
    fontSize: 16,
    marginLeft: 12,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reminderDescription: {
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
  },
  createButton: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pickerModal: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  pickerOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  courseOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  courseOptionName: {
    fontSize: 16,
    fontWeight: '500',
  },
  courseOptionCode: {
    fontSize: 13,
    marginTop: 2,
  },
  priorityOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityOptionIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  priorityOptionText: {
    fontSize: 16,
  },
  datePickerContainer: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingBottom: 10,
  },
  doneButton: {
    fontSize: 17,
    fontWeight: '600',
  },
});
