import { HelloWave } from "@/components/hello-wave";
import { render } from "@testing-library/react-native";
import React from "react";

jest.mock("react-native-reanimated", () => {
    const { Text } = require("react-native");
    return {
        __esModule: true,
        default: {
            Text: (props: any) => <Text testID="hello-wave-text" {...props} />,
        },
    };
});

describe("HelloWave Component", () => {
    it("renders the waving hand emoji", () => {
        const { getByText } = render(<HelloWave />);
        expect(getByText("👋")).toBeTruthy();
    });

    it("contains the correct animation configuration in styles", () => {
        const { getByTestId } = render(<HelloWave />);
        const waveComponent = getByTestId("hello-wave-text");

        expect(waveComponent.props.style).toEqual(
            expect.objectContaining({
                fontSize: 28,
                lineHeight: 32,
                animationDuration: "300ms",
                animationIterationCount: 4,
                animationName: expect.objectContaining({
                    "50%": { transform: [{ rotate: "25deg" }] },
                }),
            })
        );
    });
});
