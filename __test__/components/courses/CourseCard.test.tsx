import CourseCard, { getCourseIcon } from "@/components/courses/CourseCard";
import { Course } from "@/types";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

jest.mock("@/contexts/ThemeContext", () => ({
    useTheme: () => ({
        colors: {
            cardBackground: "#FFFFFF",
            textPrimary: "#000000",
            textSecondary: "#666666",
            textMuted: "#999999",
            border: "#EEEEEE",
        },
    }),
}));

jest.mock("@expo/vector-icons", () => ({
    Ionicons: "Ionicons",
    MaterialCommunityIcons: "MaterialCommunityIcons",
}));

const mockCourse: Course = {
    id: "1",
    name: "Advanced Mathematics",
    code: "MATH-202",
    icon: "calculator",
    color: "#FF5733",
    semester: "Fall 2024",
    instructor: "Dr. Alice",
    activeTaskCount: 3,
    completedTaskCount: 7,
    progress: 70,
} as Course;

describe("CourseCard", () => {
    it("renders course information correctly", () => {
        const { getByText } = render(<CourseCard course={mockCourse} />);

        expect(getByText("Advanced Mathematics")).toBeTruthy();
        expect(getByText("MATH-202")).toBeTruthy();
        expect(getByText("Fall 2024")).toBeTruthy();
        expect(getByText("Dr. Alice")).toBeTruthy();
    });

    it("renders statistics correctly", () => {
        const { getByText } = render(<CourseCard course={mockCourse} />);

        expect(getByText("3 active")).toBeTruthy();
        expect(getByText("7 done")).toBeTruthy();
        expect(getByText("70%")).toBeTruthy();
    });

    it("handles interaction (onPress)", () => {
        const onMockPress = jest.fn();
        const { getByText } = render(
            <CourseCard course={mockCourse} onPress={onMockPress} />
        );

        fireEvent.press(getByText("Advanced Mathematics"));
        expect(onMockPress).toHaveBeenCalledTimes(1);
    });

    it("renders the progress bar with correct width", () => {
        const { getByTestId } = render(<CourseCard course={mockCourse} />);

        const progressFill = getByTestId("progress-fill");

        expect(progressFill.props.style).toEqual(
            expect.arrayContaining([expect.objectContaining({ width: "70%" })])
        );
    });

    it("renders N/A when semester or instructor is missing", () => {
        const emptyCourse = {
            ...mockCourse,
            semester: undefined,
            instructor: undefined,
        };
        const { getAllByText } = render(<CourseCard course={emptyCourse} />);

        const naTexts = getAllByText("N/A");
        expect(naTexts).toHaveLength(2);
    });
});

describe("getCourseIcon Helper", () => {
    const testCases = [
        { type: "calculator", lib: "Ionicons", name: "calculator" },
        { type: "flask", lib: "MaterialCommunityIcons", name: "flask" },
        { type: "book", lib: "Ionicons", name: "book" },
        { type: "atom", lib: "MaterialCommunityIcons", name: "atom" },
        { type: "code", lib: "Ionicons", name: "code-slash" },
        { type: "palette", lib: "Ionicons", name: "color-palette" },
        { type: "musical-notes", lib: "Ionicons", name: "musical-notes" },
        { type: "globe", lib: "Ionicons", name: "globe" },
        { type: "fitness", lib: "Ionicons", name: "fitness" },
        { type: "briefcase", lib: "Ionicons", name: "briefcase" },
    ];

    testCases.forEach(({ type, lib, name }) => {
        it(`returns correct icon for type: ${type}`, () => {
            const icon = getCourseIcon(type as any, 20, "#000");

            expect(icon.type).toBe(lib);
            expect(icon.props.name).toBe(name);
        });
    });

    it("returns default school icon for unknown types", () => {
        const icon = getCourseIcon("unknown-type" as any, 20, "#000");
        expect(icon.props.name).toBe("school");
    });
    it("uses default size (28) and color (#FFFFFF) when parameters are missing", () => {
        const icon = getCourseIcon("calculator");

        expect(icon.props.size).toBe(28);
        expect(icon.props.color).toBe("#FFFFFF");
    });
});
