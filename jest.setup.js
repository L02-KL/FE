import "react-native-gesture-handler/jestSetup";

jest.mock("expo-router", () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
    }),
    useLocalSearchParams: () => ({ id: "123" }),
    Stack: ({ children }) => <>{children}</>,
    Tabs: ({ children }) => <>{children}</>,
}));

jest.mock("react-native-safe-area-context", () => ({
    ...jest.requireActual("react-native-safe-area-context"),
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));
jest.mock("./assets/images/mascot/happy.png", () => 1);
