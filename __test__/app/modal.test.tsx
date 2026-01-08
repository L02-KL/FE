import AddTaskModal from "@/app/modal";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";

// ----------------------------------------------------------------------
// 1. Mocks
// ----------------------------------------------------------------------

const mockBack = jest.fn();
jest.mock("expo-router", () => ({
    useRouter: () => ({ back: mockBack }),
}));

jest.mock("@/contexts/ThemeContext", () => ({
    useTheme: () => ({
        colors: {
            background: "#ffffff",
            cardBackground: "#f5f5f5",
            textPrimary: "#000000",
            textSecondary: "#666666",
            primary: "#007bff",
            error: "#ff0000",
            border: "#e0e0e0",
        },
    }),
}));

const mockCreateTask = jest.fn();
jest.mock("@/hooks/useApi", () => ({
    useCourses: () => ({
        data: {
            items: [
                {
                    id: "c1",
                    name: "Mathematics",
                    code: "MATH101",
                    color: "red",
                },
                { id: "c2", name: "Physics", code: "PHY101", color: "blue" },
            ],
        },
    }),
    useTaskMutations: () => ({
        createTask: mockCreateTask,
        loading: false,
    }),
}));

jest.mock("expo-notifications", () => ({
    scheduleNotificationAsync: jest.fn(),
    SchedulableTriggerInputTypes: {
        TIME_INTERVAL: "timeInterval",
    },
}));

jest.mock("@react-native-community/datetimepicker", () => {
    const { View } = require("react-native");
    return (props: any) => <View testID="mock-datepicker" {...props} />;
});

jest.mock("@expo/vector-icons", () => ({
    Ionicons: ({ name }: any) => {
        const { Text } = require("react-native");
        return <Text>{name}</Text>;
    },
}));

describe("AddTaskModal", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(Alert, "alert");
    });

    it("renders the form correctly", () => {
        const { getByText, getByPlaceholderText } = render(<AddTaskModal />);

        expect(getByText("Add New Task")).toBeTruthy();
        expect(getByPlaceholderText("e.g., Math Assignment 2")).toBeTruthy();
        expect(getByText("Select a course")).toBeTruthy();
        expect(getByText("Task Details")).toBeTruthy();
    });

    it("validates required fields (Title, Course, Date) before submission", async () => {
        // FIX: Render ONLY ONCE
        const { getByText, getByPlaceholderText } = render(<AddTaskModal />);
        const createBtn = getByText("Create Task");

        // 1. Submit empty
        fireEvent.press(createBtn);
        expect(Alert.alert).toHaveBeenCalledWith(
            "Error",
            "Please enter a task title"
        );

        // 2. Fill Title, Submit (Missing Course)
        // Use the existing getter from the single render
        fireEvent.changeText(
            getByPlaceholderText("e.g., Math Assignment 2"),
            "My Task"
        );

        fireEvent.press(createBtn);
        expect(Alert.alert).toHaveBeenCalledWith(
            "Error",
            "Please select a course"
        );
    });

    it("allows selecting a course from the picker", async () => {
        const { getByText } = render(<AddTaskModal />);

        fireEvent.press(getByText("Select a course"));
        expect(getByText("Mathematics")).toBeTruthy();

        fireEvent.press(getByText("Mathematics"));

        await waitFor(() => {
            expect(getByText("Mathematics")).toBeTruthy();
        });
    });

    it("successfully creates a task with valid data", async () => {
        mockCreateTask.mockResolvedValue({ id: "task-1", title: "Test Task" });

        const { getByText, getByPlaceholderText, getByTestId } = render(
            <AddTaskModal />
        );

        fireEvent.changeText(
            getByPlaceholderText("e.g., Math Assignment 2"),
            "Final Exam"
        );
        fireEvent.press(getByText("Select a course"));
        fireEvent.press(getByText("Physics"));

        fireEvent.press(getByText("dd/mm/yyyy"));
        const datePicker = getByTestId("mock-datepicker");
        const futureDate = new Date("2025-12-31T12:00:00");
        fireEvent(datePicker, "onChange", { type: "set" }, futureDate);

        fireEvent.press(getByText("Create Task"));

        await waitFor(() => {
            expect(mockCreateTask).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: "Final Exam",
                    courseId: "c2",
                })
            );
            expect(mockBack).toHaveBeenCalled();
        });
    });

    it("handles navigation back", () => {
        const { getByText } = render(<AddTaskModal />);
        fireEvent.press(getByText("Back"));
        expect(mockBack).toHaveBeenCalled();
    });
});
