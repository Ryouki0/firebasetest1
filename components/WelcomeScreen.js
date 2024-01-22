import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  Image,
  ScrollView,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import Default_pfp from '../assets/Default_pfp.jpg';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {useFocusEffect,} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import createPrivateChatRoom from './createPrivateChatroom';
import FirebaseImage from './FirebaseImage';



function WelcomeScreen({route, navigation}) {

  



  useFocusEffect(
    React.useCallback(() => {
        const onBackPress = () => {
            console.log('backbutton pressed inside welcomeScreen');
            return true;
        }
        const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => subscription.remove()
    }, [])
)


  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [allUsers, setAllUsers] = useState([]);

  

  //get all users
  useFocusEffect(
    React.useCallback(() => {
      let userList = [];
      const subscriber = auth().onAuthStateChanged((user) => {
        if(user != null){
        console.log('user: ', user.uid);
           firestore().collection('Users').doc(user.uid).get().then((currentUser) => {
            setUser(currentUser);
           })
        }

      })
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
          
        });
      };
      if(auth().currentUser != null){
        getUsers();
      }
      return () => subscriber();
    }, []),
  );


  
  return (
    <>
  
  <View>
      <Text style={{color: 'white'}}>
        Welcome {user != null && user != undefined ? user.data().Username : <></>}{' '}
      </Text>
      <ScrollView horizontal={true} style={{flexDirection: 'row'}}>
        {allUsers.length > 0 ? (
          allUsers.map(element => {
            console.log('element.uid: ', element.data().uid);
            return (
              <TouchableOpacity
                onPress={() => {
                  createPrivateChatRoom(user, element, navigation);
                }}
                key={element.data().uid}>
                <View style={{alignItems: 'center'}}>
                  <FirebaseImage imagePath={element.data().Pfp} style={{width: 100, height: 100, borderRadius: 300}}></FirebaseImage>
                  <Text style={{color: 'white'}}>{element.data().Username}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <Text>empty</Text>
        )}
      </ScrollView>
    </View>
  
    </>
  );
}




export default WelcomeScreen;
