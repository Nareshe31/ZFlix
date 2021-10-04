import React,{useState,useEffect} from 'react';
import {Linking,Dimensions, Modal,StyleSheet, Text, View,StatusBar,SafeAreaView,Image, Pressable, Alert} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Popular from './screens/Popular'
import Movie from './screens/Movie'
import TvShow from './screens/TvShow'
import MovieModal from './modals/MovieModal'
import TvShowModal from './modals/TvShowModal'
import SeeAllModal from './modals/SeeAllModal'
import { styles,colors} from "./globalStyle";
import * as Font from 'expo-font'
import AppLoading from 'expo-app-loading';
import { MaterialIcons,Ionicons,MaterialCommunityIcons } from '@expo/vector-icons';
import YoutubeScreen from './screens/YoutubeScreen';
import Search from './screens/Search';
import GenreModal from './modals/GenreModal';
import SearchResult from './screens/SearchResult';
import TorrentModal from './modals/TorrentModal';
import PersonModal from './modals/PersonModal';
import WatchlistModal from './modals/WatchlistModal'
import Constants from "expo-constants"
import axios from 'axios';
import { URLs } from './globalUtils';
import AboutModal from './modals/AboutModal';
import Login from './screens/Login'
import authReducer from './redux/auth'
import {createStore} from 'redux'
import { Provider } from 'react-redux'
import { useSelector,useDispatch } from 'react-redux'
import * as SecureStore from 'expo-secure-store';
import Signup from './screens/Signup';
import ProfileModal from './modals/ProfileModal';
import * as Linkings from 'expo-linking'
import NetInfo from "@react-native-community/netinfo";
import LottieView from 'lottie-react-native';

const windowHeight=Dimensions.get('window').height

const RootStack=createStackNavigator()
const MovieModalStack=createStackNavigator()
const TvModalStack=createStackNavigator()
const PersonModalStack=createStackNavigator()
// const Drawer = createDrawerNavigator();

const MovieModalScreen=({route})=>{

  return(
    <MovieModalStack.Navigator screenOptions={{headerShown:false}}>
      <MovieModalStack.Screen name='MovieModal' component={MovieModal} />
    </MovieModalStack.Navigator>
  )
}

const TvModalScreen=(props)=>{
  return(
    <TvModalStack.Navigator screenOptions={{headerShown:false}}>
      <TvModalStack.Screen name='TvModal' component={TvShowModal} />
    </TvModalStack.Navigator>
  )
}
const PersonScreen=(props)=>{
  return(
    <PersonModalStack.Navigator screenOptions={{headerShown:false}}>
      <PersonModalStack.Screen name='PersonScreen' component={PersonModal} />
    </PersonModalStack.Navigator>
  )
}

const Tab = createBottomTabNavigator();

const BottomTabScreen=()=>{
  return(
      <Tab.Navigator tabBarOptions={{
          showLabel:false,
          style:{
            borderTopRightRadius:0,
            borderTopLeftRadius:0,
            backgroundColor:colors.mainBlackColor,
            position:'absolute',
            bottom: 0,
            left:0,
            marginHorizontal:0,
            paddingHorizontal:0,
            paddingBottom:5,
            height:55,
            borderTopWidth:0,
            borderTopColor:colors.lighterWhite
            }
          }} >
        <Tab.Screen name="Popular" component={Popular}  options={{tabBarIcon:({focused})=>(
          <View style={s.centerAlign}>
            {focused?<MaterialIcons name="home" size={28} color={colors.mainBlue} />:
            <MaterialCommunityIcons name="home-outline" size={28} color={colors.lighterWhite} />}
            {/* {focused?<Text style={[styles.navText,{color:focused?colors.mainBlue:colors.lighterWhite}]}>Home</Text>:null} */}
          </View>
        )}}  />
        <Tab.Screen name="Search" component={Search} options={{tabBarIcon:({focused})=>(
          <View style={s.centerAlign}>
            {focused?<Ionicons name="search" size={28} color={colors.mainBlue} />:
            <Ionicons name="search-outline" size={28} color={colors.lighterWhite} />}
            {/* {focused?<Text style={[styles.navText,{color:focused?colors.mainBlue:colors.lighterWhite}]}>Search</Text>:null} */}
          </View>
        )}}  />
        <Tab.Screen name="Movie" component={Movie} options={{tabBarIcon:({focused})=>(
          <View style={s.centerAlign}>
            {focused?<MaterialCommunityIcons name="movie-open" size={28} color={colors.mainBlue} />:
            <MaterialCommunityIcons name="movie-open-outline" size={28} color={colors.lighterWhite} />}
            {/* {focused?<Text style={[styles.navText,{color:focused?colors.mainBlue:colors.lighterWhite}]}>Movies</Text>:null} */}
          </View>
        )}}  />
        <Tab.Screen name="TvShow" component={TvShow} options={{tabBarIcon:({focused})=>(
          <View style={s.centerAlign}>
            {focused?<Ionicons name="tv" size={28} color={colors.mainBlue} />:
            <Ionicons name="md-tv-outline" size={28} color={colors.lighterWhite} />}
            {/* {focused?<Text style={[styles.navText,{color:focused?colors.mainBlue:colors.lighterWhite}]}>TV Shows</Text>:null} */}
          </View>
        )}} />
      
      </Tab.Navigator>
    )
  }

