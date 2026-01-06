import { Mascot } from "@/components/common/Mascot";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const fadeAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(0.8);

    useEffect(() => {
        // Animate in
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();

        // Navigate based on auth state after delay
        const timer = setTimeout(() => {
            if (!isLoading) {
                if (user) {
                    router.replace("/(tabs)");
                } else {
                    router.replace("/welcome");
                }
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [user, isLoading]);

    return (
        <View style={[styles.container, { backgroundColor: colors.primary }]}>
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                <Mascot mood="happy" size="xlarge" />
                <Text style={styles.appName}>TaskMaster</Text>
                <Text style={styles.tagline}>Your personal task companion</Text>
            </Animated.View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Made with 💙</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        alignItems: "center",
    },
    appName: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#FFF",
        marginTop: 24,
    },
    tagline: {
        fontSize: 16,
        color: "rgba(255,255,255,0.8)",
        marginTop: 8,
    },
    footer: {
        position: "absolute",
        bottom: 50,
    },
    footerText: {
        fontSize: 14,
        color: "rgba(255,255,255,0.6)",
    },
});
