import { StyleSheet, Text, View, Image, Pressable, SafeAreaView } from "react-native";
import React, { useState } from "react";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList, RootStackNavigationProp } from '../types';

type FitScreenRouteParams = RouteProp<RootStackParamList, 'Fit'>;

const FitScreen = () => {
  const route = useRoute<FitScreenRouteParams>();
  const navigation = useNavigation<RootStackNavigationProp>();

  const excersises = route.params?.excersises || [];
  console.log("Excersises:", excersises); // Check if the data is coming through

  const [index, setIndex] = useState(0);
  const current = excersises[index];

  console.log("Current Exercise:", current); // Check if current exercise is undefined

  if (!current) {
    return (
      <View>
        <Text>No exercises available</Text>
      </View>
    );
  }

  const incrementIndex = () => {
    setIndex((prevIndex) => prevIndex + 1);
  };

  const handleDone = () => {
    if (index + 1 < excersises.length) {
      navigation.navigate("Rest", {
        incrementIndex: incrementIndex, // Pass the increment callback
      });
    } else {
      navigation.navigate("LifestyleAndWellnessScreen"); // Navigate to the Lifestyle and Wellness screen
    }
  };

  const handleSkip = () => {
    if (index + 1 >= excersises.length) {
      navigation.navigate("LifestyleAndWellnessScreen"); // Navigate to Lifestyle and Wellness if all exercises are done
    } else {
      navigation.navigate("Rest", {
        incrementIndex: () => setIndex(index + 1),
      });
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1);
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

      <View style={{ flexDirection: "row", alignItems: "center", marginLeft: "auto", marginRight: "auto", marginTop: 50 }}>
        <Pressable
          onPress={handlePrev}
          style={{ backgroundColor: "green", padding: 10, borderRadius: 20, marginHorizontal: 20, width: 100 }}>
          <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>PREV</Text>
        </Pressable>
        <Pressable
          onPress={handleSkip}
          style={{ backgroundColor: "green", padding: 10, borderRadius: 20, marginHorizontal: 20, width: 100 }}>
          <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>SKIP</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default FitScreen;
