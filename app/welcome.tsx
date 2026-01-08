import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router"; // 1. Import the router hook
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function WelcomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.card}>
                <View style={styles.header}>
                    {/* Use your image source here */}
                    <Image
                        source={require("../assets/images/onboarding/Onboarding1.png")}
                        style={styles.illustration}
                        contentFit="contain"
                    />
                </View>

                <View style={styles.content}>
                    <Text style={styles.appName}>DeadTood</Text>
                    <Text style={styles.tagline}>
                        Plan smart. Do better. <Text>✨</Text>
                    </Text>
                    <Text style={styles.description}>
                        Stay on top of your assignments, deadlines, and study
                        goals
                    </Text>

                    <View style={styles.buttonContainer}>
                        {/* <TouchableOpacity style={styles.googleButton}>
                            <View style={styles.iconWrapper}>
                                <AntDesign
                                    name="google"
                                    size={20}
                                    color="white"
                                />
                            </View>
                            <Text style={styles.googleButtonText}>
                                Continue with Google
                            </Text>
                        </TouchableOpacity> */}

                        {/* 3. Add the onPress handler to navigate */}
                        <Link href="/login" asChild>
                            <TouchableOpacity style={styles.emailButton}>
                                <View style={styles.iconWrapper}>
                                    <MaterialCommunityIcons
                                        name="email-outline"
                                        size={20}
                                        color="black"
                                    />
                                </View>
                                <Text style={styles.emailButtonText}>
                                    Continue with Email
                                </Text>
                            </TouchableOpacity>
                        </Link>
                    </View>

                    <Text style={styles.legalText}>
                        By continuing, you agree to our Terms of Service and
                        Privacy Policy
                    </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Made for students, by students 💙
                </Text>
            </View>
        </SafeAreaView>
    );
}

// ... Copy the exact same styles object from the previous response here ...
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F2F5",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
    },
    card: {
        width: width * 0.9,
        backgroundColor: "#fff",
        borderRadius: 30,
        overflow: "hidden",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    header: {
        height: 280,
        backgroundColor: "#E6F0FF",
        alignItems: "center",
        justifyContent: "center",
    },
    illustration: { width: 180, height: 180 },
    content: { padding: 30, alignItems: "center" },
    appName: {
        fontSize: 32,
        fontWeight: "900",
        color: "#0F172A",
        marginBottom: 10,
        letterSpacing: 0.5,
    },
    tagline: {
        fontSize: 18,
        color: "#3B82F6",
        fontWeight: "600",
        marginBottom: 15,
    },
    description: {
        fontSize: 15,
        color: "#64748B",
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 35,
        paddingHorizontal: 10,
    },
    buttonContainer: { width: "100%", gap: 15, marginBottom: 30 },
    googleButton: {
        flexDirection: "row",
        backgroundColor: "#3B82F6",
        paddingVertical: 16,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        elevation: 2,
    },
    googleButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 10,
    },
    emailButton: {
        flexDirection: "row",
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        paddingVertical: 16,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    emailButtonText: {
        color: "#334155",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 10,
    },
    iconWrapper: {
        justifyContent: "center",
        alignItems: "center",
    },
    legalText: {
        fontSize: 11,
        color: "#94A3B8",
        textAlign: "center",
        lineHeight: 16,
        paddingHorizontal: 10,
    },
    footer: { marginTop: 30, alignItems: "center" },
    footerText: { color: "#64748B", fontSize: 14 },
});
