import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, FlatList, Alert } from "react-native";
import firestore from '@react-native-firebase/firestore';

const ResultScreen = () => {
    const [loading, setLoading] = useState(true);
    const [workout, setWorkout] = useState([]);
    const [editedRemarks, setEditedRemarks] = useState({});

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

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center' }} />;
    }

    return (
        <View style={styles.container}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
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
                <TouchableOpacity
                    style={styles.updateButton}
                    onPress={updateAllRemarks}
                >
                    <Text style={styles.buttonText}>Update All Remarks</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
