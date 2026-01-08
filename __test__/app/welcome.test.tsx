import WelcomeScreen from "@/app/welcome";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

// ----------------------------------------------------------------------
// 1. Mocks
// ----------------------------------------------------------------------

// Mock Expo Router
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
    Link: ({ href, children, asChild }: any) => {
        // Import React INSIDE the mock factory to avoid "ReferenceError"
        const React = require("react");
        const { TouchableOpacity } = require("react-native");

        if (asChild) {
            return React.cloneElement(React.Children.only(children), {
                onPress: () => mockPush(href),
                testID: `link-${href}`,
            });
        }

        return (
            <TouchableOpacity
                testID={`link-${href}`}
                onPress={() => mockPush(href)}
            >
                {children}
            </TouchableOpacity>
        );
    },
}));

// Mock Expo Image
jest.mock("expo-image", () => {
    const { View } = require("react-native");
    return {
        Image: (props: any) => <View testID="expo-image" {...props} />,
    };
});

// Mock Vector Icons
jest.mock("@expo/vector-icons", () => ({
    MaterialCommunityIcons: ({ name }: any) => {
        const { Text } = require("react-native");
        return <Text>{name}</Text>;
    },
}));

// Mock Safe Area
jest.mock("react-native-safe-area-context", () => ({
    SafeAreaView: ({ children, style }: any) => {
        const { View } = require("react-native");
        return <View style={style}>{children}</View>;
    },
}));

// Mock Status Bar
jest.mock("expo-status-bar", () => ({
    StatusBar: () => null,
}));

describe("WelcomeScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders branding and description text correctly", () => {
        const { getByText } = render(<WelcomeScreen />);

        expect(getByText("DeadTood")).toBeTruthy();

        // FIX: Use Regex to match the text because it contains a nested <Text> component (✨)
        // which breaks exact string matching.
        expect(getByText(/Plan smart\. Do better\./)).toBeTruthy();

        expect(
            getByText(
                "Stay on top of your assignments, deadlines, and study goals"
            )
        ).toBeTruthy();

        // Use regex for the footer too, just to be safe with the heart emoji
        expect(getByText(/Made for students, by students/)).toBeTruthy();
    });

    it("renders the illustration image", () => {
        const { getByTestId } = render(<WelcomeScreen />);
        expect(getByTestId("expo-image")).toBeTruthy();
    });

    it('renders the "Continue with Email" button with correct icon', () => {
        const { getByText } = render(<WelcomeScreen />);

        expect(getByText("Continue with Email")).toBeTruthy();
        // Check icon (mocked to render text name)
        expect(getByText("email-outline")).toBeTruthy();
    });

    it('navigates to /login when "Continue with Email" is pressed', () => {
        const { getByTestId } = render(<WelcomeScreen />);

        const emailLink = getByTestId("link-/login");
        fireEvent.press(emailLink);

        expect(mockPush).toHaveBeenCalledWith("/login");
    });
});
