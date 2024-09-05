import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import StackNavigator from './StackNavigator'; // Import your StackNavigator
import { FitnessContext } from './Context'; // Import FitnessProvider
import HomeScreen from './screens/HomeScreen';
import LifestyleWellnessScreen from './screens/LifestyleWellnessScreen';
import Location from './screens/Location';
import TimeTablingScreen from "./screens/TimeTablingScreen";
import LoginScreen from './screens/LoginScreen'; // Import LoginScreen
import SignUpScreen from './screens/SignUpScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator(); // Add stack navigator

const App = () => {
    return (
        <FitnessContext>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Main">
                        {() => (
                            <Drawer.Navigator
                                drawerContent={(props) => <CustomDrawerComponent {...props} />}
                                screenOptions={{
                                    drawerActiveTintColor: 'darkslateblue',
                                    drawerActiveBackgroundColor: 'pink',
                                }}
                            >
                                <Drawer.Screen name="Home" component={HomeScreen} />
                                <Drawer.Screen name="TimeTable" component={TimeTablingScreen} />
                                <Drawer.Screen name="Lifestyle and Wellness" component={LifestyleWellnessScreen} />
                                <Drawer.Screen name="WorkoutStack" component={StackNavigator} options={{
                                    drawerLabel: () => null,  // Hide from drawer menu
                                    title: 'Workout',
                                    drawerIcon: () => null // Hide the icon too
                                }} />
                                <Drawer.Screen name="Location" component={Location} options={{
                                    drawerLabel: () => null,  // Hide from drawer menu
                                    title: 'Location',
                                    drawerIcon: () => null // Hide the icon too
                                }} />
                            </Drawer.Navigator>
                        )}
                    </Stack.Screen>
                </Stack.Navigator>
            </NavigationContainer>
        </FitnessContext>
    );
};

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
};

export default App;
