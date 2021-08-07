import React,{useEffect} from 'react';
import { View,Text,StatusBar } from 'react-native'
import { styles } from "../globalStyle";
import CustomHeader from './CustomHeader';

export default function TvShowScreen({navigation}) {
 
    return(
      <View style={styles.container}>
        <CustomHeader  />
      </View>
    )
  }