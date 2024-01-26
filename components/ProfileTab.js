
import react, { useCallback, useState } from 'react';
import auth from '@react-native-firebase/auth';
import Default_pfp from '../assets/Default_pfp.jpg';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {useFocusEffect,} from '@react-navigation/native';
import {Text, Image, View, Button, StyleSheet, TouchableOpacity} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import FirebaseImage from './FirebaseImage';
import Ionicons from 'react-native-vector-icons/Ionicons';


function ProfileTab({route, navigation}) {
    const [user, setUser] = useState();
    const [userPfp, setUserPfp] = useState();
    const currentUserID = auth().currentUser.uid;
    useFocusEffect(
        useCallback(() => {
            firestore().collection('Users').doc(currentUserID).get().then((documentSnapShot) => {
                console.log('document: ', documentSnapShot.data());
                setUser(documentSnapShot.data());
                setUserPfp(documentSnapShot.data().Pfp);
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
            firestore().collection('Users').doc(user.uid).update({Pfp: `/Pfps/${result.name}`});
            setUserPfp(`/Pfps/${result.name}`);
          })

          //update the users profile picture in firestore
          
        } catch (err) {
          if (DocumentPicker.isCancel(err)) {
            console.log('User canceled the image selection');
          } else {
            console.error('Error picking image:', err);
          }
        }
      };
   
    return <View>
        {user ? (<View>
          <Text style={{fontSize: 16, alignSelf: 'center'}}>{user.Username}</Text>
          <FirebaseImage imagePath={userPfp} style={{width: 200, height: 200, borderRadius: 300, alignSelf: 'center', margin: 10, marginTop: 20}}></FirebaseImage>
          
        </View>
          
        ) : (<></>)}
        <TouchableOpacity onPress={() => {pickImage()}}>
          <Text style={styles.changePfp}>Change pfp</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {logOut()}}>
          <View style={styles.logOut}>
            <Text style={{fontSize: 20}}>Logout</Text>
            <Ionicons name='log-out-outline' size={30} style={{marginLeft: 46}}></Ionicons>
          </View>
        </TouchableOpacity>
    </View>
}

const styles = StyleSheet.create({
  logOut: {
    borderWidth: 1,
    height: 30,
    marginTop: 20,
    borderColor: 'grey',
    color: 'red',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  changePfp: {
  backgroundColor: 'blue',
  borderRadius: 30,
  alignSelf: 'center',
  width: 200,
  height: 40,
  textAlignVertical: 'center',
  textAlign: 'center',
  fontSize: 20,

  }
})

export default ProfileTab;