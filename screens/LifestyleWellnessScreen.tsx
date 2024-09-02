import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import FitnessCards from "../components/FitnessCards";
import { FitnessItems } from "../Context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import Location from "./Location";
import { RootStackNavigationProp } from "../types"; // Import your navigation prop type

const LifestyleWellnessScreen = () => {

    const { minutes, calories, workout } = useContext(FitnessItems)
    const navigation = useNavigation<RootStackNavigationProp>(); // Use your navigation type

    return (
        <ScrollView contentContainerStyle={styles.container}>
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
                            {calories}
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
    );
};

const styles = StyleSheet.create({
    container: {
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
});

export default LifestyleWellnessScreen;
