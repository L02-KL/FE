import ParallaxScrollView from "@/components/parallax-scroll-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { render } from "@testing-library/react-native";
import React from "react";
import { Text, View } from "react-native";

jest.mock("@/hooks/use-color-scheme");
jest.mock("@/hooks/use-theme-color");

jest.mock("@/components/themed-view", () => {
    const { View } = require("react-native");
    return {
        ThemedView: ({ style, children }: any) => (
            <View testID="content-container" style={style}>
                {children}
            </View>
        ),
    };
});

jest.mock("react-native-reanimated", () => {
    const { View, ScrollView } = require("react-native");
    return {
        __esModule: true,
        default: {
            ScrollView: (props: any) => (
                <ScrollView testID="parallax-scroll-view" {...props} />
            ),
            View: (props: any) => <View testID="animated-header" {...props} />,
        },
        useAnimatedRef: jest.fn(() => ({ current: null })),
        useScrollOffset: jest.fn(() => ({ value: 0 })),
        useAnimatedStyle: jest.fn((cb) => cb()),
        interpolate: jest.fn(() => 1),
    };
});

describe("ParallaxScrollView", () => {
    const mockHeaderImage = <View testID="mock-header-image" />;

    beforeEach(() => {
        jest.clearAllMocks();
        (useThemeColor as jest.Mock).mockReturnValue("#ffffff");
    });

    it("renders content and header image correctly", () => {
        (useColorScheme as jest.Mock).mockReturnValue("light");

        const { getByTestId, getByText } = render(
            <ParallaxScrollView
                headerImage={mockHeaderImage}
                headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
            >
                <Text>Test Content</Text>
            </ParallaxScrollView>
        );

        expect(getByTestId("mock-header-image")).toBeTruthy();
        expect(getByText("Test Content")).toBeTruthy();
    });

    it("applies the correct background color in Light mode", () => {
        (useColorScheme as jest.Mock).mockReturnValue("light");

        const { getByTestId } = render(
            <ParallaxScrollView
                headerImage={mockHeaderImage}
                headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
            >
                <View />
            </ParallaxScrollView>
        );

        const header = getByTestId("animated-header");
        const flatStyle = Object.assign(
            {},
            ...(Array.isArray(header.props.style)
                ? header.props.style
                : [header.props.style])
        );

        expect(flatStyle.backgroundColor).toBe("#A1CEDC");
    });

    it("applies the correct background color in Dark mode", () => {
        (useColorScheme as jest.Mock).mockReturnValue("dark");

        const { getByTestId } = render(
            <ParallaxScrollView
                headerImage={mockHeaderImage}
                headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
            >
                <View />
            </ParallaxScrollView>
        );

        const header = getByTestId("animated-header");
        const flatStyle = Object.assign(
            {},
            ...(Array.isArray(header.props.style)
                ? header.props.style
                : [header.props.style])
        );

        expect(flatStyle.backgroundColor).toBe("#1D3D47");
    });

    it("applies the main background color from useThemeColor", () => {
        (useColorScheme as jest.Mock).mockReturnValue("light");
        (useThemeColor as jest.Mock).mockReturnValue("#123456");

        const { getByTestId } = render(
            <ParallaxScrollView
                headerImage={mockHeaderImage}
                headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
            >
                <View />
            </ParallaxScrollView>
        );

        const scrollView = getByTestId("parallax-scroll-view");
        expect(scrollView.props.style).toEqual(
            expect.objectContaining({ backgroundColor: "#123456" })
        );
    });
});
