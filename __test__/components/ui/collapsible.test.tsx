import { Collapsible } from "@/components/ui/collapsible";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";

jest.mock("@/hooks/use-color-scheme", () => ({
    useColorScheme: jest.fn(),
}));

jest.mock("@/constants/theme", () => ({
    Colors: {
        light: { icon: "#000000" },
        dark: { icon: "#FFFFFF" },
    },
}));

jest.mock("@/components/themed-text", () => ({
    ThemedText: ({ children }: any) => {
        const { Text } = require("react-native");
        return <Text>{children}</Text>;
    },
}));

jest.mock("@/components/themed-view", () => ({
    ThemedView: ({ children, style }: any) => {
        const { View } = require("react-native");
        return <View style={style}>{children}</View>;
    },
}));

// Mock IconSymbol with testID for easier targeting
jest.mock("@/components/ui/icon-symbol", () => ({
    IconSymbol: (props: any) => {
        const { View } = require("react-native");
        return <View testID="chevron-icon" {...props} />;
    },
}));

// Import the mocked hook to control return values
import { useColorScheme } from "@/hooks/use-color-scheme";

describe("Collapsible", () => {
    const mockUseColorScheme = useColorScheme as jest.Mock;

    beforeEach(() => {
        mockUseColorScheme.mockReturnValue("light");
    });

    it("renders title but hides content initially", () => {
        const { getByText, queryByText } = render(
            <Collapsible title="Details">
                <Text>Hidden Content</Text>
            </Collapsible>
        );

        expect(getByText("Details")).toBeTruthy();
        expect(queryByText("Hidden Content")).toBeNull();
    });

    it("shows content when header is pressed", () => {
        const { getByText } = render(
            <Collapsible title="Details">
                <Text>Secret Data</Text>
            </Collapsible>
        );

        fireEvent.press(getByText("Details"));

        expect(getByText("Secret Data")).toBeTruthy();
    });

    it("hides content when pressed again (toggles)", () => {
        const { getByText, queryByText } = render(
            <Collapsible title="Details">
                <Text>Toggle Me</Text>
            </Collapsible>
        );

        // Open
        fireEvent.press(getByText("Details"));
        expect(getByText("Toggle Me")).toBeTruthy();

        // Close
        fireEvent.press(getByText("Details"));
        expect(queryByText("Toggle Me")).toBeNull();
    });

    it("rotates the icon when expanded", () => {
        const { getByText, getByTestId } = render(
            <Collapsible title="Details">
                <Text>Content</Text>
            </Collapsible>
        );

        const icon = getByTestId("chevron-icon");

        // Initial state: 0deg
        expect(icon.props.style).toEqual({ transform: [{ rotate: "0deg" }] });

        // Expand
        fireEvent.press(getByText("Details"));

        // Expanded state: 90deg
        expect(icon.props.style).toEqual({ transform: [{ rotate: "90deg" }] });
    });

    it("uses the correct icon color for LIGHT theme", () => {
        mockUseColorScheme.mockReturnValue("light");

        const { getByTestId } = render(
            <Collapsible title="Details">
                <Text>Content</Text>
            </Collapsible>
        );

        expect(getByTestId("chevron-icon").props.color).toBe("#000000");
    });

    it("uses the correct icon color for DARK theme", () => {
        mockUseColorScheme.mockReturnValue("dark");

        const { getByTestId } = render(
            <Collapsible title="Details">
                <Text>Content</Text>
            </Collapsible>
        );

        expect(getByTestId("chevron-icon").props.color).toBe("#FFFFFF");
    });

    it("falls back to light mode if useColorScheme returns null", () => {
        mockUseColorScheme.mockReturnValue(null);

        const { getByTestId } = render(
            <Collapsible title="Details">
                <Text>Content</Text>
            </Collapsible>
        );

        expect(getByTestId("chevron-icon").props.color).toBe("#000000");
    });
});
