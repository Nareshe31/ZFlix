import axios from 'axios'
import React,{useEffect,useState} from 'react'
import { Dimensions,View,Text,ScrollView,ActivityIndicator,Alert,Image,StyleSheet,Linking,Pressable, FlatList, SafeAreaView, TouchableOpacity,TouchableHighlight} from 'react-native'
import { styles,colors } from "../globalStyle";
import ProgressCircle from 'react-native-progress-circle'
import { MaterialIcons,Ionicons } from '@expo/vector-icons';
import ImageView from "react-native-image-viewing";
import { IMAGE_PATH ,months,API_KEY,getHour,getMinute, URLs} from '../globalUtils';
import {Picker} from '@react-native-picker/picker';
import Accordion from 'react-native-collapsible/Accordion';

const dummyEpisodes = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 },{ id: 6 }, { id: 7 }, { id: 8 }]
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function TvShowModal({navigation,route}){
    const [isLoading,setIsLoading]=useState(true)
    const [tvShowData,setTvShowData]=useState({})
    const [visible, setIsVisible] = useState(false);
    const [images,setImages]=useState([])
    const [imageIndex,setImageIndex]=useState(0)
    const [seasonData,setSeasonData]=useState({})
    const [seasonLoading,setSeasonLoading]=useState(true)
    const [seasonNumber,setSeasonNumber]=useState(1)
    const [activeSections,setActiveSections]=useState([])
    useEffect(() => {
        
        getTvShowInfo()
    }, [route])

    useEffect(() => {
        getSeasonData(seasonNumber)
    }, [seasonNumber])
    const getTvShowInfo=async()=>{
        try {
            setIsLoading(true)
            let response=await axios.get(`${URLs[24]}tv/${route.params.id}?api_key=${API_KEY}${URLs[25]}`)
            var images=[]
            setSeasonNumber(response.data.seasons[0].season_number==0?response.data.seasons[1].season_number:response.data.seasons[0].season_number)
            // response.data.seasons.length?getSeasonData(response.data.seasons[0].season_number==0?response.data.seasons[1].season_number:response.data.seasons[0].season_number):null
            setTvShowData(response.data)
            response.data.images.backdrops.map(item=>{
                images.push({uri:IMAGE_PATH+item.file_path})
            })
            setImages(images)
            setIsLoading(false)
        } catch (error) {
            // Alert.alert('Oops...','Something went wrong',[{text:"Go back",onPress:()=>navigation.goBack()}])
        }
    }
    const getSeasonData=async(season)=>{
        try {
            setSeasonLoading(true)
            let {data}=await axios.get(URLs[13]+'tv/'+route.params.id+'/season/'+season+'?api_key='+API_KEY)
            setSeasonData(data)
            setSeasonLoading(false)
        } catch (error) {

        }
    }
    const renderSectionTitle=(item)=>(
        <View>
        </View>
    )
    const renderHeader=(item)=>(
        <View style={s.episodeHeaderContainer}>
            <View style={s.episodePlayContainer}>
                <TouchableOpacity onPress={()=>navigation.push('PlayModal',{url:`${URLs[14]}${route.params.id}/${seasonNumber}/${item.episode_number}`})}>
                    <Ionicons name="md-play-circle-sharp" size={36} color={colors.mainLightBlue} />
                </TouchableOpacity>
            </View>
            <View style={s.epsiodeNameContainer}>
                <Text style={s.episodeNumber}>Episode {item.episode_number}</Text>
                <Text style={s.episodeName}>{item.name}</Text>
            </View>
            
        </View>)
    const renderContent=(item)=>(
        <View style={s.episodeContentContainer}>
            {item.overview || item.still_path?
                <View>
                    {item.still_path?<Image style={s.episodePoster} source={{uri:IMAGE_PATH+item.still_path}} />:null}
                    <Text style={s.episodeOverview}>{item.overview}</Text>
                </View>
                :<Text style={s.episodeOverview}>Information not available</Text>
            }
            
        </View>)
    const updateSections=(activeSections)=>{
        setActiveSections(activeSections)
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
                    <Text ellipsizeMode={'middle'} numberOfLines={1} style={styles.movieModalHeaderText}>{tvShowData.name} <Text style={[styles.movieYear]}>({tvShowData.first_air_date.slice(0,4)})</Text></Text>
                </TouchableOpacity>
            </View>
            
            <ScrollView style={[styles.container],{backgroundColor:'hsl(0,5%,8%)'}}>
                
                <View style={styles.modalPosterContainer}>
                    <Image
                        opacity={0.55}
                        style={styles.modalBackdropPoster}
                        resizeMode={'cover'}
                        source={{uri:IMAGE_PATH+tvShowData.backdrop_path}}
                    />
                    <Image 
                        resizeMode={'cover'}
                        source={{uri:IMAGE_PATH+tvShowData.poster_path}}
                        style={styles.modalPoster}
                    />
                </View>
                <View style={s.movieDetailContainer}>
                    <Pressable onPress={()=>{
                        tvShowData.homepage?Linking.openURL(tvShowData.homepage):null
                    }}>
                        <View style={{marginVertical:5}}>            
                            <Text style={[styles.movieName]}>{tvShowData.name} <Text style={styles.movieYear}>({tvShowData.first_air_date.slice(0,4)})</Text> </Text>
                            {tvShowData.tagline?
                                <Text style={[styles.taglineText]}>{tvShowData.tagline}</Text>
                                :null    
                            }   
                        </View>
                    </Pressable>
                    <View style={{flexDirection:'column',flexWrap:'wrap'}}>
                        <View style={styles.movieTextContainer}>
                            <Text style={[styles.movieText]}>
                                Episode Runtime: {tvShowData.episode_run_time[0]? (tvShowData.episode_run_time[0]>60?getHour(tvShowData.episode_run_time[0])+'hr ':'') + (getMinute(tvShowData.episode_run_time[0])?getMinute(tvShowData.episode_run_time[0])+' min' :'') :'N/A'}
                            </Text>
                        </View>

                        <View style={styles.movieTextContainer}>
                            <Text style={[styles.movieText]}>
                                Languages: 
                                    {tvShowData.spoken_languages.map((item,index)=>(<Text key={item.name} style={styles.movieText}> {item.name}{index!==tvShowData.spoken_languages.length-1?',':null}</Text>))}
                            </Text>
                        </View>

                        {tvShowData.first_air_date!==''? 
                            <View style={styles.movieTextContainer}>
                                <Text style={styles.movieText}>First episode date: {months[Number(tvShowData.first_air_date.slice(5,7))-1]} {tvShowData.first_air_date.slice(8,10)}, {tvShowData.first_air_date.slice(0,4)}</Text>
                            </View>
                            :null
                        }
                        {tvShowData.last_air_date!==''? 
                            <View style={styles.movieTextContainer}>
                                <Text style={styles.movieText}>Last episode date: {months[Number(tvShowData.last_air_date.slice(5,7))-1]} {tvShowData.last_air_date.slice(8,10)}, {tvShowData.last_air_date.slice(0,4)}</Text>
                            </View>
                            :null
                        }
                        <View style={styles.movieTextContainer}>
                            <Text style={[styles.movieText]}>
                                No. of seasons: {tvShowData.number_of_seasons}
                            </Text>
                        </View>
                        <View style={styles.movieTextContainer}>
                            <Text style={[styles.movieText]}>
                                No. of episodes: {tvShowData.number_of_episodes}
                            </Text>
                        </View>
                        
                        <View style={styles.movieTextContainer}>
                            <Text style={[styles.movieText]}>
                                Status: {tvShowData.status}
                            </Text>
                        </View>

                    </View>

                    <View style={styles.genreContainer}>
                        {tvShowData.genres.map(item=>(
                            <TouchableOpacity key={item.id} onPress={()=>navigation.push('GenreModal',{genreId:item.id,genreName:item.name,type:'tv'})}>
                                <Text style={styles.genreName}>{item.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={s.movieScore}>
                        <View style={s.movieScoreLeft}>
                            <ProgressCircle
                                percent={Math.floor(tvShowData.vote_average*10)}
                                radius={30}
                                borderWidth={5}
                                color={Math.floor(tvShowData.vote_average*10)>70?'hsl(125,90%,35%)':(Math.floor(tvShowData.vote_average*10)>45?'hsl(55,80%,45%)':'red')}
                                bgColor={Math.floor(tvShowData.vote_average*10)>70?'hsl(125,30%,15%)':(Math.floor(tvShowData.vote_average*10)>45?'hsl(55,40%,20%)':'red')}
                            >
                                <Text style={[{ fontSize: 18},styles.text]}>{Math.floor(tvShowData.vote_average*10)}%</Text>
                            </ProgressCircle>
                            <Text style={[{ fontSize: 16,fontFamily:'Nunito-Regular',width:80,flexWrap:'wrap',textAlign:'center'},styles.text]}>Audience Score</Text>
                        
                        </View>
                        
                        <View style={s.movieScoreLeft}>
                            <TouchableHighlight onPress={()=>navigation.push('TorrentModal',{query:tvShowData.name+' season '+seasonNumber,type:'tv'})}>
                                <Text style={styles.torrentSearchButton}>Browse Torrents</Text>
                            </TouchableHighlight>
                        </View>
                    </View>

                    <View style={styles.movieOverview}>
                        <Text style={styles.heading_1}>Overview</Text>
                        <Text style={[styles.overviewText,styles.text]}>{tvShowData.overview}</Text>
                    </View>

                    <View style={s.seasonDetailContainer}>
                        <View style={s.seasonFilter}>
                            <Picker
                                selectedValue={seasonNumber}
                                style={{ height: 50, width: 150,color:colors.lightWhite}}
                                onValueChange={(itemValue, itemIndex) => setSeasonNumber(itemValue)}
                                mode='dialog'
                                dropdownIconColor={colors.lightWhite}
                            >
                                {tvShowData.seasons.map((item)=>
                                        item.season_number>0?(<Picker.Item key={item.id} style={{fontFamily:'Nunito-Bold',fontSize:18}} color={colors.mainBlackColor} label={"Season "+item.season_number} value={item.season_number} />):null
                                    )}
                            </Picker>
                        </View>
                        {seasonLoading?
                            <View style={[styles.container,{paddingVertical:200}]}>
                                <ActivityIndicator size='large' color={colors.mainBlue}  />
                            </View>
                            :
                            <View style={s.wholeEpisodeContainer}>
                                <Accordion
                                    sections={seasonData.episodes}
                                    activeSections={activeSections}
                                    renderSectionTitle={renderSectionTitle}
                                    renderHeader={renderHeader}
                                    renderContent={renderContent}
                                    onChange={updateSections}
                                />
                            </View>
                        }
                    </View>

                    <View style={[s.recommendationMovieContainer,s.imagesContainer]}>
                        <FlatList  
                            horizontal
                            keyExtractor={(item)=>item.file_path}
                            showsHorizontalScrollIndicator={false}
                            data={tvShowData.images.backdrops}
                            renderItem={({item,index})=>(
                                <TouchableOpacity onPress={()=>{
                                    setImageIndex(index)
                                    setIsVisible(true)
                                    }}>
                                    <View style={[styles.moviePosterContainer,styles.movieImages]}>
                                        <Image 
                                            style={styles.moviePoster}
                                            source={{uri:IMAGE_PATH+item.file_path}} />
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>

                    {tvShowData.videos.results.length?
                        <View style={styles.videoContainer}> 
                            <Text style={[styles.heading_1]}>Videos</Text>
                            <FlatList 
                                data={tvShowData.videos.results}
                                horizontal
                                keyExtractor={(item)=>item.key}
                                renderItem={({item})=>item.site==='YouTube'?(
                                    <TouchableOpacity onPress={()=>Linking.openURL(URLs[17]+item.key)}>
                                        <View style={styles.ytContainer}>
                                            <Image resizeMode='stretch' blurRadius={0.35} style={styles.videoThumbnail} source={{uri:URLs[18]+item.key+URLs[19]}} />
                                            <Text  style={styles.ytTitle}>{item.name}</Text>
                                            <View style={styles.videoPlayButton}>
                                                <Image style={styles.youtubeLogo} source={require('../assets/images/youtube-logo.png')}  />
                                            </View>
                                            
                                        </View>
                                    </TouchableOpacity>
                                ):null}
                                />
                        </View>
                    :null
                    }

                    {tvShowData.credits.cast.length>0? 
                        <View style={[s.castContainer,s.imagesContainer]}>
                            <Text style={[styles.heading_1]}>Cast</Text>
                            <FlatList  
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item)=>item.id.toString()}
                                data={tvShowData.credits.cast}
                                renderItem={({item})=>(
                                    <Pressable >
                                        <View style={[styles.moviePosterContainer,styles.movieImages]}>
                                            {item.profile_path?
                                                <Image style={styles.moviePoster} source={{uri:IMAGE_PATH+item.profile_path}} />
                                                :
                                                <Image style={[styles.moviePoster,{width:'80%',marginLeft:'10%'}]} resizeMode='contain'  source={require('../assets/images/no-image.png')} />
                                            }
                                        </View>
                                        <View style={styles.posterDetail}>
                                            <Text ellipsizeMode={'tail'} numberOfLines={1} style={styles.posterTitle}>{item.name}</Text>
                                            {item.character?<Text style={styles.posterYear}>{item.character}</Text>:null}
                                        </View>
                                    </Pressable>
                                )}
                            />
                        </View>
                    :null}
                    
                    {tvShowData.similar.results.length>0?
                        <View style={[s.similarMovieContainer,s.imagesContainer]}>
                            <Text style={[styles.heading_1]}>More like this</Text>
                            <FlatList  
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item)=>item.id.toString()}
                                data={tvShowData.similar.results}
                                renderItem={({item})=>(
                                    <View style={styles.movieWholePosterContainer}>
                                        <TouchableOpacity onPress={()=>navigation.push('TvShowModal',{screen:'TvModal',params:{id:item.id},key: Math.round( Math.random() * 10000000 )})}>
                                            <View style={styles.moviePosterContainer}>
                                                {item.poster_path?
                                                    <Image style={styles.moviePoster} source={{uri:IMAGE_PATH+item.poster_path}} />
                                                    :
                                                    <Image style={[styles.moviePoster,{width:'80%',marginLeft:'10%'}]} resizeMode='contain'  source={require('../assets/images/no-image.png')} />
                                                }
                                            </View>
                                        </TouchableOpacity>
                                        <View style={styles.posterDetail}>
                                            <Text ellipsizeMode={'tail'} numberOfLines={1} style={styles.posterTitle}>{item.name}</Text>
                                            {item.first_air_date?<Text style={styles.posterYear}>{months[Number(item.first_air_date.slice(5,7))-1]} {item.first_air_date.slice(8,10)}, {item.first_air_date.slice(0,4)}</Text>:null}
                                        </View>
                                    </View>
                                )}
                            />
                        </View>
                    :null}

                    {tvShowData.recommendations.results.length>0?
                        <View style={[s.recommendationMovieContainer,s.imagesContainer]}>
                            <Text style={[styles.heading_1]}>Recommendations</Text>
                            <FlatList  
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item)=>item.id.toString()}
                                data={tvShowData.recommendations.results.slice(0,10)}
                                renderItem={({item})=>(
                                    <View style={styles.movieWholePosterContainer}>
                                        <TouchableOpacity onPress={()=>navigation.push('TvShowModal',{screen:'TvModal',params:{id:item.id},key: Math.round( Math.random() * 10000000 )})}>
                                            <View style={styles.moviePosterContainer}>
                                                {item.poster_path?
                                                    <Image style={styles.moviePoster} source={{uri:IMAGE_PATH+item.poster_path}} />
                                                    :
                                                    <Image style={[styles.moviePoster,{width:'80%',marginLeft:'10%'}]} resizeMode='contain'  source={require('../assets/images/no-image.png')} />
                                                }
                                            </View>
                                        </TouchableOpacity>
                                        <View style={styles.posterDetail}>
                                            <Text ellipsizeMode={'tail'} numberOfLines={1} style={styles.posterTitle}>{item.name}</Text>
                                            {item.first_air_date?<Text style={styles.posterYear}>{months[Number(item.first_air_date.slice(5,7))-1]} {item.first_air_date.slice(8,10)}, {item.first_air_date.slice(0,4)}</Text>:null}
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
        marginVertical:15,
        marginHorizontal:'4%',
        overflow:'scroll',
        paddingVertical:12,
        width:'92%',
        position:'relative',
    },
    movieScoreLeft:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:'50%',
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
    imagesContainer:{
        marginTop:10,
        marginBottom:15,
        marginHorizontal:10
    },
    seasonDetailContainer:{
        marginTop:12,
        marginBottom:18
    },
    episodeHeaderContainer:{
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:14,
        paddingVertical:8,
        marginBottom:5,
        backgroundColor:colors.lightBlack
    },
    episodeNumber:{
        color:colors.lightWhite,
        fontFamily:'Nunito-SemiBold',
        fontSize:18
    },
    episodeName:{
        color:colors.lightGray,
        fontFamily:'Nunito-Regular',
        fontSize:18
    },
    epsiodeNameContainer:{
        marginLeft:10
    },
    episodeContentContainer:{
        marginBottom:20
    },
    episodePoster:{
        width:windowWidth,
        height:250,
        alignSelf:'center'
    },
    episodeOverview:{
        color:colors.lightGray,
        fontSize:16,
        fontFamily:'Nunito-Regular',
        marginHorizontal:15,
        marginVertical:5,
        textAlign:'justify'
    },
    seasonFilter:{
        marginLeft:10
    },
})
  