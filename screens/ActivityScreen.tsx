import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  ScrollView,
  View,
  Image,
} from 'react-native';
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import NetInfo from "@react-native-community/netinfo";

interface Activity {
  id: number;
  name: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  synced: number;
}

const ActivityScreen: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    SQLite.enablePromise(true);
    SQLite.openDatabase({ name: 'activities.db', location: 'default' })
      .then((database: SQLiteDatabase) => {
        setDb(database);
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
        ToastAndroid.show('Failed to load activities', ToastAndroid.SHORT);
      }
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
        const [results] = await db.executeSql('SELECT * FROM activities WHERE synced = 0', []);
        const rows = results.rows;
        const unsyncedActivities: Activity[] = [];
        for (let i = 0; i < rows.length; i++) {
          unsyncedActivities.push(rows.item(i));
        }

        if (unsyncedActivities.length > 0) {
          const existingActivitiesJson = await AsyncStorage.getItem('activities');
          let cloudActivities: Activity[] = existingActivitiesJson ? JSON.parse(existingActivitiesJson) : [];

          cloudActivities = [...cloudActivities, ...unsyncedActivities];
          await AsyncStorage.setItem('activities', JSON.stringify(cloudActivities));

          // Mark activities as synced in SQLite
          await db.executeSql('UPDATE activities SET synced = 1 WHERE synced = 0', []);

          console.log('Activities synced with AsyncStorage');
          ToastAndroid.show('Activities synced with cloud', ToastAndroid.SHORT);
        }
      } catch (error) {
        console.error('Error syncing with AsyncStorage:', error);
      }
    }
  };

  // Use useFocusEffect to reload activities when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadActivities();
      syncWithAsyncStorage();
    }, [db])
  );

  const renderActivity = (activity: Activity) => (
    <View key={activity.id} style={styles.activityBox}>
      <Text style={styles.activityName}>{activity.name}</Text>
      <Text style={styles.activityDateTime}>Start: {activity.startDateTime}</Text>
      <Text style={styles.activityDateTime}>End: {activity.endDateTime}</Text>
      <Text style={styles.activityDescription}>{activity.description}</Text>
      <Text style={styles.syncStatus}>{activity.synced ? 'Synced' : 'Not synced'}</Text>
    </View>
  );


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Activities</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddActivityScreen')} style={styles.addButton}>
          <Image source={require('../icon/plus.jpg')} style={styles.addIcon} />
        </TouchableOpacity>
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
});

export default ActivityScreen;