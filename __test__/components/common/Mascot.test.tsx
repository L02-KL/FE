import Mascot from "@/components/common/Mascot";
import { render } from "@testing-library/react-native";
import React from "react";

// Mock Assets
jest.mock("@/assets/images/mascot/sad.png", () => 1);
jest.mock("@/assets/images/mascot/angry.png", () => 2);
jest.mock("@/assets/images/mascot/surprised.png", () => 3);
jest.mock("@/assets/images/mascot/thinking.png", () => 4);
jest.mock("@/assets/images/mascot/bored.png", () => 5);
jest.mock("@/assets/images/mascot/pointing.png", () => 6);
jest.mock("@/assets/images/mascot/wink.png", () => 7);
jest.mock("@/assets/images/mascot/hehe.png", () => 8);
jest.mock("@/assets/images/mascot/willing.png", () => 9);
jest.mock("@/assets/images/mascot/happy.png", () => 10);

describe("Mascot Component", () => {
    it("renders correctly", () => {
        const { getByTestId } = render(<Mascot mood="happy" />);
        expect(getByTestId("mascot-image")).toBeTruthy();
    });

    it('applies "small" size styles correctly', () => {
        const { getByTestId } = render(<Mascot mood="happy" size="small" />);
        const image = getByTestId("mascot-image");

        // style is usually an array in React Native [defaultStyle, propStyle]
        // We check if the array contains an object with our dimensions
        expect(image.props.style).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ width: 80, height: 80 }),
            ])
        );
    });

    it('applies "xlarge" size styles correctly', () => {
        const { getByTestId } = render(<Mascot mood="angry" size="xlarge" />);
        const image = getByTestId("mascot-image");

        expect(image.props.style).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ width: 280, height: 280 }),
            ])
        );
    });

    it('defaults to "medium" size if size prop is missing', () => {
        const { getByTestId } = render(<Mascot mood="thinking" />);
        const image = getByTestId("mascot-image");

        expect(image.props.style).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ width: 140, height: 140 }),
            ])
        );
    });
});
