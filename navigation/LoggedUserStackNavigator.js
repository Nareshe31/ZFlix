import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import BottomNavBar from './BottomNavBar'
import MovieModal from '../modals/MovieModal'
import TvShowModal from '../modals/TvShowModal'
import YoutubeScreen from '../screens/YoutubeScreen';
import GenreModal from '../modals/GenreModal';
import SearchResult from '../screens/SearchResult';
import TorrentModal from '../modals/TorrentModal';
import SeeAllModal from '../modals/SeeAllModal'
import WatchlistModal from '../modals/WatchlistModal'
import ProfileModal from '../modals/ProfileModal';
import PersonModal from '../modals/PersonModal';
import * as Linkings from 'expo-linking'

const MovieModalStack=createStackNavigator()
const TvModalStack=createStackNavigator()
const PersonModalStack=createStackNavigator()

const MovieModalScreen=()=>{

  return(
    <MovieModalStack.Navigator screenOptions={{headerShown:false}}>
      <MovieModalStack.Screen name='MovieModal' component={MovieModal} />
    </MovieModalStack.Navigator>
  )
}

const TvModalScreen=()=>{
  return(
    <TvModalStack.Navigator screenOptions={{headerShown:false}}>
      <TvModalStack.Screen name='TvModal' component={TvShowModal} />
    </TvModalStack.Navigator>
  )
}
const PersonScreen=()=>{
  return(
    <PersonModalStack.Navigator screenOptions={{headerShown:false}}>
      <PersonModalStack.Screen name='PersonScreen' component={PersonModal} />
    </PersonModalStack.Navigator>
  )
}


const RootStack=createStackNavigator()

export default function StackNavigator(){
    return(
        <NavigationContainer >
            <RootStack.Navigator screenOptions={{headerShown:false}}>
            <RootStack.Screen name="Main" component={BottomNavBar} />
            <RootStack.Screen name="Modal" component={MovieModalScreen} />
            <RootStack.Screen name="PlayModal" component={YoutubeScreen} />
            <RootStack.Screen name="GenreModal" component={GenreModal} />
            <RootStack.Screen name="TvShowModal" component={TvModalScreen} />
            <RootStack.Screen name="SearchModal" component={SearchResult} />
            <RootStack.Screen name="TorrentModal" component={TorrentModal} />
            <RootStack.Screen name="SeeAllModal" component={SeeAllModal} />
            <RootStack.Screen name="PersonModal" component={PersonScreen} />
            <RootStack.Screen name="ProfileModal" component={ProfileModal} />
            <RootStack.Screen name="WatchlistModal" component={WatchlistModal} />
            </RootStack.Navigator>
        </NavigationContainer>
    )
}
