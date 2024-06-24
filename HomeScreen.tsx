/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const handleCreateScrapBook = () => {
    // Navigate to the screen for creating ScrapBooks
    navigation.navigate('CreateScrapBooksfriend');
  };
  const handleCreateScrapBookFamily = () => {
    // Navigate to the screen for creating ScrapBooks
    navigation.navigate('CreateScrapBookfamily');
  };
  const handleCreateScrapBookColleague = () => {
    // Navigate to the screen for creating ScrapBooks
    navigation.navigate('CreateScrapBookColleague');
  };
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.container1}>
      <Image source={require('./assets/search.jpg')} style={styles.image1} />
      <Image source={require('./assets/book.png')} style={styles.image} />
      <Image source={require('./assets/message.png')} style={styles.image} />
    </View>
      <Text style={styles.title}>Create</Text>
      <View style={styles.buttonContainer}>
        <Button title="ScrapBook for Friends" onPress={handleCreateScrapBook} />
        <Button title="ScrapBook for Family" onPress={handleCreateScrapBookFamily} />
        <Button title="ScrapBook for Colleague" onPress={handleCreateScrapBookColleague} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container1: {
    flexDirection: 'row', // Images will be in a single row
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 10,
  },
  title: {
    paddingTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
    backgroundColor: 'pink',
  },
  image: {
    height: 30,
    width: 30,
    marginRight: 20, // Add some margin between images
  },
  image1: {
    height: 30,
    width: 30,
    marginRight: 260, // Add some margin between images
    paddingLeft: 20,
  },
  button: {
    backgroundColor: 'pink', // Change the color to whatever you desire
  },

});

export default HomeScreen;
