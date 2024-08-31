import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { RootStackNavigationProp } from '../types';
import fitness from '../data/fitness';
import Fit from './FitScreen'

// Define the type for the route parameters
type WorkoutScreenRouteParams = {
  image: string;
  excersises: {
    id: string;
    image: string;
    name: string;
    sets: number;
  }[];
  id: string;
};

// Below code is needed in order for the "uri: route.params.image" too work
const WorkoutScreen = () => {
  // Receiving Data and typecasting
  const route = useRoute<RouteProp<{ params: WorkoutScreenRouteParams }, 'params'>>();


  console.log(route.params);

  // This is to ensure the back button here will go back to LifeStyle and Wellness Screen
  const navigation = useNavigation<RootStackNavigationProp>(); // Ensure correct typing

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: 'white', marginTop: 0 }}>
        <Image source={{ uri: route.params.image }} style={styles.image} />

        <MaterialCommunityIcons
          onPress={() => navigation.navigate('LifestyleAndWellnessScreen')} // Navigate directly
          style={styles.icon}
          name="keyboard-backspace" a
          size={28}
          color="black"
        />

        {route.params.excersises.map((item, index) => (
          <Pressable style={{ margin: 10, flexDirection: "row", alignItems: "center" }} key={index}>
            <Image style={{ width: 90, height: 92 }} source={{ uri: item.image }} />

            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 17, fontWeight: "bold" }}>{item.name}</Text>

              <Text style={{ marginTop: 4, fontSize: 18, color: "gray" }}>x{item.sets}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Pressable 
      onPress={() => navigation.navigate("Fit", {
        excersises: route.params.excersises,
      })}

      style={{ backgroundColor: "blue", padding: 10, marginLeft: "auto", marginRight: "auto", borderRadius: 6, width: 120 }}>
        <Text style={{ textAlign: "center", color: "white", fontSize: 15, fontWeight: "600" }}>START</Text>
      </Pressable>
    </>
  );
};

export default WorkoutScreen;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 170, // Adjust size as needed
    resizeMode: 'cover',
  },

  icon: {
    position: "absolute",
    color: "white",
    top: 20,
    left: 20
  }
});
