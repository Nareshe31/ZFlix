import React,{useEffect} from 'react';
import { View,StatusBar } from 'react-native';
import {WebView} from 'react-native-webview'
import * as ScreenOrientation from 'expo-screen-orientation';
import {styles,colors} from '../globalStyle'

export default function YoutubeScreen({route}) {
    useEffect(() => {
        changeScreenOrientation()
        StatusBar.setHidden(true)
        return function removeOrientation() {
            changeScreenOrientationLock()
            StatusBar.setHidden(false)
        }
      }, [])
      async function changeScreenOrientationLock() {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      }
    async function changeScreenOrientation() {
        console.log('change screen');
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      }
    return(
           <WebView
            originWhitelist={['https://www.2embed.ru/*']} 
            source={{uri:`https://www.2embed.ru/embed/imdb/movie?id=${route.params.id}`}} 
            allowsFullscreenVideo={true}
           />
    )
}