import React from 'react';
import { View,TouchableOpacity } from 'react-native';
import CastImage from '../atoms/CastImage'
import CardText from '../atoms/CardText'
import { styles } from "../../globalStyle";

export default function Poster({navigation,item,type}){

    const navigateToScreen=()=>{
        navigation.push('PersonModal',{screen:'PersonScreen',params:{id:item.id,name:item.name},key: Math.round( Math.random() * 10000000 )})
    }

    return(
        <View style={styles.castWholePosterContainer}>
            <TouchableOpacity onPress={navigateToScreen }>
                <CastImage item={item} />
            </TouchableOpacity>
            <CardText item={item} type={type} />
        </View>
    )
}