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
import * as Sentry from "@sentry/react-native";

Sentry.init({
    dsn: "https://7e7726f7a5d0d6602ed86423cd4b1a56@o4510500074356736.ingest.de.sentry.io/4510675544440912",

    // Adds more context data to events (IP address, cookies, user, etc.)
    // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
    sendDefaultPii: true,

    // Enable Logs
    enableLogs: true,

    // Configure Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    integrations: [
        Sentry.mobileReplayIntegration(),
        Sentry.feedbackIntegration(),
    ],

    // uncomment the line below to enable Spotlight (https://spotlightjs.com)
    // spotlight: __DEV__,
});

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

export default Sentry.wrap(function RootLayout() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <RootLayoutNav />
            </ThemeProvider>
        </AuthProvider>
    );
});
