import React, { useState } from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet } from 'react-native';

const SocialCommunityScreen = () => {
  // State to manage posts
  const [posts, setPosts] = useState([
    { id: '1', user: 'Alice', content: 'Hello, everyone! This is my first post.' },
    { id: '2', user: 'Bob', content: 'Nice to meet you all. Looking forward to great discussions!' },
  ]);

  const [newPost, setNewPost] = useState(''); // State to manage the new post content

  // Function to handle adding a new post
  const handleAddPost = () => {
    if (newPost.trim() === '') return; // Prevent empty posts
    const newPostData = {
      id: (posts.length + 1).toString(),
      user: 'User', // Placeholder for the user (could be fetched from profile)
      content: newPost,
    };
    setPosts([newPostData, ...posts]); // Add the new post to the top of the list
    setNewPost(''); // Clear the input field
  };

  // Render each post in a list
  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.userName}>{item.user}</Text>
      <Text style={styles.postContent}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Social Community</Text>

      {/* Input for new post */}
      <TextInput
        style={styles.input}
        placeholder="Write something..."
        value={newPost}
        onChangeText={setNewPost}
      />
      <Button title="Add Post" onPress={handleAddPost} />

      {/* Displaying posts */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        style={styles.postList}
      />
    </View>
  );
};

export default SocialCommunityScreen;

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  postList: {
    marginTop: 20,
  },
  postContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postContent: {
    fontSize: 14,
    marginTop: 5,
  },
});
