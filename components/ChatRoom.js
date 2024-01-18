
import react, { useState, useEffect, useCallback } from 'react';
import firestore from '@react-native-firebase/firestore';
import {Text, TextInput, View} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

let loggedInUserName = null;
let otherUserName = null;

function ChatRoom({route, navigation}) {
    const roomID = route.params.roomID;
    const loggedInUserID = route.params.loggedInUser;
    const otherUserID = route.params.otherUser;
   

    console.log('IDS: ', loggedInUserID, otherUserID);
    firestore().collection('Users').doc(loggedInUserID).get().then((documentSnapShot) => {
        loggedInUserName = documentSnapShot.data().Username;
    })
    firestore().collection('Users').doc(otherUserID).get().then((documentSnapShot) => {
        otherUserName = documentSnapShot.data().Username;
    })

    const [messages, setMessages] = useState([]);
    const [messToSend, setMessToSend] = useState();

    useFocusEffect(
        useCallback(() => {
            getMessages();
            const observer = firestore().collection('PrivateChatRooms').doc(roomID).onSnapshot(() => {getMessages()}, (err) => {console.log(err)});
            return () => observer();
        }, [])
    )

    function sendMessage() {
        if(messToSend === null || messToSend === ''){
            console.log('Error sending message: need message');
            return -1;
        }
        try{
            firestore().collection('PrivateChatRooms').doc(roomID).update({Messages: firestore.FieldValue
                .arrayUnion({Message: messToSend, Sender: loggedInUserName})});

        }catch(err){
            console.log('error in sendMessage: ', err);
        }
    }

    function getMessages(){
        firestore().collection('PrivateChatRooms').doc(roomID).get().then((documentSnapShot) => {
            if(documentSnapShot.data().Messages === undefined) {
                console.log('Messages doesnt exists');
                return -1;
            }else{
                console.log(documentSnapShot.data().Messages);
                setMessages(documentSnapShot.data().Messages);
            }
        })
    }
    return <View>
        <Text style={{color: 'green'}}>asd</Text>
        <TextInput value={messToSend} 
        onChangeText={(mess) => {setMessToSend(mess)}} style={{color: 'black', backgroundColor: 'grey'}}
        onSubmitEditing={() => {sendMessage()}}></TextInput>
        {messages.length > 0 ? (
            messages.map((mess, index) => {
                 return <Text key={index} style={{color: 'black'}}>{mess.Sender}:{mess.Message}</Text>
            })
        ) : <></>}
    </View>
}

export default ChatRoom;