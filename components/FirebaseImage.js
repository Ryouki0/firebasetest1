import react, {useState, useEffect, useCallback} from 'react';
import storage from '@react-native-firebase/storage';
import {View, Image} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Default_pfp from '../assets/Default_pfp.jpg';
function FirebaseImage({ imagePath, style }) {
    console.log('params:  ', imagePath);
    
    const [imageURL, setImageURL] = useState();

    useFocusEffect(
        useCallback(() => {
            const fetchImage = async () => {
                if (imagePath === null || imagePath === undefined){
                    console.log('   ', imagePath);
                    return <></>;
                }
                const reference = storage().ref(imagePath);
                const url = await reference.getDownloadURL();
                setImageURL(url);
            }
            fetchImage();
        }, [imagePath])
        
    )

    return <>
        {imageURL ? (<Image source={{uri: imageURL}} style={style}></Image>) 
        : (<Image source={Default_pfp} style={style}></Image>)}
    </>
}

export default FirebaseImage;