import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { render } from "@testing-library/react-native";
import React from "react";

jest.mock("@/hooks/use-theme-color");

describe("ThemedView Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useThemeColor as jest.Mock).mockReturnValue("#ffffff");
    });

    it("renders correctly", () => {
        const { getByTestId } = render(<ThemedView testID="themed-view" />);
        expect(getByTestId("themed-view")).toBeTruthy();
    });

    it("applies the correct background color from the theme hook", () => {
        (useThemeColor as jest.Mock).mockReturnValue("#123456");

        const { getByTestId } = render(<ThemedView testID="themed-view" />);
        const view = getByTestId("themed-view");

        const flatStyle = Object.assign(
            {},
            ...(Array.isArray(view.props.style)
                ? view.props.style
                : [view.props.style])
        );
        expect(flatStyle.backgroundColor).toBe("#123456");
    });

    it("passes lightColor and darkColor props to the hook", () => {
        render(
            <ThemedView
                lightColor="#eee"
                darkColor="#333"
                testID="themed-view"
            />
        );

        expect(useThemeColor).toHaveBeenCalledWith(
            { light: "#eee", dark: "#333" },
            "background"
        );
    });

    it("merges custom styles with the theme background color", () => {
        const customStyle = { margin: 10, borderRadius: 5 };
        const { getByTestId } = render(
            <ThemedView style={customStyle} testID="themed-view" />
        );
        const view = getByTestId("themed-view");

        const flatStyle = Object.assign(
            {},
            ...(Array.isArray(view.props.style)
                ? view.props.style
                : [view.props.style])
        );

        expect(flatStyle).toEqual(
            expect.objectContaining({
                backgroundColor: "#ffffff",
                margin: 10,
                borderRadius: 5,
            })
        );
    });

    it("allows custom style to override theme background color if specified", () => {
        const customStyle = { backgroundColor: "red" };
        const { getByTestId } = render(
            <ThemedView style={customStyle} testID="themed-view" />
        );
        const view = getByTestId("themed-view");

        // In React Native styles array, the last item takes precedence
        // The component code: style={[{ backgroundColor }, style]}
        // So custom style (red) should win over theme color (#ffffff)
        const flatStyle = Object.assign(
            {},
            ...(Array.isArray(view.props.style)
                ? view.props.style
                : [view.props.style])
        );

        expect(flatStyle.backgroundColor).toBe("red");
    });

    it("passes through other View props", () => {
        const { getByTestId } = render(
            <ThemedView
                testID="themed-view"
                accessible={true}
                accessibilityLabel="test label"
            />
        );
        const view = getByTestId("themed-view");

        expect(view.props.accessible).toBe(true);
        expect(view.props.accessibilityLabel).toBe("test label");
    });
});
