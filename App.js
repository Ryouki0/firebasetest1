
import react, { useState } from 'react';
import {View, Text, Button, TextInput, } from 'react-native';
import { NavigationContainer, } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import firestore from '@react-native-firebase/firestore';
import LoginScreen from './components/LoginScreen';
import CreateAccountScreen from './components/CreateAccountScreen';
import ChatRoom from './components/ChatRoom';

import auth from '@react-native-firebase/auth';
import WelcomeScreen from './components/WelcomeScreen';

const Stack = createNativeStackNavigator();

let initialRouteName = 'LoginScreen';
function App() {

  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');

  
 
  function onError(error){
    console.log(error);
  }
  function onResult(querySnapshot){
    console.log('querysnapshot');
  }



  firestore().collection('Users').onSnapshot(onResult, onError);
  if(auth().currentUser != null){
    initialRouteName='WelcomeScreen';
  }
  return <NavigationContainer>
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Screen name='LoginScreen' component={LoginScreen}></Stack.Screen>
      <Stack.Screen name='CreateAccountScreen' component={CreateAccountScreen}></Stack.Screen>
      <Stack.Screen name='WelcomeScreen' component={WelcomeScreen}></Stack.Screen>
      <Stack.Screen name='ChatRoom' component={ChatRoom}></Stack.Screen>
    </Stack.Navigator>
  </NavigationContainer>
}

export default App;