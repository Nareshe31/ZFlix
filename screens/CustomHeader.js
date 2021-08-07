import React from 'react';
import { View,Text,TouchableWithoutFeedback } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'; 
import { styles } from "../globalStyle";

export default function CustomHeader({navigation,title}) {
    return(
      <View style={styles.header}>
        {/* <View style={styles.headerLeftContainer}>
          <TouchableWithoutFeedback onPress={()=>navigation.toggleDrawer()}>
            <MaterialIcons name="menu" size={28} color="white" />
          </TouchableWithoutFeedback>
        </View> */}
        <View style={styles.headerTextContainer}>
          <Text style={[styles.headerText]}>ZFlix</Text>
        </View>
      </View>
    )
  }