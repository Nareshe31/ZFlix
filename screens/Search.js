import axios from 'axios';
import React,{useState,useEffect} from 'react';
import { View,Text,TextInput,StyleSheet, TouchableOpacity } from 'react-native';
import {styles,colors} from '../globalStyle'
import CustomHeader from './CustomHeader'
import {API_KEY} from '../globalUtils'

export default function Search({navigation}) {

    const [genres,setGenres]=useState([])
    useEffect(() => {
        getAllGenres()
    }, [])

    const getAllGenres=async()=>{
        try {
            let response=await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`)
            setGenres(response.data.genres)
        } catch (error) {
            console.log(error);
        }
    }
    return(
        <View style={[styles.container,{backgroundColor:colors.mainBlackColor}]}>
            <CustomHeader  />
            <TextInput placeholder='Search by title, actor...' placeholderTextColor={colors.lightGray} style={s.searchInput} />
            <View style={s.genreContainer}>
                <Text style={s.genreHeader}>Genres</Text>
                <View style={s.genreBoxContainer}>
                    {
                        genres.map(item=>(
                            <TouchableOpacity key={item.id} onPress={()=>navigation.push('GenreModal',{genreId:item.id,genreName:item.name})}>
                                <View style={s.genreBox}>
                                    <Text style={s.genreText}>{item.name}</Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    }
                    
                </View>
                    
            </View>
        </View>
    )
}

const s=StyleSheet.create({
    searchInput:{
        borderWidth:0.5,
        borderColor:colors.lightGray,
        paddingVertical:6,
        paddingHorizontal:20,
        marginHorizontal:20,
        marginVertical:10,
        borderRadius:5,
        color:colors.lightWhite,
        fontSize:18,
        fontFamily:'Nunito-Regular'
    },
    genreContainer:{
        marginVertical:15,
        marginHorizontal:10,
        position:'relative'
    },
    genreHeader:{
        fontSize:20,
        fontFamily:'Nunito-SemiBold',
        color:colors.lightWhite
    },
    genreBoxContainer:{
        width:'100%',
        position:'relative',
        flexDirection:'row',
        flexWrap:'wrap',
        marginVertical:10,
        alignItems:'center',
        justifyContent:'center',
    },
    genreBox:{
        paddingVertical:12,
        paddingHorizontal:18,
        borderWidth:1,
        borderColor:colors.lightGray,
        alignSelf:'flex-start',
        marginVertical:'6%',
        marginHorizontal:'3%',
        flexWrap:'wrap',
        borderRadius:5
    },
    genreText:{
        fontSize:18,
        color:colors.lightWhite,
        fontFamily:'Nunito-Regular',
        textAlign:'center',
    }
})