import axios from 'axios'
import React,{useEffect,useState} from 'react'
import { View,Text,ScrollView,ActivityIndicator,Image,StyleSheet,ImageBackground,Linking,Pressable, FlatList, SafeAreaView, TouchableOpacity, Button} from 'react-native'
import { styles,mainColor,backgroundBlackColor, colors } from "../globalStyle";
import ProgressCircle from 'react-native-progress-circle'
import { MaterialIcons } from '@expo/vector-icons';
import CustomHeader from './CustomHeader';
import { WebView } from 'react-native-webview';
import YoutubeScreen from './YoutubeScreen';

export default function ModalScreen({navigation,route}){
    const [isLoading,setIsLoading]=useState(true)
    const [movieData,setMovieData]=useState({})
    useEffect(() => {
        
        getMovieInfo()
    }, [route])
    const getMovieInfo=async()=>{
        try {
            setIsLoading(true)
            let response=await axios.get(`https://api.themoviedb.org/3/movie/${route.params.id}?api_key=dfc43a605d906f9da6982495ad7bb34e&append_to_response=images,videos,credits,similar,recommendations`)
            setMovieData(response.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error);
        }
    }
    if(isLoading){
        return(
            <View style={[styles.pageLoader,{backgroundColor:colors.mainBlackColor}]}>
                <ActivityIndicator size='large' color={colors.mainBlue} />
            </View>
        )
    }
    return(
        <View style={[styles.container],{position:'relative',backgroundColor:colors.mainBlackColor}}>
            <View style={[s.movieModalHeader]}>
                <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={()=>navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={22} color={colors.lightWhite} /> 
                    <Text ellipsizeMode={'middle'} numberOfLines={1} style={s.movieModalHeaderText}>{movieData.title} <Text style={[s.movieYear]}>({movieData.release_date.slice(0,4)})</Text></Text>
                </TouchableOpacity>
            </View>
            
            <ScrollView contentContainerStyle={{paddingBottom:40}} style={[styles.container],{backgroundColor:'hsl(0,5%,8%)'}}>
                
                <View style={s.modalPosterContainer}>
                    <Image
                        opacity={0.85}
                        style={s.modalBackdropPoster}
                        resizeMode={'cover'}
                        source={{uri:'https://image.tmdb.org/t/p/original'+movieData.backdrop_path}}
                    />
                    <Image 
                        resizeMode={'stretch'}
                        source={{uri:'https://image.tmdb.org/t/p/original'+movieData.poster_path}}
                        style={s.modalPoster}
                    />
                </View>
                <View style={s.movieDetailContainer}>
                    <Pressable onPress={()=>{
                        movieData.homepage?Linking.openURL(movieData.homepage):null
                    }}>
                        <View style={{marginVertical:5}}>            
                            <Text style={[s.movieName,styles.text]}>{movieData.title} <Text style={s.movieYear}>({movieData.release_date.slice(0,4)})</Text> </Text>
                            {movieData.tagline?
                                <Text style={[{fontFamily:'Nunito-Italic',fontSize:18,textAlign:'center',paddingHorizontal:10},styles.text]}>{movieData.tagline}</Text>
                                :null    
                            }   
                        </View>
                    </Pressable>
                    <View style={s.movieScore}>
                        <View style={s.movieScoreLeft}>
                            <ProgressCircle
                                percent={Math.floor(movieData.vote_average*10)}
                                radius={30}
                                borderWidth={5}
                                color={Math.floor(movieData.vote_average*10)>70?'hsl(125,90%,35%)':(Math.floor(movieData.vote_average*10)>45?'hsl(55,80%,45%)':'red')}
                                bgColor={Math.floor(movieData.vote_average*10)>70?'hsl(125,30%,15%)':(Math.floor(movieData.vote_average*10)>45?'hsl(55,40%,20%)':'red')}
                            >
                                <Text style={[{ fontSize: 18},styles.text]}>{Math.floor(movieData.vote_average*10)}%</Text>
                            </ProgressCircle>
                            <Text style={[{ fontSize: 16,fontFamily:'Nunito-Regular',width:80,flexWrap:'wrap',textAlign:'center'},styles.text]}>Audience Score</Text>
                        
                        </View>
                        <View style={s.movieScoreRight}>
                            {movieData.genres.map(item=>(
                                <Text style={s.genreName} key={item.id}>{item.name}</Text>
                            ))}
                        </View>
                        
                    </View>
                    <View style={{width:'60%',alignSelf:'center',marginBottom:15}}>
                        <Button title="Watch" color={colors.mainBlue} onPress={()=>navigation.push('PlayModal',{id:movieData.imdb_id})} />
                    </View>

                    <View style={s.movieOverview}>
                        <Text style={s.heading_1}>Overview</Text>
                        <Text style={[{fontFamily:'Nunito-Regular',fontSize:18,marginVertical:5,textAlign:'justify'},styles.text]}>{movieData.overview}</Text>
                    </View>
                    <View style={[s.castContainer,s.imagesContainer]}>
                        <Text style={[s.heading_1]}>Cast</Text>
                        <FlatList  
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item)=>item.id.toString()}
                            data={movieData.credits.cast.slice(0,10)}
                            renderItem={({item})=>(
                                <Pressable >
                                    <View style={s.moviePosterContainer}>
                                        <Image 
                                            style={s.moviePoster}
                                            source={{uri:'https://image.tmdb.org/t/p/original'+item.profile_path}} />
                                    </View>
                                </Pressable>
                            )}
                        />
                    </View>
                    <View style={[s.similarMovieContainer,s.imagesContainer]}>
                        {movieData.similar.results.length>1?<Text style={[s.heading_1]}>More like this</Text>:null}
                        <FlatList  
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item)=>item.id.toString()}
                            data={movieData.similar.results.slice(0,10)}
                            renderItem={({item})=>(
                                <TouchableOpacity onPress={()=>navigation.push('Modal',{screen:'MovieModal',params:{id:item.id},key: Math.round( Math.random() * 10000000 )})}>
                                    <View style={s.moviePosterContainer}>
                                        <Image 
                                            style={s.moviePoster}
                                            source={{uri:'https://image.tmdb.org/t/p/original'+item.poster_path}} />
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                    <View style={[s.recommendationMovieContainer,s.imagesContainer]}>
                        {movieData.recommendations.results.length>1?<Text style={[s.heading_1]}>Recommendations</Text>:null}
                        <FlatList  
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item)=>item.id.toString()}
                            data={movieData.recommendations.results.slice(0,10)}
                            renderItem={({item})=>(
                                <TouchableOpacity onPress={()=>navigation.push('Modal',{screen:'MovieModal',params:{id:item.id},key: Math.round( Math.random() * 10000000 )})}>
                                    <View style={s.moviePosterContainer}>
                                        <Image 
                                            style={s.moviePoster}
                                            source={{uri:'https://image.tmdb.org/t/p/original'+item.poster_path}} />
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </ScrollView>

      </View>
    )
  }

