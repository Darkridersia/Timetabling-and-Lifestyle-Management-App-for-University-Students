import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar as BigCalendar } from 'react-native-big-calendar';
import { Agenda } from 'react-native-calendars';

// Sample events/tasks for demonstration
const events = [
  {
    title: 'Meeting with John',
    start: new Date(2024, 7, 25, 10, 0),
    end: new Date(2024, 7, 25, 11, 0),
  },
  {
    title: 'Lunch with Sarah',
    start: new Date(2024, 7, 26, 12, 0),
    end: new Date(2024, 7, 26, 13, 0),
  },
  {
    title: 'Project Deadline',
    start: new Date(2024, 7, 30, 9, 0),
    end: new Date(2024, 7, 30, 17, 0),
  },
];

// Sample tasks for Agenda
const tasks = {
  '2024-08-25': [{ name: 'Meeting with John', time: '10:00 - 11:00' }],
  '2024-08-26': [{ name: 'Lunch with Sarah', time: '12:00 - 13:00' }],
  '2024-08-30': [{ name: 'Project Deadline', time: '09:00 - 17:00' }],
};

const TimeTablingScreen = () => {
  const [mode, setMode] = useState<'day' | 'week' | 'month'>('month');
  const [selectedDate, setSelectedDate] = useState('2024-08-25'); // Initial selected date

  // Function to handle date press and jump to day view
  const handleDatePress = (date: string) => {
    setSelectedDate(date);
    setMode('day');
  };

  // Function to handle "+" button press in day view
  const handleAddButtonPress = () => {
    // Navigate to another screen or perform another action
    console.log('Navigating to another screen or adding new task');
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
      {/* "+" Button to navigate to another page */}
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
      mode={mode} // 'week' or 'month'
      onPressCell={(date:any) => handleDatePress(date.toISOString().split('T')[0])} // Navigate to the day view on date press
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
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  taskItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  taskTime: {
    fontSize: 16,
    color: '#333',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  emptyDate: {
    height: 50,
    flex: 1,
    paddingTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  modeText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'blue',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#00adf5',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default TimeTablingScreen;
