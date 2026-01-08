import RegisterScreen from "@/app/register";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";

// ----------------------------------------------------------------------
// 1. Mocks
// ----------------------------------------------------------------------

// Mock Navigation
const mockBack = jest.fn();
const mockPush = jest.fn();

jest.mock("expo-router", () => ({
    useRouter: () => ({
        back: mockBack,
        push: mockPush,
    }),
}));

// Mock Auth Context
const mockRegister = jest.fn();
jest.mock("@/contexts/AuthContext", () => ({
    useAuth: () => ({
        register: mockRegister,
    }),
}));

// Mock Icons - FIXED: Wrap in Text to ensure getByText finds them
jest.mock("@expo/vector-icons", () => ({
    AntDesign: ({ name }: any) => {
        const { Text } = require("react-native");
        return <Text>{name}</Text>;
    },
    Feather: ({ name }: any) => {
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

describe("RegisterScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(Alert, "alert");
    });

    // Helper to find the Create Account button (skipping the header title)
    const getCreateButton = (getAllByText: any) => {
        const elements = getAllByText("Create Account");
        return elements[elements.length - 1]; // The button is at the bottom
    };

    it("renders all form elements correctly", () => {
        const { getAllByText, getByPlaceholderText } = render(
            <RegisterScreen />
        );

        // Header Title and Button both have this text
        expect(getAllByText("Create Account").length).toBeGreaterThanOrEqual(2);

        expect(getByPlaceholderText("your.email@university.edu")).toBeTruthy();
        expect(getByPlaceholderText("Enter your password")).toBeTruthy();
        expect(getByPlaceholderText("Confirm your password")).toBeTruthy();
    });

    it("validates empty fields", () => {
        const { getAllByText } = render(<RegisterScreen />);
        const createBtn = getCreateButton(getAllByText);

        fireEvent.press(createBtn);

        expect(Alert.alert).toHaveBeenCalledWith(
            "Error",
            "Please fill in all fields"
        );
        expect(mockRegister).not.toHaveBeenCalled();
    });

    it("validates password mismatch", () => {
        const { getAllByText, getByPlaceholderText } = render(
            <RegisterScreen />
        );

        fireEvent.changeText(
            getByPlaceholderText("your.email@university.edu"),
            "test@test.com"
        );
        fireEvent.changeText(
            getByPlaceholderText("Enter your password"),
            "password123"
        );
        fireEvent.changeText(
            getByPlaceholderText("Confirm your password"),
            "password999"
        ); // Mismatch

        const createBtn = getCreateButton(getAllByText);
        fireEvent.press(createBtn);

        expect(Alert.alert).toHaveBeenCalledWith(
            "Error",
            "Passwords do not match"
        );
        expect(mockRegister).not.toHaveBeenCalled();
    });

    it("calls register with valid data and shows success alert", async () => {
        const { getAllByText, getByPlaceholderText } = render(
            <RegisterScreen />
        );

        fireEvent.changeText(
            getByPlaceholderText("your.email@university.edu"),
            "student@uni.edu"
        );
        fireEvent.changeText(
            getByPlaceholderText("Enter your password"),
            "secretPass"
        );
        fireEvent.changeText(
            getByPlaceholderText("Confirm your password"),
            "secretPass"
        );

        const createBtn = getCreateButton(getAllByText);
        fireEvent.press(createBtn);

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith({
                email: "student@uni.edu",
                password: "secretPass",
            });
            expect(Alert.alert).toHaveBeenCalledWith(
                "Success",
                "Account created successfully!"
            );
        });
    });

    it("handles registration errors gracefully", async () => {
        // Mock failure
        mockRegister.mockRejectedValueOnce({ message: "Email already in use" });

        const { getAllByText, getByPlaceholderText } = render(
            <RegisterScreen />
        );

        fireEvent.changeText(
            getByPlaceholderText("your.email@university.edu"),
            "existing@uni.edu"
        );
        fireEvent.changeText(
            getByPlaceholderText("Enter your password"),
            "pass"
        );
        fireEvent.changeText(
            getByPlaceholderText("Confirm your password"),
            "pass"
        );

        const createBtn = getCreateButton(getAllByText);
        fireEvent.press(createBtn);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith(
                "Registration Failed",
                "Email already in use"
            );
        });
    });

    it("toggles password visibility", () => {
        const { getByPlaceholderText, getAllByText } = render(
            <RegisterScreen />
        );
        const passwordInput = getByPlaceholderText("Enter your password");

        // Initial state: secure
        expect(passwordInput.props.secureTextEntry).toBe(true);

        // Find the eye/eye-off icon.
        // getAllByText returns an array. The form has 2 password fields, so there are 2 icons.
        // We click the first one.
        const eyeOffIcons = getAllByText("eye-off");

        // We need to press the PARENT TouchableOpacity, not the Text itself
        fireEvent.press(eyeOffIcons[0].parent);

        // Should flip to visible
        expect(passwordInput.props.secureTextEntry).toBe(false);
    });

    it("navigates back when Back button is pressed", () => {
        const { getByText } = render(<RegisterScreen />);
        fireEvent.press(getByText("Back"));
        expect(mockBack).toHaveBeenCalled();
    });

    it("navigates to login when Sign In link is pressed", () => {
        const { getByText } = render(<RegisterScreen />);
        fireEvent.press(getByText("Sign In"));
        expect(mockPush).toHaveBeenCalledWith("/login");
    });
});
