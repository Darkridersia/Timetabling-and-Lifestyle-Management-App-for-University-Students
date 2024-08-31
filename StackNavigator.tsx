import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WorkoutScreen from './screens/WorkoutScreen';
import LifestyleAndWellnessScreen from './screens/LifestyleWellnessScreen'; // Import your other screen
import FitScreen from './screens/FitScreen';
import RestScreen from './screens/RestScreen';

const Stack = createStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Workout"
                component={WorkoutScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="LifestyleAndWellnessScreen" // Ensure this matches the screen name used in navigation
                component={LifestyleAndWellnessScreen}
                options={{ headerShown: false }} // Adjust as needed
            />

            <Stack.Screen
                name="Fit" // Ensure this matches the screen name used in navigation
                component={FitScreen}
                options={{ headerShown: false }} // Adjust as needed
            />

            <Stack.Screen
                name="Rest" // Ensure this matches the screen name used in navigation
                component={RestScreen}
                options={{ headerShown: false }} // Adjust as needed
            />
        </Stack.Navigator>


    );
}

export default StackNavigator;
