import React,{useEffect,useState} from 'react'
import { View,Text,StyleSheet,ScrollView,Image,FlatList,ActivityIndicator,RefreshControl,SafeAreaView,TouchableOpacity} from 'react-native'
import { styles,mainColor, colors } from "../globalStyle";
import CustomHeader from './CustomHeader'
import axios from 'axios'
import { MaterialIcons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';

function ContainerLoading() {

    
    return(
        <View style={styles.loadingContainer}>
            <ActivityIndicator size='large' color={colors.mainBlue} />
        </View>
    )
}

export default function PopularScreen({navigation}) {
    const [refreshing,setRefreshing]=useState(true)
    const [isMovieLoading,setIsMovieLoading]=useState(true)
    const [isTvShowLoading,setIsTvShowLoading]=useState(true)
    const [isPersonLoading,setIsPersonLoading]=useState(true)
    const [movie,setMovie]=useState([])
    const [tvShow,setTvShow]=useState([])
    const [person,setPerson]=useState([])
    useEffect(() => {
        getAllData()
    }, [])

    const getAllData=async()=>{
        await getPopularMovies()
        await getPopularTvShows()
        await getPopularPersons()
        setRefreshing(false)
    }

    const getPopularMovies=async()=>{
        try {
            let response=await axios.get('https://api.themoviedb.org/3/trending/movie/day?api_key=dfc43a605d906f9da6982495ad7bb34e')
            setMovie(response.data.results)
            setIsMovieLoading(false)
        } catch (error) {
            
        }
    }

    const getPopularTvShows=async()=>{
        try {
            let response=await axios.get('https://api.themoviedb.org/3/trending/tv/day?api_key=dfc43a605d906f9da6982495ad7bb34e')
            setTvShow(response.data.results)
            setIsTvShowLoading(false)
        } catch (error) {
            
        }
    }

    const getPopularPersons=async()=>{
        try {
            let response=await axios.get('https://api.themoviedb.org/3/trending/person/week?api_key=dfc43a605d906f9da6982495ad7bb34e')
            setPerson(response.data.results)
            setIsPersonLoading(false)
        } catch (error) {
            
        }
    }
    return(
        <View style={[styles.container,s.container]}>
            <CustomHeader navigation={navigation} title='Home' />
            <ScrollView 
                style={[styles.container,s.container]} 
                refreshControl={<RefreshControl onRefresh={getAllData} refreshing={refreshing} />}>
                

                <View style={s.popularContainer}>
                    <View style={s.popularHeaderContainer}>
                        <Text style={s.popularHeaderText}>Trending Movies</Text>
                        <TouchableOpacity onPress={()=>navigation.navigate('Movie')}>
                            <MaterialIcons style={{marginRight:10}} name="keyboard-arrow-right" size={24} color={colors.lightWhite} />
                        </TouchableOpacity>
                    </View>
                    
                    {isMovieLoading?
                        <ContainerLoading  />
                    :

                        <SafeAreaView style={{flex:1}} style={s.posterSlideShowContainer}>
                            
                            <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={movie}
                            keyExtractor={(item)=>item.id.toString()}
                            renderItem={({item})=>(
                                <View key={item.id} style={s.moviePosterContainer}>
                                    <TouchableOpacity onPress={()=>navigation.push('Modal',{screen:'MovieModal',params:{id:item.id},key: Math.round( Math.random() * 10000000 )})}>
                                        <Image resizeMode='cover' style={s.moviePoster} source={{uri:'https://image.tmdb.org/t/p/original'+item.poster_path}}></Image>
                                    </TouchableOpacity>
                                </View>
                            )}  />

                        </SafeAreaView>
                    }
                </View>

                <View style={s.popularContainer}>
                    <View style={s.popularHeaderContainer}>
                        <Text style={s.popularHeaderText}>Trending Shows</Text>
                        <MaterialIcons style={{marginRight:10}} name="keyboard-arrow-right" size={24} color={colors.lightWhite} />
                    </View>
                    {isTvShowLoading?
                        <ContainerLoading  />
                    :
                        <SafeAreaView style={s.posterSlideShowContainer}>
                            <FlatList 
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={tvShow}
                            keyExtractor={(item)=>item.id.toString()}
                            renderItem={({item})=>(
                                <View key={item.id} style={s.moviePosterContainer}>
                                    <Image resizeMode='cover' style={s.moviePoster} source={{uri:'https://image.tmdb.org/t/p/original'+item.poster_path}}></Image>
                                </View>
                            )}/>
                        </SafeAreaView>
                    }
                    
                </View>

                <View style={s.popularContainer}>
                    <View style={s.popularHeaderContainer}>
                        <Text style={s.popularHeaderText}>Trending Persons</Text>
                        <MaterialIcons style={{marginRight:10}} name="keyboard-arrow-right" size={24} color={colors.lightWhite} />
                    </View>
                    {isPersonLoading?
                        <ContainerLoading  />
                    :
                        <SafeAreaView style={s.posterSlideShowContainer}>
                            <FlatList 
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={person}
                            keyExtractor={(item)=>item.id.toString()}
                            renderItem={({item})=>{
                                return item.profile_path?
                                    (<View key={item.id} style={s.moviePosterContainer}>
                                        <Image resizeMode='cover' style={s.moviePoster} source={{uri:'https://image.tmdb.org/t/p/original'+item.profile_path}}></Image>
                                    </View>)
                                :null
                                
                            }}/>
                        </SafeAreaView>
                    }
                    
                </View>

            </ScrollView>
      </View>
    )
  }

const s=StyleSheet.create({
    popularContainer:{
        width:'100%',
        marginBottom:15,
    },
    popularHeaderText:{
        fontSize:20,
        marginVertical:5,
        marginHorizontal:15,
        fontWeight:'600',
        fontFamily:'Nunito-Bold',
        color:colors.lightWhite
    },
    moviePoster:{
        width:160,
        height:200,
        borderRadius:10,
        backgroundColor:colors.lightGray
    },
    moviePosterContainer:{
        marginHorizontal:8,
        backgroundColor:colors.mainBlackColor
    },
    posterSlideShowContainer:{
        marginLeft:5,
        paddingVertical:10,
        borderRadius:10,
        backgroundColor:colors.mainBlackColor
    },
    container:{
        backgroundColor:colors.mainBlackColor
    },
    popularHeaderContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    }
})