function UserScreen() {
  const linking={
    prefixes:[prefix],
    config:{
      Main:"home",
      SearchModal:"search",
      Modal:"movie",
      TvShowModal:"tv"
    }
  }

  return(
    <NavigationContainer linking={linking}>
      <RootStack.Navigator screenOptions={{headerShown:false}}>
        <RootStack.Screen name="Main" component={BottomTabScreen} />
        <RootStack.Screen name="Modal" component={MovieModalScreen} />
        <RootStack.Screen name="PlayModal" component={YoutubeScreen} />
        <RootStack.Screen name="GenreModal" component={GenreModal} />
        <RootStack.Screen name="TvShowModal" component={TvModalScreen} />
        <RootStack.Screen name="SearchModal" component={SearchResult} />
        <RootStack.Screen name="TorrentModal" component={TorrentModal} />
        <RootStack.Screen name="SeeAllModal" component={SeeAllModal} />
        <RootStack.Screen name="PersonModal" component={PersonScreen} />
        <RootStack.Screen name="AboutModal" component={AboutModal} />
        <RootStack.Screen name="ProfileModal" component={ProfileModal} />
        <RootStack.Screen name="WatchlistModal" component={WatchlistModal} />
      </RootStack.Navigator>
      
    </NavigationContainer>
  )
}

// function MainScreen() {
//   return(
//         <Drawer.Navigator initialRouteName="Home">
//           <Drawer.Screen name="Home" component={BottomTabScreen} />
//           <Drawer.Screen name="Notifications" component={ProfileModal} />
//         </Drawer.Navigator>
//   )
// }

function InitialScreen() {
  const linking={
    prefixes:[prefix],
    config:{
      Login:"login",
      Signup:"signup"
    }
  }

  return(
    <NavigationContainer linking={linking}>
      <RootStack.Navigator screenOptions={{headerShown:false}}>
        <RootStack.Screen name="Login" component={Login} />
        <RootStack.Screen name="Signup" component={Signup} />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}
const store=createStore(authReducer)

const prefix=Linkings.makeUrl('/')

export default function App() {

  // NetInfo.fetch().then(state => {
  //   console.log("Connection type", state.type);
  //   console.log("Is connected?", state.isConnected);
  // });

  const [data,setData]=useState(null)
  
  function handleDeepLink(event) {
    let data=Linkings.parse(event.url)
    setData(data)
  }
  
  useEffect(() => {
    async function getInitialUrl() {
      const initialUrl=await Linkings.getInitialURL()
      if(!initialUrl) setData(Linkings.parse(initialUrl))
    }
    Linkings.addEventListener('url',handleDeepLink)
    if(!data){
      getInitialUrl()
    }
    return () => {
      Linkings.removeEventListener("url")
    }
  }, [])
  
  return(
    <Provider store={store}>
      <Index />
    </Provider>
  )
}

function Index() {
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
      // <SafeAreaView style={styles.pageLoader}>
      //   <StatusBar backgroundColor='hsl(190,80%,50%)' />
      // </SafeAreaView>
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
        <SafeAreaView style={[styles.container,{backgroundColor:colors.mainBlackColor}]}>
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
      <SafeAreaView style={[styles.container,{backgroundColor:colors.mainBlackColor}]}>
        <StatusBar backgroundColor={colors.mainBlackColor} />
        <Modal animationType='fade' visible={modalVisible} transparent={true} 
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }} >
          <View style={s.centeredView}>
            <View style={s.modalView}>
              {/* <View style={s.modalClose}>
                <Pressable onPress={()=>setModalVisible(!modalVisible)}>
                  <Ionicons name="md-close-circle-sharp" size={30} color={colors.lightWhite} />
                </Pressable>
              </View> */}
              <Text style={[s.modalHeader,s.center]}>Update available</Text>
              <View style={s.modalNewContainer}>
                <Text style={s.modalHeader}>What's new </Text>
                {update?.new?.length && update.new.map((item,i)=>(
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
          <UserScreen  />
          :
          <InitialScreen  />
          }
      </SafeAreaView>
    )
  }
}

const s=StyleSheet.create({
  centerAlign:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    padding:0
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:'hsla(330, 25%, 3%,0.6)',
  },
  modalView: {
    margin:20,
    backgroundColor:'hsla(330, 25%, 3%,0.80)',
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
  button: {
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical:8,
    marginTop:18,
    backgroundColor:colors.mainBlue
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
  center:{
    alignSelf:'center'
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