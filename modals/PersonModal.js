import axios from 'axios'
import React,{useEffect,useState} from 'react'
import { BackHandler,View,Dimensions,Text,ScrollView,ActivityIndicator,Image,StyleSheet,Linking,Alert,Pressable, FlatList, SafeAreaView, TouchableOpacity, Button, TouchableHighlight} from 'react-native'
import { styles, colors } from "../globalStyle"
import { MaterialIcons,Ionicons } from '@expo/vector-icons';
import ImageView from "react-native-image-viewing";
import { IMAGE_PATH,months,getHour,getMinute,convertMoney, URLs, API_KEY } from '../globalUtils';
import PosterContainer from "../components/molecules/PosterContainer";
import Ripple from 'react-native-material-ripple';

const windowHeight = Dimensions.get('window').height;

export default function PersonModal({navigation,route}) {
    const [isLoading,setIsLoading]=useState(true)
    const [personData,setPersonData]=useState({})
    const [visible, setIsVisible] = useState(false);
    const [images,setImages]=useState([])
    const [imageIndex,setImageIndex]=useState(0)
    useEffect(() => {
        
        getMovieInfo()
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
        return () => {
            backHandler.remove()
        }

    }, [route])
    
    const handleBackButtonClick = () => {
        navigation.goBack()
        return true
    }
    const getMovieInfo=async()=>{
        try {
            setIsLoading(true)
            let {data}=await axios.get(`${URLs[24]}person/${route.params.id}?api_key=${API_KEY}&language=en-US&append_to_response=images,movie_credits,tv_credits`)
            var images=[]
            setPersonData(data)
            data.images.profiles.map(item=>{
                images.push({uri:IMAGE_PATH+item.file_path})
            })
            setImages(images)
            setIsLoading(false)
        } catch (error) {
            // Alert.alert('Oops...','Something went wrong',[{text:"Go back",onPress:()=>navigation.goBack()}])
        }
    }
    
    
    return(
        <View style={[styles.container,{position:'relative',backgroundColor:colors.mainBlackColor}]}>   
            <View style={[styles.movieModalHeader]}>
                <TouchableOpacity style={{paddingLeft:0}} onPress={()=>navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={22} color={colors.lightWhite} /> 
                </TouchableOpacity>
                <Text ellipsizeMode={'middle'} numberOfLines={1} style={styles.movieModalHeaderText}>{route.params.name} </Text>
            </View>
            {isLoading?
                (
                    <View style={[styles.pageLoader,styles.container,{backgroundColor:colors.mainBlackColor}]}>
                        {/* <ActivityIndicator size='large' color={colors.mainBlue} /> */}
                        <Image source={require('../assets/images/loading-hand.gif')} style={{width:250,height:350}}  />
                    </View>
                )
                :
                <ScrollView style={[styles.container,{backgroundColor:colors.mainBlackColor}]}>
                    
                    <View style={styles.modalPosterContainer}>
                        {personData.profile_path?
                            <Image 
                                style={styles.modalBackdropPoster} 
                                opacity={1}
                                source={{uri:IMAGE_PATH+personData.profile_path}} />
                            :
                            <Image 
                                style={[styles.modalBackdropPoster,{width:'80%',marginLeft:'10%',backgroundColor:'#999',zIndex:-10}]} 
                                resizeMode='contain'  
                                source={require('../assets/images/no-image.png')} />
                        }
                        
                    </View>
                    <View style={s.movieDetailContainer}>
                        <Pressable onPress={()=>{
                            personData.homepage?Linking.openURL(personData.homepage):null
                        }}>
                            <View style={{marginVertical:5}}>  
                                <Text style={[styles.movieName]}>{personData.name}</Text>
                                {personData.tagline?
                                    <Text style={[styles.taglineText]}>{personData.tagline}</Text>
                                    :null    
                                }   
                            </View>
                        </Pressable>
                        <View style={{flexDirection:'column',flexWrap:'wrap'}}>
                        
                            {personData?.birthday? 
                                <View style={styles.movieTextContainer}>
                                    <Text style={styles.movieText}>Born: {months[Number(personData.birthday.slice(5,7))-1]} {personData.birthday.slice(8,10)}, {personData.birthday.slice(0,4)}</Text>
                                </View>
                                :null
                            }
                            {personData?.deathday? 
                                <View style={styles.movieTextContainer}>
                                    <Text style={styles.movieText}>Died: {months[Number(personData.deathday.slice(5,7))-1]} {personData.deathday.slice(8,10)}, {personData.deathday.slice(0,4)}</Text>
                                </View>
                                :null
                            }
                            {personData?.place_of_birth? 
                                <View style={styles.movieTextContainer}>
                                    <Text style={styles.movieText}>Place of Birth: {personData.place_of_birth}</Text>
                                </View>
                                :null
                            }
                            {personData?.known_for_department!==''? 
                                <View style={styles.movieTextContainer}>
                                    <Text style={styles.movieText}>Known for: {personData.known_for_department}</Text>
                                </View>
                                :null
                            }
                            {/* <View style={styles.movieTextContainer}>
                                <Text style={[styles.movieText]}>
                                    Budget: {personData.budget?'$'+convertMoney(personData.budget):'N/A'}
                                </Text>
                            </View>

                            <View style={styles.movieTextContainer}>
                                <Text style={[styles.movieText]}>
                                    Revenue: {personData.revenue?'$'+convertMoney(personData.revenue):'N/A'}
                                </Text>
                            </View> */}
                        </View>
                        
                        {/* <View style={styles.torrentSearchContainer}>
                            <TouchableHighlight onPress={()=>navigation.push('TorrentModal',{query:personData.title,type:'movie'})}>
                                <Text style={styles.torrentSearchButton}>Browse Torrents</Text>
                            </TouchableHighlight>
                        </View> */}

                        
                        <View style={styles.movieOverview}>
                            {/* <Text style={styles.heading_1}>About</Text> */}
                            <Text style={[styles.overviewText,styles.text]}>{personData?.biography ?personData.biography:"No information available"}</Text>
                        </View>   

                        {personData.images.profiles.length?
                            <View style={[{marginBottom:15}]}>
                                <FlatList  
                                    horizontal
                                    keyExtractor={(item)=>item.file_path}
                                    showsHorizontalScrollIndicator={false}
                                    data={personData.images.profiles}
                                    renderItem={({item,index})=>(
                                        <Ripple onPress={()=>{
                                            setImageIndex(index)
                                            setIsVisible(true)
                                            }}
                                            rippleColor={colors.rippleColor}
                                            >
                                            <View style={[styles.moviePosterContainer,s.movieImages,{marginHorizontal:8,borderRadius:10}]}>
                                                <Image 
                                                    style={[styles.moviePoster,{borderRadius:10}]}
                                                    source={{uri:IMAGE_PATH+item.file_path}} />
                                            </View>
                                        </Ripple>
                                    )}
                                />
                            </View>
                        :null}
                        
                        <PosterContainer
                            data={personData.movie_credits.cast}
                            title="Movies (Cast)"
                            loading={false}
                            navigation={navigation}
                            type="movie"
                        />


                        {personData?.movie_credits?.crew?.length>0?
                            <View style={[s.similarMovieContainer,s.imagesContainer]}>
                                <Text style={[styles.heading_1]}>Movies (Crew)</Text>
                                <FlatList  
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item)=>item.id.toString()+Math.round( Math.random() * 10000000 )}
                                    data={personData.movie_credits.crew}
                                    renderItem={({item})=>(
                                        <View style={styles.movieWholePosterContainer}>
                                            <TouchableOpacity onPress={()=>navigation.push('Modal',{screen:'MovieModal',params:{id:item.id,release_date:item.release_date,title:item.title},key: Math.round( Math.random() * 10000000 )})}>
                                                <View style={styles.moviePosterContainer}>
                                                        {item.poster_path ?
                                                            <Image resizeMode='cover' style={styles.moviePoster} source={{ uri: IMAGE_PATH + item.poster_path }}></Image>
                                                            :
                                                            <Image style={[styles.moviePoster, { width: '80%', marginLeft: '10%' }]} resizeMode='contain' source={require('../assets/images/no-image.png')} />
                                                        }
                                                </View>
                                            </TouchableOpacity>
                                            <View style={styles.posterDetail}>
                                                <Text ellipsizeMode={'tail'} numberOfLines={1} style={styles.posterTitle}>{item.title}</Text>
                                                {item.release_date?<Text style={styles.posterYear}>{months[Number(item.release_date.slice(5,7))-1]} {item.release_date.slice(8,10)}, {item.release_date.slice(0,4)}</Text>:null}
                                                {item.job?<Text ellipsizeMode={'tail'} numberOfLines={1} style={s.personJob}>{item.job}</Text>:null}
                                            </View>
                                        </View>
                                    )}
                                />
                            </View>
                        :null}
                        <PosterContainer
                            data={personData?.tv_credits?.cast}
                            title="TV Shows (Cast)"
                            loading={false}
                            navigation={navigation}
                            type="tv"
                        />
                        {personData?.tv_credits?.crew?.length>0?
                            <View style={[s.imagesContainer]}>
                                <Text style={[styles.heading_1]}>TV Shows (Crew)</Text>
                                <FlatList  
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item)=>item.id.toString()+Math.round( Math.random() * 10000000 )}
                                    data={personData.tv_credits.crew}
                                    renderItem={({item})=>(
                                        <View style={styles.movieWholePosterContainer}>    
                                            <TouchableOpacity onPress={()=>navigation.push('TvShowModal',{screen:'TvModal',params:{id:item.id,name:item.name,first_air_date:item.first_air_date},key: Math.round( Math.random() * 10000000 )})}>
                                                <View key={item.id} style={styles.moviePosterContainer}>
                                                    {item.poster_path ?
                                                        <Image resizeMode='cover' style={styles.moviePoster} source={{ uri: IMAGE_PATH + item.poster_path }}></Image>
                                                        :
                                                        <Image style={[styles.moviePoster, { width: '80%', marginLeft: '10%' }]} resizeMode='contain' source={require('../assets/images/no-image.png')} />
                                                    }
                                                </View>
                                            </TouchableOpacity>
                                            <View style={styles.posterDetail}>
                                                <Text ellipsizeMode={'tail'} numberOfLines={1} style={styles.posterTitle}>{item.name}</Text>
                                                {item.first_air_date?<Text style={styles.posterYear}>{months[Number(item.first_air_date.slice(5,7))-1]} {item.first_air_date.slice(8,10)}, {item.first_air_date.slice(0,4)}</Text>:null}
                                                {item.job?<Text ellipsizeMode={'tail'} numberOfLines={1} style={s.personJob}>{item.job}</Text>:null}
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
            }

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
        marginVertical:12,
        marginHorizontal:10
    },
    personJob:{
        fontFamily:'Nunito-SemiBold',
        fontSize:16,
        color:colors.lightWhite,
        marginTop:5
    }

})