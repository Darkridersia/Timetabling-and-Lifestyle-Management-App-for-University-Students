import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import LifestyleWellnessScreen from "./screens/LifestyleWellnessScreen"; // Import the screen
import HomeScreen from "./screens/HomeScreen";
import WorkoutScreen from "./screens/WorkoutScreen";
import { DrawerContentScrollView, DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Drawer.Navigator
                drawerContent={(props) => <CustomDrawerComponent {...props} />}
                screenOptions={{
                    drawerActiveTintColor: 'darkslateblue',
                    drawerActiveBackgroundColor: 'pink',
                }}
            >
                <Drawer.Screen 
                  name="Home" 
                  component={HomeScreen} 
                />
                <Drawer.Screen 
                    name="Lifestyle and Wellness" 
                    component={LifestyleWellnessScreen}
                />  
                <Drawer.Screen 
                    name="WorkoutStack" 
                    component={WorkoutStackNavigator} // Adding stack navigator as a drawer screen
                />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

const WorkoutStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Workout" component={WorkoutScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
    );
}

const CustomDrawerComponent = (props: any) => {
    const windowHeight = Dimensions.get('window').height;

    return (
        <DrawerContentScrollView {...props}>
            <View style={{ height: "100%" }}>
                <View style={{ backgroundColor: '#fff', paddingTop: 10, height: windowHeight * .75 }}>
                    <DrawerItemList {...props} />
                </View>
                <View style={{
                    borderTopWidth: 1,
                    borderTopColor: 'gray',
                }}>
                    <TouchableOpacity>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginLeft: 20,
                            }}>
                            <Text
                                style={{
                                    marginLeft: 20,
                                    fontSize: 23,
                                }}>
                                Logout
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </DrawerContentScrollView>
    );
}

export default App;
