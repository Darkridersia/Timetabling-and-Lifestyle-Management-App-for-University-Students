import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, FlatList, Alert } from "react-native";
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import CheckBox from '@react-native-community/checkbox'; // Import checkbox
import { RootStackParamList, RootStackNavigationProp } from '../types';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

type WorkoutScreenRouteProp = RouteProp<RootStackParamList, 'WorkoutScreen'>;

const ResultScreen = () => {
    const [loading, setLoading] = useState(true);
    const [workout, setWorkout] = useState([]);
    const [editedRemarks, setEditedRemarks] = useState({});
    const [selectedItems, setSelectedItems] = useState({}); // To store selected items for deletion

    const route = useRoute<WorkoutScreenRouteProp>();
    const navigation = useNavigation<RootStackNavigationProp>();

    useEffect(() => {
        const subscriber = firestore()
            .collection('Workout')
            .onSnapshot(querySnapshot => {
                const workoutData = [];

                querySnapshot.forEach(documentSnapshot => {
                    workoutData.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });

                console.log('Workout Data:', workoutData); // Verify data is correctly fetched
                setWorkout(workoutData);
                setLoading(false);
            }, (error) => {
                console.error('Firestore subscription error:', error); // Log Firestore errors
                setLoading(false);
            });

        return () => subscriber();
    }, []);

    const handleRemarksChange = (key, newRemarks) => {
        setEditedRemarks(prev => ({ ...prev, [key]: newRemarks }));
    };

    const updateRemarks = (key) => {
        const updatedRemark = editedRemarks[key];
        if (updatedRemark !== undefined) {
            firestore()
                .collection('Workout')
                .doc(key)
                .update({
                    remarks: updatedRemark,
                })
                .then(() => {
                    console.log(`Remarks updated for workout with key: ${key}`);
                    Alert.alert("Remarks updated!");
                })
                .catch(error => {
                    console.error("Error updating remarks: ", error);
                });
        }
    };

    const updateAllRemarks = () => {
        workout.forEach((item) => {
            const updatedRemark = editedRemarks[item.key];
            if (updatedRemark !== undefined) {
                firestore()
                    .collection('Workout')
                    .doc(item.key)
                    .update({
                        remarks: updatedRemark,
                    })
                    .then(() => {
                        console.log(`Remarks for ${item.workout} updated!`);
                    })
                    .catch(error => {
                        console.error("Error updating remarks: ", error);
                    });
            }
        });
        Alert.alert('All remarks updated!');
    };

    // Handle selection of checkboxes
    const handleSelectItem = (key, value) => {
        setSelectedItems(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Delete selected workouts
    const deleteSelectedItems = () => {
        const keysToDelete = Object.keys(selectedItems).filter(key => selectedItems[key]);
        if (keysToDelete.length === 0) {
            Alert.alert('No items selected for deletion.');
            return;
        }

        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete the selected workouts?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => {
                        keysToDelete.forEach(key => {
                            firestore()
                                .collection('Workout')
                                .doc(key)
                                .delete()
                                .then(() => {
                                    console.log(`Workout with key: ${key} deleted`);
                                    setSelectedItems(prev => {
                                        const updatedSelection = { ...prev };
                                        delete updatedSelection[key];
                                        return updatedSelection;
                                    });
                                })
                                .catch(error => {
                                    console.error("Error deleting workout: ", error);
                                });
                        });
                        Alert.alert('Selected items deleted!');
                    }
                }
            ]
        );
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center' }} />;
    }

    return (
        <View style={styles.container}>
            <MaterialCommunityIcons
                // Might need to remove "as never" if values are not properly passed
                onPress={() => navigation.navigate('Lifestyle and Wellness' as never)}
                style={styles.icon}
                name="keyboard-backspace"
                size={28}
                color="black"
            />
            {/* Table Header */}
            <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Select</Text>
                <Text style={styles.tableHeaderText}>Workout</Text>
                <Text style={styles.tableHeaderText}>Calories</Text>
                <Text style={styles.tableHeaderText}>Minutes</Text>
                <Text style={styles.tableHeaderText}>Remarks</Text>
                <Text style={styles.tableHeaderText}>Action</Text>
            </View>

            {/* Table Rows */}
            <FlatList
                data={workout}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => (
                    <View style={styles.tableRow}>
                        {/* Checkbox for selecting rows */}
                        <CheckBox
                            value={!!selectedItems[item.key]} // Check if the item is selected
                            onValueChange={(newValue) => handleSelectItem(item.key, newValue)}
                        />

                        <Text style={styles.tableCell}>{item.workouts || 'N/A'}</Text>
                        <Text style={styles.tableCell}>{item.calories || 'N/A'}</Text>
                        <Text style={styles.tableCell}>{item.minutes || 'N/A'}</Text>

                        {/* Editable Remarks */}
                        <TextInput
                            style={[styles.tableCell, styles.remarksInput]}
                            multiline
                            textAlignVertical="top"
                            numberOfLines={3} // Adjust as per your needs
                            placeholder="Enter remarks"
                            value={editedRemarks[item.key] !== undefined ? editedRemarks[item.key] : item.remarks || ''}
                            onChangeText={(text) => handleRemarksChange(item.key, text)}
                        />

                        {/* Action Button: Add or Update */}
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => updateRemarks(item.key)}
                        >
                            <Text style={styles.actionButtonText}>
                                {item.remarks ? "Update" : "Add"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            {/* Update All Remarks Button */}
            <View style={styles.footer}>
                {/* Delete Selected Items Button */}
                <TouchableOpacity
                    style={[styles.updateButton, { backgroundColor: 'red', marginTop: 10 }]}
                    onPress={deleteSelectedItems}
                >
                    <Text style={styles.buttonText}>Delete Selected Items</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    icon: {
        position: "absolute",
        color: "black",
        left: 20

    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },

    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f1f1f1',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        top: 10
    },
    tableHeaderText: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 5,
    },
    remarksInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 5,
        flex: 2, // Make remarks column wider
    },
    actionButton: {
        backgroundColor: 'lightgreen',
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 5,
    },
    actionButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    footer: {
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'flex-end',
    },
    updateButton: {
        backgroundColor: 'lightblue',
        padding: 15,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ResultScreen;
