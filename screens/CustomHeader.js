import React from 'react';
import { View,Text,TouchableWithoutFeedback } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'; 
import { styles } from "../globalStyle";

export default function CustomHeader({navigation}) {
    return(
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <TouchableWithoutFeedback >
            <Text style={[styles.headerText]}>ZFlix</Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    )
  }