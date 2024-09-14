import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar as BigCalendar } from 'react-native-big-calendar';
import { Agenda } from 'react-native-calendars';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
// Sample events/tasks for demonstration
type TimeTablingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TimeTable'>;

type Props = {
    navigation: TimeTablingScreenNavigationProp;
};

const TimeTablingScreen: React.FC<Props> = ({navigation}) => {
    const [mode, setMode] = useState<'day' | 'week' | 'month'>('month');
    const [selectedDate, setSelectedDate] = useState('2024-08-25');
    const [events, setEvents] = useState([]);
    const [tasks, setTasks] = useState({});
  
    // Fetch saved events from AsyncStorage on component mount
    useEffect(() => {
      const loadEvents = async () => {
        const savedEvents = await AsyncStorage.getItem('events');
        if (savedEvents) setEvents(JSON.parse(savedEvents));
      };
  
      const loadTasks = async () => {
        const savedTasks = await AsyncStorage.getItem('tasks');
        if (savedTasks) setTasks(JSON.parse(savedTasks));
      };
  
      loadEvents();
      loadTasks();
    }, []);
  
    // Handle date press and switch to day view
    const handleDatePress = (date: string) => {
      setSelectedDate(date);
      setMode('day');
    };
  
    // Handle "+" button press to navigate to AddActivity screen
    const handleAddButtonPress = () => {
      navigation.navigate('AddActivity');
    };
  
    // Render day view using Agenda
    const renderDayView = () => (
      <View style={{ flex: 1 }}>
        <Agenda
          items={tasks}
          selected={selectedDate}
          renderItem={(item: any) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskTime}>{item.time}</Text>
              <Text style={styles.taskTitle}>{item.name}</Text>
            </View>
          )}
          renderEmptyDate={() => (
            <View style={styles.emptyDate}>
              <Text>No tasks for this day</Text>
            </View>
          )}
          theme={{
            selectedDayBackgroundColor: '#00adf5',
            todayTextColor: '#00adf5',
            dotColor: '#00adf5',
            selectedDotColor: '#ffffff',
          }}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddButtonPress}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  
    // Render week and month views using BigCalendar
    const renderCalendarView = () => (
      <BigCalendar
        events={events}
        height={600}
        mode={mode}
        onPressCell={(date: any) => handleDatePress(date.toISOString().split('T')[0])}
      />
    );
  
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Timetabling Management</Text>
        {mode === 'day' ? renderDayView() : renderCalendarView()}
        <View style={styles.modeSwitch}>
          <Text onPress={() => setMode('day')} style={styles.modeText}>
            Day
          </Text>
          <Text onPress={() => setMode('week')} style={styles.modeText}>
            Week
          </Text>
          <Text onPress={() => setMode('month')} style={styles.modeText}>
            Month
          </Text>
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 20, backgroundColor: '#f0f0f0' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    taskItem: { backgroundColor: '#fff', padding: 10, marginRight: 10, marginTop: 17, borderRadius: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 1 }, shadowRadius: 3, elevation: 2 },
    taskTime: { fontSize: 16, color: '#333' },
    taskTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
    emptyDate: { height: 50, flex: 1, paddingTop: 30, justifyContent: 'center', alignItems: 'center' },
    modeSwitch: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
    modeText: { fontSize: 18, fontWeight: '500', color: 'blue' },
    addButton: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#00adf5', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', elevation: 5 },
    addButtonText: { color: 'white', fontSize: 30, fontWeight: 'bold' },
  });
  
  export default TimeTablingScreen;