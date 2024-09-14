import React, { useState, useEffect , useLayoutEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  View,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackNavigationProp } from '../types';

interface Activity {
  id?: string;
  name: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
}

type RootStackParamList = {
  AddActivity: { activity?: Activity } | undefined;
};


const AddEditActivityScreen: React.FC = () => {
  const route = useRoute();
  const { activity } = route.params as { activity?: Activity };
  const [name, setName] = useState(activity?.name || '');
  const [description, setDescription] = useState(activity?.description || '');
  const [startDateTime, setStartDateTime] = useState(activity?.startDateTime || '');
  const [endDateTime, setEndDateTime] = useState(activity?.endDateTime || '');
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const navigation = useNavigation<RootStackNavigationProp>();

  const isEditMode = !!activity;

  useEffect(() => {
    SQLite.enablePromise(true);
    SQLite.openDatabase({ name: 'activities.db', location: 'default' })
      .then((database: SQLiteDatabase) => {
        setDb(database);
      })
      .catch((error: Error) => console.error('Error opening database:', error));

    return () => {
      if (db) {
        syncWithAsyncStorage().then(() => {
          db.close()
            .then(() => console.log('Database closed'))
            .catch((error: Error) => console.error('Error closing database:', error));
        });
      }
    };
  }, []);

  const saveActivity = async () => {
    if (!name || !description || !startDateTime || !endDateTime) {
      Alert.alert('Incomplete Information', 'Please fill all fields');
      return;
    }

    if (db) {
      try {
        if (isEditMode) {
          await db.executeSql(
            'UPDATE activities SET name = ?, description = ?, startDateTime = ?, endDateTime = ? WHERE id = ?',
            [name, description, startDateTime, endDateTime, activity.id]
          );
        } else {
          await db.executeSql(
            'INSERT INTO activities (name, description, startDateTime, endDateTime) VALUES (?, ?, ?, ?)',
            [name, description, startDateTime, endDateTime]
          );
        }
        Alert.alert('Success', `Activity ${isEditMode ? 'updated' : 'added'} successfully`, [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } catch (error) {
        console.error(`Error ${isEditMode ? 'updating' : 'adding'} activity:`, error);
        Alert.alert('Error', `Failed to ${isEditMode ? 'update' : 'add'} activity`);
      }
    } else {
      Alert.alert('Error', 'Database not ready');
    }
  };

  const syncWithAsyncStorage = async () => {
    if (db) {
      try {
        const [results] = await db.executeSql('SELECT * FROM activities ORDER BY id DESC');
        const activities: Activity[] = results.rows.raw();
        await AsyncStorage.setItem('activities', JSON.stringify(activities));
        console.log('Activities synced with AsyncStorage');
      } catch (error) {
        console.error('Error syncing with AsyncStorage:', error);
      }
    }
  }; 

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Activity Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter activity name"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter activity description"
          multiline
        />

          <Text style={styles.label}>Start Date and Time</Text>
            <TextInput
                style={styles.input}
                value={startDateTime}
                onChangeText={setStartDateTime}
                placeholder="YYYY-MM-DD HH:MM"
            />


        <Text style={styles.label}>End Date and Time</Text>
          <TextInput
            style={styles.input}
            value={endDateTime}
            onChangeText={setEndDateTime}
            placeholder="YYYY-MM-DD HH:MM"
          />

        <TouchableOpacity style={styles.saveButton} onPress={saveActivity}>
          <Text style={styles.saveButtonText}>
            {isEditMode ? 'Update Activity' : 'Add Activity'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddEditActivityScreen;