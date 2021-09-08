import React from 'react';
import { View,Text,TouchableWithoutFeedback,Image } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'; 
import { colors, styles } from "../globalStyle";


export default function CustomHeader({navigation}) {
    
    return(
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
        {/* onPress={()=>navigation.push('AboutModal') } */}
          <TouchableWithoutFeedback >
            <Text style={[styles.headerText]}>ZFlix</Text>
            {/* <Image resizeMode='stretch' scaleX={1.6} scaleY={1.7} source={require('../assets/adaptive-icon.png')} style={styles.headerLogoImage} /> */}
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={()=>navigation.push('ProfileModal')}>
            <Image resizeMode='cover' source={require('../assets/images/profile/male-1.png')} style={styles.profileImage} />
          </TouchableWithoutFeedback>
        </View>
      </View>
    )
  }