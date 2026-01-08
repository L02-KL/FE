import SectionHeader from "@/components/common/SectionHeader";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

jest.mock("@/contexts/ThemeContext", () => ({
    useTheme: () => ({
        colors: {
            textPrimary: "#111111",
            primary: "#6200ee",
        },
    }),
}));

jest.mock("@expo/vector-icons", () => ({
    Ionicons: "Ionicons",
}));

describe("SectionHeader", () => {
    it("renders the title correctly", () => {
        const { getByText } = render(<SectionHeader title="My Tasks" />);

        expect(getByText("My Tasks")).toBeTruthy();
    });

    it('renders the action button with default text "View All" when onActionPress is provided', () => {
        const { getByText } = render(
            <SectionHeader title="Tasks" onActionPress={() => {}} />
        );

        expect(getByText("View All")).toBeTruthy();
    });

    it("renders custom action text when provided", () => {
        const { getByText } = render(
            <SectionHeader
                title="Tasks"
                actionText="See More"
                onActionPress={() => {}}
            />
        );

        expect(getByText("See More")).toBeTruthy();
    });

    it("calls onActionPress when the button is clicked", () => {
        const mockOnPress = jest.fn();

        const { getByText } = render(
            <SectionHeader title="Tasks" onActionPress={mockOnPress} />
        );

        fireEvent.press(getByText("View All"));

        expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it("does NOT render the action button if onActionPress is undefined", () => {
        const { queryByText } = render(<SectionHeader title="Tasks" />);

        expect(queryByText("View All")).toBeNull();
    });

    it("applies the correct theme colors", () => {
        const { getByText } = render(
            <SectionHeader title="Themed Title" onActionPress={() => {}} />
        );

        const title = getByText("Themed Title");
        const action = getByText("View All");

        expect(title.props.style).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ color: "#111111" }),
            ])
        );

        expect(action.props.style).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ color: "#6200ee" }),
            ])
        );
    });
});
