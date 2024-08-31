import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { RootStackNavigationProp } from '../types';

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

const WorkoutScreen = () => {
  const route = useRoute<RouteProp<{ params: WorkoutScreenRouteParams }, 'params'>>();
  const navigation = useNavigation<RootStackNavigationProp>();

  // Destructure parameters with default values
  const { image = '', excersises = [] } = route.params || {};

  // Check if required data is available
  if (!image || !excersises.length) {
    return <Text style={styles.errorText}>Error: Missing or invalid data</Text>;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />

      <MaterialCommunityIcons
        onPress={() => navigation.navigate('LifestyleAndWellnessScreen')}
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
        </Pressable>
      ))}

      <Pressable 
        onPress={() => navigation.navigate("Fit", { excersises })}
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
