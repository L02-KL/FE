import CoursesScreen from "@/app/(tabs)/courses";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

// ----------------------------------------------------------------------
// 1. Mocks
// ----------------------------------------------------------------------

// Mock Navigation
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
    useRouter: () => ({ push: mockPush }),
    useFocusEffect: (cb: any) => cb(), // Execute effect immediately
}));

// Mock API Hooks
const mockUseCourses = jest.fn();
const mockUseDashboardStats = jest.fn();

jest.mock("@/hooks/useApi", () => ({
    useCourses: () => mockUseCourses(),
    useDashboardStats: () => mockUseDashboardStats(),
}));

// Mock Theme
jest.mock("@/contexts/ThemeContext", () => ({
    useTheme: () => ({
        colors: {
            background: "#fff",
            cardBackground: "#f5f5f5",
            textPrimary: "#000",
            textSecondary: "#666",
            primary: "blue",
            error: "red",
            textMuted: "#999",
        },
    }),
}));

// Mock Components
jest.mock("@/components/common/Mascot", () => ({
    Mascot: ({ mood }: any) => {
        const { Text } = require("react-native");
        return <Text testID="mascot">{mood}</Text>;
    },
}));

jest.mock("@/components/courses/CourseCard", () => ({
    CourseCard: ({ course, onPress }: any) => {
        const { TouchableOpacity, Text } = require("react-native");
        return (
            <TouchableOpacity
                onPress={onPress}
                testID={`course-card-${course.id}`}
            >
                <Text>{course.name}</Text>
            </TouchableOpacity>
        );
    },
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

// ----------------------------------------------------------------------
// 2. Tests
// ----------------------------------------------------------------------

describe("CoursesScreen", () => {
    const mockRefetch = jest.fn();
    const mockRefetchStats = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Default Mock Implementations
        mockUseCourses.mockReturnValue({
            data: { items: [] },
            loading: false,
            error: null,
            refetch: mockRefetch,
        });

        mockUseDashboardStats.mockReturnValue({
            data: { tasksDue: 5 },
            refetch: mockRefetchStats,
        });
    });

    it("renders loading state correctly", () => {
        mockUseCourses.mockReturnValue({
            loading: true,
            error: null,
            refetch: mockRefetch,
        });

        const { getByText } = render(<CoursesScreen />);

        // Check for "bored" mascot
        expect(getByText("bored")).toBeTruthy();
    });

    it("renders error state correctly", () => {
        mockUseCourses.mockReturnValue({
            loading: false,
            error: { message: "Network Error" },
            refetch: mockRefetch,
        });

        const { getByText } = render(<CoursesScreen />);

        expect(getByText("angry")).toBeTruthy();
        expect(getByText("Error loading courses")).toBeTruthy();
        expect(getByText("Network Error")).toBeTruthy();
    });

    it("renders empty state when no courses exist", () => {
        mockUseCourses.mockReturnValue({
            data: { items: [] },
            loading: false,
            error: null,
            refetch: mockRefetch,
        });

        const { getByText, getByTestId } = render(<CoursesScreen />);

        expect(getByText("No courses found")).toBeTruthy();
        expect(getByText("Add your first course to get started")).toBeTruthy();
        expect(getByTestId("icon-school-outline")).toBeTruthy();
    });

    it("renders list of courses and stats", () => {
        const mockCourses = [
            { id: "1", name: "Math 101", semester: "Fall 2024" },
            { id: "2", name: "Physics 202", semester: "Fall 2024" },
        ];

        mockUseCourses.mockReturnValue({
            data: { items: mockCourses },
            loading: false,
            error: null,
            refetch: mockRefetch,
        });

        const { getByText } = render(<CoursesScreen />);

        // Header & Stats
        expect(getByText("My Courses")).toBeTruthy();
        expect(getByText("2 courses • Fall 2024")).toBeTruthy();

        // Stats Cards (Active Courses count)
        expect(getByText("2")).toBeTruthy(); // Active Courses count
        expect(getByText("5")).toBeTruthy(); // Pending Tasks count (from dashboard stats mock)

        // Course Cards
        expect(getByText("Math 101")).toBeTruthy();
        expect(getByText("Physics 202")).toBeTruthy();
    });

    it("navigates to course details when a card is pressed", () => {
        const mockCourses = [{ id: "101", name: "Math 101" }];

        mockUseCourses.mockReturnValue({
            data: { items: mockCourses },
            loading: false,
            refetch: mockRefetch,
        });

        const { getByTestId } = render(<CoursesScreen />);

        fireEvent.press(getByTestId("course-card-101"));

        expect(mockPush).toHaveBeenCalledWith("/course/101");
    });

    it("navigates to create course screen when add button is pressed", () => {
        const { getByTestId } = render(<CoursesScreen />);

        // The add button is an Ionicons named "add-circle" wrapped in Touchable
        const addButtonIcon = getByTestId("icon-add-circle");
        fireEvent.press(addButtonIcon.parent);

        expect(mockPush).toHaveBeenCalledWith("/course/create");
    });

    it("calls refetch on focus", () => {
        render(<CoursesScreen />);

        // Since we mocked useFocusEffect to run immediately
        expect(mockRefetch).toHaveBeenCalled();
        expect(mockRefetchStats).toHaveBeenCalled();
    });
});
