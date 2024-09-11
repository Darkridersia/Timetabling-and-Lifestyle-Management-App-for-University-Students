import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator'; // Import your StackNavigator
import { FitnessContext } from './Context'; // Import FitnessProvider
import auth from '@react-native-firebase/auth';
import HomeScreen from './screens/HomeScreen';
import LifestyleWellnessScreen from './screens/LifestyleWellnessScreen';
import Location from './screens/Location';
import TimeTablingScreen from './screens/TimeTablingScreen';
import LoginScreen from './screens/LoginScreen'; // Import LoginScreen
import SignUpScreen from './screens/SignUpScreen';
import ResultScreen from './screens/ResultScreen';
import ChatScreen from './screens/ChatScreen';
// Hello from the other side

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const App = () => {
    const handleLogout = (navigation: any) => {
        auth()
            .signOut()
            .then(() => {
                Alert.alert('Logged Out', 'You have been logged out successfully.');
                navigation.replace('Login'); // Use 'replace' to prevent going back to the Main screen with back button
            })
            .catch(error => {
                Alert.alert('Error', error.message);
            });
    };

    const MainDrawerNavigator = () => (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerComponent {...props} handleLogout={handleLogout} />}
            screenOptions={{
                drawerActiveTintColor: 'darkslateblue',
                drawerActiveBackgroundColor: 'pink',
            }}
        >
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="TimeTable" component={TimeTablingScreen} />
            <Drawer.Screen name="Lifestyle and Wellness" component={LifestyleWellnessScreen} />
            <Drawer.Screen name="Chat" component={ChatScreen} />
            
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
                    <Drawer.Screen name="Result" component={ResultScreen} options={{
                        drawerLabel: () => null,  // Hide from drawer menu
                        title: 'Result',
                        drawerIcon: () => null // Hide the icon too
                    }} />
            </Drawer.Navigator>
    );

    return (
        <FitnessContext>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                    <Stack.Screen name="Main" component={MainDrawerNavigator} />
                </Stack.Navigator>
            </NavigationContainer>
        </FitnessContext>
    );
};

const CustomDrawerComponent = (props: any) => {
    const windowHeight = Dimensions.get('window').height;
    const { navigation } = props;

    return (
        <DrawerContentScrollView {...props}>
            <View style={{ height: "100%" }}>
                <View style={{ backgroundColor: '#fff', paddingTop: 10, height: windowHeight * 0.75 }}>
                    <DrawerItemList {...props} />
                </View>
                <View style={{
                    borderTopWidth: 1,
                    borderTopColor: 'gray',
                }}>
                    <TouchableOpacity onPress={() => props.handleLogout(navigation)}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginLeft: 20,
                                paddingVertical: 10,
                            }}>
                            <Text>
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
