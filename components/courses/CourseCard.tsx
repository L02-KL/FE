import { useTheme } from "@/contexts/ThemeContext";
import { Course, CourseIconType } from "@/types";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CourseCardProps {
    course: Course;
    onPress?: () => void;
}

// Map course icon types to actual icons
export function getCourseIcon(
    iconType: CourseIconType,
    size: number = 28,
    color: string = "#FFFFFF"
) {
    switch (iconType) {
        case "calculator":
            return <Ionicons name="calculator" size={size} color={color} />;
        case "flask":
            return (
                <MaterialCommunityIcons
                    name="flask"
                    size={size}
                    color={color}
                />
            );
        case "book":
            return <Ionicons name="book" size={size} color={color} />;
        case "atom":
            return (
                <MaterialCommunityIcons name="atom" size={size} color={color} />
            );
        case "code":
            return <Ionicons name="code-slash" size={size} color={color} />;
        case "palette":
            return <Ionicons name="color-palette" size={size} color={color} />;
        case "musical-notes":
            return <Ionicons name="musical-notes" size={size} color={color} />;
        case "globe":
            return <Ionicons name="globe" size={size} color={color} />;
        case "fitness":
            return <Ionicons name="fitness" size={size} color={color} />;
        case "briefcase":
            return <Ionicons name="briefcase" size={size} color={color} />;
        default:
            return <Ionicons name="school" size={size} color={color} />;
    }
}

export function CourseCard({ course, onPress }: CourseCardProps) {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={[
                styles.container,
                { backgroundColor: colors.cardBackground },
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Header Section with Course Color */}
            <View style={[styles.header, { backgroundColor: course.color }]}>
                <View style={styles.iconContainer}>
                    {getCourseIcon(course.icon, 28, "rgba(255,255,255,0.9)")}
                </View>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.courseName} numberOfLines={1}>
                        {course.name}
                    </Text>
                    <Text style={styles.courseCode}>{course.code}</Text>
                </View>
                <Ionicons
                    name="chevron-forward"
                    size={24}
                    color="rgba(255,255,255,0.7)"
                />
            </View>

            {/* Details Section */}
            <View style={styles.details}>
                {/* Semester and Instructor Row */}
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Text
                            style={[
                                styles.infoLabel,
                                { color: colors.textMuted },
                            ]}
                        >
                            Semester
                        </Text>
                        <Text
                            style={[
                                styles.infoValue,
                                { color: colors.textPrimary },
                            ]}
                        >
                            {course.semester || "N/A"}
                        </Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text
                            style={[
                                styles.infoLabel,
                                { color: colors.textMuted },
                            ]}
                        >
                            Instructor
                        </Text>
                        <Text
                            style={[
                                styles.infoValue,
                                { color: colors.textPrimary },
                            ]}
                        >
                            {course.instructor || "N/A"}
                        </Text>
                    </View>
                </View>

                {/* Task Stats Badges */}
                <View style={styles.badgeRow}>
                    <View
                        style={[styles.badge, { backgroundColor: "#E8F5E9" }]}
                    >
                        <Text style={[styles.badgeText, { color: "#4CAF50" }]}>
                            {course.activeTaskCount} active
                        </Text>
                    </View>
                    <View style={styles.doneBadge}>
                        <Text style={styles.checkIcon}>✅</Text>
                        <Text
                            style={[
                                styles.doneText,
                                { color: colors.textSecondary },
                            ]}
                        >
                            {course.completedTaskCount} done
                        </Text>
                    </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                        <Text
                            style={[
                                styles.progressLabel,
                                { color: colors.textSecondary },
                            ]}
                        >
                            Progress
                        </Text>
                        <Text
                            style={[
                                styles.progressPercent,
                                { color: colors.textPrimary },
                            ]}
                        >
                            {course.progress}%
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.progressTrack,
                            { backgroundColor: colors.border },
                        ]}
                    >
                        <View
                            testID="progress-fill"
                            style={[
                                styles.progressFill,
                                {
                                    backgroundColor: course.color,
                                    width: `${course.progress}%`,
                                },
                            ]}
                        />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        marginBottom: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        paddingVertical: 24,
    },
    iconContainer: {
        width: 52,
        height: 52,
        borderRadius: 14,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },
    headerTextContainer: {
        flex: 1,
    },
    courseName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 4,
    },
    courseCode: {
        fontSize: 14,
        color: "rgba(255,255,255,0.85)",
        fontWeight: "500",
    },
    details: {
        padding: 20,
    },
    infoRow: {
        flexDirection: "row",
        marginBottom: 16,
    },
    infoItem: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 13,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: "600",
    },
    badgeRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        gap: 12,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 13,
        fontWeight: "600",
    },
    doneBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    checkIcon: {
        fontSize: 14,
    },
    doneText: {
        fontSize: 13,
        fontWeight: "500",
    },
    progressContainer: {
        marginTop: 4,
    },
    progressHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    progressLabel: {
        fontSize: 14,
        fontWeight: "500",
    },
    progressPercent: {
        fontSize: 14,
        fontWeight: "600",
    },
    progressTrack: {
        height: 8,
        borderRadius: 4,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        borderRadius: 4,
    },
});

export default CourseCard;
