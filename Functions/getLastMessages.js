import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';

const getLastMessages = async () => {
    return new Promise(async(resolve, reject) => {
        try{
            const userID = auth().currentUser.uid;
        const userData = (await firestore().collection('Users').doc(userID).get()).data();
        const lastMessages= await Promise.all(userData.PrivateChatRooms.map(async (chatRoom) => {
        const chatRoomData = (await firestore().collection('PrivateChatRooms').doc(chatRoom.chatRoomId).get()).data();
        console.log('chatRoomData: ', chatRoomData.Messages);
        if(chatRoomData.Messages === null || chatRoomData.Messages === undefined){
            return {User: chatRoom.otherUser, message: null, time: null};
        }else {
            const lastMess = chatRoomData.Messages[chatRoomData.Messages.length - 1];
            const otherUser = chatRoom.otherUser;
            return {User: otherUser, message: lastMess.message, time: lastMess.time};
        }
        
        }))
        resolve(lastMessages);
        }catch(err) {
            console.log('err:', err);
            reject(err);
        }
    })
}
export default getLastMessages;
