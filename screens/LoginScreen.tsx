import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, Image } from 'react-native'; // Import Image
import MyButton from '../components/MyButton';
import MyTextInput from '../components/MyTextInput';
import auth from "@react-native-firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
    navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginWithEmailAndPass = async () => {
        try {
            const res = await auth().signInWithEmailAndPassword(email, password);
            console.log(res);

            // Save the user data to AsyncStorage
            await AsyncStorage.setItem('currentUser', JSON.stringify(res.user.email));

            Alert.alert("Success", "Logged in successfully.");
            navigation.navigate("Main");
        } catch (err) {
            Alert.alert("Error", err.message);
            console.log(err);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Login Screen</Text>



            <View style={styles.inputContainer}>
                {/* Profile Picture */}
                <Image
                    source={require('../images/profile.png')}  // Replace with your profile image path
                    style={styles.profileImage}
                />

                <MyTextInput
                    value={email}
                    onChangeText={text => setEmail(text)}
                    placeholder="Enter Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <MyTextInput
                    value={password}
                    onChangeText={text => setPassword(text)}
                    placeholder="Password"
                    secureTextEntry
                />
                <Text style={styles.textDontHave}>
                    Don't have an Account?
                    <Text
                        style={styles.signupLink}
                        onPress={() => navigation.navigate('SignUp')}
                    >
                        {' Sign Up'}
                    </Text>
                </Text>
                <MyButton onPress={loginWithEmailAndPass} title={"Login"} />
            </View>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "grey",
        justifyContent: "center",
        alignItems: "center",
    },
    inputContainer: {
        height: 450,
        width: "90%",
        backgroundColor: "white",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    text: {
        margin: 5,
        fontSize: 24,
        fontWeight: 'bold',
    },
    profileImage: {
        width: 100, // Width of the image
        height: 100, // Height of the image
        borderRadius: 50, // Make the image circular
        marginBottom: 30, // Space between the image and the rest of the UI
        
    },
    textDontHave: {
        alignSelf: "flex-end",
        marginRight: 10,
        color: "black",
        marginBottom: 15,
    },
    signupLink: {
        color: "blue",
        fontWeight: 'bold',
    },
});
