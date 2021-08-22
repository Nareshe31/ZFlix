import React,{useState,useEffect} from 'react';
import {Dimensions, View,Text,StyleSheet,TouchableOpacity,FlatList,ActivityIndicator,Alert,Image,Animated} from 'react-native'
import {styles,colors} from '../globalStyle'
import { MaterialIcons } from '@expo/vector-icons';
import { API_KEY,IMAGE_PATH,months,URLs} from '../globalUtils';
import axios from 'axios';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const loadingImages=[{id:0},{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7},{id:8},{id:9}]

function Movie({navigation,item}) {
    return(
    <View style={s.movieWholePosterContainer}>
        <TouchableOpacity onPress={()=> navigation.push('Modal',{screen:'MovieModal',params:{id:item.id},key: Math.round( Math.random() * 10000000 )})} >
            <View style={s.moviePosterContainer}>
                {item.poster_path?
                    <Image style={s.moviePoster}  source={{uri:IMAGE_PATH+item.poster_path}} />
                    :
                    <Image style={[s.moviePoster,{width:'80%',marginLeft:'10%'}]} resizeMode='contain'  source={require('../assets/images/no-image.png')} />
                }
            </View>
        </TouchableOpacity>
        <View style={styles.posterDetail}>
            <Text ellipsizeMode={'tail'} numberOfLines={1} style={styles.posterTitle}>{item.title}</Text>
            {item.release_date?<Text style={styles.posterYear}>{months[Number(item.release_date.slice(5,7))-1]} {item.release_date.slice(8,10)}, {item.release_date.slice(0,4)} </Text>:null}
        </View>
    </View>
    )
}

function TvShow({navigation,item}) {
    return(
    <View style={s.movieWholePosterContainer}>
        <TouchableOpacity onPress={()=> navigation.push('TvShowModal',{screen:'TvModal',params:{id:item.id},key: Math.round( Math.random() * 10000000 )})} >
            <View style={s.moviePosterContainer}>
                {item.poster_path?
                    <Image style={s.moviePoster}  source={{uri:IMAGE_PATH+item.poster_path}} />
                    :
                    <Image style={[s.moviePoster,{width:'80%',marginLeft:'10%'}]} resizeMode='contain'  source={require('../assets/images/no-image.png')} />
                }
            </View>
        </TouchableOpacity>
        <View style={styles.posterDetail}>
            <Text ellipsizeMode={'tail'} numberOfLines={1} style={styles.posterTitle}>{item.name}</Text>
            <View style={styles.tv}>
                {item.first_air_date?<Text style={styles.posterYear}>{months[Number(item.first_air_date.slice(5,7))-1]} {item.first_air_date.slice(8,10)}, {item.first_air_date.slice(0,4)}</Text>:<Text style={styles.posterYear}>N/A</Text>}
                <Text style={styles.tvBox}>TV</Text>
            </View>
        </View>
    </View>
    )
}

function Person({navigation,item}) {
    return(
        <View style={s.movieWholePosterContainer}> 
            <View key={item.id} style={[s.moviePosterContainer]}>
                {item.profile_path?
                    <Image resizeMode='cover' style={[s.moviePoster]} source={{uri:IMAGE_PATH+item.profile_path}}></Image>
                    :
                    <Image style={[s.moviePoster,{width:'80%',marginLeft:'10%'}]} resizeMode='contain'  source={require('../assets/images/no-image.png')} />
                }
                
            </View>
            <View style={styles.posterDetail}>
                <Text ellipsizeMode={'tail'} numberOfLines={1} style={styles.posterTitle}>{item.name}</Text>
                {item.known_for_department?<Text style={styles.posterYear}>{item.known_for_department}</Text>:null}
            </View>
        </View>
    )
    
}

