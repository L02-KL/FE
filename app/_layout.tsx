import {
    AuthProvider,
    useAuth,
    useProtectedRoute,
} from "@/contexts/AuthContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";

import { usePushNotifications } from "@/hooks/usePushNotifications";

export const unstable_settings = {
    anchor: "(tabs)",
};

function RootLayoutNav() {
    const { isDark } = useTheme();
    usePushNotifications();
    const { user, isLoading, isOnboardingCompleted } = useAuth();

    useProtectedRoute(user, isLoading, isOnboardingCompleted);

    if (isLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#fff",
                }}
            >
                <ActivityIndicator size="large" color="#4A90E2" />
            </View>
        );
    }

    return (
        <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="splash" options={{ headerShown: false }} />
                <Stack.Screen
                    name="onboarding"
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen
                    name="register"
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="welcome" options={{ headerShown: false }} />

                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="modal"
                    options={{ presentation: "modal", title: "Modal" }}
                />
                <Stack.Screen
                    name="task/[id]"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="course/[id]"
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="profile" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style={isDark ? "light" : "dark"} />
        </NavigationThemeProvider>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <RootLayoutNav />
            </ThemeProvider>
        </AuthProvider>
    );
}
