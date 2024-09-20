import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Alert, TextInput, Button, PermissionsAndroid, Platform } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';

const SocialCommunityScreen: React.FC = () => {
    const [eventName, setEventName] = useState('');
    const [eventImageURL, setEventImageURL] = useState('');
    const [imageFileName, setImageFileName] = useState('');

    const navigation = useNavigation();

    // Request storage permission for Android
    const requestStoragePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    {
                        title: "Permission to access gallery",
                        message: "We need your permission to access the gallery to upload event images.",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK",
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true; // No need for permission on iOS
    };

    useEffect(() => {
        // Automatically request storage permission on component mount (Android only)
        if (Platform.OS === 'android') {
            requestStoragePermission();
        }
    }, []);

    // Function to pick image from the gallery
    const pickImage = async () => {
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) {
            Alert.alert("Permission denied", "Unable to access gallery.");
            return;
        }

        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            maxWidth: 1024,
            maxHeight: 1024,
            quality: 0.8,
        };

        launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
                console.log("Image picker cancelled");
                return;
            }

            if (response.errorCode) {
                console.error("Error in image picker:", response.errorMessage);
                Alert.alert("Error", "Failed to pick image.");
                return;
            }

            if (response.assets && response.assets.length > 0) {
                const imageUri = response.assets[0].uri || '';
                const imageName = response.assets[0].fileName || `image_${Date.now()}.jpg`; // Fallback in case filename is missing
                setImageFileName(imageName);
                await uploadImageToStorage(imageUri, imageName);
            }
        });
    };

    // Function to upload the image to Firebase Storage
    const uploadImageToStorage = async (imageUri: string, imageName: string) => {
        try {
            const reference = storage().ref(imageName);
            await reference.putFile(imageUri);
            const url = await reference.getDownloadURL();
            setEventImageURL(url);
            Alert.alert("Image Uploaded", "Image successfully uploaded.");
        } catch (error) {
            console.error("Error uploading image:", error);
            Alert.alert("Error", "Failed to upload image.");
        }
    };

    // Add social event to Firestore
    const addSocialEvent = () => {
        if (!eventName) {
            Alert.alert("Error", "Please enter an event name.");
            return;
        }

        if (!eventImageURL) {
            Alert.alert("Error", "Please upload an event image.");
            return;
        }

        firestore().collection("SocialEvents").add({
            eventName,
            eventImageURL,
        })
        .then(() => {
            console.log('Added Social Event');
            Alert.alert("Success", "Social event added successfully.");
            setEventName('');
            setEventImageURL('');
            setImageFileName('');
        })
        .catch((err) => {
            console.error("Error adding social event:", err);
            Alert.alert("Error", "Failed to add social event.");
        });
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={styles.headerText}>Social Events</Text>

                        <MaterialCommunityIcons
                            onPress={() => navigation.navigate("Location")}
                            name="map-search-outline"
                            size={30}
                            color="white"
                        />
                    </View>

                    {/* Event name input */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Event Name"
                            value={eventName}
                            onChangeText={setEventName}
                            style={styles.input}
                        />
                    </View>

                    {/* Button to pick image */}
                    <Button title="Pick Event Image" onPress={pickImage} />

                    {/* Display event image preview */}
                    {eventImageURL ? (
                        <View style={styles.imageContainer}>
                            <Image
                                style={styles.image}
                                source={{ uri: eventImageURL }}
                            />
                        </View>
                    ) : (
                        <Text style={styles.noImageText}>No Image Selected</Text>
                    )}
                </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
                <MaterialCommunityIcons
                    name="plus-circle"
                    size={30}
                    color="white"
                    style={styles.icons}
                    onPress={addSocialEvent}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1, 
    },
    header: {
        backgroundColor: "#3CB371",
        padding: 10,
        paddingBottom: 10,
    },
    headerText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 18,
    },
    inputContainer: {
        marginVertical: 10,
    },
    input: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    imageContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    image: {
        width: "90%",
        height: 120,
        borderRadius: 7,
    },
    noImageText: {
        textAlign: "center",
        color: "white",
        fontStyle: "italic",
        marginTop: 10,
    },
    icons: {
        backgroundColor: "#20B2AA",
        padding: 15,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    buttonContainer: {
        position: "absolute",
        bottom: 20,
        right: 20,
        alignItems: "center",
        justifyContent: "center",
    },
});

export default SocialCommunityScreen;
