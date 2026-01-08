import { IconSymbol } from "@/components/ui/icon-symbol.ios";
import { render } from "@testing-library/react-native";
import React from "react";

jest.mock("expo-symbols", () => ({
    SymbolView: (props: any) => {
        const { View } = require("react-native");
        return <View testID="expo-symbol-view" {...props} />;
    },
}));

describe("IconSymbol (iOS)", () => {
    it("renders correctly with required props", () => {
        const { getByTestId } = render(
            <IconSymbol name="star.fill" color="#FF0000" />
        );

        const symbol = getByTestId("expo-symbol-view");

        expect(symbol.props.name).toBe("star.fill");
        expect(symbol.props.tintColor).toBe("#FF0000");
        expect(symbol.props.weight).toBe("regular");
        expect(symbol.props.style).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ width: 24, height: 24 }),
            ])
        );
    });

    it("applies custom size", () => {
        const { getByTestId } = render(
            <IconSymbol name="heart" color="blue" size={50} />
        );

        const symbol = getByTestId("expo-symbol-view");

        expect(symbol.props.style).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ width: 50, height: 50 }),
            ])
        );
    });

    it("applies custom weight", () => {
        const { getByTestId } = render(
            <IconSymbol name="heart" color="blue" weight="bold" />
        );

        const symbol = getByTestId("expo-symbol-view");
        expect(symbol.props.weight).toBe("bold");
    });

    it("merges external styles", () => {
        const { getByTestId } = render(
            <IconSymbol name="house" color="black" style={{ opacity: 0.5 }} />
        );

        const symbol = getByTestId("expo-symbol-view");

        expect(symbol.props.style).toEqual(
            expect.arrayContaining([expect.objectContaining({ opacity: 0.5 })])
        );
    });
});
