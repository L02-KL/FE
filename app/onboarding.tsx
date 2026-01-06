import { useAuth } from "@/contexts/AuthContext";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const slides = [
    {
        id: "1",
        title: "Welcome to DeadTood",
        description: "Your friendly study companion for university life",
        image: require("../assets/images/onboarding/Onboarding1.svg"),
        backgroundColor: "#FFF5CC",
        icon: "👋",
        buttonIcon: require("../assets/images/onboarding/Next.svg"),
        displaySkip: true,
    },
    {
        id: "2",
        title: "Organize Tasks",
        description: "Keep all your assignments and deadlines in one place",
        image: require("../assets/images/onboarding/Onboarding2.svg"),
        backgroundColor: "#E6F0FF",
        icon: "📚",
        buttonIcon: require("../assets/images/onboarding/Next.svg"),
        displaySkip: true,
    },
    {
        id: "3",
        title: "Never Miss Deadlines",
        description: "Smart reminders help you stay on track",
        image: require("../assets/images/onboarding/Onboarding3.svg"),
        backgroundColor: "#FFE6E6",
        icon: "⏰",
        buttonIcon: require("../assets/images/onboarding/Next.svg"),
        displaySkip: true,
    },
    {
        id: "4",
        title: "Boost Productivity",
        description: "Track progress and celebrate your achievements",
        image: require("../assets/images/onboarding/Onboarding4.svg"),
        backgroundColor: "#E6FFFA",
        icon: "🎉",
        buttonIcon: require("../assets/images/onboarding/CheckCircle.svg"),
        displaySkip: false,
    },
];

interface OnboardingItemProps {
    item: (typeof slides)[0];
    onSkip: () => void;
}

const OnboardingItem = ({ item, onSkip }: OnboardingItemProps) => {
    return (
        <View style={[styles.container, { width }]}>
            {item.displaySkip && (
                <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            )}

            <View
                style={[
                    styles.imageContainer,
                    { backgroundColor: item.backgroundColor },
                ]}
            >
                <Image
                    source={item.image}
                    style={styles.image}
                    contentFit="contain"
                />
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.miniIconContainer}>
                    <Text style={{ fontSize: 48 }}>{item.icon}</Text>
                </View>

                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </View>
    );
};

interface PaginatorProps {
    data: typeof slides;
    currentIndex: number;
}

const Paginator = ({ data, currentIndex }: PaginatorProps) => {
    return (
        <View style={styles.paginatorContainer}>
            {data.map((_, i) => {
                const isActive = i === currentIndex;
                return (
                    <View
                        key={i.toString()}
                        style={[
                            styles.dot,
                            {
                                backgroundColor: isActive
                                    ? "#447BF0"
                                    : "#D3D3D3",
                                width: isActive ? 20 : 8,
                            },
                        ]}
                    />
                );
            })}
        </View>
    );
};

export default function OnboardingScreen() {
    const { completeOnboarding } = useAuth();
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const slidesRef = useRef<FlatList>(null);

    const onViewableItemsChanged = useRef(
        ({ viewableItems }: { viewableItems: any[] }) => {
            if (viewableItems && viewableItems.length > 0) {
                setCurrentIndex(viewableItems[0].index);
            }
        }
    ).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const handleComplete = async () => {
        await completeOnboarding();
        router.replace("/welcome");
    };

    const scrollToNext = () => {
        if (currentIndex < slides.length - 1) {
            slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            handleComplete();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={{ flex: 3 }}>
                <FlatList
                    data={slides}
                    renderItem={({ item }) => (
                        <OnboardingItem item={item} onSkip={handleComplete} />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={(item) => item.id}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    ref={slidesRef}
                    scrollEventThrottle={32}
                />
            </View>

            <View style={styles.footer}>
                <Paginator data={slides} currentIndex={currentIndex} />

                <TouchableOpacity style={styles.button} onPress={scrollToNext}>
                    <Text style={styles.buttonText}>
                        {currentIndex === slides.length - 1
                            ? "Get Started"
                            : "Continue"}
                    </Text>
                    {currentIndex === slides.length - 1 ? (
                        <Image
                            source={slides[currentIndex].buttonIcon}
                            style={{ width: 20, height: 20, marginLeft: 10 }}
                            contentFit="contain"
                        />
                    ) : (
                        <Image
                            source={slides[currentIndex].buttonIcon}
                            style={{ width: 24, height: 24, marginLeft: 10 }}
                            contentFit="contain"
                        />
                    )}
                </TouchableOpacity>

                {currentIndex === slides.length - 1 && (
                    <TouchableOpacity
                        style={{ marginTop: 15 }}
                        onPress={handleComplete}
                    >
                        <Text style={styles.smallText}>Skip for now</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.bottomTextContainer}>
                    <Text style={styles.bottomText}>
                        Plan smart. Do better.
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },
    skipButton: {
        position: "absolute",
        top: 20,
        right: 30,
        zIndex: 1,
    },
    skipText: {
        color: "#333",
        fontWeight: "600",
        fontSize: 16,
    },
    imageContainer: {
        flex: 0.6,
        width: width - 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 30,
        marginTop: 60,
        marginBottom: 20,
        marginHorizontal: 20,
    },
    image: {
        width: "70%",
        height: "70%",
    },
    contentContainer: {
        flex: 0.4,
        alignItems: "center",
        paddingHorizontal: 40,
    },
    miniIconContainer: {
        marginBottom: 10,
    },
    title: {
        fontWeight: "800",
        fontSize: 24,
        marginBottom: 10,
        color: "#000",
        textAlign: "center",
    },
    description: {
        fontWeight: "400",
        color: "#666",
        textAlign: "center",
        paddingHorizontal: 20,
        fontSize: 20,
        lineHeight: 22,
    },

    footer: {
        flex: 1,
        width: width,
        justifyContent: "flex-start",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    paginatorContainer: {
        flexDirection: "row",
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        backgroundColor: "#447BF0",
        marginHorizontal: 4,
    },
    button: {
        backgroundColor: "#447BF0",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
        width: "80%",
        height: 56,
        shadowColor: "#447BF0",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    smallText: {
        color: "#666",
        fontSize: 14,
        fontWeight: "500",
    },
    bottomTextContainer: {
        position: "absolute",
        bottom: 20,
    },
    bottomText: {
        color: "#aaa",
        fontSize: 12,
    },
});
