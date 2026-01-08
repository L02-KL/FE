import LoginScreen from "@/app/login";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";

// ----------------------------------------------------------------------
// 1. Mocks
// ----------------------------------------------------------------------

// Mock Navigation and Links
const mockBack = jest.fn();
const mockPush = jest.fn();

jest.mock("expo-router", () => ({
    useRouter: () => ({
        back: mockBack,
        push: mockPush,
    }),
    // Mock Link to just render its children
    Link: ({ children, href }: any) => {
        const { TouchableOpacity } = require("react-native");
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

// Mock Auth Context
const mockLogin = jest.fn();
jest.mock("@/contexts/AuthContext", () => ({
    useAuth: () => ({
        login: mockLogin,
    }),
}));

// Mock Vector Icons to avoid rendering issues
jest.mock("@expo/vector-icons", () => ({
    AntDesign: ({ name }: any) => {
        const { Text } = require("react-native");
        return <Text testID={`icon-${name}`}>{name}</Text>;
    },
    Feather: ({ name, onPress }: any) => {
        const { Text } = require("react-native");
        // Pass onPress if it exists (for the eye icon)
        return (
            <Text testID={`icon-${name}`} onPress={onPress}>
                {name}
            </Text>
        );
    },
}));

// Mock Safe Area Context
jest.mock("react-native-safe-area-context", () => ({
    SafeAreaView: ({ children, style }: any) => {
        const { View } = require("react-native");
        return <View style={style}>{children}</View>;
    },
}));

describe("LoginScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(Alert, "alert"); // Spy on Alert to check validation messages
    });

    it("renders all UI elements correctly", () => {
        const { getByText, getByPlaceholderText } = render(<LoginScreen />);

        expect(getByText("Welcome Back")).toBeTruthy();
        expect(getByText("Sign in to continue to DeadTood")).toBeTruthy();
        expect(getByPlaceholderText("your.email@university.edu")).toBeTruthy();
        expect(getByPlaceholderText("Enter your password")).toBeTruthy();
        expect(getByText("Sign In")).toBeTruthy();
        expect(getByText("Sign Up")).toBeTruthy();
    });

    it("updates email and password state on input", () => {
        const { getByPlaceholderText } = render(<LoginScreen />);

        const emailInput = getByPlaceholderText("your.email@university.edu");
        const passwordInput = getByPlaceholderText("Enter your password");

        fireEvent.changeText(emailInput, "student@test.edu");
        fireEvent.changeText(passwordInput, "secret123");

        expect(emailInput.props.value).toBe("student@test.edu");
        expect(passwordInput.props.value).toBe("secret123");
    });

    it("shows an alert if fields are empty on submit", async () => {
        const { getByText } = render(<LoginScreen />);
        const loginBtn = getByText("Sign In");

        fireEvent.press(loginBtn);

        expect(Alert.alert).toHaveBeenCalledWith(
            "Error",
            "Please enter both email and password"
        );
        expect(mockLogin).not.toHaveBeenCalled();
    });

    it("calls login function with trimmed email when inputs are valid", async () => {
        const { getByText, getByPlaceholderText } = render(<LoginScreen />);

        fireEvent.changeText(
            getByPlaceholderText("your.email@university.edu"),
            "  user@test.com  "
        );
        fireEvent.changeText(
            getByPlaceholderText("Enter your password"),
            "password123"
        );

        fireEvent.press(getByText("Sign In"));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({
                email: "user@test.com", // Should be trimmed
                password: "password123",
            });
        });
    });

    it("shows an error alert if login fails", async () => {
        // Mock login to reject
        mockLogin.mockRejectedValueOnce({
            message: "Invalid credentials",
        });

        const { getByText, getByPlaceholderText } = render(<LoginScreen />);

        fireEvent.changeText(
            getByPlaceholderText("your.email@university.edu"),
            "user@test.com"
        );
        fireEvent.changeText(
            getByPlaceholderText("Enter your password"),
            "wrongpass"
        );

        fireEvent.press(getByText("Sign In"));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith(
                "Login Failed",
                "Invalid credentials"
            );
        });
    });

    it("navigates back when back button is pressed", () => {
        const { getByText } = render(<LoginScreen />);

        // The back button text is "Back" inside the header
        const backButton = getByText("Back");
        fireEvent.press(backButton);

        expect(mockBack).toHaveBeenCalledTimes(1);
    });

    it("toggles password visibility when eye icon is pressed", () => {
        const { getByPlaceholderText, getByTestId, queryByTestId } = render(
            <LoginScreen />
        );
        const passwordInput = getByPlaceholderText("Enter your password");

        // 1. Default state: Secure entry is true, icon is "eye-off"
        expect(passwordInput.props.secureTextEntry).toBe(true);
        expect(getByTestId("icon-eye-off")).toBeTruthy();

        // 2. Press the eye-off icon
        fireEvent.press(getByTestId("icon-eye-off"));

        // 3. New state: Secure entry is false, icon becomes "eye"
        expect(passwordInput.props.secureTextEntry).toBe(false);
        expect(getByTestId("icon-eye")).toBeTruthy();
        expect(queryByTestId("icon-eye-off")).toBeNull(); // Old icon should be gone
    });
});
