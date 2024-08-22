import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import FitnessCards from "../components/FitnessCards";

const LifestyleWellnessScreen = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Home Workout</Text>

                <View style={styles.statsContainer}>
                    <View style={styles.stat}>
                        <Text style={styles.statValue}>0</Text>
                        <Text style={styles.statLabel}>WORKOUTS</Text>
                    </View>

                    <View style={styles.stat}>
                        <Text style={styles.statValue}>0</Text>
                        <Text style={styles.statLabel}>KCAL</Text>
                    </View>

                    <View style={styles.stat}>
                        <Text style={styles.statValue}>0</Text>
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
