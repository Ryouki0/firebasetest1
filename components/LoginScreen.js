
import * as React from 'react';

import {View, TextInput,BackHandler, Button, Text, } from 'react-native';
import {useState, useCallback} from 'react';
import auth from '@react-native-firebase/auth';
import { useFocusEffect, } from '@react-navigation/native';



const LoginScreen = ({route, navigation}) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                console.log('backbutton pressed inside loginScreen');
                return true;
            }
            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => subscription.remove()
        }, [])
    )

    async function logIn(){
        await auth().signInWithEmailAndPassword(`${userName}@example.com`, password);
        navigation.navigate('HomeScreen');
    }    

    return <View>
        <TextInput placeholder='Username' onChangeText={(text) => {setUserName(text)} }></TextInput>
        <TextInput placeholder='Password' onChangeText={(text) => {setPassword(text)} }></TextInput>
        <Text style={{color: 'blue'}} onPress={() => {navigation.navigate('CreateAccountScreen')}}>Create Account</Text>
        <Button onPress={() => {logIn()}} title='Login'></Button>
    </View>
}
export default LoginScreen;