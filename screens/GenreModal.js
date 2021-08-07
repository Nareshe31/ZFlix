import axios from 'axios';
import React,{useState,useEffect} from 'react';
import { View,Text, FlatList, TouchableOpacity,Image,StyleSheet,ActivityIndicator} from 'react-native';
import { colors, styles } from '../globalStyle';
import { API_KEY,IMAGE_PATH} from '../globalUtils';
import { MaterialIcons } from '@expo/vector-icons';
import {Picker} from '@react-native-picker/picker';

export default function GenreModal({navigation,route}) {
    const [isRefreshing,setIsRefreshing]=useState(false)
    const [movieData,setMovieData]=useState([])
    const [filterValue,setFilterValue]=useState('popularity.desc')
    useEffect(() => {
        setMovieData([])
        getMovies(1)
    }, [filterValue])
    useEffect(() => {
        getMovies(1)
    }, [])

    const getMovies=async(page)=>{
        try {
            let response=await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}&language=en-US&sort_by=${filterValue}&with_genres=${route.params.genreId}`)
            setIsRefreshing(false)
            setMovieData((prev)=>{
                return [...prev,...response.data.results]
            })
        } catch (error) {
            console.log(error);
        }
    }
    return(
        <View style={[styles.container,{backgroundColor:colors.mainBlackColor}]}>
            <View style={[s.movieModalHeader]}>
                <TouchableOpacity style={{justifyContent:'center'}} onPress={()=>navigation.goBack()}>
                    <View style={s.genreHeader} >
                        <MaterialIcons name="arrow-back" size={22} color={colors.lightWhite} /> 
                        <Text style={s.movieModalHeaderText}>{route.params.genreName}</Text>
                    </View>
                </TouchableOpacity>

                <View style={s.genreFilter}>
                    <Picker
                        selectedValue={filterValue}
                        style={{ height: 50, width: 150,color:colors.lightWhite }}
                        onValueChange={(itemValue, itemIndex) => setFilterValue(itemValue)}
                        mode='dropdown'
                        dropdownIconColor={colors.lightWhite}
                    >
                        <Picker.Item color={colors.lightWhite} label="Popular" value="popularity.desc" />
                        <Picker.Item color={colors.lightWhite} label="Release Date" value="release_date.desc" />
                        <Picker.Item color={colors.lightWhite} label="Rating" value="vote_average.desc" />
                        <Picker.Item color={colors.lightWhite} label="Revenue" value="revenue.desc" />
                    </Picker>
                </View>
            </View>

            <FlatList  
                data={movieData}
                keyExtractor={(item)=>item.id.toString()}
                contentContainerStyle={{width:'100%',position:'relative',justifyContent:'center'}}
                renderItem={({item})=>(
                    <TouchableOpacity onPress={()=> navigation.push('Modal',{screen:'MovieModal',params:{id:item.id},key: Math.round( Math.random() * 10000000 )})} >
                        <View style={s.moviePosterContainer}>
                            <Image style={s.moviePoster}  source={{uri:IMAGE_PATH+item.poster_path}} />
                        </View>
                    </TouchableOpacity>
                )}
                onEndReached={({distanceFromEnd})=>{
                    setIsRefreshing(true)
                    getMovies(movieData.length/20+1)
                }}
                onEndReachedThreshold={0.25}
                numColumns={2}
            />
            {isRefreshing?
                <ActivityIndicator size='large' color={colors.mainBlue} />
                :null}
        </View>
    )
}

const s=StyleSheet.create({
    moviePoster:{
        width:175,
        height:200,
        borderRadius:10,
        backgroundColor:'#666'
    },
    moviePosterContainer:{
        width:'40%',
        position:'relative',
        marginHorizontal:10,
        marginVertical:15,
    },
    movieModalHeader:{
        backgroundColor:colors.mainBlackColor,
        flexDirection:'row',
        paddingHorizontal:10,
        paddingVertical:5,
        width:'100%',
        justifyContent:'space-between'
    },
    movieModalHeaderText:{
        fontSize:20,
        color:colors.lightWhite,
        marginLeft:8,
        marginTop:1,
    },
    genreHeader:{
        maxWidth:250,
        flexDirection:'row'
    },
    genreFilter:{
    }

})