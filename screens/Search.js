import axios from 'axios';
import React,{useState,useEffect} from 'react';
import { BackHandler,View,Text,TextInput,StyleSheet, TouchableOpacity ,Alert,Keyboard, ScrollView, ActivityIndicator} from 'react-native';
import {styles,colors} from '../globalStyle'
import CustomHeader from './CustomHeader'
import { MaterialIcons } from '@expo/vector-icons';
import {API_KEY,URLs} from '../globalUtils'

const genresDummy=[{id:0},{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7},{id:8},{id:9},{id:10},{id:11},{id:12},{id:13},{id:14}]
export default function Search({navigation}) {
    const [searchQuery,setSearchQuery]=useState('')
    const [movieGenres,setMovieGenres]=useState([])
    const [tvGenres,setTvGenres]=useState([])
    const [isMovieGenreLoading,setIsMovieGenreLoading]=useState(true)
    const [isTvGenreLoading,setIsTvGenreLoading]=useState(true)
    useEffect(() => {
        getAllGenres()
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
        return () => {
            backHandler.remove()
        }
    }, [])
    const handleBackButtonClick = () => {
        if (navigation.isFocused()) {
            Alert.alert(
                'Exit App',
                'Do you want to exit?',
                [
                    { text: 'Yes', onPress: () => BackHandler.exitApp() },
                    { text: 'No', onPress: () => null, style: 'cancel' },
                ],
                { cancelable: false });
            return true
        }
    }
    const getAllGenres=async()=>{
        await getAllMovieGenres()
        await getAllTvGenres()
    }

    const getAllMovieGenres=async()=>{
        try {
            let response=await axios.get(URLs[20])
            setMovieGenres(response.data.genres)
            setIsMovieGenreLoading(false)
        } catch (error) {
            // Alert.alert('Oops...','Something went wrong',[{text:"Go back",onPress:()=>navigation.goBack()}])
        }
    }

    const getAllTvGenres=async()=>{
        try {
            let response=await axios.get(URLs[21])
            setTvGenres(response.data.genres)
            setIsTvGenreLoading(false)
        } catch (error) {
            // Alert.alert('Oops...','Something went wrong',[{text:"Go back",onPress:()=>navigation.goBack()}])
        }
    }
    const search=()=>{
        navigation.push('SearchModal',{searchQuery:searchQuery})
        setSearchQuery('')
    }
    const handleEnter=()=>{
        if(searchQuery===''){
            // Alert.alert('Oops...','Search query is empty',[{text:'Ok'}])
        }
        else{
            search()
        }
    }
    return(
        <View style={[styles.container,{backgroundColor:colors.mainBlackColor}]}>
            {/* <CustomHeader navigation={navigation}  /> */}
            <ScrollView  
                contentContainerStyle={{paddingBottom:40,paddingTop:10}}
                style={[styles.container,{backgroundColor:colors.mainBlackColor}]}>
                <View style={s.searchContainer}>
                    <TextInput 
                        placeholder='Search by title, actor...' 
                        placeholderTextColor={colors.lighterWhite} 
                        style={s.searchInput}
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        returnKeyType='search'
                        onSubmitEditing={(e)=>handleEnter()}
                        />
                    <TouchableOpacity onPress={()=>{
                        Keyboard.dismiss()
                        handleEnter()
                    }} >
                        <View style={s.searchIcon}>
                            <MaterialIcons name="search" size={28} color={colors.lighterWhite} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={s.genreContainer}>
                    <Text style={s.genreHeader}>Movie Genres</Text>
                    {
                        isMovieGenreLoading?
                            <View style={s.genreBoxContainer}>
                                {
                                   genresDummy.map(item=>(
                                        <View key={item.id} style={[{width:100,height:30,borderRadius:5,marginHorizontal:10,marginVertical:10,borderColor:colors.lightGray,borderWidth:1}]}>
                                        </View>
                                    ))
                                }
                            </View>
                        :
                            <View style={s.genreBoxContainer}>
                                {
                                    movieGenres.map(item=>(
                                        <TouchableOpacity key={item.id} onPress={()=>navigation.push('GenreModal',{genreId:item.id,genreName:item.name,type:'movie'})}>
                                            <View style={s.genreBox}>
                                                <Text style={s.genreText}>{item.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                }
                                
                            </View>
                    }
                        
                </View>

                <View style={s.genreContainer}>
                    <Text style={s.genreHeader}>Tv Show Genres</Text>
                    {
                        isTvGenreLoading?
                            <View style={s.genreBoxContainer}>
                                {
                                   genresDummy.map(item=>(
                                        <View key={item.id} style={[{width:100,height:30,borderRadius:5,marginHorizontal:10,marginVertical:10,borderColor:colors.lightGray,borderWidth:1}]}>
                                        </View>
                                    ))
                                }
                            </View>
                        :
                            <View style={s.genreBoxContainer}>
                                {
                                    tvGenres.map(item=>(
                                        <TouchableOpacity key={item.id} onPress={()=>navigation.push('GenreModal',{genreId:item.id,genreName:item.name,type:'tv'})}>
                                            <View style={s.genreBox}>
                                                <Text style={s.genreText}>{item.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                }
                                
                            </View>
                    }
                        
                </View>
            </ScrollView>
        </View>
    )
}

const s=StyleSheet.create({
    searchInput:{
        paddingVertical:6,
        paddingHorizontal:20,
        borderRadius:5,
        color:colors.lightWhite,
        fontSize:18,
        fontFamily:'Nunito-Regular',
        width:'85%',
    },
    genreContainer:{
        marginVertical:15,
        marginHorizontal:10,
        position:'relative'
    },
    genreHeader:{
        fontSize:20,
        fontFamily:'Nunito-SemiBold',
        color:colors.lightWhite,
        marginLeft:10
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
        paddingVertical:8,
        paddingHorizontal:12,
        borderWidth:1,
        borderColor:colors.lighterWhite,
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
    },
    searchContainer:{
        flexDirection:'row',
        marginHorizontal:'5%',
        marginVertical:10,
        borderWidth:0,
        borderColor:colors.lightWhite,
        borderRadius:6,
        width:'90%',
        position:'relative',
        backgroundColor:'hsla(0,0%,20%,0.6)'
    },
    searchIcon:{
        alignItems:'center',
        justifyContent:'center',
        marginLeft:'7%',
        marginTop:7,
    }
})