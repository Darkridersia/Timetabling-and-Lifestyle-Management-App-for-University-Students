import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined; // No parameters for Home
  LifestyleAndWellnessScreen: { incrementIndex?: () => void }; // Optional parameter
  WorkoutScreen: { 
    excersises: {
      id: string;
      image: string;
      name: string;
      sets: number;
    }[];
  };
  Fit: { 
    excersises: {
      id: string;
      image: string;
      name: string;
      sets: number;
    }[];
  };
  Rest: { 
    incrementIndex: () => void; // Expecting a function as a parameter
  };
  Location: undefined;
};

// Export the type for use in other components
export type FitnessCardsNavigationProp = StackNavigationProp<RootStackParamList, 'WorkoutScreen'>;
export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
