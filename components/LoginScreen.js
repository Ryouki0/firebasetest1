
import * as React from 'react';

import {View, TextInput, Button, Text} from 'react-native';
import {useState} from 'react';
import auth from '@react-native-firebase/auth';



const LoginScreen = ({route, navigation}) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');


    async function logIn(){
        await auth().signInWithEmailAndPassword(`${userName}@example.com`, password);
        navigation.navigate('WelcomeScreen');
    }    

    return <View>
        <TextInput placeholder='Username' onChangeText={(text) => {setUserName(text)} }></TextInput>
        <TextInput placeholder='Password' onChangeText={(text) => {setPassword(text)} }></TextInput>
        <Text style={{color: 'blue'}} onPress={() => {navigation.navigate('CreateAccountScreen')}}>Create Account</Text>
        <Button onPress={() => {logIn()}} title='Login'></Button>
    </View>
}
export default LoginScreen;