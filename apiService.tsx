const API_BASE_URL = 'https://api.example.com';

// Define the UserProfile interface for type safety
interface UserProfile {
  id: string;
  name: string;
  email?: string;
  bio?: string;
}

// Fetch the user profile by userId
export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.status}`);
    }
    const data: UserProfile = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user profile', error);
    throw error;
  }
};

// Update the user profile with new data
export const updateUserProfile = async (
  userId: string, 
  profileData: UserProfile
): Promise<UserProfile> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    if (!response.ok) {
      throw new Error(`Failed to update user profile: ${response.status}`);
    }
    const data: UserProfile = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating user profile', error);
    throw error;
  }
};
