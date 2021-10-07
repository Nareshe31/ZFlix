import React from 'react'
import Signup from '../screens/Signup';
import Login from '../screens/Login'
import * as Linkings from 'expo-linking'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

const RootStack=createStackNavigator()

export default function GuestStackNavigator() {
    
    return(
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{headerShown:false}}>
          <RootStack.Screen name="Login" component={Login} />
          <RootStack.Screen name="Signup" component={Signup} />
        </RootStack.Navigator>
      </NavigationContainer>
    )
  }