import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React, { useState } from "react";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList, RootStackNavigationProp } from '../types';

type FitScreenRouteParams = RouteProp<RootStackParamList, 'Fit'>;

const FitScreen = () => {
  const route = useRoute<FitScreenRouteParams>();
  const navigation = useNavigation<RootStackNavigationProp>();

  const exercises = route.params?.excersises || [];

  const [index, setIndex] = useState(0);
  const current = exercises[index];

  return (
    <SafeAreaView>
      <Image style={{ width: "100%", height: 370 }} source={{ uri: current.image }} />
      <Text style={{ marginLeft: "auto", marginRight: "auto", marginTop: 30, fontSize: 30, fontWeight: "bold" }}>{current.name}</Text>
      <Text style={{ marginLeft: "auto", marginRight: "auto", marginTop: 30, fontSize: 38, fontWeight: "bold" }}>
        x{current.sets}
      </Text>
      <Pressable 
        onPress={() => navigation.navigate("Rest")}
        style={{ backgroundColor: "blue", marginLeft: "auto", marginRight: "auto", marginTop: 30, borderRadius: 20, padding: 10, width: 150 }}>
        <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 20, color: "white" }}>DONE</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default FitScreen;

const styles = StyleSheet.create({});
