
import * as React from 'react';
import {View, TextInput, Button, Text} from 'react-native';
import {useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useFocusEffect} from '@react-navigation/native';
const CreateAccountScreen = ({route, navigation}) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            const subscriber = auth().onAuthStateChanged((user) => {
                console.log('state changed, user: ', user);
            })
            return subscriber;
        })
    );

    async function addUser() {
        try{
            const fakeEmail = `${userName}@example.com`;
            console.log('fakeEmail:', fakeEmail);
            auth().createUserWithEmailAndPassword(fakeEmail, password).then(async (user) =>{
                console.log('user in createWithemail    ', user.user.uid);
                await firestore().collection('Users').add({Username: userName, uid: user.user.uid, PrivateChatRooms: []});
            })
            navigation.navigate('WelcomeScreen');
        }catch(err){
            console.log('error in createAccountScreen, addUser', err);
        }
      }
      

    return <View>
        <Text style={{color: 'green'}}>asd</Text>
        <TextInput placeholder='Username' style={{color:'black'}} onChangeText={(text) => {setUserName(text)}} placeholderTextColor={'grey'}></TextInput>
        <TextInput placeholder='Password' style={{color: 'black'}} onChangeText={(text) => {setPassword(text)}} placeholderTextColor={'grey'}></TextInput>
        <Button title='create account' onPress={() => {addUser()}}></Button>
    </View>
}

export default CreateAccountScreen;