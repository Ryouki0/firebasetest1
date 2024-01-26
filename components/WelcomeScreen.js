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
import {AsyncStorage} from 'react-native';
import getLastMessages from '../Functions/getLastMessages';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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

  const [user, setUser] = useState();
  const [allUsers, setAllUsers] = useState([]);
  const [lastMessages, setLastMessages] = useState();
  

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

      const getLastMess = async () => {
        getLastMessages().then((result) => {
          console.log('RESUILT: ', result);
          setLastMessages(result);
        })
      }
      getLastMess();
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
      <ScrollView style={{flexDirection: 'row'}}>
        {allUsers.length > 0 ? (
          allUsers.map(element => {
            console.log('element.uid: ', element.data().uid);
            return (
              <TouchableOpacity
                onPress={() => {
                  createPrivateChatRoom(user, element, navigation);
                }}
                key={element.data().uid}>
                <View style={{alignItems: 'center',paddingTop: 5, flexDirection: 'row'}}>
                  <FirebaseImage imagePath={element.data().Pfp} style={{width: 70, height: 70, borderRadius: 300,
                     marginLeft: 17}}></FirebaseImage>
                  <View >
                    <Text style={{color: 'darkgrey', 
                    paddingBottom: 3, paddingLeft: 7, fontSize: 15}}>{element.data().Username}</Text>            
                    {lastMessages ? (
                      lastMessages.map((lastMess, idx) => {
                        if(!lastMess){
                          return <></>
                        }
                        if(lastMess.message === null){
                          return;
                        }
                        if(lastMess.User === element.data().Username){
                          if(lastMess.message.length >= 20){
                            console.log('longer than 15: ', lastMess.message);
                            return <Text style={{color: 'grey', paddingLeft: 7}} key={idx}>{
                              lastMess.message.slice(0, 20)}...
                              • {months[new Date(lastMess.time.seconds*1000)
                            .getMonth()]} {new Date(lastMess.time.seconds*1000)
                              .getDate().toString()}
                              </Text>
                          }
                          return <Text style={{color: 'grey', paddingLeft: 7}} key={idx}>{lastMess.message} • {months[new Date(lastMess.time.seconds*1000)
                            .getMonth()]} {new Date(lastMess.time.seconds*1000)
                              .getDate().toString()}</Text>
                        }
                      })
                    ) : (<Text> Test message</Text>)}
                    
                  </View>
                 
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
