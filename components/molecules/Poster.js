import React from 'react';
import { View,TouchableOpacity } from 'react-native';
import CardImage from '../atoms/CardImage'
import CardText from '../atoms/CardText'
import { colors, styles } from "../../globalStyle";
import Ripple from 'react-native-material-ripple';

export default function Poster({navigation,item,type}){

    const navigateToScreen=()=>{
        if (type==='movie') {
            navigation.push('Modal', { screen: 'MovieModal', params: { id: item.id ,release_date:item.release_date,title:item.title}, key: Math.round(Math.random() * 10000000) })
        } else if(type==='tv') {
            navigation.push('TvShowModal', { screen: 'TvModal', params: { id: item.id ,name:item.name,first_air_date:item.first_air_date}, key: Math.round(Math.random() * 10000000) })
        }
        else{
            navigation.push('PersonModal',{screen:'PersonScreen',params:{id:item.id,name:item.name},key: Math.round( Math.random() * 10000000 )})
        }
    }

    return(
        <View style={styles.movieWholePosterContainer}>
            <Ripple rippleColor={colors.rippleColor} onPress={navigateToScreen }>
                <>
                <CardImage item={item} type={type}  />
                <CardText item={item} type={type} />
                </>
            </Ripple>
        </View>
    )
}