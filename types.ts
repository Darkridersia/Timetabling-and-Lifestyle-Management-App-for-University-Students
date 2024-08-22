// types.ts
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  Workout: undefined;
  // Add other screens here
};

export type FitnessCardsNavigationProp = StackNavigationProp<RootStackParamList, 'Workout'>;
