import React,{useState,useEffect} from 'react';
import {Linking, Modal,StyleSheet, Text, View,StatusBar,SafeAreaView, ScrollView,ActivityIndicator, Pressable} from 'react-native';
import { Link, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Popular from './screens/Popular'
import Movie from './screens/Movie'
import TvShow from './screens/TvShow'
import MovieModal from './screens/MovieModal'
import TvShowModal from './screens/TvShowModal'
import SeeAllModal from './screens/SeeAllModal'
import { styles,colors} from "./globalStyle";
import * as Font from 'expo-font'
import AppLoading from 'expo-app-loading';
import { MaterialIcons,Ionicons } from '@expo/vector-icons';
import YoutubeScreen from './screens/YoutubeScreen';
import Search from './screens/Search';
import GenreModal from './screens/GenreModal';
import SearchResult from './screens/SearchResult';
import TorrentModal from './screens/TorrentModal';
import PersonModal from './screens/PersonModal';
import Constants from "expo-constants"
import axios from 'axios';
import { URLs } from './globalUtils';
import AboutModal from './screens/AboutModal';

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
          borderTopRightRadius:30,
          borderTopLeftRadius:30,
          backgroundColor:colors.mainBlackColor,
          position:'absolute',
          bottom: 0,
          left:0,
          marginHorizontal:0,
          paddingHorizontal:5,
          paddingBottom:2,
          height:65,
          borderTopWidth:0,
          }
        }} >
      <Tab.Screen name="Popular" component={Popular}  options={{tabBarLabel:'Home',tabBarIcon:({focused})=>(
        <View style={s.centerAlign}>
          <MaterialIcons name="home" size={24} color={focused?colors.mainBlue:colors.lightGray} />
          <Text style={[styles.navText,{color:focused?colors.mainBlue:colors.lightGray}]}>Home</Text>
        </View>
      )}}  />
       <Tab.Screen name="Search" component={Search} options={{tabBarLabel:'Search',tabBarIcon:({focused})=>(
        <View style={s.centerAlign}>
          <MaterialIcons name="search" size={24} color={focused?colors.mainBlue:colors.lightGray} />
          <Text style={[styles.navText,{color:focused?colors.mainBlue:colors.lightGray}]}>Search</Text>
        </View>
      )}}  />
      <Tab.Screen name="Movie" component={Movie} options={{tabBarLabel:'Movies',tabBarIcon:({focused})=>(
        <View style={s.centerAlign}>
          <MaterialIcons name="movie" size={24} color={focused?colors.mainBlue:colors.lightGray} />
          <Text style={[styles.navText,{color:focused?colors.mainBlue:colors.lightGray}]}>Movies</Text>
        </View>
      )}}  />
      <Tab.Screen name="TvShow" component={TvShow} options={{tabBarLabel:'TV Shows',tabBarIcon:({focused})=>(
        <View style={s.centerAlign}>
          <Ionicons name="tv" size={24} color={focused?colors.mainBlue:colors.lightGray} />
          <Text style={[styles.navText,{color:focused?colors.mainBlue:colors.lightGray}]}>TV Shows</Text>
        </View>
      )}} />
     
    </Tab.Navigator>
)
export default function App() {
  const [isLoading,setIsLoading]=useState(true)
  const [modalVisible, setModalVisible] = useState(false);
  const [update,setUpdate]=useState({})
  useEffect(() => {
    fetch(URLs[12]).then(res=>res.json()).then(res=>{
      if(res.version.slice(0,1)>Constants.manifest.version.slice(0,1)){
        setUpdate(res)
        setModalVisible(!modalVisible)
      }
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
  if(isLoading){
    return(
      // <SafeAreaView style={styles.pageLoader}>
      //   <StatusBar backgroundColor='hsl(190,80%,50%)' />
      // </SafeAreaView>
      <AppLoading 
        startAsync={getFonts}
        onFinish={()=>setIsLoading(false)}
        onError={console.warn}
      />
    )
    }
  else{
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
                  <Ionicons name="md-close-circle-sharp" size={30} color={colors.mainBlackColor} />
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

        <NavigationContainer>
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
          </RootStack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    )
  }
}

const s=StyleSheet.create({
  centerAlign:{
    justifyContent:'center',
    alignItems:'center'
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
  }
})