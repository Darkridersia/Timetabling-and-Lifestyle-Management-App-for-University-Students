import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator'; // Import your StackNavigator
import { FitnessItems, FitnessContext } from './Context'; // Import FitnessProvider
import HomeScreen from './screens/HomeScreen';
import LifestyleWellnessScreen from './screens/LifestyleWellnessScreen';

const Drawer = createDrawerNavigator();

const App = () => {
    return (
        <FitnessContext>
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
                    {/* StackNavigator as a screen but hidden in drawer */}
                    <Drawer.Screen 
                        name="WorkoutStack" 
                        component={StackNavigator} 
                        options={{ 
                            drawerLabel: () => null,  // Hide from drawer menu
                            title: 'Workout',
                            drawerIcon: () => null // Hide the icon too
                        }} 
                    />
                </Drawer.Navigator>
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
