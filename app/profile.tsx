import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import * as Sentry from "@sentry/react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface UserProfile {
    name: string;
    email: string;
    phone: string;
    studentId: string;
    major: string;
    year: string;
    avatar: string | null;
}

export default function ProfileScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const { user, logout } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<UserProfile>({
        name: user?.name || "User",
        email: user?.email || "",
        phone: "",
        studentId: "",
        major: "",
        year: "",
        avatar: user?.avatar || null,
    });

    const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

    const handleBack = () => {
        router.back();
    };

    const handleEdit = () => {
        setEditedProfile(profile);
        setIsEditing(true);
    };

    const handleSave = () => {
        setProfile(editedProfile);
        setIsEditing(false);
        Alert.alert("Success", "Profile updated successfully!");
    };

    const handleCancel = () => {
        setEditedProfile(profile);
        setIsEditing(false);
    };

    const handleChangeAvatar = () => {
        Alert.alert(
            "Change Avatar",
            "Photo picker will be implemented with image library"
        );
    };

    const handleLogout = async () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                    try {
                        await logout();
                        // Navigation handled by AuthContext
                    } catch (error) {
                        Sentry.captureException(error);
                        console.error("Logout failed:", error);
                    }
                },
            },
        ]);
    };

    const renderField = (
        label: string,
        value: string,
        field: keyof UserProfile,
        icon: keyof typeof Ionicons.glyphMap,
        editable: boolean = true
    ) => (
        <View
            style={[
                styles.fieldContainer,
                { borderBottomColor: colors.border },
            ]}
        >
            <View
                style={[
                    styles.fieldIcon,
                    { backgroundColor: colors.background },
                ]}
            >
                <Ionicons name={icon} size={20} color={colors.primary} />
            </View>
            <View style={styles.fieldContent}>
                <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>
                    {label}
                </Text>
                {isEditing && editable ? (
                    <TextInput
                        style={[
                            styles.fieldInput,
                            {
                                color: colors.textPrimary,
                                borderColor: colors.border,
                            },
                        ]}
                        value={editedProfile[field] as string}
                        onChangeText={(text) =>
                            setEditedProfile({
                                ...editedProfile,
                                [field]: text,
                            })
                        }
                        placeholderTextColor={colors.textMuted}
                    />
                ) : (
                    <Text
                        style={[
                            styles.fieldValue,
                            { color: colors.textPrimary },
                        ]}
                    >
                        {value}
                    </Text>
                )}
            </View>
        </View>
    );

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: colors.background }]}
            edges={["top"]}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View
                    style={[
                        styles.header,
                        { backgroundColor: colors.cardBackground },
                    ]}
                >
                    <View style={styles.headerTop}>
                        <TouchableOpacity
                            onPress={handleBack}
                            style={styles.backButton}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color={colors.textPrimary}
                            />
                        </TouchableOpacity>
                        <Text
                            style={[
                                styles.headerTitle,
                                { color: colors.textPrimary },
                            ]}
                        >
                            Profile
                        </Text>
                        {!isEditing ? (
                            <TouchableOpacity
                                onPress={handleEdit}
                                style={styles.editButton}
                            >
                                <Ionicons
                                    name="pencil"
                                    size={20}
                                    color={colors.primary}
                                />
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.editButton} />
                        )}
                    </View>

                    {/* Avatar */}
                    <View style={styles.avatarSection}>
                        <TouchableOpacity
                            onPress={handleChangeAvatar}
                            style={styles.avatarContainer}
                        >
                            {profile.avatar ? (
                                <Image
                                    source={{ uri: profile.avatar }}
                                    style={styles.avatar}
                                />
                            ) : (
                                <View
                                    style={[
                                        styles.avatarPlaceholder,
                                        { backgroundColor: colors.primary },
                                    ]}
                                >
                                    <Text style={styles.avatarText}>
                                        {profile.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .toUpperCase()}
                                    </Text>
                                </View>
                            )}
                            <View
                                style={[
                                    styles.cameraIcon,
                                    { backgroundColor: colors.accent },
                                ]}
                            >
                                <Ionicons
                                    name="camera"
                                    size={16}
                                    color="#FFF"
                                />
                            </View>
                        </TouchableOpacity>
                        <Text
                            style={[
                                styles.profileName,
                                { color: colors.textPrimary },
                            ]}
                        >
                            {profile.name}
                        </Text>
                        <Text
                            style={[
                                styles.profileEmail,
                                { color: colors.textSecondary },
                            ]}
                        >
                            {profile.email}
                        </Text>
                    </View>
                </View>

                {/* Profile Fields */}
                <View style={styles.section}>
                    <Text
                        style={[
                            styles.sectionTitle,
                            { color: colors.textMuted },
                        ]}
                    >
                        Personal Information
                    </Text>
                    <View
                        style={[
                            styles.sectionContent,
                            { backgroundColor: colors.cardBackground },
                        ]}
                    >
                        {renderField(
                            "Full Name",
                            profile.name,
                            "name",
                            "person-outline"
                        )}
                        {renderField(
                            "Email",
                            profile.email,
                            "email",
                            "mail-outline"
                        )}
                        {renderField(
                            "Phone",
                            profile.phone,
                            "phone",
                            "call-outline"
                        )}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text
                        style={[
                            styles.sectionTitle,
                            { color: colors.textMuted },
                        ]}
                    >
                        Academic Information
                    </Text>
                    <View
                        style={[
                            styles.sectionContent,
                            { backgroundColor: colors.cardBackground },
                        ]}
                    >
                        {renderField(
                            "Student ID",
                            profile.studentId,
                            "studentId",
                            "id-card-outline",
                            false
                        )}
                        {renderField(
                            "Major",
                            profile.major,
                            "major",
                            "school-outline",
                            false
                        )}
                        {renderField(
                            "Year",
                            profile.year,
                            "year",
                            "calendar-outline",
                            false
                        )}
                    </View>
                </View>

                {/* Statistics */}
                <View style={styles.section}>
                    <Text
                        style={[
                            styles.sectionTitle,
                            { color: colors.textMuted },
                        ]}
                    >
                        Statistics
                    </Text>
                    <View style={styles.statsRow}>
                        <View
                            style={[
                                styles.statCard,
                                { backgroundColor: colors.cardBackground },
                            ]}
                        >
                            <View
                                style={[
                                    styles.statIcon,
                                    { backgroundColor: colors.primaryLight },
                                ]}
                            >
                                <Ionicons
                                    name="checkbox"
                                    size={24}
                                    color={colors.primary}
                                />
                            </View>
                            <Text
                                style={[
                                    styles.statValue,
                                    { color: colors.textPrimary },
                                ]}
                            >
                                24
                            </Text>
                            <Text
                                style={[
                                    styles.statLabel,
                                    { color: colors.textSecondary },
                                ]}
                            >
                                Tasks Done
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.statCard,
                                { backgroundColor: colors.cardBackground },
                            ]}
                        >
                            <View
                                style={[
                                    styles.statIcon,
                                    { backgroundColor: colors.accentLight },
                                ]}
                            >
                                <Ionicons
                                    name="book"
                                    size={24}
                                    color={colors.accent}
                                />
                            </View>
                            <Text
                                style={[
                                    styles.statValue,
                                    { color: colors.textPrimary },
                                ]}
                            >
                                4
                            </Text>
                            <Text
                                style={[
                                    styles.statLabel,
                                    { color: colors.textSecondary },
                                ]}
                            >
                                Courses
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.statCard,
                                { backgroundColor: colors.cardBackground },
                            ]}
                        >
                            <View
                                style={[
                                    styles.statIcon,
                                    { backgroundColor: "#E8F5E9" },
                                ]}
                            >
                                <Ionicons
                                    name="trophy"
                                    size={24}
                                    color="#4CAF50"
                                />
                            </View>
                            <Text
                                style={[
                                    styles.statValue,
                                    { color: colors.textPrimary },
                                ]}
                            >
                                3
                            </Text>
                            <Text
                                style={[
                                    styles.statLabel,
                                    { color: colors.textSecondary },
                                ]}
                            >
                                Achievements
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Edit Actions */}
                {isEditing && (
                    <View style={styles.editActions}>
                        <TouchableOpacity
                            style={[
                                styles.cancelButton,
                                { borderColor: colors.border },
                            ]}
                            onPress={handleCancel}
                        >
                            <Text
                                style={[
                                    styles.cancelButtonText,
                                    { color: colors.textSecondary },
                                ]}
                            >
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.saveButton,
                                { backgroundColor: colors.primary },
                            ]}
                            onPress={handleSave}
                        >
                            <Text style={styles.saveButtonText}>
                                Save Changes
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Logout Button */}
                {!isEditing && (
                    <View style={styles.section}>
                        <TouchableOpacity
                            style={[
                                styles.logoutButton,
                                { backgroundColor: "#ffebee" },
                            ]}
                            onPress={handleLogout}
                        >
                            <Ionicons
                                name="log-out-outline"
                                size={24}
                                color={colors.error}
                                style={{ marginRight: 8 }}
                            />
                            <Text
                                style={[
                                    styles.logoutText,
                                    { color: colors.error },
                                ]}
                            >
                                Log Out
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        paddingBottom: 24,
    },
    headerTop: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
    },
    editButton: {
        padding: 8,
        width: 40,
        alignItems: "center",
    },
    avatarSection: {
        alignItems: "center",
    },
    avatarContainer: {
        position: "relative",
        marginBottom: 12,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#FFF",
    },
    cameraIcon: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#FFF",
    },
    profileName: {
        fontSize: 22,
        fontWeight: "bold",
    },
    profileEmail: {
        fontSize: 14,
        marginTop: 4,
    },
    section: {
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 12,
    },
    sectionContent: {
        borderRadius: 16,
        overflow: "hidden",
    },
    fieldContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
    },
    fieldIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },
    fieldContent: {
        flex: 1,
    },
    fieldLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    fieldValue: {
        fontSize: 16,
        fontWeight: "500",
    },
    fieldInput: {
        fontSize: 16,
        fontWeight: "500",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginTop: 2,
    },
    statsRow: {
        flexDirection: "row",
        gap: 12,
    },
    statCard: {
        flex: 1,
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
    },
    statIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    statValue: {
        fontSize: 24,
        fontWeight: "bold",
    },
    statLabel: {
        fontSize: 12,
        marginTop: 4,
    },
    editActions: {
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingTop: 24,
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: "center",
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: "600",
    },
    saveButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FFF",
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        borderRadius: 16,
        marginTop: 8,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: "600",
    },
});
