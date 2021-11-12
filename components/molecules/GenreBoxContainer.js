import React from 'react';
import { View,StyleSheet } from 'react-native';
import GenreBox from '../atoms/GenreBox';
import GenreBoxLoadingContainer from './GenreBoxLoadingContainer'

export default function GenreBoxContainer({data,navigation,type,loading,mVertical,mHorizontal,fontSize}){

    if (loading)    return <GenreBoxLoadingContainer  />
    return(
        <View style={s.genreBoxContainer}>
            {data.map(item=>(
                    <GenreBox 
                        item={item}  
                        key={item.id}   
                        navigation={navigation} 
                        type={type}
                        mVertical={mVertical}
                        mHorizontal={mHorizontal}
                        fontSize={fontSize}
                    />
                )
            )}
        </View>
    )
}

const s=StyleSheet.create({
    genreBoxContainer:{
        width:'100%',
        position:'relative',
        flexDirection:'row',
        flexWrap:'wrap',
        marginVertical:10,
        alignItems:'stretch',
        justifyContent:'space-evenly',
    },
})