import React from 'react';
import { View,Text,Image } from 'react-native'
import { MaterialIcons,Ionicons } from '@expo/vector-icons'; 
import { colors, styles } from "../../globalStyle";
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function AppHeader({navigation}) {
    
    return(
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.push('ProfileModal')}>
          <View> 
            <Image resizeMode='cover' source={require('../../assets/images/profile/male-1.png')} style={styles.profileImage} />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity >
          <Image source={require('../../assets/images/logo-wo-bg.png')} style={{width:32,height:32}} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={()=>navigation.push('WatchlistModal')}>
          <View>
            <Ionicons name="heart" size={28} color={colors.lighterWhite} />
          </View>
        </TouchableOpacity>
      </View>
    )
  }