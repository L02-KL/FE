import CourseDetailScreen from "@/app/course/[id]";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { ActivityIndicator } from "react-native";

// ----------------------------------------------------------------------
// 1. Mocks
// ----------------------------------------------------------------------

// Mock Navigation
const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock("expo-router", () => ({
    useRouter: () => ({
        push: mockPush,
        back: mockBack,
    }),
    useLocalSearchParams: () => ({ id: "course-123" }),
}));

// Mock API Hooks
const mockUseCourse = jest.fn();
const mockUseTasks = jest.fn();

jest.mock("@/hooks/useApi", () => ({
    useCourse: (id: string) => mockUseCourse(id),
    useTasks: (filters: any) => mockUseTasks(filters),
}));

// Mock Theme
jest.mock("@/contexts/ThemeContext", () => ({
    useTheme: () => ({
        colors: {
            background: "#fff",
            cardBackground: "#f5f5f5",
            textPrimary: "#000",
            textSecondary: "#666",
            textMuted: "#999",
            primary: "blue",
            error: "red",
            border: "#ccc",
            priorityHigh: "red",
            priorityMedium: "orange",
            priorityLow: "green",
        },
    }),
}));

// Mock Icons
jest.mock("@expo/vector-icons", () => ({
    Ionicons: ({ name }: any) => {
        const { Text } = require("react-native");
        return <Text testID={`icon-${name}`}>{name}</Text>;
    },
}));

// Mock Safe Area
jest.mock("react-native-safe-area-context", () => ({
    SafeAreaView: ({ children }: any) => <>{children}</>,
}));

// FIX: Mock CourseCard helper function
jest.mock("@/components/courses/CourseCard", () => ({
    getCourseIcon: () => {
        const { View } = require("react-native");
        return <View testID="course-icon" />;
    },
}));

// FIX: Removed manual ActivityIndicator mock.
// We will use UNSAFE_getByType to find it.

describe("CourseDetailScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Default mock implementation
        mockUseCourse.mockReturnValue({
            data: {
                id: "course-123",
                name: "Introduction to Computer Science",
                code: "CS101",
                semester: "Fall 2024",
                instructor: "Dr. Smith",
                color: "blue",
                icon: "code",
                progress: 75,
            },
            loading: false,
        });

        mockUseTasks.mockReturnValue({
            data: {
                items: [
                    {
                        id: "task-1",
                        title: "Midterm Exam",
                        priority: "high",
                        status: "pending",
                        dueDate: new Date("2024-10-15"),
                        dueTime: "10:00 AM",
                    },
                    {
                        id: "task-2",
                        title: "Lab Report 1",
                        priority: "medium",
                        status: "done",
                        dueDate: new Date("2024-09-20"),
                        dueTime: "11:59 PM",
                    },
                ],
            },
            loading: false,
        });
    });

    it("renders loading state correctly", () => {
        mockUseCourse.mockReturnValue({ loading: true });

        // FIX: Use UNSAFE_getByType to find built-in components without testIDs
        const { UNSAFE_getByType } = render(<CourseDetailScreen />);

        expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });

    it("renders error state when course is not found", () => {
        mockUseCourse.mockReturnValue({ data: null, loading: false });

        const { getByText } = render(<CourseDetailScreen />);

        expect(getByText("Course not found")).toBeTruthy();
        expect(getByText("Go back")).toBeTruthy();
    });

    it("renders course details correctly", () => {
        const { getByText } = render(<CourseDetailScreen />);

        expect(getByText("Introduction to Computer Science")).toBeTruthy();
        expect(getByText("CS101")).toBeTruthy();
        expect(getByText("Fall 2024")).toBeTruthy();
        expect(getByText("Dr. Smith")).toBeTruthy();
        expect(getByText("75%")).toBeTruthy(); // Progress
    });

    it("renders task list associated with the course", () => {
        const { getByText } = render(<CourseDetailScreen />);

        expect(getByText("Midterm Exam")).toBeTruthy();
        expect(getByText("Lab Report 1")).toBeTruthy();

        // Check Task Status Labels
        expect(getByText("Pending")).toBeTruthy();
        expect(getByText("Completed")).toBeTruthy();
    });

    it("renders correct statistics", () => {
        const { getByText, getAllByText } = render(<CourseDetailScreen />);

        // Total tasks: 2
        // Active tasks: 1 (Midterm)
        // Done tasks: 1 (Lab Report)

        expect(getByText("2")).toBeTruthy(); // Total
        expect(getAllByText("1").length).toBeGreaterThanOrEqual(2); // Active & Done
    });

    it("navigates back when back button is pressed", () => {
        const { getByText } = render(<CourseDetailScreen />);

        fireEvent.press(getByText("Back"));

        expect(mockBack).toHaveBeenCalled();
    });

    it("navigates to task details when a task is pressed", () => {
        const { getByText } = render(<CourseDetailScreen />);

        fireEvent.press(getByText("Midterm Exam"));

        expect(mockPush).toHaveBeenCalledWith("/task/task-1");
    });

    it("shows empty state when no tasks exist", () => {
        mockUseTasks.mockReturnValue({
            data: { items: [] },
            loading: false,
        });

        const { getByText } = render(<CourseDetailScreen />);

        expect(getByText("No tasks yet")).toBeTruthy();
        expect(getByText("Add your first task for this course")).toBeTruthy();
    });
});
