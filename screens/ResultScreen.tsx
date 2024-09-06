import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';

const ResultScreen = () => {
    const [workOut, setWorkOut] = useState("");
    const [calories, setCalories] = useState("");
    const [minutes, setMinutes] = useState("");

    const navigation = useNavigation(); // Get the navigation object

    const addWorkOut = () => {
        firestore().collection("Workout").add({
            workouts: workOut,
            calories: calories,
            minutes: minutes
        }).then(() => {
            Alert.alert("Added Workout")
            console.log('Workout Added');
            navigation.goBack(); // Navigate back after adding the workout
        }).catch((err) => {
            console.error("Error adding workout:", err);
        });
    };

    return (
        <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
            <TextInput
                placeholder="Workout"
                value={workOut}
                onChangeText={(text) => setWorkOut(text)}
                style={styles.input} // Apply styles as needed
            />
            <TextInput
                placeholder="Calories"
                value={calories}
                onChangeText={(text) => setCalories(text)}
                style={styles.input} // Apply styles as needed
            />
            <TextInput
                placeholder="Minutes"
                value={minutes}
                onChangeText={(text) => setMinutes(text)}
                style={styles.input} // Apply styles as needed
            />

            <TouchableOpacity onPress={addWorkOut} style={styles.button}>
                <Text>Add Workout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        width: '80%',
        borderBottomWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: 'lightblue',
        padding: 10,
        borderRadius: 5,
    },
});

export default ResultScreen;
