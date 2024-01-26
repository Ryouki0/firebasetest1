
import react from 'react';
import {View, Text} from 'react-native';
import WelcomeScreen from './WelcomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileTab from './ProfileTab';
import Ionicons from 'react-native-vector-icons/Ionicons';
const Tab = createBottomTabNavigator();

function HomeScreen() {
    return <>
        <Tab.Navigator screenOptions={({route}) => ({
      tabBarIcon: ({focused, color, size}) => {
        
        if(route.name === 'Chats'){
          return <Ionicons name='chatbubble-ellipses' size={27} color={color}></Ionicons>
        }
        else if(route.name === 'Profile'){
          return <Ionicons name='person-circle' size={27} color={color}></Ionicons>
        }
      }
    })}>
    <Tab.Screen name='Chats' component={WelcomeScreen}></Tab.Screen>
    <Tab.Screen name='Profile' component={ProfileTab}></Tab.Screen>
  </Tab.Navigator>
    </>
}

export default HomeScreen;