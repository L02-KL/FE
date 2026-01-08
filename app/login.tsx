import { useAuth } from "@/contexts/AuthContext";
import { AntDesign, Feather } from "@expo/vector-icons";
import * as Sentry from "@sentry/react-native";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
    const { login } = useAuth();
    const router = useRouter();

    // State for inputs and password visibility toggle
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password");
            return;
        }

        setLoading(true);
        try {
            await login({ email: email.trim(), password });
            // Navigation is handled by AuthContext protected route
        } catch (error: any) {
            Sentry.captureException(error);
            console.log("Login error:", error);
            const errorMessage =
                error.data?.error ||
                error.message ||
                "Please check your credentials and try again";
            Alert.alert("Login Failed", errorMessage);
        } finally {
            setLoading(false);
        }
    };
    ``;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                {/* KeyboardAvoidingView ensures the keyboard doesn't cover inputs on smaller screens */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        {/* Top Navigation Bar */}
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
                            {/* 1. Card Header (Light Blue) */}
                            <View style={styles.cardHeader}>
                                <View style={styles.iconCircle}>
                                    <Feather
                                        name="mail"
                                        size={32}
                                        color="#3B82F6"
                                    />
                                </View>
                                <Text style={styles.title}>Welcome Back</Text>
                                <Text style={styles.subtitle}>
                                    Sign in to continue to DeadTood
                                </Text>
                            </View>

                            {/* 2. Card Body (White Form) */}
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
                                            setPasswordVisible(
                                                !isPasswordVisible
                                            )
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

                                {/* Forgot Password */}
                                <TouchableOpacity style={styles.forgotButton}>
                                    <Text style={styles.forgotText}>
                                        Forgot password?
                                    </Text>
                                </TouchableOpacity>

                                {/* Sign In Button */}
                                <TouchableOpacity
                                    style={styles.signInButton}
                                    onPress={handleLogin}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#FFF" />
                                    ) : (
                                        <Text style={styles.signInButtonText}>
                                            Sign In
                                        </Text>
                                    )}
                                </TouchableOpacity>

                                {/* Sign Up Prompt */}
                                <View style={styles.signupContainer}>
                                    <Text style={styles.signupText}>
                                        Don't have an account?{" "}
                                    </Text>
                                    <Link href="/register" asChild>
                                        <TouchableOpacity>
                                            <Text style={styles.signupLink}>
                                                Sign Up
                                            </Text>
                                        </TouchableOpacity>
                                    </Link>
                                </View>
                            </View>
                        </View>

                        {/* Footer Legal Text */}
                        <Text style={styles.legalText}>
                            By continuing, you agree to our Terms and Privacy
                            Policy
                        </Text>
                    </ScrollView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F2F5", // Light gray background
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
        overflow: "hidden", // Clip header to border radius
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        marginBottom: 30,
    },
    cardHeader: {
        backgroundColor: "#E6F0FF", // Light blue top section
        alignItems: "center",
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    iconCircle: {
        width: 80,
        height: 80,
        backgroundColor: "#fff",
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
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
        backgroundColor: "#F8FAFC", // Very light gray input bg
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
    forgotButton: {
        alignSelf: "flex-end",
        marginBottom: 30,
    },
    forgotText: {
        color: "#3B82F6",
        fontWeight: "600",
        fontSize: 14,
    },
    signInButton: {
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
        marginBottom: 25,
    },
    signInButtonText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "700",
    },
    signupContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    signupText: {
        color: "#64748B",
        fontSize: 15,
        fontWeight: "600",
    },
    signupLink: {
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
