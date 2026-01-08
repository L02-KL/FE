import ProfileScreen from "@/app/profile";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";

const mockBack = jest.fn();
jest.mock("expo-router", () => ({ useRouter: () => ({ back: mockBack }) }));

const mockLogout = jest.fn();
const mockUser = {
    name: "John Doe",
    email: "john@university.edu",
    avatar: null,
};
jest.mock("@/contexts/AuthContext", () => ({
    useAuth: () => ({ user: mockUser, logout: mockLogout }),
}));

jest.mock("@/contexts/ThemeContext", () => ({
    useTheme: () => ({
        colors: {
            background: "#fff",
            cardBackground: "#f5f5f5",
            textPrimary: "#000",
            textMuted: "#666",
            primary: "blue",
            border: "#ccc",
            accent: "orange",
            error: "red",
        },
    }),
}));

jest.mock("react-native-safe-area-context", () => ({
    SafeAreaView: ({ children }: any) => <>{children}</>,
}));
jest.mock("@expo/vector-icons", () => ({
    Ionicons: ({ name }: any) => {
        const { Text } = require("react-native");
        return <Text testID={`icon-${name}`}>{name}</Text>;
    },
}));

describe("ProfileScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(Alert, "alert");
    });

    it("renders user profile information correctly", () => {
        const { getByText, getAllByText } = render(<ProfileScreen />);

        expect(getByText("Profile")).toBeTruthy();
        expect(getAllByText("John Doe").length).toBeGreaterThan(0);

        // FIX: Check for email using getAllByText
        expect(getAllByText("john@university.edu").length).toBeGreaterThan(0);

        expect(getByText("JD")).toBeTruthy();
        expect(getByText("Personal Information")).toBeTruthy();
    });

    it("enters edit mode and saves changes", async () => {
        const { getByText, getByDisplayValue, getAllByText, queryByText } =
            render(<ProfileScreen />);

        const editBtn = getByText("pencil");
        fireEvent.press(editBtn);

        const nameInput = getByDisplayValue("John Doe");
        fireEvent.changeText(nameInput, "Jane Smith");

        fireEvent.press(getByText("Save Changes"));

        expect(Alert.alert).toHaveBeenCalledWith(
            "Success",
            "Profile updated successfully!"
        );
        // Expect updated name
        expect(getAllByText("Jane Smith").length).toBeGreaterThan(0);
        expect(queryByText("Save Changes")).toBeNull();
    });

    it("enters edit mode and cancels changes", () => {
        const { getByText, getByDisplayValue, getAllByText, queryByText } =
            render(<ProfileScreen />);
        fireEvent.press(getByText("pencil"));

        const nameInput = getByDisplayValue("John Doe");
        fireEvent.changeText(nameInput, "Wrong Name");

        fireEvent.press(getByText("Cancel"));

        expect(queryByText("Wrong Name")).toBeNull();
        // Expect reverted name
        expect(getAllByText("John Doe").length).toBeGreaterThan(0);
    });

    // (Keeping other tests short for brevity, they were passing or just depended on mocks)
    it("handles logout flow correctly", async () => {
        const { getByText } = render(<ProfileScreen />);
        fireEvent.press(getByText("Log Out"));
        const alertButtons = (Alert.alert as jest.Mock).mock.calls[0][2];
        await alertButtons.find((btn: any) => btn.text === "Logout").onPress();
        expect(mockLogout).toHaveBeenCalled();
    });

    it("navigates back", () => {
        const { getByText } = render(<ProfileScreen />);
        fireEvent.press(getByText("arrow-back"));
        expect(mockBack).toHaveBeenCalled();
    });
});
