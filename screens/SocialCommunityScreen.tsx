import React, { useContext } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Alert } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';
import { RootStackNavigationProp } from "../types";
import { FitnessItems } from "../Context";

const SocialCommunityScreen: React.FC = () => {
    const { workout, calories, minutes } = useContext(FitnessItems); // Updated values to match FitnessItems context

    const navigation = useNavigation<RootStackNavigationProp>();

    const addSocialEvent = () => {
        if (workout && calories && minutes) {
            firestore().collection("FitnessEvents").add({
                workout,
                calories,
                minutes,
            })
            .then(() => {
                console.log('Added Fitness Event');
            })
            .catch((err) => {
                console.error("Error adding fitness event:", err);
                Alert.alert("Error", "Failed to add fitness event.");
            });
        } else {
            console.log("Some fields are missing, unable to add fitness event");
            Alert.alert("Error", "Please make sure all event details are filled.");
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={styles.headerText}>Fitness Events</Text>

                        <MaterialCommunityIcons
                            onPress={() => navigation.navigate("Location")}
                            name="map-search-outline"
                            size={30}
                            color="white"
                        />
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>
                                {workout || "No event"}
                            </Text>
                            <Text style={styles.statLabel}>WORKOUT</Text>
                        </View>

                        <View style={styles.stat}>
                            <Text style={styles.statValue}>
                                {calories || 0}
                            </Text>
                            <Text style={styles.statLabel}>CALORIES</Text>
                        </View>

                        <View style={styles.stat}>
                            <Text style={styles.statValue}>
                                {minutes ? `${minutes} mins` : "0 mins"}
                            </Text>
                            <Text style={styles.statLabel}>DURATION</Text>
                        </View>
                    </View>

                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.image}
                            source={{
                                uri: "https://example.com/fitness-event-image.png", // Replace with relevant image
                            }}
                        />
                    </View>
                </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
                <MaterialCommunityIcons
                    name="details"
                    size={30}
                    color="white"
                    style={styles.icons}
                    onPress={() => navigation.navigate('Result')} // Navigate to event details
                />

                <MaterialCommunityIcons
                    name="plus-circle"
                    size={30}
                    color="white"
                    style={styles.icons}
                    onPress={() => {
                        console.log('Button Pressed');
                        addSocialEvent();
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
        flexGrow: 1, 
    },
    header: {
        backgroundColor: "#3CB371",
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
        backgroundColor: "#20B2AA",
        padding: 15,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    buttonContainer: {
        position: "absolute",
        bottom: 20,
        right: 20,
        alignItems: "center",
        justifyContent: "center",
    },
});

export default SocialCommunityScreen;
