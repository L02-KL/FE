import RootLayout from "@/app/_layout";
import { render } from "@testing-library/react-native";
import React from "react";

// ----------------------------------------------------------------------
// 1. Mock Hooks and Contexts
// ----------------------------------------------------------------------

const mockUseAuth = jest.fn();
const mockUseTheme = jest.fn();
const mockUseProtectedRoute = jest.fn();
const mockUsePushNotifications = jest.fn();

jest.mock("@/contexts/AuthContext", () => ({
    AuthProvider: ({ children }: any) => <>{children}</>,
    useAuth: () => mockUseAuth(),
    useProtectedRoute: (...args: any) => mockUseProtectedRoute(...args),
}));

jest.mock("@/contexts/ThemeContext", () => ({
    ThemeProvider: ({ children }: any) => <>{children}</>,
    useTheme: () => mockUseTheme(),
}));

jest.mock("@/hooks/usePushNotifications", () => ({
    usePushNotifications: () => mockUsePushNotifications(),
}));

// FIX: Ensure mock components are valid React components
jest.mock("@react-navigation/native", () => {
    const React = require("react");
    return {
        ThemeProvider: ({ children }: any) => <>{children}</>, // Return a Fragment
        DarkTheme: { colors: {} },
        DefaultTheme: { colors: {} },
    };
});

// ----------------------------------------------------------------------
// 2. Mock UI Components
// ----------------------------------------------------------------------

jest.mock("expo-status-bar", () => ({
    StatusBar: ({ style }: any) => {
        const { View } = require("react-native");
        return <View testID="mock-status-bar" accessibilityLabel={style} />;
    },
}));

jest.mock("expo-router", () => {
    const { View } = require("react-native");
    const Stack = ({ children }: any) => (
        <View testID="stack-navigator">{children}</View>
    );
    Stack.Screen = ({ name }: any) => <View testID={`stack-screen-${name}`} />;
    return { Stack };
});

jest.mock("react-native-reanimated", () =>
    require("react-native-reanimated/mock")
);

jest.mock(
    "react-native/Libraries/Components/ActivityIndicator/ActivityIndicator",
    () => {
        const { View } = require("react-native");
        return (props: any) => <View testID="activity-indicator" {...props} />;
    }
);

describe("RootLayout", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders Navigation Stack when auth is loaded", () => {
        mockUseAuth.mockReturnValue({
            user: { email: "test@test.com" },
            isLoading: false,
            isOnboardingCompleted: true,
        });
        mockUseTheme.mockReturnValue({ isDark: false });

        const { getByTestId, queryByTestId } = render(<RootLayout />);

        expect(queryByTestId("activity-indicator")).toBeNull();
        expect(getByTestId("stack-navigator")).toBeTruthy();
    });

    it('passes "dark" style to StatusBar when theme is light', () => {
        mockUseAuth.mockReturnValue({ isLoading: false });
        mockUseTheme.mockReturnValue({ isDark: false });

        const { getByTestId } = render(<RootLayout />);

        const statusBar = getByTestId("mock-status-bar");
        expect(statusBar.props.accessibilityLabel).toBe("dark");
    });

    it('passes "light" style to StatusBar when theme is dark', () => {
        mockUseAuth.mockReturnValue({ isLoading: false });
        mockUseTheme.mockReturnValue({ isDark: true });

        const { getByTestId } = render(<RootLayout />);

        const statusBar = getByTestId("mock-status-bar");
        expect(statusBar.props.accessibilityLabel).toBe("light");
    });
});
