import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { RootStackNavigationProp } from '../types';


interface Activity {
  id: number;
  name: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
}

const ActivityScreen: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const navigation = useNavigation<RootStackNavigationProp>();

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

  const createTable = async (database: SQLiteDatabase) => {
    try {
      await database.executeSql(
        'CREATE TABLE IF NOT EXISTS activities (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, startDateTime TEXT, endDateTime TEXT)'
      );
      console.log('Table created successfully');
    } catch (error) {
      console.error('Error creating table:', error);
    }
  };

  const loadActivitiesFromAsyncStorage = async () => {
    try {
      const activitiesJson = await AsyncStorage.getItem('activities');
      if (activitiesJson) {
        const asyncActivities: Activity[] = JSON.parse(activitiesJson);
        if (db) {
          await db.executeSql('DELETE FROM activities');
          for (const activity of asyncActivities) {
            await db.executeSql(
              'INSERT INTO activities (id, name, description, startDateTime, endDateTime) VALUES (?, ?, ?, ?, ?)',
              [activity.id, activity.name, activity.description, activity.startDateTime, activity.endDateTime]
            );
          }
        }
      }
    } catch (error) {
      console.error('Error loading activities from AsyncStorage:', error);
    }
  };

  const loadActivities = async () => {
    if (db) {
      try {
        const [results] = await db.executeSql('SELECT * FROM activities ORDER BY id DESC', []);
        const rows = results.rows;
        const activitiesData: Activity[] = [];
        for (let i = 0; i < rows.length; i++) {
          activitiesData.push(rows.item(i));
        }
        setActivities(activitiesData);
      } catch (error) {
        console.error('Error loading activities:', error);
        Alert.alert('Error', 'Failed to load activities');
      }
    }
  };

  const deleteActivity = async (id: number) => {
    if (db) {
      try {
        await db.executeSql('DELETE FROM activities WHERE id = ?', [id]);
        loadActivities();
      } catch (error) {
        console.error('Error deleting activity:', error);
        Alert.alert('Error', 'Failed to delete activity');
      }
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

  // Use useFocusEffect to reload activities when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (db) {
        loadActivitiesFromAsyncStorage().then(() => loadActivities());
      }
      return () => {
        syncWithAsyncStorage();
      };
    }, [db])
  );

  const renderActivity = (activity: Activity) => (
    <View key={activity.id} style={styles.activityBox}>
      <View style={styles.activityHeader}>
        <Text style={styles.activityName}>{activity.name}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("AddEditActivity")}
          >
            <MaterialCommunityIcons name="pencil-outline" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteActivity(activity.id)}
          >
            <MaterialCommunityIcons name="delete-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.activityDateTime}>Start: {activity.startDateTime}</Text>
      <Text style={styles.activityDateTime}>End: {activity.endDateTime}</Text>
      <Text style={styles.activityDescription}>{activity.description}</Text>
    </View>
  );


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Activities</Text>
        <MaterialCommunityIcons 
          onPress={() => navigation.navigate("AddEditActivity")}
          name="plus"
          size={30}
        />
      </View>
      <ScrollView style={styles.scrollView}>
        {activities.length > 0 ? (
          activities.map(renderActivity)
        ) : (
          <Text style={styles.noActivities}>No activities found</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    padding: 8,
  },
  addIcon: {
    width: 24,
    height: 24,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  activityBox: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  activityDateTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#444',
    marginTop: 8,
  },
  noActivities: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 32,
  },
  syncStatus: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    fontStyle: 'italic',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 4,
  },
});

export default ActivityScreen;