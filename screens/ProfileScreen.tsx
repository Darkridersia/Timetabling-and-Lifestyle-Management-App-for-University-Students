

import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { getUserProfile, updateUserProfile } from '../services/apiService'; // Adjust the path as needed

// Define types for user profile
interface UserProfile {
  id: string;
  name: string;
  email?: string; 
  bio?: string;
}

const ExampleComponent: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [newProfileName, setNewProfileName] = useState<string>('');
  const userId: string = '123'; 

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getUserProfile(userId);
        setUserProfile(profile);
      } catch (error) {
        console.error('Failed to load profile', error);
      }
    };

    loadProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (userProfile) {
      try {
        const updatedProfile = { ...userProfile, name: newProfileName };
        const result = await updateUserProfile(userId, updatedProfile);
        setUserProfile(result);
      } catch (error) {
        console.error('Failed to update profile', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text>User Profile: {userProfile ? JSON.stringify(userProfile) : 'Loading...'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter new name"
        value={newProfileName}
        onChangeText={setNewProfileName}
      />
      <Button title="Update Profile" onPress={handleSaveProfile} />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default ProfileScreen;