export default function SearchResult({navigation,route}) {
    const [searchResults,setSearchResults]=useState([])
    const [isSearchLoading,setIsSearchLoading]=useState(true)
    const [isRefreshing,setIsRefreshing]=useState(false)
    const [pages,setPages]=useState(0)
    const opacity=new Animated.Value(0.7)
    const [onEndReachedCalledDuringMomentum,setOnEndReachedCalledDuringMomentum]=useState(false)

    useEffect(() => {
        search(1)
    }, [])

    const search=async(page)=>{
        try {
            let response=await axios.get(`${URLs[22]}${route.params.searchQuery}&api_key=${API_KEY}&page=${page}`)
            setSearchResults((prev)=>[...prev,...response.data.results])
            setPages(response.data.total_pages)
            setIsSearchLoading(false)
            setIsRefreshing(false)
        } catch (error) {
            // Alert.alert('Oops...','Something went wrong',[{text:"Go back",onPress:()=>navigation.goBack()}])
        }
    }

    const fadeIn=()=>{
        Animated.timing(opacity,{
            toValue:1,
            duration:800,
            useNativeDriver:true
        }).start(()=>isSearchLoading?fadeOut():null)
    }
    const fadeOut=()=>{
        Animated.timing(opacity,{
            toValue:0.7,
            duration:800,
            useNativeDriver:true
        }).start(()=>isSearchLoading?fadeIn():null)
    }

    return(
        <View style={[styles.container,{width:'100%',position:'relative',backgroundColor:colors.mainBlackColor}]}>
            <View style={[s.movieModalHeader]}>
                <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={()=>navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={22} color={colors.lightWhite} /> 
                    <Text ellipsizeMode={'tail'} numberOfLines={1} style={[s.movieModalHeaderText]}>Search results for "{route.params.searchQuery}"</Text>
                </TouchableOpacity>
            </View>
            {isSearchLoading?
                <View style={[styles.pageLoader,{backgroundColor:colors.mainBlackColor}]}>
                    <FlatList  
                        data={loadingImages}
                        horizontal={false}
                        keyExtractor={(item)=>item.id.toString()}
                        contentContainerStyle={{alignItems:'center'}}
                        renderItem={({item})=>(
                            <View style={s.movieWholePosterContainer}>
                                <Animated.View style={[s.moviePosterContainer,{opacity}]}>
                                    <View style={s.moviePoster} ></View>
                                </Animated.View>
                                <View style={styles.posterDetail}>
                                    <Animated.View style={{opacity,width:(33*windowWidth)/100,backgroundColor:colors.loadingColor,marginVertical:6,borderRadius:10,padding:5}}></Animated.View>
                                    <Animated.View style={{opacity,width:(25*windowWidth)/100,backgroundColor:colors.loadingColor,padding:5,borderRadius:10}}></Animated.View>
                                </View>
                            </View>
                        )}
                        numColumns={2}
                    />
                </View>
                :
                <View style={[styles.container,{backgroundColor:colors.mainBlackColor}]}>
                    {searchResults.length==0?
                        <View style={styles.noResultContainer}>
                            <Text style={styles.noResultText}>No results found</Text>
                        </View>
                        :
                        <View style={[styles.container,{backgroundColor:colors.mainBlackColor}]}>
                            <FlatList  
                                data={searchResults}
                                keyExtractor={(item)=>item.id.toString()}
                                contentContainerStyle={{alignItems:'center'}}
                                renderItem={({item})=>(
                                        item.media_type==='movie'?<Movie navigation={navigation} item={item} />:
                                            (item.media_type==='tv'?
                                                <TvShow navigation={navigation} item={item}  />
                                                :
                                                <Person navigation={navigation} item={item} />
                                            ))
                                }
                                ListFooterComponent={()=>(
                                    ((searchResults.length / 20) + 1)<pages?<ActivityIndicator size='large' color={colors.mainBlue} />:null
                                )}
                                onEndReached={()=>{
                                    if(!onEndReachedCalledDuringMomentum && ((searchResults.length/20)+1)<pages ){
                                        setIsRefreshing(true)
                                        search((searchResults.length/20)+1)
                                    }
                                }}
                                onEndReachedThreshold={0.25}
                                onMomentumScrollBegin = {() => {setOnEndReachedCalledDuringMomentum(false)}}
                                numColumns={2}
                            />
                            {/* {isRefreshing?
                                <ActivityIndicator size='large' color={colors.mainBlue} />
                                :null} */}
                        </View>
                    }
                </View>
            }
        </View>
    )
}

const s=StyleSheet.create({
    movieModalHeader:{
        backgroundColor:colors.mainBlackColor,
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:10,
        paddingVertical:15
    },
    movieModalHeaderText:{
        fontSize:20,
        color:colors.lightWhite,
        marginLeft:8,
        fontFamily:'Nunito-SemiBold'
    },
    movieWholePosterContainer:{
        width:(42*windowWidth)/100,
        position:'relative',
        marginVertical:10,
        marginHorizontal:(3*windowWidth)/100
    },
    moviePoster:{
        width:'100%',
        height:(28*windowHeight)/100,
        borderRadius:10,
    },
    moviePosterContainer:{
        width:'100%',
        position:'relative',
        borderRadius:10,
        backgroundColor:colors.loadingColor
    },
    movieModalHeader:{
        backgroundColor:colors.mainBlackColor,
        flexDirection:'row',
        paddingHorizontal:10,
        paddingVertical:5,
        width:'100%',
        justifyContent:'space-between'
    },
})
