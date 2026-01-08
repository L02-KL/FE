import SplashScreen from "@/app/splash";
import { act, render } from "@testing-library/react-native";
import React from "react";

// ----------------------------------------------------------------------
// 1. Mocks
// ----------------------------------------------------------------------

// Mock Navigation
const mockReplace = jest.fn();
jest.mock("expo-router", () => ({
    useRouter: () => ({
        replace: mockReplace,
    }),
}));

// Mock Theme
jest.mock("@/contexts/ThemeContext", () => ({
    useTheme: () => ({
        colors: { primary: "#6200ee" },
    }),
}));

// Mock Auth Context (We'll override return values in tests)
const mockUseAuth = jest.fn();
jest.mock("@/contexts/AuthContext", () => ({
    useAuth: () => mockUseAuth(),
}));

// Mock Mascot to avoid image loading issues
jest.mock("@/components/common/Mascot", () => ({
    Mascot: () => {
        const { View, Text } = require("react-native");
        return (
            <View testID="mock-mascot">
                <Text>Mascot</Text>
            </View>
        );
    },
}));

describe("SplashScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers(); // Take control of setTimeout
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("renders the branding elements correctly", () => {
        mockUseAuth.mockReturnValue({ user: null, isLoading: true });

        const { getByText, getByTestId } = render(<SplashScreen />);

        expect(getByTestId("mock-mascot")).toBeTruthy();
        expect(getByText("DeadTood")).toBeTruthy();
        expect(getByText("Your personal task companion")).toBeTruthy();
        expect(getByText("Made with 💙")).toBeTruthy();
    });

    it("navigates to Tabs when user is authenticated (after delay)", () => {
        // Setup: User exists, not loading
        mockUseAuth.mockReturnValue({
            user: { id: "123" },
            isLoading: false,
        });

        render(<SplashScreen />);

        // Fast-forward time by 2 seconds
        act(() => {
            jest.advanceTimersByTime(2000);
        });

        expect(mockReplace).toHaveBeenCalledWith("/(tabs)");
    });

    it("navigates to Welcome when user is NOT authenticated (after delay)", () => {
        // Setup: No user, not loading
        mockUseAuth.mockReturnValue({
            user: null,
            isLoading: false,
        });

        render(<SplashScreen />);

        // Fast-forward time
        act(() => {
            jest.advanceTimersByTime(2000);
        });

        expect(mockReplace).toHaveBeenCalledWith("/welcome");
    });

    it("does NOT navigate if still loading", () => {
        // Setup: Still loading
        mockUseAuth.mockReturnValue({
            user: null,
            isLoading: true,
        });

        render(<SplashScreen />);

        // Fast-forward time
        act(() => {
            jest.advanceTimersByTime(2000);
        });

        // Should verify the isLoading check inside setTimeout prevented navigation
        expect(mockReplace).not.toHaveBeenCalled();
    });
});
