import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';

const NotificationsScreen = () => {
  // State to store notifications
  const [notifications, setNotifications] = useState([
    { id: '1', message: 'Your assignment is due tomorrow.', time: '2 hours ago' },
    { id: '2', message: 'New event: Programming Workshop starts in 3 days.', time: '5 hours ago' },
    { id: '3', message: 'Your friend just commented on your post.', time: '1 day ago' },
  ]);

  // Function to clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Function to render each notification item
  const renderNotification = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.time}>{item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Notifications</Text>

      {/* Clear Notifications Button */}
      {notifications.length > 0 ? (
        <Button title="Clear All" onPress={clearNotifications} />
      ) : (
        <Text style={styles.noNotifications}>No notifications available</Text>
      )}

      {/* List of Notifications */}
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        style={styles.notificationList}
      />
    </View>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  notificationList: {
    marginTop: 10,
  },
  notificationItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 5,
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  noNotifications: {
    textAlign: 'center',
    color: '#555',
    fontSize: 16,
    marginBottom: 20,
  },
});
