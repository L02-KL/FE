import { useAuth } from "@/contexts/AuthContext";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function RegisterScreen() {
    const router = useRouter();
    const { register } = useAuth();

    // State management
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            await register({ email, password });
            Alert.alert("Success", "Account created successfully!");
        } catch (error: any) {
            console.error("Register error:", error);
            Alert.alert(
                "Registration Failed",
                error.message || "Please check your information and try again"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {/* Nav Bar */}
                    <View style={styles.navBar}>
                        <TouchableOpacity
                            onPress={() => {
                                router.back();
                            }}
                            style={styles.backButton}
                        >
                            <AntDesign
                                name="arrow-left"
                                size={24}
                                color="#334155"
                            />
                            <Text style={styles.backText}>Back</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Main Card */}
                    <View style={styles.card}>
                        {/* Header Section */}
                        <View style={styles.cardHeader}>
                            <View style={styles.iconCircle}>
                                <Feather
                                    name="mail"
                                    size={32}
                                    color="#3B82F6"
                                />
                            </View>
                            <Text style={styles.title}>Create Account</Text>
                            <Text style={styles.subtitle}>
                                Sign up to get started with DeadTood
                            </Text>
                        </View>

                        {/* Form Body */}
                        <View style={styles.cardBody}>
                            {/* Email Input */}
                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.inputContainer}>
                                <Feather
                                    name="mail"
                                    size={20}
                                    color="#94A3B8"
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="your.email@university.edu"
                                    placeholderTextColor="#94A3B8"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            {/* Password Input */}
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputContainer}>
                                <Feather
                                    name="lock"
                                    size={20}
                                    color="#94A3B8"
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your password"
                                    placeholderTextColor="#94A3B8"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!isPasswordVisible}
                                />
                                <TouchableOpacity
                                    onPress={() =>
                                        setPasswordVisible(!isPasswordVisible)
                                    }
                                >
                                    <Feather
                                        name={
                                            isPasswordVisible
                                                ? "eye"
                                                : "eye-off"
                                        }
                                        size={20}
                                        color="#94A3B8"
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Confirm Password Input */}
                            <Text style={styles.label}>Confirm Password</Text>
                            <View style={styles.inputContainer}>
                                <Feather
                                    name="lock"
                                    size={20}
                                    color="#94A3B8"
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirm your password"
                                    placeholderTextColor="#94A3B8"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!isPasswordVisible}
                                />
                            </View>

                            {/* Create Account Button */}
                            <TouchableOpacity
                                style={styles.createButton}
                                onPress={handleRegister}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.createButtonText}>
                                        Create Account
                                    </Text>
                                )}
                            </TouchableOpacity>

                            {/* Already have an account? */}
                            <View style={styles.loginContainer}>
                                <Text style={styles.loginText}>
                                    Already have an account?{" "}
                                </Text>
                                {/* Redirects to Login if they already have an account */}
                                <TouchableOpacity
                                    onPress={() => router.push("/login")}
                                >
                                    <Text style={styles.loginLink}>
                                        Sign In
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Footer Legal Text */}
                    <Text style={styles.legalText}>
                        By continuing, you agree to our Terms and Privacy Policy
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F2F5",
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: "center",
        paddingVertical: 20,
    },
    navBar: {
        width: "100%",
        paddingHorizontal: 20,
        marginBottom: 20,
        alignItems: "flex-start",
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
    },
    backText: {
        fontSize: 16,
        color: "#334155",
        marginLeft: 8,
        fontWeight: "600",
    },
    card: {
        width: width * 0.9,
        backgroundColor: "#fff",
        borderRadius: 30,
        overflow: "hidden",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        marginBottom: 30,
    },
    cardHeader: {
        backgroundColor: "#E6F0FF",
        alignItems: "center",
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    iconCircle: {
        width: 80,
        height: 80,
        backgroundColor: "#fff",
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
        elevation: 4,
        shadowColor: "#3B82F6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: "900",
        color: "#0F172A",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: "#64748B",
        textAlign: "center",
    },
    cardBody: {
        padding: 30,
        backgroundColor: "#fff",
    },
    label: {
        fontSize: 14,
        fontWeight: "700",
        color: "#334155",
        marginBottom: 8,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 16,
        paddingHorizontal: 15,
        height: 55,
        marginBottom: 20,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: "#1E293B",
    },
    createButton: {
        backgroundColor: "#3B82F6",
        borderRadius: 50,
        height: 56,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#3B82F6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
        marginTop: 10,
        marginBottom: 25,
    },
    createButtonText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "700",
    },
    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    loginText: {
        color: "#64748B",
        fontSize: 15,
        fontWeight: "600",
    },
    loginLink: {
        color: "#3B82F6",
        fontSize: 15,
        fontWeight: "700",
    },
    legalText: {
        textAlign: "center",
        color: "#94A3B8",
        fontSize: 12,
        paddingHorizontal: 40,
        lineHeight: 18,
        marginBottom: 20,
    },
});
