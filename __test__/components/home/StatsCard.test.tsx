import StatsCard from "@/components/home/StatsCard";
import { render } from "@testing-library/react-native";
import React from "react";

// ----------------------------------------------------------------------
// 1. Mocks
// ----------------------------------------------------------------------

// Mock ThemeContext to provide default colors
jest.mock("@/contexts/ThemeContext", () => ({
    useTheme: () => ({
        colors: {
            cardBackground: "#FFFFFF",
            primaryLight: "#E3F2FD",
            primary: "#2196F3",
            textSecondary: "#757575",
            textPrimary: "#000000",
        },
    }),
}));

// Mock Ionicons
jest.mock("@expo/vector-icons", () => ({
    Ionicons: "Ionicons",
}));

// ----------------------------------------------------------------------
// 2. Tests
// ----------------------------------------------------------------------

describe("StatsCard", () => {
    it("renders label and value correctly", () => {
        const { getByText } = render(
            <StatsCard iconName="time" label="Pending Tasks" value={12} />
        );

        expect(getByText("Pending Tasks")).toBeTruthy();
        expect(getByText("12")).toBeTruthy();
    });

    it("uses theme colors by default when no optional props are provided", () => {
        const { getByTestId, getByText } = render(
            <StatsCard iconName="time" label="Tasks" value={5} />
        );

        // Check Container Background (Default: #FFFFFF)
        const container = getByTestId("stats-card-container");
        expect(container.props.style).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ backgroundColor: "#FFFFFF" }),
            ])
        );

        // Check Icon Container Background (Default: #E3F2FD)
        const iconContainer = getByTestId("stats-icon-container");
        expect(iconContainer.props.style).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ backgroundColor: "#E3F2FD" }),
            ])
        );

        // Check Label Color (Default: #757575)
        const label = getByText("Tasks");
        expect(label.props.style).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ color: "#757575" }),
            ])
        );
    });

    it("overrides default colors when specific props are provided", () => {
        const { getByTestId } = render(
            <StatsCard
                iconName="time"
                label="Urgent"
                value={1}
                backgroundColor="#000000" // Custom card bg
                iconBackgroundColor="#FF0000" // Custom icon bg
                iconColor="#FFFF00" // Custom icon color
            />
        );

        // Check Custom Container Background
        const container = getByTestId("stats-card-container");
        expect(container.props.style).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ backgroundColor: "#000000" }),
            ])
        );

        // Check Custom Icon Container Background
        const iconContainer = getByTestId("stats-icon-container");
        expect(iconContainer.props.style).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ backgroundColor: "#FF0000" }),
            ])
        );

        // Check Custom Icon Color
        const icon = getByTestId("stats-icon");
        expect(icon.props.color).toBe("#FFFF00");
    });

    it("passes the correct icon name to the icon component", () => {
        const { getByTestId } = render(
            <StatsCard iconName="checkmark-circle" label="Done" value={10} />
        );

        const icon = getByTestId("stats-icon");
        expect(icon.props.name).toBe("checkmark-circle");
    });
});
