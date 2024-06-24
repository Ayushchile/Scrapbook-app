import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import CreateBookFriend from './CreateBookFriend';
import CreateBookFamily from './CreateBookFamily';
import CreateBookColleague from './CreateBookColleague';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="CreateScrapBooksfriend"
          component={CreateBookFriend}
        />
        <Stack.Screen
          name="CreateScrapBookfamily"
          component={CreateBookFamily}
        />
        <Stack.Screen
          name="CreateScrapBookColleague"
          component={CreateBookColleague}
        />
        {/* Other screens */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
