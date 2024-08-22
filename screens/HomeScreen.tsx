import React from "react";
import { View, Text, StyleSheet } from "react-native";

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Timetabling and LifeStyle Management</Text>
        </View>    
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f2f2f2",
    },
    text: {
        fontSize: 24,
        color: "black",
    },
});

export default HomeScreen;
