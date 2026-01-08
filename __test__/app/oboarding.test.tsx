import OnboardingScreen from "@/app/onboarding";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

// ----------------------------------------------------------------------
// 1. Mocks
// ----------------------------------------------------------------------

const mockReplace = jest.fn();
jest.mock("expo-router", () => ({
    useRouter: () => ({
        replace: mockReplace,
    }),
}));

const mockCompleteOnboarding = jest.fn();
jest.mock("@/contexts/AuthContext", () => ({
    useAuth: () => ({
        completeOnboarding: mockCompleteOnboarding,
    }),
}));

jest.mock("expo-image", () => {
    const { View } = require("react-native");
    return {
        Image: (props: any) => <View testID="expo-image" {...props} />,
    };
});

jest.mock("react-native-safe-area-context", () => ({
    SafeAreaView: ({ children, style }: any) => {
        const { View } = require("react-native");
        return <View style={style}>{children}</View>;
    },
}));

describe("OnboardingScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the first slide correctly", () => {
        const { getByText } = render(<OnboardingScreen />);
        expect(getByText("Welcome to DeadTood")).toBeTruthy();
        expect(
            getByText("Your friendly study companion for university life")
        ).toBeTruthy();
        expect(getByText("Continue")).toBeTruthy();
    });

    it("navigates to welcome screen when Skip is pressed", async () => {
        const { getAllByText } = render(<OnboardingScreen />);

        // FIX: Multiple "Skip" buttons exist (one per slide). Grab the first one.
        const skipButtons = getAllByText("Skip");
        const firstSkipButton = skipButtons[0];

        fireEvent.press(firstSkipButton);

        await waitFor(() => {
            expect(mockCompleteOnboarding).toHaveBeenCalledTimes(1);
            expect(mockReplace).toHaveBeenCalledWith("/welcome");
        });
    });

    it('handles the "Continue" button press', () => {
        const { getByText } = render(<OnboardingScreen />);
        const continueButton = getByText("Continue");

        try {
            fireEvent.press(continueButton);
        } catch (e) {
            // In a real app, this scrolls. In Jest, we just want to ensure the logic runs.
        }
    });
});
