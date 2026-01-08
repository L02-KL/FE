import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
// Note: We import the helpers here to unit test them
import TaskCard, {
    getCategoryColor,
    getCategoryIcon,
} from "@/components/tasks/TaskCard";
import { Task } from "@/types";

jest.mock("@/contexts/ThemeContext", () => ({
    useTheme: () => ({
        colors: {
            cardBackground: "#FFFFFF",
            textPrimary: "#000000",
            textSecondary: "#666666",
            textMuted: "#999999",
            primary: "#6200EE",
            primaryLight: "#BB86FC",
            border: "#E0E0E0",
            // Category colors
            math: "#1976D2",
            mathBg: "#E3F2FD",
            chemistry: "#388E3C",
            chemistryBg: "#E8F5E9",
            physics: "#7B1FA2",
            physicsBg: "#F3E5F5",
            literature: "#FBC02D",
            literatureBg: "#FFFDE7",
            // Priority Colors
            priorityHigh: "#F44336",
            priorityHighBg: "#FFEBEE",
            priorityMedium: "#FF9800",
            priorityMediumBg: "#FFF8E1",
            priorityLow: "#4CAF50",
            priorityLowBg: "#E8F5E9",
        },
    }),
}));

jest.mock("@expo/vector-icons", () => ({
    Ionicons: "Ionicons",
    MaterialCommunityIcons: "MaterialCommunityIcons",
}));

const baseTask: Task = {
    id: "1",
    title: "Complete Math Assignment",
    description: "Chapter 5 exercises",
    category: "math",
    priority: "high",
    status: "pending",
    dueDate: new Date("2024-10-15T09:00:00"),
    dueTime: "09:00 AM",
    completed: false,
};

describe("TaskCard Component", () => {
    it("renders basic task information correctly", () => {
        const { getByText } = render(<TaskCard task={baseTask} />);
        expect(getByText("Complete Math Assignment")).toBeTruthy();
        expect(getByText("09:00 AM")).toBeTruthy();
        // Check formatting logic (Oct 15)
        expect(getByText("Oct 15")).toBeTruthy();
    });

    it("handles onPress interaction", () => {
        const mockOnPress = jest.fn();
        const { getByText } = render(
            <TaskCard task={baseTask} onPress={mockOnPress} />
        );
        fireEvent.press(getByText("Complete Math Assignment"));
        expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it("renders HIGH priority styling correctly", () => {
        const { getByText } = render(
            <TaskCard task={{ ...baseTask, priority: "high" }} />
        );
        expect(getByText("🔴")).toBeTruthy();
        expect(getByText("high")).toBeTruthy();
    });

    it("renders MEDIUM priority styling correctly", () => {
        const { getByText } = render(
            <TaskCard task={{ ...baseTask, priority: "medium" }} />
        );
        expect(getByText("🟡")).toBeTruthy();
        expect(getByText("medium")).toBeTruthy();
    });

    it("renders LOW priority styling correctly", () => {
        const { getByText } = render(
            <TaskCard task={{ ...baseTask, priority: "low" }} />
        );
        expect(getByText("🟢")).toBeTruthy();
        expect(getByText("low")).toBeTruthy();
    });

    // Covers the "default" switch case in getPriorityIcon (Line 103)
    it("renders default priority icon for unknown priority", () => {
        const unknownTask = { ...baseTask, priority: "urgent" as any };
        const { getByText } = render(<TaskCard task={unknownTask} />);
        expect(getByText("⚪")).toBeTruthy();
    });

    it("renders PENDING status label correctly", () => {
        const { getByText } = render(
            <TaskCard task={{ ...baseTask, status: "pending" }} />
        );
        expect(getByText("Pending")).toBeTruthy();
    });

    it("renders IN-PROGRESS status label correctly", () => {
        const { getByText } = render(
            <TaskCard task={{ ...baseTask, status: "in-progress" }} />
        );
        expect(getByText("In Progress")).toBeTruthy();
    });

    it("renders DONE status label correctly", () => {
        const { getByText } = render(
            <TaskCard task={{ ...baseTask, status: "done" }} />
        );
        expect(getByText("Completed")).toBeTruthy();
    });

    it("renders default status label fallback", () => {
        const { getByText } = render(
            <TaskCard task={{ ...baseTask, status: "archived" as any }} />
        );
        expect(getByText("archived")).toBeTruthy();
    });
});

describe("TaskCard Visual Logic Helpers", () => {
    const mockColors: any = {
        math: "#blue",
        mathBg: "#blueBg",
        chemistry: "#green",
        chemistryBg: "#greenBg",
        physics: "#purple",
        physicsBg: "#purpleBg",
        literature: "#yellow",
        literatureBg: "#yellowBg",
        primary: "#primary",
        primaryLight: "#white",
    };

    describe("getCategoryIcon", () => {
        it("returns correct icon for math", () => {
            expect(getCategoryIcon("math", mockColors)).toEqual({
                name: "calculator-variant",
                color: "#blue",
            });
        });
        it("returns correct icon for chemistry", () => {
            expect(getCategoryIcon("chemistry", mockColors)).toEqual({
                name: "flask",
                color: "#green",
            });
        });
        it("returns correct icon for physics", () => {
            expect(getCategoryIcon("physics", mockColors)).toEqual({
                name: "atom",
                color: "#purple",
            });
        });
        it("returns correct icon for literature", () => {
            expect(getCategoryIcon("literature", mockColors)).toEqual({
                name: "book-open-page-variant",
                color: "#yellow",
            });
        });
        it("returns default icon for unknown category", () => {
            expect(getCategoryIcon("gym" as any, mockColors)).toEqual({
                name: "file-document-outline",
                color: "#primary",
            });
        });
    });

    describe("getCategoryColor", () => {
        it("returns correct colors for math", () => {
            expect(getCategoryColor("math", mockColors)).toEqual({
                bg: "#blueBg",
                icon: "#blue",
            });
        });
        it("returns correct colors for chemistry", () => {
            expect(getCategoryColor("chemistry", mockColors)).toEqual({
                bg: "#greenBg",
                icon: "#green",
            });
        });
        it("returns default colors for unknown category", () => {
            expect(getCategoryColor("gym" as any, mockColors)).toEqual({
                bg: "#white",
                icon: "#primary",
            });
        });

        it("returns correct colors for physics", () => {
            expect(getCategoryColor("physics", mockColors)).toEqual({
                bg: "#purpleBg",
                icon: "#purple",
            });
        });

        it("returns correct colors for literature", () => {
            expect(getCategoryColor("literature", mockColors)).toEqual({
                bg: "#yellowBg",
                icon: "#yellow",
            });
        });
    });
});
