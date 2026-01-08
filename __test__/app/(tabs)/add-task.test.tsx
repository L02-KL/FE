import AddTaskPlaceholder from "@/app/(tabs)/add-task";
import { render } from "@testing-library/react-native";
import React from "react";

// ----------------------------------------------------------------------
// 1. Mocks
// ----------------------------------------------------------------------

// Mock Redirect so we can inspect its props instead of actually redirecting
jest.mock("expo-router", () => ({
    Redirect: jest.fn(({ href }) => {
        const { View } = require("react-native");
        // We use accessibilityLabel to store the href for easy assertion
        return <View testID="mock-redirect" accessibilityLabel={href} />;
    }),
}));

describe("AddTaskPlaceholder", () => {
    it("redirects to the modal route immediately", () => {
        const { getByTestId } = render(<AddTaskPlaceholder />);

        const redirectComponent = getByTestId("mock-redirect");

        // Verify the href prop passed to Redirect
        expect(redirectComponent.props.accessibilityLabel).toBe("/modal");
    });
});
