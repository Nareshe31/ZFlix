import React from 'react';
import { View,TouchableOpacity } from 'react-native';
import CastImage from '../atoms/CastImage'
import CardText from '../atoms/CardText'
import { colors, styles } from "../../globalStyle";
import Ripple from 'react-native-material-ripple';

export default function Poster({navigation,item,type,crew}){

    const navigateToScreen=()=>{
        navigation.push('PersonModal',{screen:'PersonScreen',params:{id:item.id,name:item.name},key: Math.round( Math.random() * 10000000 )})
    }

    return(
        <View style={{marginHorizontal:5,borderRadius:10}}>
            <Ripple rippleColor={colors.rippleColor} onPress={navigateToScreen}>
                <View style={styles.castWholePosterContainer}>
                    <CastImage item={item} />
                    <CardText item={item} type={type} crew={crew} />
                </View>
            </Ripple>
        </View>

    )
}