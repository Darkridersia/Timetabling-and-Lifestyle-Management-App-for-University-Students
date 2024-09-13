import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  ScrollView,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SQLite, { SQLiteDatabase, Transaction, ResultSet } from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import NetInfo from '@react-native-community/netinfo';

interface Activity {
  id: string;
  name: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
}

const AddActivityScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const navigation = useNavigation();

  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  useEffect(() => {
    SQLite.enablePromise(true);
    SQLite.openDatabase({ name: 'activities.db', location: 'default' })
      .then((database: SQLiteDatabase) => {
        setDb(database);
        createTable(database);
      })
      .catch((error: Error) => console.error('Error opening database:', error));

    return () => {
      if (db) {
        db.close()
          .then(() => console.log('Database closed'))
          .catch((error: Error) => console.error('Error closing database:', error));
      }
    };
  }, []);

  const createTable = (database: SQLiteDatabase) => {
    database.transaction((tx: Transaction) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS activities (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, startDateTime TEXT, endDateTime TEXT)',
        [],
        () => console.log('Table created successfully'),
        (_, error: SQLite.SQLError) => {
          console.error('Error creating table:', error);
          return false;
        }
      );
    }).catch((error: Error) => console.error('Transaction error:', error));
  };

  const saveActivity = async () => {
    if (!name || !description || !startDateTime || !endDateTime) {
      ToastAndroid.show('Please fill all fields', ToastAndroid.SHORT);
      return;
    }

    if (db) {
      try {
        await db.transaction(async (tx) => {
          const [, results] = await tx.executeSql(
            'INSERT INTO activities (name, description, startDateTime, endDateTime) VALUES (?, ?, ?, ?)',
            [name, description, startDateTime, endDateTime]
          );
          if (results.insertId) {
            ToastAndroid.show('Activity saved successfully', ToastAndroid.SHORT);
            syncWithAsyncStorage();
            navigation.goBack();
          } else {
            ToastAndroid.show('Failed to save activity', ToastAndroid.SHORT);
          }
        });
      } catch (error) {
        console.error('Error saving activity:', error);
        ToastAndroid.show('Error saving activity', ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show('Database not ready', ToastAndroid.SHORT);
    }
  };

  const syncWithAsyncStorage = async () => {
    const isConnected = await NetInfo.fetch().then(state => state.isConnected);
    if (!isConnected) {
      console.log('No internet connection, skipping sync');
      return;
    }

    if (db) {
      try {
        const [results] = await db.executeSql('SELECT * FROM activities WHERE synced = 0');
        const unsyncedActivities = results.rows.raw();

        if (unsyncedActivities.length > 0) {
          const existingActivitiesJson = await AsyncStorage.getItem('activities');
          let activities: Activity[] = existingActivitiesJson ? JSON.parse(existingActivitiesJson) : [];

          activities = [...activities, ...unsyncedActivities];
          await AsyncStorage.setItem('activities', JSON.stringify(activities));

          // Mark activities as synced in SQLite
          await db.executeSql('UPDATE activities SET synced = 1 WHERE synced = 0');

          console.log('Activities synced with AsyncStorage');
        }
      } catch (error) {
        console.error('Error syncing with AsyncStorage:', error);
      }
    }
  };

  const showDatePicker = (isStart: boolean) => {
    if (isStart) {
      setStartDatePickerVisibility(true);
    } else {
      setEndDatePickerVisibility(true);
    }
  };
  

  const hideDatePicker = (isStart: boolean) => {
    if (isStart) {
      setStartDatePickerVisibility(false);
    } else {
      setEndDatePickerVisibility(false);
    }
  };
  

  const handleConfirm = (date: Date, isStart: boolean) => {
    const formattedDate = date.toISOString().slice(0, 16).replace('T', ' ');
    if (isStart) {
      setStartDateTime(formattedDate);
      setStartDatePickerVisibility(false);
    } else {
      setEndDateTime(formattedDate);
      setEndDatePickerVisibility(false);
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
        <TouchableOpacity onPress={() => showDatePicker(true)}>
          <TextInput
            style={styles.input}
            value={startDateTime}
            placeholder="YYYY-MM-DD HH:MM"
            editable={false}
          />
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isStartDatePickerVisible}
          mode="datetime"
          onConfirm={(date) => handleConfirm(date, true)}
          onCancel={() => hideDatePicker(true)}
        />

        <Text style={styles.label}>End Date and Time</Text>
        <TouchableOpacity onPress={() => showDatePicker(false)}>
          <TextInput
            style={styles.input}
            value={endDateTime}
            placeholder="YYYY-MM-DD HH:MM"
            editable={false}
          />
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isEndDatePickerVisible}
          mode="datetime"
          onConfirm={(date) => handleConfirm(date, false)}
          onCancel={() => hideDatePicker(false)}
        />

        <TouchableOpacity style={styles.saveButton} onPress={saveActivity}>
          <Text style={styles.saveButtonText}>Save Activity</Text>
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

export default AddActivityScreen;