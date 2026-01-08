import { ExternalLink } from "@/components/external-link";
import { fireEvent, render } from "@testing-library/react-native";
import { openBrowserAsync } from "expo-web-browser";
import React from "react";

jest.mock("expo-web-browser", () => ({
    openBrowserAsync: jest.fn(),
    WebBrowserPresentationStyle: {
        AUTOMATIC: "AUTOMATIC",
    },
}));

jest.mock("expo-router", () => ({
    Link: ({ onPress, children, ...props }: any) => {
        const { TouchableOpacity, Text } = require("react-native");

        return (
            <TouchableOpacity onPress={onPress} testID="mock-link" {...props}>
                <Text>{children}</Text>
            </TouchableOpacity>
        );
    },
}));

describe("ExternalLink Component", () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it("renders correctly", () => {
        const { getByText } = render(
            <ExternalLink href="https://example.com">Click me</ExternalLink>
        );
        expect(getByText("Click me")).toBeTruthy();
    });

    it("opens in-app browser and prevents default on Native (iOS)", async () => {
        // Force iOS environment
        process.env.EXPO_OS = "ios";

        const { getByTestId } = render(
            <ExternalLink href="https://google.com" />
        );

        const link = getByTestId("mock-link");
        const mockPreventDefault = jest.fn();

        fireEvent(link, "press", { preventDefault: mockPreventDefault });

        expect(mockPreventDefault).toHaveBeenCalled();
        expect(openBrowserAsync).toHaveBeenCalledWith(
            "https://google.com",
            expect.objectContaining({ presentationStyle: "AUTOMATIC" })
        );
    });
});
