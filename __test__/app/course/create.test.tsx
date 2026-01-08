import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";
// Correct import path based on your file structure
import CreateCourseScreen from "@/app/course/create";

// ----------------------------------------------------------------------
// 1. Mocks
// ----------------------------------------------------------------------

const mockBack = jest.fn();
jest.mock("expo-router", () => ({
    useRouter: () => ({ back: mockBack }),
}));

const mockCreateCourse = jest.fn();
jest.mock("@/hooks/useApi", () => ({
    useCourseMutations: () => ({
        createCourse: mockCreateCourse,
        loading: false,
    }),
}));

jest.mock("@/contexts/ThemeContext", () => ({
    useTheme: () => ({
        colors: {
            background: "#fff",
            cardBackground: "#f5f5f5",
            textPrimary: "#000",
            textSecondary: "#666",
            textMuted: "#999",
            border: "#ccc",
        },
        isDark: false,
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

// REMOVED: Manual ScrollView mock to prevent "Element type is invalid" errors.

describe("CreateCourseScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(Alert, "alert");
    });

    it("renders the form elements correctly", () => {
        const { getByText, getByPlaceholderText } = render(
            <CreateCourseScreen />
        );

        expect(getByText("Add New Course")).toBeTruthy();
        expect(getByText("Course Details")).toBeTruthy();
        expect(getByPlaceholderText("e.g., Calculus II")).toBeTruthy();
        expect(getByPlaceholderText("e.g., MATH 201")).toBeTruthy();
        expect(getByPlaceholderText("e.g., Dr. Smith")).toBeTruthy();
        expect(getByText("Choose Icon & Color")).toBeTruthy();
    });

    it("validates missing fields (Name, Code, Category)", async () => {
        const { getByText } = render(<CreateCourseScreen />);
        const createBtn = getByText("Create Course");

        fireEvent.press(createBtn);

        expect(Alert.alert).toHaveBeenCalledWith(
            "Missing Fields",
            "Please fill in Name, Code and select a Category."
        );
        expect(mockCreateCourse).not.toHaveBeenCalled();
    });

    it("selects a category when pressed", () => {
        const { getByText } = render(<CreateCourseScreen />);
        fireEvent.press(getByText("Math"));
        // We implicitly verify this in the success test where category data is sent
    });

    it("successfully creates a course with valid data", async () => {
        mockCreateCourse.mockResolvedValue(true);

        const { getByText, getByPlaceholderText } = render(
            <CreateCourseScreen />
        );

        // 1. Fill Form
        fireEvent.changeText(
            getByPlaceholderText("e.g., Calculus II"),
            "Advanced Math"
        );
        fireEvent.changeText(
            getByPlaceholderText("e.g., MATH 201"),
            "MATH 300"
        );
        fireEvent.changeText(
            getByPlaceholderText("e.g., Dr. Smith"),
            "Prof. X"
        );

        // 2. Select Category (Math)
        fireEvent.press(getByText("Math"));

        // 3. Submit
        fireEvent.press(getByText("Create Course"));

        await waitFor(() => {
            // Verify API call arguments
            expect(mockCreateCourse).toHaveBeenCalledWith({
                name: "Advanced Math",
                code: "MATH 300",
                instructor: "Prof. X",
                semester: "Fall 2024",
                color: "#4A90E2", // Math color
                icon: "calculator", // Math icon
                description: "",
            });

            // Verify Success Alert
            expect(Alert.alert).toHaveBeenCalledWith(
                "Success",
                "Course created successfully!",
                expect.any(Array)
            );
        });

        // 4. Simulate pressing "OK" on success alert
        const alertButtons = (Alert.alert as jest.Mock).mock.calls[0][2];
        const okButton = alertButtons.find((btn: any) => btn.text === "OK");
        okButton.onPress();

        expect(mockBack).toHaveBeenCalled();
    });

    it("handles creation failure", async () => {
        mockCreateCourse.mockResolvedValue(false);

        const { getByText, getByPlaceholderText } = render(
            <CreateCourseScreen />
        );

        // Fill minimal valid data
        fireEvent.changeText(
            getByPlaceholderText("e.g., Calculus II"),
            "Fail Course"
        );
        fireEvent.changeText(
            getByPlaceholderText("e.g., MATH 201"),
            "FAIL 101"
        );
        fireEvent.press(getByText("Science"));

        fireEvent.press(getByText("Create Course"));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith(
                "Error",
                "Failed to create course. Please try again."
            );
        });
    });

    it("navigates back when back button is pressed", () => {
        const { getByText } = render(<CreateCourseScreen />);
        fireEvent.press(getByText("Back"));
        expect(mockBack).toHaveBeenCalled();
    });
});
