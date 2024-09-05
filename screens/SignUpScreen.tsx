import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import MyButton from '../components/MyButton';
import MyTextInput from '../components/MyTextInput';
import auth from "@react-native-firebase/auth";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types'; // Import the RootStackParamList type

// Define the navigation prop type for SignUpScreen
type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

type Props = {
    navigation: SignUpScreenNavigationProp;
};

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const signUpTestFn = () => {
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                Alert.alert("Success", "User created successfully. Please log in.");
                navigation.navigate("Login"); // Navigate to Login screen after successful signup
            })
            .catch((err) => {
                // It will check if there's duplicate email or password is less than 6 characters
                Alert.alert("Error", err.message); // Display error message
                console.log(err);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Sign Up Screen</Text>
            <View style={styles.inputContainer}>
                <MyTextInput
                    value={email}
                    // Can ignore the error
                    onChangeText={text => setEmail(text)}
                    placeholder="Enter Email"
                />
                <MyTextInput
                    value={password}
                    // Can ignore the error
                    onChangeText={text => setPassword(text)}
                    placeholder="Password"
                    secureTextEntry
                />
                <MyTextInput
                    value={confirmPassword}
                    // Can ignore the error
                    onChangeText={text => setConfirmPassword(text)}
                    placeholder="Confirm Password"
                    secureTextEntry
                />
                {/* Can ignore the error */}
                <MyButton onPress={signUpTestFn} title={"Sign Up"} />
            </View>
        </View>
    );
};

export default SignUpScreen;

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
});
