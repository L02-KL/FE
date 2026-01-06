import { api } from "@/services";
import { apiClient } from "@/services/api/client";
import { LoginRequest, RegisterRequest, User } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    isOnboardingCompleted: boolean;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    completeOnboarding: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Key for storing token in AsyncStorage
const TOKEN_KEY = "auth_token";
const ONBOARDING_KEY = "onboarding_completed";

export function useAuth() {
    return useContext(AuthContext);
}

export function useProtectedRoute(
    user: User | null,
    isLoading: boolean,
    isOnboardingCompleted: boolean
) {
    const segments = useSegments();
    const router = useRouter();
    const [isNavigationReady, setIsNavigationReady] = React.useState(false);

    useEffect(() => {
        // Wait for the root layout to mount properly
        // This is a simple heuristic; in real apps checking root navigation state might be cleaner
        const timer = setTimeout(() => setIsNavigationReady(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isLoading || !isNavigationReady) return;

        const inAuthGroup = segments[0] === "(tabs)";
        const inPublicGroup =
            segments[0] === "login" ||
            segments[0] === "register" ||
            segments[0] === "splash" ||
            segments[0] === "welcome";
        const inOnboarding = segments[0] === "onboarding";

        console.log("🔒 [Auth Check]", {
            user: !!user,
            segment: segments[0],
            inAuthGroup,
            isOnboardingCompleted,
            path: segments.join("/"),
        });

        if (!isOnboardingCompleted && !inOnboarding) {
            console.log("🆕 Redirecting to Onboarding...");
            router.replace("/onboarding");
        } else if (isOnboardingCompleted && inOnboarding) {
            console.log("✅ Onboarding done, Redirecting to Welcome...");
            router.replace("/welcome");
        } else if (!user && inAuthGroup) {
            // If trying to access tabs without user, redirect to welcome
            console.log("🔏 Redirecting to Welcome...");
            router.replace("/welcome");
        } else if (
            user &&
            isOnboardingCompleted &&
            (inPublicGroup || inOnboarding || !segments[0])
        ) {
            // If user is logged in but on login/register/splash/welcome, redirect to tabs
            // !segments[0] means root path or empty segments
            console.log("🔓 Redirecting to Tabs...");
            router.replace("/(tabs)");
        }
    }, [user, segments, isLoading, isNavigationReady, isOnboardingCompleted]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

    useEffect(() => {
        // Check for persisted token on mount
        const loadToken = async () => {
            try {
                const onboardingStatus = await AsyncStorage.getItem(
                    ONBOARDING_KEY
                );
                if (onboardingStatus === "true") {
                    setIsOnboardingCompleted(true);
                }

                const token = await AsyncStorage.getItem(TOKEN_KEY);
                if (token) {
                    apiClient.setToken(token);
                    // Verify token and get user info
                    try {
                        // Aligned with docs: /users/me
                        const userData = await api.auth.getCurrentUser();
                        setUser(userData);
                    } catch (error) {
                        console.error("Failed to fetch user profile:", error);
                        // Token might be invalid
                        await AsyncStorage.removeItem(TOKEN_KEY);
                        apiClient.clearToken();
                        setUser(null);
                    }
                }
            } catch (error) {
                console.error("Failed to load token:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadToken();
    }, []);

    const login = async (data: LoginRequest) => {
        try {
            const response = await api.auth.login(data);
            if (response.token) {
                await AsyncStorage.setItem(TOKEN_KEY, response.token);
                apiClient.setToken(response.token);
                setUser(response.user);
            }
        } catch (error) {
            throw error;
        }
    };

    const register = async (data: RegisterRequest) => {
        try {
            const response = await api.auth.register(data);
            if (response.token) {
                await AsyncStorage.setItem(TOKEN_KEY, response.token);
                apiClient.setToken(response.token);
                setUser(response.user);
            }
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            // Optional: Call logout endpoint
            // await api.auth.logout();
            await AsyncStorage.removeItem(TOKEN_KEY);
            // await AsyncStorage.removeItem(ONBOARDING_KEY);
            apiClient.clearToken();
            setUser(null);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const completeOnboarding = async () => {
        try {
            await AsyncStorage.setItem(ONBOARDING_KEY, "true");
            setIsOnboardingCompleted(true);
        } catch (error) {
            console.log("Error saving onboarding status:", error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                register,
                logout,
                completeOnboarding,
                isOnboardingCompleted,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
