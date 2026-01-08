import SettingsScreen from "@/app/(tabs)/settings";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Alert, Switch } from "react-native"; // Import Switch for type matching

// ----------------------------------------------------------------------
// 1. Mocks
// ----------------------------------------------------------------------

const mockPush = jest.fn();
jest.mock("expo-router", () => ({
    useRouter: () => ({ push: mockPush }),
}));

const mockLogout = jest.fn();
jest.mock("@/contexts/AuthContext", () => ({
    useAuth: () => ({ logout: mockLogout }),
}));

const mockSetThemeMode = jest.fn();
const mockToggleTheme = jest.fn();

jest.mock("@/contexts/ThemeContext", () => ({
    useTheme: () => ({
        isDark: false,
        themeMode: "light",
        setThemeMode: mockSetThemeMode,
        toggleTheme: mockToggleTheme,
        colors: {
            background: "#fff",
            cardBackground: "#f5f5f5",
            textPrimary: "#000",
            textSecondary: "#666",
            textMuted: "#999",
            border: "#ccc",
            primary: "blue",
            accent: "orange",
            error: "red",
            white: "#fff",
        },
    }),
}));

jest.mock("@expo/vector-icons", () => ({
    Ionicons: ({ name }: any) => {
        const { Text } = require("react-native");
        return <Text testID={`icon-${name}`}>{name}</Text>;
    },
}));

jest.mock("react-native-safe-area-context", () => ({
    SafeAreaView: ({ children }: any) => <>{children}</>,
}));

// REMOVED: Manual ScrollView and Switch mocks.
// We rely on the React Native Jest preset to handle these correctly.

describe("SettingsScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(Alert, "alert");
    });

    it("renders all setting sections", () => {
        const { getByText } = render(<SettingsScreen />);

        expect(getByText("Account")).toBeTruthy();
        expect(getByText("Appearance")).toBeTruthy();
        expect(getByText("General")).toBeTruthy();
        expect(getByText("Support")).toBeTruthy();
    });

    it("renders specific setting items", () => {
        const { getByText } = render(<SettingsScreen />);

        expect(getByText("Profile")).toBeTruthy();
        expect(getByText("Notifications")).toBeTruthy();
        expect(getByText("Dark Mode")).toBeTruthy();
        expect(getByText("Language")).toBeTruthy();
        expect(getByText("Help Center")).toBeTruthy();
    });

    it("navigates to profile when profile item is pressed", () => {
        const { getByText } = render(<SettingsScreen />);
        fireEvent.press(getByText("Profile"));
        expect(mockPush).toHaveBeenCalledWith("/profile");
    });

    it("toggles theme when Dark Mode switch is pressed", () => {
        // We use UNSAFE_getAllByType to find the Switch components since they don't have testIDs.
        // This is a standard fallback when modifying source code isn't desired.
        const { UNSAFE_getAllByType } = render(<SettingsScreen />);

        const switches = UNSAFE_getAllByType(Switch);

        // 1st Switch: Notifications
        // 2nd Switch: Dark Mode
        const darkModeSwitch = switches[1];

        // Trigger the value change event
        fireEvent(darkModeSwitch, "valueChange", true);

        expect(mockToggleTheme).toHaveBeenCalled();
    });

    it("cycles theme mode when Theme Mode item is pressed", () => {
        const { getByText } = render(<SettingsScreen />);

        // Initial label is "Light" (mocked)
        const themeModeItem = getByText("Theme Mode");
        fireEvent.press(themeModeItem);

        // It should cycle from 'light' -> 'dark'
        expect(mockSetThemeMode).toHaveBeenCalledWith("dark");
    });

    it("handles logout flow", async () => {
        const { getByText } = render(<SettingsScreen />);

        fireEvent.press(getByText("Log Out"));

        expect(Alert.alert).toHaveBeenCalled();

        // Simulate pressing 'Log Out' in the alert
        const alertButtons = (Alert.alert as jest.Mock).mock.calls[0][2];
        const logoutAction = alertButtons.find(
            (btn: any) => btn.text === "Log Out"
        );

        await logoutAction.onPress();

        expect(mockLogout).toHaveBeenCalled();
    });
});
