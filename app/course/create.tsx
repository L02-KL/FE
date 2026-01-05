import { useTheme } from '@/contexts/ThemeContext';
import { useCourseMutations } from '@/hooks/useApi';
import { CourseIconType } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* 
  Design Note:
  - Header: Back button, Title "Add New Course", Subtitle.
  - Form: Name, Code, Instructor, Semester (Dropdown-like).
  - Category Grid: Math, Science, Literature, Computer, Art, Music, Social.
*/

type CategoryOption = {
    label: string;
    icon: CourseIconType;
    color: string;
};

const CATEGORIES: CategoryOption[] = [
    { label: 'Math', icon: 'calculator', color: '#4A90E2' },
    { label: 'Science', icon: 'flask', color: '#66BB6A' },
    { label: 'Literature', icon: 'book', color: '#EF5350' },
    { label: 'Computer', icon: 'code', color: '#AB47BC' },
    { label: 'Art', icon: 'palette', color: '#FFA726' },
    { label: 'Music', icon: 'musical-notes', color: '#EC407A' },
    { label: 'Social', icon: 'globe', color: '#26C6DA' },
];

export default function CreateCourseScreen() {
    const { colors, isDark } = useTheme();
    const router = useRouter();
    const { createCourse, loading } = useCourseMutations();

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [instructor, setInstructor] = useState('');
    const [semester, setSemester] = useState('Fall 2024'); // Default per design
    const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null);

    const handleCreate = async () => {
        if (!name || !code || !selectedCategory) {
            Alert.alert('Missing Fields', 'Please fill in Name, Code and select a Category.');
            return;
        }

        const result = await createCourse({
            name,
            code,
            instructor,
            semester,
            color: selectedCategory.color,
            icon: selectedCategory.icon,
            description: '', // Optional
        });

        if (result) {
            Alert.alert('Success', 'Course created successfully!', [
                { text: 'OK', onPress: () => router.back() },
            ]);
        } else {
            Alert.alert('Error', 'Failed to create course. Please try again.');
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                    <Text style={[styles.backText, { color: colors.textPrimary }]}>Back</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.titleContainer}>
                        <Text style={[styles.title, { color: colors.textPrimary }]}>Add New Course</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Create a new course for this semester 📚
                        </Text>
                    </View>

                    <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardIcon}>📝</Text>
                            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Course Details</Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textPrimary }]}>Course Name *</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.background, color: colors.textPrimary, borderColor: isDark ? '#333' : '#E0E0E0' }]}
                                placeholder="e.g., Calculus II"
                                placeholderTextColor={colors.textMuted}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textPrimary }]}>Course Code *</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.background, color: colors.textPrimary, borderColor: isDark ? '#333' : '#E0E0E0' }]}
                                placeholder="e.g., MATH 201"
                                placeholderTextColor={colors.textMuted}
                                value={code}
                                onChangeText={setCode}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textPrimary }]}>Instructor</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.background, color: colors.textPrimary, borderColor: isDark ? '#333' : '#E0E0E0' }]}
                                placeholder="e.g., Dr. Smith"
                                placeholderTextColor={colors.textMuted}
                                value={instructor}
                                onChangeText={setInstructor}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textPrimary }]}>Semester *</Text>
                            <View style={[styles.dropdownStub, { backgroundColor: colors.background, borderColor: isDark ? '#333' : '#E0E0E0' }]}>
                                <Text style={{ color: colors.textPrimary }}>🍂 {semester}</Text>
                                <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
                            </View>
                        </View>
                    </View>

                    <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardIcon}>🎨</Text>
                            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Choose Icon & Color</Text>
                        </View>

                        <View style={styles.grid}>
                            {CATEGORIES.map((cat) => {
                                const isSelected = selectedCategory?.label === cat.label;
                                return (
                                    <TouchableOpacity
                                        key={cat.label}
                                        style={[
                                            styles.gridItem,
                                            {
                                                backgroundColor: isSelected ? cat.color + '20' : colors.background,
                                                borderColor: isSelected ? cat.color : 'transparent',
                                                borderWidth: 2
                                            }
                                        ]}
                                        onPress={() => setSelectedCategory(cat)}
                                    >
                                        <View style={[styles.iconCircle, { backgroundColor: isSelected ? cat.color : (isDark ? '#333' : '#F5F5F5') }]}>
                                            <Ionicons
                                                name={cat.icon as any}
                                                size={24}
                                                color={isSelected ? '#FFF' : cat.color}
                                            />
                                        </View>
                                        <Text style={[
                                            styles.gridLabel,
                                            { color: isSelected ? cat.color : colors.textSecondary, fontWeight: isSelected ? 'bold' : 'normal' }
                                        ]}>
                                            {cat.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <View style={{ height: 20 }} />

                    <TouchableOpacity
                        style={[styles.createButton, { opacity: loading ? 0.7 : 1 }]}
                        onPress={handleCreate}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.createButtonText}>Create Course</Text>
                        )}
                    </TouchableOpacity>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 4,
    },
    content: {
        padding: 20,
    },
    titleContainer: {
        marginBottom: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
    },
    card: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    cardIcon: {
        fontSize: 24,
        marginRight: 10,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        fontSize: 16,
    },
    dropdownStub: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'space-between',
    },
    gridItem: {
        width: '23%', // approx 4 items per row but we have 7 items, lets do 3-4 per row or auto
        minWidth: 80,
        aspectRatio: 0.8,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    gridLabel: {
        fontSize: 12,
    },
    createButton: {
        backgroundColor: '#007AFF', // Primary Blue
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    createButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
