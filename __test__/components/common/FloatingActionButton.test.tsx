import FloatingActionButton from "@/components/common/FloatingActionButton";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

jest.mock("@/constants/colors", () => ({
    accent: "#6200ee",
    white: "#ffffff",
}));

describe("FloatingActionButton", () => {
    it("renders correctly", () => {
        const { getByTestId } = render(
            <FloatingActionButton onPress={() => {}} />
        );
        expect(getByTestId("fab-button")).toBeTruthy();
    });

    it("calls onPress when pressed", () => {
        const mockOnPress = jest.fn();
        const { getByTestId } = render(
            <FloatingActionButton onPress={mockOnPress} />
        );

        fireEvent.press(getByTestId("fab-button"));
        expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it("applies the correct styles (background color)", () => {
        const { getByTestId } = render(
            <FloatingActionButton onPress={() => {}} />
        );

        const button = getByTestId("fab-button");

        // Check styled object directly
        expect(button.props.style).toEqual(
            expect.objectContaining({
                backgroundColor: "#6200ee",
            })
        );
    });
});
