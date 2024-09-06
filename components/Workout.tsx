import React, {FC} from 'react';
import {StyleSheet, View, Image, Text, Button} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Category: FC<{workout: any; calories: any, minutes: any, remarks:string, itemKey:string}> = ({workout, calories, minutes, remarks, itemKey}) => {

  const deleteItem = () =>{
    firestore()
      .collection('Workout')
      .doc(itemKey)
      .delete()
      .then(() => {
        console.log('Workout deleted!');
      })
  }

  return (
    <View style={styles.con}>
      <Button title='delete' onPress={deleteItem}/>
      <Text style={styles.text}>{workout}</Text>
      <Text style={styles.text}>{calories}</Text>
      <Text style={styles.text}>{minutes}</Text>
      <Text style={styles.text}>{remarks}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    height: 120,
    width: 139,
    borderRadius: 32,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 11,
    borderWidth: 1,
    borderColor: 'red',
  },
  image: {
    height: '48%',
    width: '48%',
    marginBottom: 5,
  },
  text: {
    fontSize: 15,
    fontFamily: 'Audiowide-Regular',
    color: 'red',
  },
});
export default Category;

