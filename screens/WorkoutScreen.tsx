import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { RootStackParamList, RootStackNavigationProp } from '../types';
import { FitnessItems } from "../Context";

// Define the type for the route parameters
type WorkoutScreenRouteProp = RouteProp<RootStackParamList, 'WorkoutScreen'>;

const WorkoutScreen = () => {
  const route = useRoute<WorkoutScreenRouteProp>();
  const navigation = useNavigation<RootStackNavigationProp>();

  const { excersises = [] } = route.params || {};

  if (!excersises.length) {
    return <Text style={styles.errorText}>Error: Missing or invalid data</Text>;
  }

  const { completed, setCompleted } = useContext(FitnessItems)

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {excersises.length > 0 && (
        <Image source={{ uri: excersises[0].image }} style={styles.image} />
      )}

      <MaterialCommunityIcons
        // Might need to remove "as never" if values are not properly passed
        onPress={() => navigation.navigate('LifestyleAndWellnessScreen' as never)}
        style={styles.icon}
        name="keyboard-backspace"
        size={28}
        color="black"
      />

      {excersises.map((item, index) => (
        <Pressable style={styles.itemContainer} key={index}>
          <Image style={styles.itemImage} source={{ uri: item.image }} />
          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemSets}>x{item.sets}</Text>
          </View>

          {/* To add a check-box when the workout is "DONE" */}
          {completed.includes(item.name) ? (
            <MaterialCommunityIcons
            marginLeft = {40}
            marginTop = {-20}
            name="check-circle"
              size={24}
              color="black"
            />
          ) : (
            null
          )}
        </Pressable>
      ))}

      <Pressable
        onPress={() => {
          navigation.navigate('Fit', { excersises } as { excersises: { id: string; image: string; name: string; sets: number; }[] });
          setCompleted([]);
        }}
        style={styles.startButton}
      >
        <Text style={styles.startButtonText}>START</Text>
      </Pressable>
    </ScrollView>
  );
};

export default WorkoutScreen;


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginTop: 0,
  },
  image: {
    width: '100%',
    height: 170, // Adjust size as needed
    resizeMode: 'cover',
  },
  icon: {
    position: "absolute",
    color: "black",
    top: 20,
    left: 20,
  },
  itemContainer: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  itemImage: {
    width: 90,
    height: 92,
  },
  itemDetails: {
    marginLeft: 10,
  },
  itemName: {
    fontSize: 17,
    fontWeight: "bold",
    width: 170
  },
  itemSets: {
    marginTop: 4,
    fontSize: 18,
    color: "gray",
  },
  startButton: {
    backgroundColor: "blue",
    padding: 10,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 6,
    width: 120,
  },
  startButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  errorText: {
    textAlign: 'center',
    margin: 20,
    fontSize: 18,
    color: 'red',
  },
});
