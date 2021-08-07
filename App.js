import React,{useState,useEffect} from 'react';
import { StyleSheet, Text, View,StatusBar,SafeAreaView, ScrollView,ActivityIndicator} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator,DrawerItem,DrawerContentScrollView,DrawerItemList } from '@react-navigation/drawer';
import Popular from './screens/Popular'
import Movie from './screens/Movie'
import TvShow from './screens/TvShow'
import MovieModal from './screens/MovieModal'
import { styles ,mainColor,colors} from "./globalStyle";
import * as Font from 'expo-font'
import AppLoading from 'expo-app-loading';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import YoutubeScreen from './screens/YoutubeScreen';
import Search from './screens/Search';
import GenreModal from './screens/GenreModal';

function CustomDrawer(props) {
  return(
    <ScrollView>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerHeaderText}>ZFlix</Text>
      </View>
      <DrawerItemList {...props} />
    </ScrollView>
  )
}

const RootStack=createStackNavigator()
const MovieModalStack=createStackNavigator()

const MovieModalScreen=(props)=>{
  return(
    <MovieModalStack.Navigator screenOptions={{headerShown:false}}>
      <MovieModalStack.Screen name='MovieModal' component={MovieModal} />
    </MovieModalStack.Navigator>
  )
}

const Drawer=createDrawerNavigator()
const Tab = createBottomTabNavigator();

const DrawerScreen=()=>(
    <Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props} />} drawerContentOptions={{activeTintColor:'hsl(190,80%,50%)',labelStyle:{fontFamily:'Nunito-Bold',fontSize:16}}} >
      <Drawer.Screen name="Popular" component={Popular} options={{drawerLabel:'Home'}} />
      <Drawer.Screen name="Movie" component={Movie} options={{drawerLabel:'Movies'}}  />
      <Drawer.Screen name="TvShow" component={TvShow} options={{drawerLabel:'TV Shows'}} />
    </Drawer.Navigator>
)


const BottomTabScreen=()=>(
    <Tab.Navigator tabBarOptions={{
        showLabel:false,
        style:{
          backgroundColor:colors.mainBlackColor,
          height:60,
          borderTopWidth: 0
          }
        }} >
      <Tab.Screen name="Popular" component={Popular}  options={{tabBarLabel:'Home',tabBarIcon:({focused})=>(
        <View style={s.centerAlign}>
          <MaterialIcons name="home" size={24} color={focused?colors.mainBlue:colors.lightGray} />
          <Text style={{color:focused?colors.mainBlue:colors.lightGray}}>Home</Text>
        </View>
      )}}  />
       <Tab.Screen name="Search" component={Search} options={{tabBarLabel:'Search',tabBarIcon:({focused})=>(
        <View style={s.centerAlign}>
          <MaterialIcons name="search" size={24} color={focused?colors.mainBlue:colors.lightGray} />
          <Text style={{color:focused?colors.mainBlue:colors.lightGray}}>Search</Text>
        </View>
      )}}  />
      <Tab.Screen name="Movie" component={Movie} options={{tabBarLabel:'Movies',tabBarIcon:({focused})=>(
        <View style={s.centerAlign}>
          <MaterialIcons name="movie" size={24} color={focused?colors.mainBlue:colors.lightGray} />
          <Text style={{color:focused?colors.mainBlue:colors.lightGray}}>Movies</Text>
        </View>
      )}}  />
      <Tab.Screen name="TvShow" component={TvShow} options={{tabBarLabel:'TV Shows',tabBarIcon:({focused})=>(
        <View style={s.centerAlign}>
          <Ionicons name="tv" size={24} color={focused?colors.mainBlue:colors.lightGray} />
          <Text style={{color:focused?colors.mainBlue:colors.lightGray}}>TV Shows</Text>
        </View>
      )}} />
     
    </Tab.Navigator>
)
export default function App() {
  const [isLoading,setIsLoading]=useState(true)
  //const TMDB_API_KEY= dfc43a605d906f9da6982495ad7bb34e

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
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={colors.mainBlackColor} />
        <NavigationContainer>
          <RootStack.Navigator screenOptions={{headerShown:false}}>
            <RootStack.Screen name="Main" component={BottomTabScreen} />
            <RootStack.Screen name="Modal" component={MovieModalScreen} />
            <RootStack.Screen name="PlayModal" component={YoutubeScreen} />
            <RootStack.Screen name="GenreModal" component={GenreModal} />
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
  }
})