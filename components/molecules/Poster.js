import React from 'react';
import { View,TouchableOpacity } from 'react-native';
import CardImage from '../atoms/CardImage'
import CardText from '../atoms/CardText'
import { styles } from "../../globalStyle";

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
            <TouchableOpacity onPress={navigateToScreen }>
                <CardImage item={item} type={type}  />
            </TouchableOpacity>
            <CardText item={item} type={type} />
        </View>
    )
}