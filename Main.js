import React,{useState,useEffect} from 'react';
import {Text,Linking, View,StatusBar,SafeAreaView,Image, Pressable, Alert,StyleSheet,Dimensions,Modal} from 'react-native';
import * as Font from 'expo-font'
import AppLoading from 'expo-app-loading';
import Constants from "expo-constants"
import axios from 'axios';
import { URLs } from './globalUtils';
import { styles,colors} from "./globalStyle";
import { useSelector,useDispatch } from 'react-redux'
import * as SecureStore from 'expo-secure-store';
import NetInfo from "@react-native-community/netinfo";
import LottieView from 'lottie-react-native';
import LoggedUserStackNavigator from './navigation/LoggedUserStackNavigator'
import GuestStackNavigator from './navigation/GuestStackNavigator'

const windowHeight=Dimensions.get('window').height

export default function Main() {
    const [isFontLoading,setIsFontLoading]=useState(true)
    const [isLoading,setIsLoading]=useState(true)
    const [modalVisible, setModalVisible] = useState(false);
    const user = useSelector(state => state)
    const [update,setUpdate]=useState({})
    const [loadingWord,setLoadingWord]=useState(0)
    const words=["Checking for updates","Getting your data","Keep tight"]
    const dispatch=useDispatch()
  
    var token;
    const getToken=async()=>{
      token=await SecureStore.getItemAsync('token')
      if(token){
          getUserDetails(token)
      }
      else{
          setIsLoading(false)
      }
    }
    
    const getUserDetails=async(token)=>{
        try {
            setLoadingWord(1)
            let response=await axios.get('http://important-bow-prawn.glitch.me/user-details/'+token)
            dispatch({type:"LOGIN",payload:response.data.user})
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
        }
    }
  
    useEffect(() => {
      let appVersion=Constants.manifest.version.split('.').map(Number)
      fetch(URLs[12]).then(res=>res.json()).then(res=>{
        let currentVersion=res.version.split('.').map(Number)
  
        if( (appVersion[0]>=currentVersion[0]) && (appVersion[1]>=currentVersion[1]) && (appVersion[2]>=currentVersion[2]) ){
          
        }
        else{
          setUpdate(res)
          setModalVisible(!modalVisible) 
        }
        getToken()
      })
      fetch(URLs[16]).then(res=>res.json()).then(res=>res)
      fetch(URLs[14]).then(res=>res)
      
      unsubscribe()
    }, [])
   
    const unsubscribe = NetInfo.addEventListener(state => {
      if(!state.isConnected){
        Alert.alert('Connection', 'No internet connection', [{text:'Ok'}])
      }
    });
  
    const getFonts=async()=>Font.loadAsync({
        'Nunito-Regular': require('./assets/fonts/Nunito-Regular.ttf'),
        'Nunito-Bold': require('./assets/fonts/Nunito-Bold.ttf'),
        'Nunito-SemiBold': require('./assets/fonts/Nunito-SemiBold.ttf'),
        'Nunito-SemiBoldItalic': require('./assets/fonts/Nunito-SemiBoldItalic.ttf'),
        'Nunito-Italic': require('./assets/fonts/Nunito-Italic.ttf')
      })
    if(isFontLoading){
      return(
        <AppLoading 
          startAsync={getFonts}
          onFinish={()=>setIsFontLoading(false)}
          onError={console.warn}
        />
      )
      }
    else{
      if(isLoading){
        return(
          <SafeAreaView style={[styles.container]}>
            <StatusBar backgroundColor={colors.mainBlackColor} />
            <View style={[styles.pageLoader,{backgroundColor:colors.mainBlackColor}]}>
                <Image source={require('./assets/custom-splash.png')} resizeMode='contain' style={s.loadingLogo}  />
                <Text style={s.loadingText}>{words[loadingWord]}</Text>
                <Text style={s.versionText}>v{Constants.manifest.version}</Text>
                <LottieView source={require('./assets/lotties/loading-bubble.json')} style={s.loadingGif} autoPlay loop />
            </View>
          </SafeAreaView>
        )
      }
      return (
        <SafeAreaView style={[styles.container]}>
          <StatusBar backgroundColor={colors.mainBlackColor} />
          <Modal animationType='fade' visible={modalVisible} transparent={true} 
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }} >
            <View style={s.centeredView}>
              <View style={s.modalView}>
                <Text style={[s.modalHeader,s.center]}>Update available</Text>
                <View style={s.modalNewContainer}>
                  <Text style={s.modalHeader}>What's new </Text>
                  {update?.new?.length && update?.new.map((item,i)=>(
                    <Text key={i} style={[s.modalText,s.eachNew]}>{item}</Text>
                  ))}
                </View>
                <View style={s.modalLinkContainer}>
                    <Pressable onPress={()=>Linking.openURL(update.url)}>
                      <Text style={[s.modalText,s.modalLink]}>Download</Text>
                    </Pressable>
                </View>
              </View>
            </View>
          </Modal>
          {user?
            <LoggedUserStackNavigator  />
            :
            <GuestStackNavigator  />
            }
        </SafeAreaView>
      )
    }
  }
  


  const s=StyleSheet.create({

    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor:'hsla(0, 0%, 0%,0.8)',
    },
    modalView: {
      margin:20,
      // backgroundColor:'hsla(330, 25%, 3%,0.80)',
      backgroundColor:'hsla(0, 0%,0%,1)',
      borderRadius: 20,
      paddingVertical: 38,
      paddingHorizontal:50,
      // alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    modalText:{
      fontSize:18,
      color:colors.lightGray,
      fontFamily:'Nunito-SemiBold'
    },
    modalLinkContainer:{
      alignItems:'center',
      marginTop:5,
      flexDirection:'row',
      alignSelf:'center'
    },
    modalLink:{
      color:colors.mainDarkBlue,
    },
    modalClose:{
      position:'absolute',
      right:10,
      top:10
    },
    modalNewContainer:{
      marginVertical:5
    },
    modalHeader:{
      fontFamily:'Nunito-Bold',
      fontSize:18,
      marginVertical:0,
      color:colors.lightWhite
    },
    eachNew:{
      marginLeft:8
    },
    loadingText:{
      fontFamily:'Nunito-SemiBold',
      fontSize:18,
      color:colors.lightWhite,
      position:'absolute',
      bottom:50,
      zIndex:10
    },
    versionText:{
      fontFamily:'Nunito-Regular',
      fontSize:14,
      color:colors.lighterWhite,
      position:'absolute',
      bottom:30,
      zIndex:10
    },
    loadingLogo:{
      width:'100%',
      height:'100%',
      backgroundColor:colors.mainBlackColor,
    },
    loadingGif:{
      position:'absolute',
      top:windowHeight/2-50,
      width:220,
    }
  })



{/* <View style={s.modalClose}>
    <Pressable onPress={()=>setModalVisible(!modalVisible)}>
    <Ionicons name="md-close-circle-sharp" size={30} color={colors.lightWhite} />
    </Pressable>
</View> */}