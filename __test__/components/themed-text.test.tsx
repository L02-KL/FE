import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { render } from "@testing-library/react-native";
import React from "react";

jest.mock("@/hooks/use-theme-color");

describe("ThemedText Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (useThemeColor as jest.Mock).mockReturnValue("#111111");
    });

    it("renders correctly with default type", () => {
        const { getByText } = render(<ThemedText>Default Text</ThemedText>);
        const textComponent = getByText("Default Text");

        expect(textComponent).toBeTruthy();

        const flatStyle = Object.assign(
            {},
            ...(Array.isArray(textComponent.props.style)
                ? textComponent.props.style
                : [textComponent.props.style])
        );

        expect(flatStyle).toEqual(
            expect.objectContaining({
                fontSize: 16,
                lineHeight: 24,
                color: "#111111",
            })
        );
    });

    it('applies "title" styles correctly', () => {
        const { getByText } = render(
            <ThemedText type="title">Title Text</ThemedText>
        );
        const textComponent = getByText("Title Text");

        const flatStyle = Object.assign(
            {},
            ...(Array.isArray(textComponent.props.style)
                ? textComponent.props.style
                : [textComponent.props.style])
        );

        expect(flatStyle).toEqual(
            expect.objectContaining({
                fontSize: 32,
                fontWeight: "bold",
                lineHeight: 32,
            })
        );
    });

    it('applies "defaultSemiBold" styles correctly', () => {
        const { getByText } = render(
            <ThemedText type="defaultSemiBold">SemiBold Text</ThemedText>
        );
        const textComponent = getByText("SemiBold Text");

        const flatStyle = Object.assign(
            {},
            ...(Array.isArray(textComponent.props.style)
                ? textComponent.props.style
                : [textComponent.props.style])
        );

        expect(flatStyle).toEqual(
            expect.objectContaining({
                fontSize: 16,
                lineHeight: 24,
                fontWeight: "600",
            })
        );
    });

    it('applies "subtitle" styles correctly', () => {
        const { getByText } = render(
            <ThemedText type="subtitle">Subtitle Text</ThemedText>
        );
        const textComponent = getByText("Subtitle Text");

        const flatStyle = Object.assign(
            {},
            ...(Array.isArray(textComponent.props.style)
                ? textComponent.props.style
                : [textComponent.props.style])
        );

        expect(flatStyle).toEqual(
            expect.objectContaining({
                fontSize: 20,
                fontWeight: "bold",
            })
        );
    });

    it('applies "link" styles correctly', () => {
        const { getByText } = render(
            <ThemedText type="link">Link Text</ThemedText>
        );
        const textComponent = getByText("Link Text");

        const flatStyle = Object.assign(
            {},
            ...(Array.isArray(textComponent.props.style)
                ? textComponent.props.style
                : [textComponent.props.style])
        );

        expect(flatStyle).toEqual(
            expect.objectContaining({
                fontSize: 16,
                lineHeight: 30,
                color: "#0a7ea4",
            })
        );
    });

    it("merges custom styles via the style prop", () => {
        const customStyle = { marginVertical: 10, fontSize: 50 };
        const { getByText } = render(
            <ThemedText style={customStyle}>Custom Style</ThemedText>
        );
        const textComponent = getByText("Custom Style");

        const flatStyle = Object.assign(
            {},
            ...(Array.isArray(textComponent.props.style)
                ? textComponent.props.style
                : [textComponent.props.style])
        );

        expect(flatStyle).toEqual(
            expect.objectContaining({
                marginVertical: 10,
                fontSize: 50,
            })
        );
    });

    it("passes through extra text props (e.g. numberOfLines)", () => {
        const { getByText } = render(
            <ThemedText numberOfLines={3} testID="prop-test">
                Long Text
            </ThemedText>
        );
        const textComponent = getByText("Long Text");

        expect(textComponent.props.numberOfLines).toBe(3);
        expect(textComponent.props.testID).toBe("prop-test");
    });

    it("calls useThemeColor with correct props", () => {
        render(
            <ThemedText lightColor="#fff" darkColor="#000">
                Theme Test
            </ThemedText>
        );

        expect(useThemeColor).toHaveBeenCalledWith(
            { light: "#fff", dark: "#000" },
            "text"
        );
    });
});
