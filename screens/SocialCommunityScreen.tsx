import React, { useContext, useEffect, useState } from "react";
<<<<<<< HEAD
import { View, Text, StyleSheet, Image, ScrollView, Alert } from "react-native";
import SocialCards from "../components/SocialCards"; // Custom component for community events
=======
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from "react-native";
// import SocialCards from "../components/SocialCards"; // Custom component for community events
>>>>>>> 6d036e1c2006f73b35ffab1488d32923938a6c89
import { SocialItems } from "../Context"; // Context related to social activities
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';
import { RootStackNavigationProp } from "../types"; // Import your navigation prop type

const SocialCommunityScreen: React.FC = () => {
    const { socialEvent, attendees, duration } = useContext(SocialItems);

    const navigation = useNavigation<RootStackNavigationProp>();

    const addSocialEvent = () => {
        if (socialEvent && attendees && duration) {
            firestore().collection("SocialEvents").add({
                event: socialEvent,
                attendees: attendees,
                duration: duration
            })
            .then(() => {
                console.log('Added Social Event');
            })
            .catch((err) => {
                console.error("Error adding social event:", err);
                Alert.alert("Error", "Failed to add social event.");
            });
        } else {
            console.log("Some fields are missing, unable to add social event");
            Alert.alert("Error", "Please make sure all event details are filled.");
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={styles.headerText}>Community Events</Text>

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
                                {socialEvent || "No event"}
                            </Text>
                            <Text style={styles.statLabel}>EVENTS</Text>
                        </View>

                        <View style={styles.stat}>
                            <Text style={styles.statValue}>
                                {attendees || 0}
                            </Text>
                            <Text style={styles.statLabel}>ATTENDEES</Text>
                        </View>

                        <View style={styles.stat}>
                            <Text style={styles.statValue}>
                                {duration ? `${duration} mins` : "0 mins"}
                            </Text>
                            <Text style={styles.statLabel}>DURATION</Text>
                        </View>
                    </View>

                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.image}
                            source={{
                                uri: "https://example.com/community-event-image.png", // Replace with relevant image
                            }}
                        />
                    </View>
                </View>
                <SocialCards /> {/* Component to show social/community events */}
            </ScrollView>

            {/* Add Social Event button positioned at the bottom-right corner */}
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
                        console.log('Button Pressed'); // Log output
                        addSocialEvent(); // Call the function to add a social event
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
