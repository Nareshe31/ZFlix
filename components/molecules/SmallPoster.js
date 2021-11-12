import React from 'react';
import { View,TouchableOpacity,StyleSheet,Dimensions } from 'react-native';
import SmallCardImage from '../atoms/SmallCardImage'
import CardText from '../atoms/CardText'
import { styles,colors } from "../../globalStyle";
import Ripple from 'react-native-material-ripple';

const windowWidth = Dimensions.get('window').width;

export default function SmallPoster({navigation,item,type,addCategory}){

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
        <View style={s.movieWholePosterContainer}>
            <Ripple onPress={navigateToScreen } rippleColor={colors.rippleColor} >
                <SmallCardImage item={item} type={type}  />
                <CardText item={item} type={type} addCategory={addCategory} />
            </Ripple>
        </View>
    )
}

const s=StyleSheet.create({
    movieWholePosterContainer:{
        width:(windowWidth-48)/3,
        position:'relative',
        marginVertical: 8,
        marginHorizontal: 8,
        minWidth:80,
        maxWidth:160,
        backgroundColor:colors.mainBlackLightColor,
        borderRadius:10
    },
})