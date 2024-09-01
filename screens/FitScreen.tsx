import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React, { useContext, useState } from "react";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList, RootStackNavigationProp } from '../types';
import { FitnessItems } from "../Context";

type FitScreenRouteParams = RouteProp<RootStackParamList, 'Fit'>;

const FitScreen = () => {
  const route = useRoute<FitScreenRouteParams>();
  const navigation = useNavigation<RootStackNavigationProp>();

  const exercises = route.params?.excersises || [];
  const [index, setIndex] = useState(0);
  const current = exercises[index];

  const { completed, setCompleted, minutes, setMinutes, calories, setCalories, workout, setWorkout } = useContext(FitnessItems)

  console.log(completed, "completed exercise")

  const incrementIndex = () => {
    setIndex((prevIndex) => prevIndex + 1);
  };

  const decrementIndex = () => {
    setIndex((prevIndex) => prevIndex - 1);
  };

  // Func for DONE btn
  const handleDone = () => {
    if (index + 1 < exercises.length) {
      // It will be brought to the REST Screen
      navigation.navigate("Rest", {
        incrementIndex: incrementIndex, // Pass the increment callback
      });

      setCompleted([...completed, current.name])
      setWorkout(workout + 1)
      setMinutes(minutes + 2.5)
      setCalories(calories + 6.30)
    } else {
      navigation.navigate("LifestyleAndWellnessScreen" as never);
    }
  };

  // funct for SKIP btn
  const handleSkip = () => {
    // It won't be brought to REST screen
    if (index + 1 < exercises.length) {
      incrementIndex();
    } else {
      navigation.navigate("LifestyleAndWellnessScreen" as never);
    }
  };

  // Function for PREV btn
  const handlePrev = () => {
    if (index > 0) {
      decrementIndex();
    } else {
      navigation.navigate("LifestyleAndWellnessScreen" as never);
    }
  };

  return (
    <SafeAreaView>
      <Image style={{ width: "100%", height: 370 }} source={{ uri: current.image }} />
      <Text style={{ marginLeft: "auto", marginRight: "auto", marginTop: 30, fontSize: 30, fontWeight: "bold" }}>{current.name}</Text>
      <Text style={{ marginLeft: "auto", marginRight: "auto", marginTop: 30, fontSize: 38, fontWeight: "bold" }}>
        x{current.sets}
      </Text>
      <Pressable
        onPress={handleDone}
        style={{ backgroundColor: "blue", marginLeft: "auto", marginRight: "auto", marginTop: 30, borderRadius: 20, padding: 10, width: 150 }}>
        <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 20, color: "white" }}>DONE</Text>
      </Pressable>

      <Pressable
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: 30
        }}
      >
        <Pressable
          style={{
            backgroundColor: "green",
            padding: 10,
            borderRadius: 20,
            marginHorizontal: 20,
            width: 100
          }}
          onPress={handlePrev} // Handling the PREV button press

        >
          <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>PREV</Text>
        </Pressable>

        <Pressable
          style={{
            backgroundColor: "green",
            padding: 10,
            borderRadius: 20,
            marginHorizontal: 20,
            width: 100
          }}
          onPress={handleSkip} // Handling the SKIP button press
        >
          <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>SKIP</Text>
        </Pressable>
      </Pressable>
    </SafeAreaView>
  );
};

export default FitScreen;

const styles = StyleSheet.create({});
