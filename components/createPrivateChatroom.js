
import react from 'react';
import firestore from '@react-native-firebase/firestore';

async function createPrivateChatRoom(user, clickedUser, navigation) {
    let roomID = null;
    
    await firestore()
      .collection('Users')
      .doc(user.id)
      .get()
      .then(documentSnapShot => {
        documentSnapShot.data().PrivateChatRooms.forEach(room => {  //for each chatroom check if the other user is the clicked user
          if (room.otherUser === clickedUser.data().Username) {
            roomID = room.chatRoomId;
            console.log('roomID:  ', roomID)
          }
        });
      });
    if (roomID != null) {
      navigation.navigate('ChatRoom', {loggedInUser: user.id, otherUser: clickedUser.id, roomID: roomID, otherUserName: clickedUser.data().Username});
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

      //add the chatroom ID and Username to the first user
      firestore()
        .collection('Users')
        .doc(user.id)
        .update({
          PrivateChatRooms: firestore.FieldValue.arrayUnion({
            otherUser: user2Name,
            chatRoomId: chatRoom.id,
          }),
        });

        //add the chatroom ID and Username to the other user
      firestore()
        .collection('Users')
        .doc(clickedUser.id)
        .update({
          PrivateChatRooms: firestore.FieldValue.arrayUnion({
            otherUser: user1Name,
            chatRoomId: chatRoom.id,
          }),
        });
        roomID = chatRoom.id;
        navigation.navigate('ChatRoom', {loggedInUser: user.id, otherUser: clickedUser.id, roomID: roomID});
      }
  }

export default createPrivateChatRoom;