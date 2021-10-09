import React from 'react';
import { View,StyleSheet,Text } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons,Ionicons,MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, styles } from '../globalStyle';
import Popular from '../screens/Popular'
import Movie from '../screens/Movie'
import TvShow from '../screens/TvShow'
import Search from '../screens/Search';

const Tab = createBottomTabNavigator();
export default function BottomTabScreen(){
    return(
        <Tab.Navigator tabBarOptions={{
            showLabel:false,
            style:s.bottomNav
            }} >
          <Tab.Screen name="Popular" component={Popular}  options={{tabBarIcon:({focused})=>(
            <View style={s.centerAlign}>
              {focused?<MaterialIcons name="home" size={28} color={colors.lightWhite} />:
              <MaterialCommunityIcons name="home-outline" size={28} color={colors.lighterWhite} />}
              <Text style={styles.text}>Home</Text>
            </View>
          )}}  />
          <Tab.Screen name="Search" component={Search} options={{tabBarIcon:({focused})=>(
            <View style={s.centerAlign}>
              {focused?<Ionicons name="search" size={28} color={colors.mainBlue} />:
              <Ionicons name="search-outline" size={28} color={colors.lighterWhite} />}
            </View>
          )}}  />
          <Tab.Screen name="Movie" component={Movie} options={{tabBarIcon:({focused})=>(
            <View style={s.centerAlign}>
              {focused?<MaterialCommunityIcons name="movie-open" size={28} color={colors.mainBlue} />:
              <MaterialCommunityIcons name="movie-open-outline" size={28} color={colors.lighterWhite} />}
            </View>
          )}}  />
          <Tab.Screen name="TvShow" component={TvShow} options={{tabBarIcon:({focused})=>(
            <View style={s.centerAlign}>
              {focused?<Ionicons name="tv" size={28} color={colors.mainBlue} />:
              <Ionicons name="md-tv-outline" size={28} color={colors.lighterWhite} />}
            </View>
          )}} />
        
        </Tab.Navigator>
      )
    }
  
const s=StyleSheet.create({
    centerAlign:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        padding:0
      },
      bottomNav:{
        borderTopRightRadius:0,
        borderTopLeftRadius:0,
        backgroundColor:colors.mainBlackLightColor,
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
})