import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  WorkoutStack: {
    screen: 'Workout';
    params: {
      image: string;
      excersises: {
        id: string;
        image: string;
        name: string;
        sets: number;
      }[];
      id: string;
    };
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
  Rest: undefined;
};


// Export the type for use in other components
export type FitnessCardsNavigationProp = StackNavigationProp<RootStackParamList, 'WorkoutStack'>;
export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;


