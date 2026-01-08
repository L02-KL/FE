import HomeScreen from "@/app/(tabs)/index";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

// ----------------------------------------------------------------------
// 1. Mocks
// ----------------------------------------------------------------------

// Mock Navigation
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
    useRouter: () => ({ push: mockPush }),
    useFocusEffect: (cb: any) => cb(), // Run effect immediately
}));

// Mock API Hook
const mockUseDashboard = jest.fn();
jest.mock("@/hooks/useApi", () => ({
    useDashboard: () => mockUseDashboard(),
}));

// Mock Theme
jest.mock("@/contexts/ThemeContext", () => ({
    useTheme: () => ({
        colors: {
            background: "#fff",
            primary: "blue",
            primaryLight: "lightblue",
            accent: "orange",
            accentLight: "lightorange",
            error: "red",
            textSecondary: "gray",
        },
    }),
}));

// Mock Child Components
jest.mock("@/components/common/Mascot", () => ({
    Mascot: ({ mood }: any) => {
        const { Text } = require("react-native");
        return <Text testID="mascot">{mood}</Text>;
    },
}));

jest.mock("@/components/home/HeaderGreeting", () => ({
    HeaderGreeting: () => {
        const { Text } = require("react-native");
        return <Text>Hello User</Text>;
    },
}));

jest.mock("@/components/home/StatsCard", () => ({
    StatsCard: ({ label, value }: any) => {
        const { View, Text } = require("react-native");
        return (
            <View testID={`stats-card-${label}`}>
                <Text>{label}</Text>
                <Text>{value}</Text>
            </View>
        );
    },
}));

jest.mock("@/components/common/SectionHeader", () => ({
    SectionHeader: ({ title, onActionPress }: any) => {
        const { View, Text, TouchableOpacity } = require("react-native");
        return (
            <View>
                <Text>{title}</Text>
                <TouchableOpacity onPress={onActionPress} testID="view-all-btn">
                    <Text>View All</Text>
                </TouchableOpacity>
            </View>
        );
    },
}));

jest.mock("@/components/tasks/TaskCard", () => ({
    TaskCard: ({ task, onPress }: any) => {
        const { TouchableOpacity, Text } = require("react-native");
        return (
            <TouchableOpacity onPress={onPress} testID={`task-card-${task.id}`}>
                <Text>{task.title}</Text>
            </TouchableOpacity>
        );
    },
}));

// FIX: Removed the incorrect ScrollView mock.
// The default React Native mock preset handles ScrollView correctly.

describe("HomeScreen", () => {
    const mockRefetch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Default success state
        mockUseDashboard.mockReturnValue({
            data: {
                stats: { tasksDue: 5, coursesCount: 3 },
                upcomingTasks: [
                    { id: "1", title: "Math Homework" },
                    { id: "2", title: "Physics Quiz" },
                ],
            },
            loading: false,
            error: null,
            refetch: mockRefetch,
        });
    });

    it("renders loading state correctly", () => {
        mockUseDashboard.mockReturnValue({
            loading: true,
            error: null,
            refetch: mockRefetch,
        });

        const { getByText } = render(<HomeScreen />);

        expect(getByText("Loading...")).toBeTruthy();
        expect(getByText("bored")).toBeTruthy();
    });

    it("renders error state correctly", () => {
        mockUseDashboard.mockReturnValue({
            loading: false,
            error: { message: "Server error" },
            refetch: mockRefetch,
        });

        const { getByText } = render(<HomeScreen />);

        expect(getByText("Error loading dashboard")).toBeTruthy();
        expect(getByText("Server error")).toBeTruthy();
        expect(getByText("angry")).toBeTruthy();
    });

    it("renders dashboard content correctly (Stats and Tasks)", () => {
        const { getByText } = render(<HomeScreen />);

        expect(getByText("Hello User")).toBeTruthy();
        expect(getByText("Tasks Due")).toBeTruthy();
        expect(getByText("5")).toBeTruthy();
        expect(getByText("Courses")).toBeTruthy();
        expect(getByText("3")).toBeTruthy();

        // Check Tasks
        expect(getByText("Upcoming Tasks")).toBeTruthy();
        expect(getByText("Math Homework")).toBeTruthy();
        expect(getByText("Physics Quiz")).toBeTruthy();
    });

    it('navigates to /tasks when "View All" is pressed', () => {
        const { getByTestId } = render(<HomeScreen />);

        fireEvent.press(getByTestId("view-all-btn"));

        expect(mockPush).toHaveBeenCalledWith("/tasks");
    });

    it("navigates to task details when a task card is pressed", () => {
        const { getByTestId } = render(<HomeScreen />);

        fireEvent.press(getByTestId("task-card-1"));

        expect(mockPush).toHaveBeenCalledWith("/task/1");
    });

    it("calls refetch on focus", () => {
        render(<HomeScreen />);
        expect(mockRefetch).toHaveBeenCalled();
    });
});
