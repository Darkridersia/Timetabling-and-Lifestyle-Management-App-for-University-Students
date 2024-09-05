import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import MyButton from '../components/MyButton';
import MyTextInput from '../components/MyTextInput';
import auth from "@react-native-firebase/auth";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types'; // Import the RootStackParamList type

// Define the navigation prop type for LoginScreen
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
    navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginWithEmailAndPass = () => {
        auth()
            .signInWithEmailAndPassword(email, password)
            .then((res) => {
                console.log(res);
                Alert.alert("Success", "Logged in successfully.");
                navigation.navigate("Main"); // Navigate to 'Main', which contains the drawer and Home screen
            })
            .catch(err => {
                Alert.alert("Error", err.message); // Display error message
                console.log(err);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Login Screen</Text>
            <View style={styles.inputContainer}>
                <MyTextInput
                    value={email}
                    onChangeText={text => setEmail(text)}
                    placeholder="Enter Email"
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
