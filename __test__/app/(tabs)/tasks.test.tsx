import TasksScreen from "@/app/(tabs)/tasks";
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
const mockUseTasks = jest.fn();
jest.mock("@/hooks/useApi", () => ({
    useTasks: () => mockUseTasks(),
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
            white: "#fff",
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

jest.mock("@/components/tasks/TaskCard", () => ({
    TaskCard: ({ task, onPress }: any) => {
        const { TouchableOpacity, Text } = require("react-native");
        return (
            <TouchableOpacity onPress={onPress} testID={`task-card-${task.id}`}>
                <Text>{task.title}</Text>
                <Text>{task.priority}</Text>
            </TouchableOpacity>
        );
    },
}));

jest.mock("react-native-safe-area-context", () => ({
    SafeAreaView: ({ children }: any) => <>{children}</>,
}));

describe("TasksScreen", () => {
    const mockRefetch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Default success state mock
        mockUseTasks.mockReturnValue({
            data: {
                items: [
                    { id: "1", title: "Urgent Task", priority: "high" },
                    { id: "2", title: "Routine Task", priority: "medium" },
                    { id: "3", title: "Easy Task", priority: "low" },
                ],
            },
            loading: false,
            error: null,
            refetch: mockRefetch,
        });
    });

    it("renders loading state correctly", () => {
        mockUseTasks.mockReturnValue({
            loading: true,
            error: null,
            refetch: mockRefetch,
        });

        const { getByText } = render(<TasksScreen />);

        // Mascot should be 'bored' during loading
        expect(getByText("bored")).toBeTruthy();
    });

    it("renders error state correctly", () => {
        mockUseTasks.mockReturnValue({
            loading: false,
            error: { message: "Network Failure" },
            refetch: mockRefetch,
        });

        const { getByText } = render(<TasksScreen />);

        expect(getByText("Error loading tasks")).toBeTruthy();
        expect(getByText("Network Failure")).toBeTruthy();
        // Mascot should be 'angry' on error
        expect(getByText("angry")).toBeTruthy();
    });

    it("renders empty state correctly", () => {
        mockUseTasks.mockReturnValue({
            data: { items: [] }, // No tasks
            loading: false,
            error: null,
            refetch: mockRefetch,
        });

        const { getByText } = render(<TasksScreen />);

        expect(getByText("No tasks found")).toBeTruthy();
        expect(getByText("Add a new task to get started!")).toBeTruthy();
        // Mascot should be 'sad' when empty
        expect(getByText("sad")).toBeTruthy();
    });

    it("renders list of tasks and filters them correctly", () => {
        const { getByText, queryByText } = render(<TasksScreen />);

        // 1. Initial State: All tasks visible
        expect(getByText("Urgent Task")).toBeTruthy();
        expect(getByText("Routine Task")).toBeTruthy();
        expect(getByText("Easy Task")).toBeTruthy();
        expect(getByText("3 tasks total")).toBeTruthy();

        // 2. Filter by "High"
        fireEvent.press(getByText("High"));

        // Should show Urgent, hide others
        expect(getByText("Urgent Task")).toBeTruthy();
        expect(queryByText("Routine Task")).toBeNull();
        expect(queryByText("Easy Task")).toBeNull();

        // 3. Filter by "Low"
        fireEvent.press(getByText("Low"));

        expect(getByText("Easy Task")).toBeTruthy();
        expect(queryByText("Urgent Task")).toBeNull();

        // 4. Return to "All"
        fireEvent.press(getByText("All"));
        expect(getByText("Urgent Task")).toBeTruthy();
        expect(getByText("Routine Task")).toBeTruthy();
    });

    it("navigates to task details when a card is pressed", () => {
        const { getByTestId } = render(<TasksScreen />);

        fireEvent.press(getByTestId("task-card-1"));

        expect(mockPush).toHaveBeenCalledWith("/task/1");
    });

    it("calls refetch on focus", () => {
        render(<TasksScreen />);
        // useFocusEffect is mocked to run immediately
        expect(mockRefetch).toHaveBeenCalled();
    });
});
