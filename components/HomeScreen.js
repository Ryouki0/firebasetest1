
import react from 'react';
import {View, Text} from 'react-native';
import WelcomeScreen from './WelcomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileTab from './ProfileTab';
import Ionicons from 'react-native-vector-icons/Ionicons';
const Tab = createBottomTabNavigator();

function HomeScreen() {
    return <>
        <Text >HomeScreen</Text>
        <Tab.Navigator screenOptions={({route}) => ({
      tabBarIcon: ({focused, color, size}) => {
        return <Ionicons name="arrow-back" size={30} color="green"></Ionicons>
      }
    })}>
    <Tab.Screen name='WelcomeScreen' component={WelcomeScreen}></Tab.Screen>
    <Tab.Screen name='ProfileTab' component={ProfileTab}></Tab.Screen>
  </Tab.Navigator>
    </>
}

export default HomeScreen;