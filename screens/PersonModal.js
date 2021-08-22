import axios from 'axios'
import React,{useEffect,useState} from 'react'
import { View,Text,ScrollView,ActivityIndicator,Image,StyleSheet,Linking,Alert,Pressable, FlatList, SafeAreaView, TouchableOpacity, Button, TouchableHighlight} from 'react-native'
import { styles, colors } from "../globalStyle"
import { MaterialIcons,Ionicons } from '@expo/vector-icons';
import ImageView from "react-native-image-viewing";
import { IMAGE_PATH,months,getHour,getMinute,convertMoney } from '../globalUtils';


export default function PersonModal({navigation,route}) {
    const [isLoading,setIsLoading]=useState(true)
    const [personData,setPersonData]=useState({})
    const [visible, setIsVisible] = useState(false);
    const [images,setImages]=useState([])
    const [imageIndex,setImageIndex]=useState(0)
    useEffect(() => {
        
        getMovieInfo()
    }, [route])
    const getMovieInfo=async()=>{
        try {
            setIsLoading(true)
            var images=[]
            setPersonData(response.data)
            response.data.images.profiles.map(item=>{
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
        <View style={[styles.container],{position:'relative',backgroundColor:colors.mainBlackColor}}>   
            <View style={[styles.movieModalHeader]}>
                <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={()=>navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={22} color={colors.lightWhite} /> 
                    <Text ellipsizeMode={'middle'} numberOfLines={1} style={styles.movieModalHeaderText}>{personData.name} </Text>
                </TouchableOpacity>
            </View>
            
            <ScrollView style={[styles.container],{backgroundColor:'hsl(0,5%,8%)'}}>
                
                <View style={styles.modalPosterContainer}>
                    <Image
                        opacity={0.75}
                        style={styles.modalBackdropPoster}
                        resizeMode={'cover'}
                        source={{uri:IMAGE_PATH+personData.profile_path}}
                    />
                    <Image 
                        resizeMode={'cover'}
                        source={{uri:IMAGE_PATH+personData.profile_path}}
                        style={styles.modalPoster}
                    />
                </View>
                <View style={s.movieDetailContainer}>
                    <Pressable onPress={()=>{
                        personData.homepage?Linking.openURL(personData.homepage):null
                    }}>
                        <View style={{marginVertical:5}}>            
                            {personData.tagline?
                                <Text style={[styles.taglineText]}>{personData.tagline}</Text>
                                :null    
                            }   
                        </View>
                    </Pressable>
                    <View style={{flexDirection:'column',flexWrap:'wrap'}}>
                        {/* <View style={styles.movieTextContainer}>
                            <Text style={[styles.movieText]}>
                                Runtime: {personData.runtime?getHour(personData.runtime)+'hr ' + (getMinute(personData.runtime)?getMinute(personData.runtime)+' min' :'') :'N/A'}
                            </Text>
                        </View>

                        <View style={styles.movieTextContainer}>
                            <Text style={[styles.movieText]}>
                                Languages: 
                                    {personData.spoken_languages.map((item,index)=>(<Text key={item.name} style={styles.movieText}> {item.english_name}{index!==personData.spoken_languages.length-1?',':null}</Text>))}
                            </Text>
                        </View>

                        <View style={styles.movieTextContainer}>
                            <Text style={[styles.movieText]}>
                                Status: {personData.status}
                            </Text>
                        </View> */}
                        {personData.birthday!==''? 
                            <View style={styles.movieTextContainer}>
                                <Text style={styles.movieText}>Born: {months[Number(personData.birthday.slice(5,7))-1]} {personData.birthday.slice(8,10)}, {personData.birthday.slice(0,4)}</Text>
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
                        <Text style={styles.heading_1}>About</Text>
                        <Text style={[styles.overviewText,styles.text]}>{personData.biography}</Text>
                    </View>
                            
                    <View style={[{marginBottom:15}]}>
                        {/* {personData.images.backdrops.length>1?<Text style={[styles.heading_1]}>Images</Text>:null} */}
                        <FlatList  
                            horizontal
                            keyExtractor={(item)=>item.file_path}
                            showsHorizontalScrollIndicator={false}
                            data={personData.images.profiles}
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
                    
                    {personData.movie_credits.cast.length>0?
                        <View style={[s.similarMovieContainer,s.imagesContainer]}>
                            <Text style={[styles.heading_1]}>Movies</Text>
                            <FlatList  
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item)=>item.id.toString()}
                                data={personData.movie_credits.cast}
                                renderItem={({item})=>(
                                    <View style={styles.movieWholePosterContainer}>
                                        <TouchableOpacity onPress={()=>navigation.push('Modal',{screen:'MovieModal',params:{id:item.id},key: Math.round( Math.random() * 10000000 )})}>
                                            <View style={styles.moviePosterContainer}>
                                                <Image 
                                                    style={styles.moviePoster}
                                                    resizeMode='cover'
                                                    source={{uri:IMAGE_PATH+item.poster_path}} />
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
                    {personData.tv_credits.cast.length>0?
                        <View style={[s.imagesContainer]}>
                            <Text style={[styles.heading_1]}>TV Shows</Text>
                            <FlatList  
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item)=>item.id.toString()}
                                data={personData.tv_credits.cast}
                                renderItem={({item})=>(
                                    <View style={styles.movieWholePosterContainer}>    
                                        <TouchableOpacity onPress={()=>navigation.push('TvShowModal',{screen:'TvModal',params:{id:item.id},key: Math.round( Math.random() * 10000000 )})}>
                                            <View key={item.id} style={styles.moviePosterContainer}>
                                                <Image resizeMode='cover' style={styles.moviePoster} source={{uri:IMAGE_PATH+item.poster_path}}></Image>
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