const s=StyleSheet.create({
    modalPosterContainer:{
      margin:0,
      position:'relative',
      backgroundColor:'#555',
      height:300,
    },
    modalPoster:{
      width:140,
      height:200,
      marginTop:40,
      marginLeft:30,
      borderRadius:10,
      position:'absolute',
    },
    modalBackdropPoster:{
        width:'100%',
        height:300,
        backgroundColor:'#555',
    },
    movieDetailContainer:{
        flex:1,
        backgroundColor:colors.mainBlackColor,
        paddingVertical:12,
        paddingHorizontal:0,
    },
    movieName:{
        fontSize:24,
        fontFamily:'Nunito-Bold',
        textAlign:'center',
        marginVertical:2,
        paddingHorizontal:10
    },
    movieYear:{
        fontSize:21,
        fontWeight:'300',
        fontFamily:'Nunito-Regular'
    },
    movieScore:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        marginVertical:20,
        marginHorizontal:'4%',
        overflow:'scroll',
        paddingVertical:12,
        width:'92%',
        position:'relative',
        borderWidth:0.5,
        borderColor:colors.lightWhite
    },
    movieScoreLeft:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:'50%',
        borderRightWidth:0.5,
        borderRightColor:colors.lightWhite
    },
    movieScoreRight:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        flexWrap:'wrap',
        width:'50%',
        paddingHorizontal:5,
    },
    genreName:{
        fontSize:16,
        color:colors.lightWhite,
        paddingHorizontal:5,
        paddingVertical:2.5,
        fontFamily:'Nunito-Regular'
    },
    movieOverview:{
        marginVertical:10,
        marginHorizontal:15
    },
    moviePoster:{
        width:160,
        height:200,
        borderRadius:10,
        backgroundColor:'#666'
    },
    moviePostersContainer:{
      flex:1,
      flexDirection:'row',
      flexWrap:'wrap',
      justifyContent:'center',
      position:'relative'
    },
    moviePosterContainer:{
      width:160,
      position:'relative',
      marginHorizontal:5,
      marginVertical:10,
    },
    heading_1:{
        fontSize:22,
        fontFamily:'Nunito-Bold',
        color:colors.lightWhite,
    },
    imagesContainer:{
        marginTop:10,
        marginBottom:10,
        marginHorizontal:10
    },
    movieModalHeader:{
        backgroundColor:colors.mainBlackColor,
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:10,
        paddingVertical:10
    },
    movieModalHeaderText:{
        fontSize:20,
        color:colors.lightWhite,
        marginLeft:8,
        marginTop:1,
        flex:1,
        flexWrap:'wrap'
    }
})
  