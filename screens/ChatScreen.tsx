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
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Use this link --> http://localhost:5000/chat
var socket = io('http://10.0.2.2:5000/chat', {
    transports: ['websocket'],
});


const ChatScreen = () => {

  const [name, setName] = useState('Your Name');
  const [message, setMessage] = useState('');
  const [chatroom, setChatroom] = useState('');

  // Fetch the user name from AsyncStorage
  const getUserNameFromStorage = async () => {
    try {
      const storedName = await AsyncStorage.getItem('currentUser');
      if (storedName) {
        setName(storedName); // Set the user name to state
      }
    } catch (error) {
      console.error('Error fetching user name from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    // Get user name when the component mounts
    getUserNameFromStorage();

    // Socket events and connection
    socket.on('connect', () => {
      console.log(socket.id); // undefined
      socket.emit('mobile_client_connected', { connected: true }, (response: any) => {
        console.log(response);
      });
      ToastAndroid.show('Connected to server', ToastAndroid.LONG);
    });

    socket.on('connect_to_client', (data: any) => {
      let greets = JSON.parse(data);
      console.log(greets);
    });

    // Handle connection error
    socket.on('error', (error: any) => {
      ToastAndroid.show('Failed to connect to server', ToastAndroid.LONG);
    });

    // Receive chat broadcast from server
    socket.on('message_broadcast', (data: any) => {
      console.log(data);
      let messageBag = JSON.parse(data);

      setChatroom((chatroom) => chatroom + `Message from ${messageBag.sender} at ${messageBag.timestamp}: \n${messageBag.message}\n\n`);
    });
  }, []);

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={name === 'Your Name' ? 'Enter name' : name}
        value={name}
        selectTextOnFocus={true}
        onChangeText={(name: string) => setName(name)}
      />
      <TextInput
        style={styles.output}
        value={chatroom}
        multiline={true}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter message"
        value={message}
        selectTextOnFocus={true}
        onChangeText={(message: string) => setMessage(message)}
      />
      <TouchableOpacity
        onPress={() => {
          socket.emit('message_sent', {
            sender: name,
            message: message,
          });
        }}
      >
        <View style={styles.button}>
          <Text style={styles.buttonText}>Send</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    fontSize: 16,
    color: '#000099',
    marginTop: 10,
    marginBottom: 10,
  },
  output: {
    height: 400,
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
    color: 'black',
  },
  button: {
    padding: 20,
    backgroundColor: 'blue',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default ChatScreen;
