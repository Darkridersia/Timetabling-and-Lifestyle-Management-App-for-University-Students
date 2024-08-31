import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  Workout: { // Ensure this matches the name and params
    excersises: {
      id: string;
      image: string;
      name: string;
      sets: number;
    }[];
  };
  LifestyleAndWellnessScreen: undefined;
  Fit: {
    excersises: {
      id: string;
      image: string;
      name: string;
      sets: number;
    }[];
  };
  Rest: {
    incrementIndex?: () => void; // Add this line to support the parameter
  };};

// Export the type for use in other components
export type FitnessCardsNavigationProp = StackNavigationProp<RootStackParamList, 'Workout'>;
export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
