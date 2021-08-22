import axios from 'axios'
import React,{useEffect,useState} from 'react'
import { View,Text,ScrollView,ActivityIndicator,Image,StyleSheet,Linking,Alert,Pressable, FlatList, TouchableOpacity, TouchableHighlight} from 'react-native'
import { styles, colors } from "../globalStyle";
import ProgressCircle from 'react-native-progress-circle'
import { MaterialIcons,Ionicons } from '@expo/vector-icons';
import ImageView from "react-native-image-viewing";
import { IMAGE_PATH,months,getHour,getMinute,convertMoney, URLs,API_KEY } from '../globalUtils';

export default function ModalScreen({navigation,route}){
    const [isLoading,setIsLoading]=useState(true)
    const [movieData,setMovieData]=useState({})
    const [visible, setIsVisible] = useState(false);
    const [images,setImages]=useState([])
    const [imageIndex,setImageIndex]=useState(0)

    useEffect(() => {
        
        getMovieInfo()
    }, [route])
    const getMovieInfo=async()=>{
        try {
            setIsLoading(true)
            let response=await axios.get(`${URLs[24]}movie/${route.params.id}?api_key=${API_KEY}${URLs[25]}`)
            var images=[]
            setMovieData(response.data)
            response.data.images.backdrops.map(item=>{
                images.push({uri:IMAGE_PATH+item.file_path})
            })
            setImages(images)
            setIsLoading(false)
        } catch (error) {
            // Alert.alert('Oops...','Something went wrong',[{text:"Go back",onPress:()=>navigation.goBack()}])
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
        <View style={[styles.container,{position:'relative',backgroundColor:colors.mainBlackColor}]}>
            <View style={[styles.movieModalHeader]}>
                <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={()=>navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={22} color={colors.lightWhite} /> 
                    <Text ellipsizeMode={'middle'} numberOfLines={1} style={styles.movieModalHeaderText}>{movieData.title} {movieData.release_date.length>0?<Text style={[styles.movieYear]}>({movieData.release_date.slice(0,4)})</Text>:null}</Text>
                </TouchableOpacity>
            </View>
            
            <ScrollView style={[styles.container,{backgroundColor:'hsl(0,5%,8%)'}]}>
                <View style={styles.modalPosterContainer}>
                    {movieData.backdrop_path?
                        <Image style={styles.modalBackdropPoster} opacity={0.75} source={{uri:IMAGE_PATH+movieData.backdrop_path}} />
                        :
                        <Image style={[styles.modalBackdropPoster,{width:'100%',marginLeft:'0%',backgroundColor:'#999',zIndex:-10}]} resizeMode='contain'  source={require('../assets/images/no-image.png')} />
                    }
                    {/* <Image
                        opacity={0.75}
                        style={styles.modalBackdropPoster}
                        resizeMode={'cover'}
                        source={{uri:IMAGE_PATH+movieData.backdrop_path}}
                    /> */}
                    {movieData.poster_path?
                        <Image style={styles.modalPoster} source={{uri:IMAGE_PATH+movieData.poster_path}} />
                        :
                        null
                    }
                    {/* <Image 
                        resizeMode={'cover'}
                        source={{uri:IMAGE_PATH+movieData.poster_path}}
                        style={styles.modalPoster}
                    /> */}
                </View>
                <View style={s.movieDetailContainer}>
                    <Pressable onPress={()=>{
                        movieData.homepage?Linking.openURL(movieData.homepage):null
                        }}>
                        <View style={{marginVertical:5}}>            
                            <Text style={[styles.movieName]}>{movieData.title} {movieData.release_date.length>0?<Text style={styles.movieYear}>({movieData.release_date.slice(0,4)})</Text>:null} </Text>
                            {movieData.tagline?
                                <Text style={[styles.taglineText]}>{movieData.tagline}</Text>
                                :null    
                            }   
                        </View>
                    </Pressable>

                    <View style={{flexDirection:'column',flexWrap:'wrap'}}>
                        <View style={styles.movieTextContainer}>
                            <Text style={[styles.movieText]}>
                                Runtime: {movieData.runtime?getHour(movieData.runtime)+'hr ' + (getMinute(movieData.runtime)?getMinute(movieData.runtime)+' min' :'') :'N/A'}
                            </Text>
                        </View>

                        {movieData.spoken_languages.length?
                            <View style={styles.movieTextContainer}>
                                <Text style={[styles.movieText]}>
                                    Languages: 
                                        {movieData.spoken_languages.map((item,index)=>(<Text key={item.name} style={styles.movieText}> {item.english_name}{index!==movieData.spoken_languages.length-1?',':null}</Text>))}
                                </Text>
                            </View>
                        :null}

                        <View style={styles.movieTextContainer}>
                            <Text style={[styles.movieText]}>
                                Status: {movieData.status}
                            </Text>
                        </View>

                        {movieData.release_date!==''? 
                            <View style={styles.movieTextContainer}>
                                <Text style={styles.movieText}>Release Date: {months[Number(movieData.release_date.slice(5,7))-1]} {movieData.release_date.slice(8,10)}, {movieData.release_date.slice(0,4)}</Text>
                            </View>
                            :
                            <View style={styles.movieTextContainer}>
                                <Text style={styles.movieText}>Release Date: N/A</Text>
                            </View>
                        }
                        <View style={styles.movieTextContainer}>
                            <Text style={[styles.movieText]}>
                                Budget: {movieData.budget?'$'+convertMoney(movieData.budget):'N/A'}
                            </Text>
                        </View>

                        <View style={styles.movieTextContainer}>
                            <Text style={[styles.movieText]}>
                                Revenue: {movieData.revenue?'$'+convertMoney(movieData.revenue):'N/A'}
                            </Text>
                        </View>
                    </View>

                    {movieData.genres.length?
                        <View style={styles.genreContainer}>
                            {movieData.genres.map(item=>(
                                <TouchableOpacity key={item.id} onPress={()=>navigation.push('GenreModal',{genreId:item.id,genreName:item.name,type:'movie'})}>
                                    <Text style={styles.genreName}>{item.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        :null
                    }
                    
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
                            <TouchableOpacity style={{justifyContent:'center',alignItems:'center'}} onPress={()=>navigation.push('PlayModal',{url:`${URLs[15]}${movieData.imdb_id}`})}>
                                <Ionicons name="md-play-circle-sharp" size={36} color={colors.mainLightBlue} />
                            </TouchableOpacity>
                            <Text style={[styles.text]}>Watch Now</Text>
                        </View>
                        
                    </View>
                    
                    <View style={styles.torrentSearchContainer}>
                        <TouchableHighlight onPress={()=>navigation.push('TorrentModal',{query:movieData.title+' '+movieData.release_date.slice(0,4),type:'movie'})}>
                            <Text style={styles.torrentSearchButton}>Browse Torrents</Text>
                        </TouchableHighlight>
                    </View>

                    {movieData.overview?
                        <View style={styles.movieOverview}>
                            <Text style={styles.overviewHeader}>Overview</Text>
                            <Text style={[styles.overviewText,styles.text]}>{movieData.overview}</Text>
                        </View>
                    :null}
                            
                    {movieData.images.backdrops.length?
                        <View style={[{marginBottom:15}]}>
                            <FlatList  
                                horizontal
                                keyExtractor={(item)=>item.file_path}
                                showsHorizontalScrollIndicator={false}
                                data={movieData.images.backdrops}
                                renderItem={({item,index})=>(
                                    <TouchableOpacity onPress={()=>{
                                        setImageIndex(index)
                                        setIsVisible(true)
                                        }}>
                                        <View style={[styles.moviePosterContainer,s.movieImages,{marginHorizontal:8}]}>
                                            <Image 
                                                style={styles.moviePoster}
                                                source={{uri:IMAGE_PATH+item.file_path}} />
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                        :null
                    }

                    {movieData.videos.results.length?
                        <View style={styles.videoContainer}> 
                            <Text style={[styles.heading_1]}>Videos</Text>
                            <FlatList 
                                data={movieData.videos.results}
                                horizontal
                                keyExtractor={(item)=>item.key}
                                renderItem={({item})=>item.site==='YouTube' ?(
                                    <TouchableHighlight onPress={()=>Linking.openURL(URLs[17]+item.key)}>
                                        <View style={styles.ytContainer}>
                                            <Image resizeMode='cover' blurRadius={0.35} style={styles.videoThumbnail} source={{uri:URLs[18]+item.key+URLs[19]}} />
                                            <Text  style={styles.ytTitle}>{item.name}</Text>
                                            
                                            <View style={styles.videoPlayButton}>
                                                <Image style={styles.youtubeLogo} source={require('../assets/images/youtube-logo.png')}  />
                                            </View>
                                        </View>
                                    </TouchableHighlight>
                                ):null}
                                />
                        </View>
                    :null}

                    {movieData.credits.cast.length?
                        <View style={[s.castContainer,s.imagesContainer]}>
                            <Text style={[styles.heading_1]}>Cast</Text>
                            <FlatList  
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item)=>item.id.toString()}
                                data={movieData.credits.cast}
                                renderItem={({item})=>(
                                    <View style={styles.movieWholePosterContainer}>
                                        <Pressable >
                                            <View style={[styles.moviePosterContainer]}>
                                                {item.profile_path?
                                                    <Image style={styles.moviePoster} source={{uri:IMAGE_PATH+item.profile_path}} />
                                                    :
                                                    <Image style={[styles.moviePoster,{width:'80%',marginLeft:'10%'}]} resizeMode='contain'  source={require('../assets/images/no-image.png')} />
                                                }
                                                
                                            </View>
                                        </Pressable>
                                        <View style={styles.posterDetail}>
                                            <Text ellipsizeMode={'tail'} numberOfLines={1} style={styles.posterTitle}>{item.name}</Text>
                                            {item.character?<Text style={styles.posterYear}>{item.character}</Text>:null}
                                        </View>
                                    </View>
                                )}
                            />
                        </View>
                    :null}

                    {movieData.similar.results.length?
                        <View style={[s.similarMovieContainer,s.imagesContainer]}>
                            <Text style={[styles.heading_1]}>More like this</Text>
                            <FlatList  
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item)=>item.id.toString()}
                                data={movieData.similar.results}
                                renderItem={({item})=>(
                                    <View style={styles.movieWholePosterContainer}>
                                        <TouchableOpacity onPress={()=>navigation.push('Modal',{screen:'MovieModal',params:{id:item.id},key: Math.round( Math.random() * 10000000 )})}>
                                            <View style={styles.moviePosterContainer}>
                                                {item.poster_path?
                                                    <Image style={styles.moviePoster} source={{uri:IMAGE_PATH+item.poster_path}} />
                                                    :
                                                    <Image style={[styles.moviePoster,{width:'80%',marginLeft:'10%'}]} resizeMode='contain'  source={require('../assets/images/no-image.png')} />
                                                }
                                            </View>
                                        </TouchableOpacity>
                                        <View style={styles.posterDetail}>
                                            <Text ellipsizeMode={'tail'} numberOfLines={1} style={styles.posterTitle}>{item.title}</Text>
                                            {item.release_date?<Text style={styles.posterYear}>{months[Number(item.release_date.slice(5,7))-1]} {item.release_date.slice(8,10)}, {item.release_date.slice(0,4)}</Text>:null}
                                        </View>
                                    </View>

                                )}
                            />
                        </View>
                    :null}

                    {movieData.recommendations.results.length?
                        <View style={[s.imagesContainer]}>
                            <Text style={[styles.heading_1]}>Recommendations</Text>
                            <FlatList  
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item)=>item.id.toString()}
                                data={movieData.recommendations.results}
                                renderItem={({item})=>(
                                    <View style={styles.movieWholePosterContainer}>
                                        <TouchableOpacity onPress={()=>navigation.push('Modal',{screen:'MovieModal',params:{id:item.id},key: Math.round( Math.random() * 10000000 )})}>
                                            <View style={styles.moviePosterContainer}>
                                                {item.poster_path?
                                                    <Image style={styles.moviePoster} source={{uri:IMAGE_PATH+item.poster_path}} />
                                                    :
                                                    <Image style={[styles.moviePoster,{width:'80%',marginLeft:'10%'}]} resizeMode='contain'  source={require('../assets/images/no-image.png')} />
                                                }
                                            </View>
                                        </TouchableOpacity>
                                        <View style={styles.posterDetail}>
                                            <Text ellipsizeMode={'tail'} numberOfLines={1} style={styles.posterTitle}>{item.title}</Text>
                                            {item.release_date?<Text style={styles.posterYear}>{months[Number(item.release_date.slice(5,7))-1]} {item.release_date.slice(8,10)}, {item.release_date.slice(0,4)}</Text>:null}
                                        </View>
                                    </View>
                                )}
                            />
                        </View>
                    :null}
                    
                    <ImageView
                        images={images}
                        imageIndex={imageIndex}
                        visible={visible}
                        onRequestClose={() => setIsVisible(false)}
                        />
                </View>
            </ScrollView>

      </View>
    )
  }

const s=StyleSheet.create({
    
    movieDetailContainer:{
        flex:1,
        backgroundColor:colors.mainBlackColor,
        paddingVertical:12,
        paddingHorizontal:0,
    },
    movieScore:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        marginVertical:5,
        marginHorizontal:'6%',
        paddingVertical:12,
        width:'90%',
        position:'relative',
    },
    movieScoreLeft:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:'50%',
    },
    movieScoreRight:{
        justifyContent:'center',
        alignItems:'center',
        width:'40%',
        paddingHorizontal:5,
    },
    watchNowButton:{
        paddingVertical:10,
        color:colors.lightWhite,
        paddingHorizontal:18,
        borderRadius:3,
        fontSize:14,
        fontFamily:'Nunito-SemiBold',
        backgroundColor:colors.mainLightBlue
    },
    imagesContainer:{
        marginVertical:18,
        marginHorizontal:10
    },

})
  