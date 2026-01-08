import { HapticTab } from "@/components/haptic-tab";
import { fireEvent, render } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";
import React from "react";

jest.mock("expo-haptics", () => ({
    impactAsync: jest.fn(),
    ImpactFeedbackStyle: {
        Light: "light",
    },
}));

jest.mock("@react-navigation/elements", () => ({
    PlatformPressable: (props: any) => {
        const { TouchableOpacity } = require("react-native");
        return <TouchableOpacity testID="haptic-tab" {...props} />;
    },
}));

describe("HapticTab Component", () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.clearAllMocks();
        // Reset env completely
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it("triggers haptic feedback on iOS during onPressIn", () => {
        process.env.EXPO_OS = "ios";

        const mockOnPressIn = jest.fn();
        const { getByTestId } = render(
            // @ts-ignore
            <HapticTab onPressIn={mockOnPressIn} />
        );

        fireEvent(getByTestId("haptic-tab"), "pressIn");

        expect(Haptics.impactAsync).toHaveBeenCalledWith("light");
        expect(mockOnPressIn).toHaveBeenCalled();
    });
});
