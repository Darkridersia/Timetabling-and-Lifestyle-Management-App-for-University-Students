import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from "react-native";
import FitnessCards from "../components/FitnessCards";
import { FitnessItems } from "../Context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import Location from "./Location";
import { RootStackNavigationProp } from "../types"; // Import your navigation prop type
import firestore from '@react-native-firebase/firestore';
import ResultScreen from "./ResultScreen";

const LifestyleWellnessScreen = () => {


    const addWorkOut = () => {
        firestore().collection("Workout").add({
            workouts: workout,
            calories: calories.toFixed(2),
            minutes: minutes
        }).then((res) => {
            Alert.alert("Added Workout")
            console.log('Added Workout');
        }).catch((err) => {
            console.error("Error adding workout:", err);
        });
    };

    const { minutes, calories, workout } = useContext(FitnessItems);
    const navigation = useNavigation<RootStackNavigationProp>(); // Use your navigation type

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={styles.headerText}>Home Workout</Text>

                        <MaterialCommunityIcons
                            onPress={() => navigation.navigate("Location")} name="map-search-outline"
                            size={30}
                            color="white"
                            fontWeight="bold"
                            padding={10}
                            paddingBottom={10}
                        />
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>
                                {workout}
                            </Text>
                            <Text style={styles.statLabel}>WORKOUTS</Text>
                        </View>

                        <View style={styles.stat}>
                            <Text style={styles.statValue}>
                                {calories.toFixed(2)}
                            </Text>
                            <Text style={styles.statLabel}>KCAL</Text>
                        </View>

                        <View style={styles.stat}>
                            <Text style={styles.statValue}>
                                {minutes}
                            </Text>
                            <Text style={styles.statLabel}>MINS</Text>
                        </View>
                    </View>

                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.image}
                            source={{
                                uri: "https://cdn-images.cure.fit/www-curefit-com/image/upload/c_fill,w_842,ar_1.2,q_auto:eco,dpr_2,f_auto,fl_progressive/image/test/sku-card-widget/gold2.png",
                            }}
                        />
                    </View>
                </View>
                <FitnessCards />
            </ScrollView>

            {/* Add Workout button positioned at the bottom-right corner */}

            <View style={styles.buttonContainer}>
            <MaterialCommunityIcons
                name="details" // Replace with the appropriate icon name
                size={30} // Adjust size as needed
                color="white" // Adjust color as needed
                style={styles.icons}
                onPress={() => navigation.navigate('Result')} // Navigate to SignUp screen
            />

                <MaterialCommunityIcons
                    name="plus-circle" // Replace with the appropriate icon name
                    size={30} // Adjust size as needed
                    color="white" // Adjust color as needed
                    style={styles.icons}
                    onPress={() => {
                        console.log('Button Pressed'); // Log output
                        addWorkOut(); // Call the function to add workout
                    }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        },
    scrollContent: {
        flexGrow: 1, // Ensures the ScrollView can expand and scroll
    },
    header: {
        backgroundColor: "#CD853F",
        padding: 10,
        paddingBottom: 10,
    },
    headerText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 18,
    },
    statsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 20,
    },
    stat: {
        alignItems: "center",
    },
    statValue: {
        textAlign: "center",
        fontWeight: "bold",
        color: "white",
        fontSize: 18,
    },
    statLabel: {
        color: "#D0D0D0",
        fontSize: 17,
        marginTop: 6,
    },
    imageContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "90%",
        height: 120,
        marginTop: 20,
        borderRadius: 7,
    },
    icons: {
        // bottom: 20, // Distance from the bottom of the screen
        // right: 20, // Distance from the right side of the screen
        backgroundColor: "#FF6347",
        padding: 15,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10
    },

    buttonContainer: {
        position: "absolute", // Absolute positioning
        bottom: 20, // Distance from the bottom of the screen
        right: 20, // Distance from the right side of the screen
        alignItems: "center",
        justifyContent: "center",
    },
});

export default LifestyleWellnessScreen;
