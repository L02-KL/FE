import TabLayout from "@/app/(tabs)/_layout";
import { fireEvent, render, within } from "@testing-library/react-native";
import React from "react";

// ----------------------------------------------------------------------
// 1. Mocks
// ----------------------------------------------------------------------

const mockPush = jest.fn();
jest.mock("expo-router", () => {
    const React = require("react");
    const { View } = require("react-native");

    const Tabs = ({ children }: any) => (
        <View testID="tabs-navigator">{children}</View>
    );

    Tabs.Screen = ({ name, options }: any) => {
        return (
            <View testID={`tab-screen-${name}`}>
                {options?.tabBarButton && options.tabBarButton()}
                {options?.tabBarIcon && (
                    <>
                        {/* The ID is based on the route 'name' prop (e.g., 'index', 'tasks') */}
                        <View testID={`icon-${name}-focused`}>
                            {options.tabBarIcon({
                                focused: true,
                                color: "blue",
                            })}
                        </View>
                        <View testID={`icon-${name}-unfocused`}>
                            {options.tabBarIcon({
                                focused: false,
                                color: "grey",
                            })}
                        </View>
                    </>
                )}
            </View>
        );
    };

    return {
        Tabs,
        useRouter: () => ({ push: mockPush }),
    };
});

jest.mock("@/components/haptic-tab", () => ({
    HapticTab: "HapticTab",
}));

jest.mock("@/contexts/ThemeContext", () => ({
    useTheme: () => ({
        colors: {
            primary: "#007AFF",
            primaryLight: "#E5F1FF",
            tabBarBackground: "#FFFFFF",
            tabBarInactive: "#8E8E93",
            accent: "#FF2D55",
            white: "#FFFFFF",
        },
    }),
}));

jest.mock("@expo/vector-icons", () => ({
    Ionicons: ({ name }: any) => {
        const { Text } = require("react-native");
        return <Text testID={`ionicon-${name}`}>{name}</Text>;
    },
}));

// ----------------------------------------------------------------------
// 2. Tests
// ----------------------------------------------------------------------

describe("TabLayout", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders all tab definitions correctly", () => {
        const { getByTestId } = render(<TabLayout />);
        expect(getByTestId("tab-screen-index")).toBeTruthy();
        expect(getByTestId("tab-screen-tasks")).toBeTruthy();
        expect(getByTestId("tab-screen-add-task")).toBeTruthy();
        expect(getByTestId("tab-screen-courses")).toBeTruthy();
        expect(getByTestId("tab-screen-settings")).toBeTruthy();
        expect(getByTestId("tab-screen-explore")).toBeTruthy();
    });

    it("renders correct icons for Home tab (Focused vs Unfocused)", () => {
        const { getByTestId } = render(<TabLayout />);

        // FIX: The route name is "index", so we look for "icon-index-..."
        const focusedContainer = getByTestId("icon-index-focused");
        const unfocusedContainer = getByTestId("icon-index-unfocused");

        expect(within(focusedContainer).getByText("home")).toBeTruthy();
        expect(
            within(unfocusedContainer).getByText("home-outline")
        ).toBeTruthy();
    });

    it("renders correct icons for Tasks tab", () => {
        const { getByTestId } = render(<TabLayout />);
        const focused = getByTestId("icon-tasks-focused");
        const unfocused = getByTestId("icon-tasks-unfocused");

        expect(within(focused).getByText("checkbox")).toBeTruthy();
        expect(within(unfocused).getByText("checkbox-outline")).toBeTruthy();
    });

    it("renders correct icons for Courses tab", () => {
        const { getByTestId } = render(<TabLayout />);
        const focused = getByTestId("icon-courses-focused");
        const unfocused = getByTestId("icon-courses-unfocused");

        expect(within(focused).getByText("book")).toBeTruthy();
        expect(within(unfocused).getByText("book-outline")).toBeTruthy();
    });

    it("renders correct icons for Settings tab", () => {
        const { getByTestId } = render(<TabLayout />);
        const focused = getByTestId("icon-settings-focused");
        const unfocused = getByTestId("icon-settings-unfocused");

        expect(within(focused).getByText("settings")).toBeTruthy();
        expect(within(unfocused).getByText("settings-outline")).toBeTruthy();
    });

    it('renders the custom Add Task button with "add" icon', () => {
        const { getByTestId } = render(<TabLayout />);
        expect(getByTestId("ionicon-add")).toBeTruthy();
    });

    it("navigates to /modal when Add Task button is pressed", () => {
        const { getByTestId } = render(<TabLayout />);
        const addIcon = getByTestId("ionicon-add");

        // Press the parent TouchableOpacity of the icon
        fireEvent.press(addIcon.parent);

        expect(mockPush).toHaveBeenCalledWith("/modal");
    });
});
