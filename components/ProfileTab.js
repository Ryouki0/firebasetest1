
import react, { useCallback, useState } from 'react';
import auth from '@react-native-firebase/auth';
import Default_pfp from '../assets/Default_pfp.jpg';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {useFocusEffect,} from '@react-navigation/native';
import {Text, Image, View, Button} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import FirebaseImage from './FirebaseImage';
function ProfileTab({route, navigation}) {
    const [user, setUser] = useState();
    const currentUserID = auth().currentUser.uid;
    useFocusEffect(
        useCallback(() => {
            firestore().collection('Users').doc(currentUserID).get().then((documentSnapShot) => {
                console.log('document: ', documentSnapShot.data());
                setUser(documentSnapShot.data());
                
                })
        }, [currentUserID])
    )

    function logOut() {
      auth()
        .signOut()
        .then(() => {
          console.log('signed out');
          navigation.navigate('LoginScreen');
        });
    }


    const pickImage = async () => {
        try {
          const result = await DocumentPicker.pickSingle({
            type: [DocumentPicker.types.images],
          });
      
          // Handle the selected image here
          const reference = storage().ref(`/Pfps/${result.name}`);
          const task = reference.putFile(result.uri);
          
          task.on('state_changed', taskShnapShot => {
            console.log(`${taskShnapShot.bytesTransferred} transferred out of ${taskShnapShot.totalBytes}`);
          });


          task.then(() => {
            console.log('image uploaded');
          })

          //update the users profile picture in firestore
          firestore().collection('Users').doc(user.uid).update({Pfp: `/Pfps/${result.name}`});
          
        } catch (err) {
          if (DocumentPicker.isCancel(err)) {
            console.log('User canceled the image selection');
          } else {
            console.error('Error picking image:', err);
          }
        }
      };
   
    return <View>
        {user ? (
          <FirebaseImage imagePath={user.Pfp} style={{width: 200, height: 200, borderRadius: 300, alignSelf: 'center'}}></FirebaseImage>
        ) : (<></>)}
        
        <Button title='change pfp' onPress={() => {pickImage()}}></Button>
        <Button title='Log out' onPress={() => {logOut()}}></Button>
    </View>
}

export default ProfileTab;