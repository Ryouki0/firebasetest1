
import react, { useState } from 'react';
import {View, Text, Button, TextInput, } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import firestore from '@react-native-firebase/firestore';
import LoginScreen from './components/LoginScreen';
import CreateAccountScreen from './components/CreateAccountScreen';
import ChatRoom from './components/ChatRoom';

import auth from '@react-native-firebase/auth';
import WelcomeScreen from './components/WelcomeScreen';
import HomeScreen from './components/HomeScreen';
import storage from '@react-native-firebase/storage';

const ref = storage().ref('Pfps/cookie.webp');
console.log('ref:   ', ref);
const Stack = createNativeStackNavigator();

let initialRouteName = 'LoginScreen';
function App() {

  if(auth().currentUser != null){
    initialRouteName='HomeScreen';
  }
  return <NavigationContainer theme={DarkTheme}>
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Screen name='LoginScreen' options={{headerShown: false}} component={LoginScreen}></Stack.Screen>
      <Stack.Screen name='CreateAccountScreen' component={CreateAccountScreen}></Stack.Screen>
      <Stack.Screen name='HomeScreen' options={{headerShown: false}} component={HomeScreen}></Stack.Screen>
      <Stack.Screen name='ChatRoom' component={ChatRoom} options={
        ({ route }) => {return {title: route.params.otherUserName}}
      }></Stack.Screen>
    </Stack.Navigator>
  </NavigationContainer>
}

export default App;