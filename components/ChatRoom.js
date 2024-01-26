
import react, { useState, useEffect, useCallback, useRef } from 'react';
import firestore from '@react-native-firebase/firestore';
import {ScrollView,FlatList  ,Text, TextInput, View, StyleSheet} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Default_pfp from '../assets/Default_pfp.jpg';
import FirebaseImage from './FirebaseImage';
import Ionicons from 'react-native-vector-icons/Ionicons';
let loggedInUser = null;
let otherUser = null;




function ChatRoom({route, navigation}) {
    const roomID = route.params.roomID;
    const loggedInUserID = route.params.loggedInUser;
    const otherUserID = route.params.otherUser;
   

    //console.log('IDS: ', loggedInUserID, otherUserID);
    firestore().collection('Users').doc(loggedInUserID).get().then((documentSnapShot) => {
        loggedInUser = documentSnapShot.data();
    })
    firestore().collection('Users').doc(otherUserID).get().then((documentSnapShot) => {
        otherUser = documentSnapShot.data();
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
                .arrayUnion({message: messToSend, user: loggedInUser.Username, time: new Date(), seen: false})});

        }catch(err){
            console.log('error in sendMessage: ', err);
        }
        setMessToSend('');
    }

    function getMessages(){
        firestore().collection('PrivateChatRooms').doc(roomID).get().then((documentSnapShot) => {
            if(documentSnapShot.data().Messages === undefined) {
                console.log('Messages doesnt exists');
                return -1;
            }else{
                setMessages(documentSnapShot.data().Messages);
            }
        })
    }

    

    return <>    
     <ScrollView  ref={ref => {this.scrollView = ref}}
    onContentSizeChange={() => this.scrollView.scrollToEnd({animated: false})}>
        {loggedInUser
        ? (messages.map((mess, index) => {
            return <View key={index}>
                {mess.user === loggedInUser.Username ? (
                    messages[index+1] === undefined ? (
                        
                        messages[index-1] === undefined ? (
                            <Text style={styles.right}>{mess.message}</Text>
                        ) : (
                            messages[index-1].user === loggedInUser.Username ? (
                                <Text style={[styles.right, {borderTopRightRadius: 10}]}>{mess.message}</Text>
                              ) : (
                                <Text style={styles.right}>{mess.message}</Text>
                              )
                        )
                    ) 
                    : (
                        messages[index+1].user === loggedInUser.Username ? (
                            messages[index-1] === undefined ? (
                                <Text style={[styles.right, {borderBottomRightRadius: 10}]}>{mess.message}</Text>
                            ) : (
                                messages[index-1].user === loggedInUser.Username ? (
                                    <Text style={[styles.right, {borderBottomRightRadius: 10, borderTopRightRadius: 10}]}>{mess.message}</Text>
                                ) : (
                                    <Text style={[styles.right, {borderBottomRightRadius: 10}]}>{mess.message}</Text>
                                )
                            )
                            ) 
                            : (
                                messages[index-1] === undefined ? (
                                    <Text style={styles.right}>{mess.message}</Text>
                                ) : (
                                    messages[index-1].user === loggedInUser.Username ? (
                                        <Text style={[styles.right, {borderTopRightRadius: 10}]}>{mess.message}</Text>
                                    ) : (
                                        <Text style={styles.right}>{mess.message}</Text>
                                    )
                            )
                        )     
                    )
                    
                ) : (       //Left side
                    messages[index+1] === undefined ? (
                        messages[index-1] === undefined ? (
                            <View style={{flexDirection: 'row'}}>
                                <FirebaseImage imagePath={otherUser.Pfp} style={{width: 35,
                                     height: 35, borderRadius: 300,}}></FirebaseImage>
                                <Text style={[styles.left, {marginLeft: 8}]}>{mess.message}</Text>
                            </View>
                        ) : (
                            messages[index-1].user === otherUser.Username ? (
                                <View style={{flexDirection: 'row'}}>
                                <FirebaseImage imagePath={otherUser.Pfp} style={{width: 35,
                                     height: 35, borderRadius: 300,}}></FirebaseImage>
                                <Text style={[styles.left, {marginLeft: 8}, {borderTopLeftRadius: 10}]}>{mess.message}</Text>
                            </View>
                            ) : (
                                <View style={{flexDirection: 'row'}}>
                                <FirebaseImage imagePath={otherUser.Pfp} style={{width: 35,
                                     height: 35, borderRadius: 300,}}></FirebaseImage>
                                <Text style={[styles.left, {marginLeft: 8}]}>{mess.message}</Text>
                            </View>
                                )
                        )
                    ) 
                    : (
                        messages[index+1].user === otherUser.Username ? (
                            messages[index-1] === undefined ? (
                                <Text style={[styles.left, {borderBottomLeftRadius: 10}]}>{mess.message}</Text>
                            ) : (
                                messages[index-1].user === otherUser.Username ? (
                                    <Text style={[styles.left, {borderBottomLeftRadius: 10, borderTopLeftRadius: 10}]}>{mess.message}</Text>
                                ) : (
                                    <Text style={[styles.left, {borderBottomLeftRadius: 10}]}>{mess.message}</Text>
                                )
                            )
                            ) 
                            : (
                                messages[index-1] === undefined ? (
                                    <View style={{flexDirection: 'row'}}>
                                <FirebaseImage imagePath={otherUser.Pfp} style={{width: 35,
                                     height: 35, borderRadius: 300,}}></FirebaseImage>
                                <Text style={[styles.left, {marginLeft: 8}]}>{mess.message}</Text>
                            </View>
                                    ) : (
                                    messages[index-1].user === otherUser.Username ? (
                                        <View style={{flexDirection: 'row'}}>
                                <FirebaseImage imagePath={otherUser.Pfp} style={{width: 35,
                                     height: 35, borderRadius: 300}}></FirebaseImage>
                                <Text style={[styles.left, {marginLeft: 8}, {borderTopLeftRadius: 10}]}>{mess.message}</Text>
                            </View>
                                        ) : (
                                            <View style={{flexDirection: 'row'}}>
                                <FirebaseImage imagePath={otherUser.Pfp} style={{width: 35,
                                     height: 35, borderRadius: 300,}}></FirebaseImage>
                                <Text style={[styles.left, {marginLeft: 8}]}>{mess.message}</Text>
                            </View>
                                            )
                            )
                        )     
                    ))}
            </View>
        }))
        : (<></>)}

    </ScrollView>
    <View style={{flexDirection: 'row', borderWidth: 1, borderColor: 'grey', borderRadius: 30, height: 50}}>
    <TextInput placeholder='Type something...' placeholderTextColor={'grey'} value={messToSend} style={{color:'white',
     width: 300, margin: 10, height: 40, alignSelf: 'center'}} 
    onChangeText={(mess) => {setMessToSend(mess)}}
    onSubmitEditing={() => 
        {sendMessage()}}></TextInput>
        <Ionicons name='send-outline' size={20}  onPress={() => {sendMessage()}} style={{width: 30, alignSelf: 'center'}}></Ionicons>
    </View>
    
    </>
}

const styles = StyleSheet.create({
    right: {
        alignSelf:'flex-end', 
        borderWidth: 1, 
        padding: 10, 
        marginBottom: 2, 
        borderColor: '#3b3b3b',
        borderRadius: 30,
        
        maxWidth: 275,
        color: 'white',
        backgroundColor: '#3b3b3b',
    },
    left: {
        alignSelf: 'flex-start',
        borderWidth: 1,
        marginBottom: 2, 
        padding: 10, 
        borderRadius: 30, 
        borderCurve: 'circular',
        borderColor: '#3b3b3b',
        color: 'white',
        marginLeft: 44,
    }
})

export default ChatRoom;