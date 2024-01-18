import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import Default_pfp from '../assets/Default_pfp.jpg';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';

function WelcomeScreen({route, navigation}) {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [allUsers, setAllUsers] = useState([]);

  let currUser = auth().currentUser;
  function logOut() {
    auth()
      .signOut()
      .then(() => {
        console.log('signed out');
        navigation.navigate('LoginScreen');
      });
  }

  //get all users
  useFocusEffect(
    React.useCallback(() => {
      let userList = [];
      const getUsers = async () => {
        return new Promise(async () => {
          await firestore()
            .collection('Users')
            .get()
            .then(querySnapShot => {
              querySnapShot.forEach(documentSnapShot => {
                userList.push(documentSnapShot);
              });
            });
          setAllUsers(userList);
          userList.forEach(user => {
            if (user.data().uid === currUser.uid) {                      //get the firestore user from the authentication server user
             
              setUser(user);
              return 0;
            }
          });
        });
      };

      getUsers();
    }, []),
  );

  async function createPrivateChatRoom(clickedUser) {
    let roomID = null;
    
    await firestore()
      .collection('Users')
      .doc(user.id)
      .get()
      .then(documentSnapShot => {
        documentSnapShot.data().PrivateChatRooms.forEach(room => {
          if (room.otherUser === clickedUser.data().Username) {
            roomID = room.chatRoomId;
            console.log('roomID:  ', roomID)
          }
        });
      });
    if (roomID != null) {
      navigation.navigate('ChatRoom', {loggedInUser: user.id, otherUser: clickedUser.id, roomID: roomID});
      return 0;
    } 
    //if chatroom doesnt exists, create it
    else {
      const chatRoom = await firestore()
        .collection('PrivateChatRooms')
        .add({User1: user.data().Username, User2: clickedUser.data().Username});
      console.log('chatroom data', chatRoom.id);
      console.log('users id:        ', user.id);
      const user2Name = clickedUser.data().Username;
      const user1Name = user.data().Username;
      firestore()
        .collection('Users')
        .doc(user.id)
        .update({
          PrivateChatRooms: firestore.FieldValue.arrayUnion({
            otherUser: user2Name,
            chatRoomId: chatRoom.id,
          }),
        });


      firestore()
        .collection('Users')
        .doc(clickedUser.id)
        .update({
          PrivateChatRooms: firestore.FieldValue.arrayUnion({
            otherUser: user1Name,
            chatRoomId: chatRoom.id,
          }),
        });

      try {
        console.log('did it write? ');
      } catch (err) {
        console.log('error adding chatRoom: ', err);
      }
    }
  }

  return (
    <View>
      <Text style={{color: 'black'}}>
        Welcome {user ? user.data().Username : <></>}{' '}
      </Text>
      <Button
        title="logout"
        onPress={() => {
          logOut();
        }}></Button>
      <ScrollView horizontal={true} style={{flexDirection: 'row'}}>
        {allUsers.length > 0 ? (
          allUsers.map(user => {
            console.log('user.uid: ', user.data().uid);
            return (
              <TouchableOpacity
                onPress={() => {
                  createPrivateChatRoom(user);
                }}
                key={user.data().uid}>
                <View style={{alignItems: 'center'}}>
                  <Image
                    source={Default_pfp}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 300,
                    }}></Image>
                  <Text style={{color: 'black'}}>{user.data().Username}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <Text>empty</Text>
        )}
      </ScrollView>
    </View>
  );
}

export default WelcomeScreen;
