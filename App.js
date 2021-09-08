import React,{useState,useEffect} from 'react';
import {Linking, Modal,StyleSheet, Text, View,StatusBar,SafeAreaView,Image, ScrollView,ActivityIndicator, Pressable} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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

const RootStack=createStackNavigator()
const MovieModalStack=createStackNavigator()
const TvModalStack=createStackNavigator()
const PersonModalStack=createStackNavigator()

const MovieModalScreen=(props)=>{
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

const BottomTabScreen=()=>(
    <Tab.Navigator tabBarOptions={{
        showLabel:false,
        style:{
          borderTopRightRadius:20,
          borderTopLeftRadius:20,
          backgroundColor:colors.mainBlackColor,
          position:'absolute',
          bottom: 0,
          left:0,
          marginHorizontal:0,
          paddingHorizontal:0,
          paddingBottom:5,
          height:60,
          borderTopWidth:0,
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

function UserScreen() {
  return(
    <NavigationContainer>
      <RootStack.Navigator mode='card' screenOptions={{headerShown:false}}>
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
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

function InitialScreen() {
  return(
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{headerShown:false}}>
        <RootStack.Screen name="Login" component={Login} />
        <RootStack.Screen name="Signup" component={Signup} />
        <RootStack.Screen name="About" component={AboutModal} />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}
const store=createStore(authReducer)

export default function App() {
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
  const words=["Checking for new version","Getting your data","Keep tight"]
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
    fetch(URLs[12]).then(res=>res.json()).then(res=>{
      if(res.version.slice(0,1)>Constants.manifest.version.slice(0,1)){
        setUpdate(res)
        setModalVisible(!modalVisible)
      }
      getToken()
    })
    fetch(URLs[16]).then(res=>res.json()).then(res=>res)
    fetch(URLs[14]).then(res=>res)
  }, [])
 
  const getFonts=async()=>Font.loadAsync({
      'Nunito-Regular': require('./assets/fonts/Nunito-Regular.ttf'),
      'Nunito-Bold': require('./assets/fonts/Nunito-Bold.ttf'),
      'Nunito-SemiBold': require('./assets/fonts/Nunito-SemiBold.ttf'),
      'Nunito-SemiBoldItalic': require('./assets/fonts/Nunito-SemiBoldItalic.ttf'),
      'Nunito-Italic': require('./assets/fonts/Nunito-Italic.ttf'),
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
          <View style={styles.pageLoader}>
              {/* <ActivityIndicator size='large' color={colors.mainBlue} /> */}
              <Image source={require('./assets/images/loading-gif.gif')} resizeMode='contain' style={s.loadingGif}  />
              <Image source={require('./assets/custom-splash.png')} resizeMode='contain' style={s.loadingLogo}  />
              <Text style={s.loadingText}>{words[loadingWord]}</Text>
              <Text style={s.versionText}>v{Constants.manifest.version}</Text>
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
              <View style={s.modalClose}>
                <Pressable onPress={()=>setModalVisible(!modalVisible)}>
                  <Ionicons name="md-close-circle-sharp" size={30} color={colors.lightWhite} />
                </Pressable>
              </View>
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
    backfaceVisibility:'visible',
  },
  loadingGif:{
    width:200,
    height:450,
    zIndex:5,
    bottom:-140,
    position:'absolute',
    backgroundColor:colors.mainBlackColor
  }
})