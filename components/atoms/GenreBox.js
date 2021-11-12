import React from 'react';
import { View,Text,StyleSheet,TouchableOpacity } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { colors } from '../../globalStyle';

export default function GenreBox({item,navigation,type,mVertical,mHorizontal,fontSize}) {

    const navigateToScreen=()=>{
        navigation.push('GenreModal',{genreId:item.id,genreName:item.name,type:type})
    }
    
    return(
        <View style={[s.genreBox,{
            marginVertical:mVertical,
            marginHorizontal:mHorizontal}]}>
            <Ripple rippleColor={colors.rippleColor} onPress={navigateToScreen}>
                <Text style={[s.genreText,{fontSize:fontSize}]}>{item.name}</Text>
            </Ripple>
        </View>
    )
}

const s=StyleSheet.create({
    genreBox:{
        alignSelf:'flex-start',
        flexWrap:'wrap',
    },
    genreText:{
        color:colors.lightWhite,
        fontFamily:'Nunito-Regular',
        textAlign:'center',
        paddingVertical:8,
        paddingHorizontal:12,
        borderRadius:10,
        backgroundColor:colors.mainBlackLightColor,
    },
})
