import HeaderGreeting from "@/components/home/HeaderGreeting";
import { render } from "@testing-library/react-native";
import React from "react";

jest.mock("@/contexts/ThemeContext", () => ({
    useTheme: () => ({
        colors: {
            textPrimary: "#000000",
            textSecondary: "#666666",
        },
    }),
}));

jest.mock("@/components/common/Mascot", () => ({
    Mascot: () => <mock-mascot testID="mock-mascot" />,
}));

describe("HeaderGreeting", () => {
    // Enable fake timers before running tests
    beforeEach(() => {
        jest.useFakeTimers();
    });

    // Restore real timers after tests are done
    afterEach(() => {
        jest.useRealTimers();
    });

    it("renders static text correctly", () => {
        const { getByText } = render(<HeaderGreeting />);

        expect(getByText("Welcome back!")).toBeTruthy();
        expect(getByText("Let's tackle your tasks today")).toBeTruthy();
    });

    it('displays "Good Morning" before 12:00', () => {
        // Set time to 9:00 AM
        jest.setSystemTime(new Date("2024-01-01T09:00:00"));

        const { getByText } = render(<HeaderGreeting />);

        expect(getByText("Good Morning 👋")).toBeTruthy();
    });

    it('displays "Good Afternoon" between 12:00 and 17:00', () => {
        // Set time to 2:00 PM (14:00)
        jest.setSystemTime(new Date("2024-01-01T14:00:00"));

        const { getByText } = render(<HeaderGreeting />);

        expect(getByText("Good Afternoon 👋")).toBeTruthy();
    });

    it('displays "Good Evening" after 17:00', () => {
        // Set time to 7:00 PM (19:00)
        jest.setSystemTime(new Date("2024-01-01T19:00:00"));

        const { getByText } = render(<HeaderGreeting />);

        expect(getByText("Good Evening 👋")).toBeTruthy();
    });

    it("renders the Mascot component", () => {
        const { getByTestId } = render(<HeaderGreeting />);
        // Check if our mocked mascot is present
        expect(getByTestId("mock-mascot")).toBeTruthy();
    });
});
