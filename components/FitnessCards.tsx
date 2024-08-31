import React from 'react';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types'; // Adjust the import path
import fitness from '../data/fitness';

type FitnessCardsNavigationProp = StackNavigationProp<RootStackParamList, 'Workout'>;

const FitnessCards = () => {
  const navigation = useNavigation<FitnessCardsNavigationProp>();

  return (
    <View>
      {fitness.map((item, key) => (
        <Pressable
          onPress={() => navigation.navigate('Workout', {
            excersises: item.excersises, // Use 'excersises' as defined in the parameter type
          })}
          style={styles.card}
          key={key}
        >
          <Image
            style={styles.image}
            source={{ uri: item.image }}
          />
          <Text style={styles.title}>{item.name}</Text>
          <MaterialCommunityIcons
            style={styles.icon}
            name="lightning-bolt"
            size={24}
            color="black"
          />
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  image: {
    width: "95%",
    height: 140,
    borderRadius: 7
  },
  title: {
    position: "absolute",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    left: 20,
    top: 20
  },
  icon: {
    position: "absolute",
    color: "white",
    bottom: 15,
    left: 20
  }
});

export default FitnessCards;
