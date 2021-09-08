import axios from 'axios';
import React,{useState,useEffect} from 'react';
import { Dimensions, View,Text, FlatList, TouchableOpacity,Image,StyleSheet,ActivityIndicator,Alert,Animated} from 'react-native';
import { colors, styles } from '../globalStyle';
import { API_KEY,IMAGE_PATH,months,URLs} from '../globalUtils';
import { MaterialIcons } from '@expo/vector-icons';
import {Picker} from '@react-native-picker/picker';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const loadingImages=[{id:0},{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7},{id:8},{id:9}]

export default function GenreModal({navigation,route}) {
    const [isRefreshing,setIsRefreshing]=useState(false)
    const [movieData,setMovieData]=useState([])
    const [filterValue,setFilterValue]=useState('popularity.desc')
    const [isLoading,setIsLoading]=useState(true)
    const [pages,setPages]=useState(0)
    const opacity=new Animated.Value(0.7)
    const [onEndReachedCalledDuringMomentum,setOnEndReachedCalledDuringMomentum]=useState(false)

    useEffect(() => {
        setMovieData([])
        fadeIn()
        getMovies(1)
        setIsLoading(true)
    }, [filterValue])

    const {type,genreId,genreName}=route.params
    const getMovies=async(page)=>{
        try {
            let response=await axios.get(`${URLs[23]}${type}?api_key=${API_KEY}&page=${page}&language=en-US&sort_by=${filterValue}&with_genres=${genreId}`)
            setIsRefreshing(false)
            setPages(response.data.total_pages)
            setMovieData((prev)=>{
                return [...prev,...response.data.results]
            })
            setIsLoading(false)
        } catch (error) {
            // Alert.alert('Oops...','Something went wrong',[{text:"Go back",onPress:()=>navigation.goBack()}])
        }
    }
    const fadeIn=()=>{
        Animated.timing(opacity,{
            toValue:1,
            duration:800,
            useNativeDriver:true
        }).start(()=>isLoading?fadeOut():null)
    }
    const fadeOut=()=>{
        Animated.timing(opacity,{
            toValue:0.7,
            duration:800,
            useNativeDriver:true
        }).start(()=>isLoading?fadeIn():null)
    }

    const Footer=()=>{
        return isRefreshing?
            <ActivityIndicator size='large' color={colors.mainBlue} />
            :null
    }
    return(
        <View style={[styles.container,{width:'100%',position:'relative',backgroundColor:colors.mainBlackColor}]} >
            <View style={[s.movieModalHeader]}>
                <View style={s.genreHeader} >
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={22} color={colors.lightWhite} /> 
                    </TouchableOpacity>
                    <Text ellipsizeMode={'tail'} numberOfLines={1} style={s.movieModalHeaderText}>{genreName}</Text>
                </View>
                <View style={s.genreFilter}>
                    <Picker
                        selectedValue={filterValue}
                        style={{ height: 50, width: 150,color:colors.lightWhite,fontSize:18}}
                        onValueChange={(itemValue, itemIndex) => setFilterValue(itemValue)}
                        mode='dropdown'
                        dropdownIconColor={colors.lightWhite}
                    >
                        <Picker.Item color={colors.mainBlackColor} label="Popular" value="popularity.desc" />
                        <Picker.Item color={colors.mainBlackColor} label="Release Date" value="release_date.desc" />
                        <Picker.Item color={colors.mainBlackColor} label="Rating (10-0)" value="vote_average.desc" />
                        <Picker.Item color={colors.mainBlackColor} label="Rating (0-10)" value="vote_average.asc" />
                        <Picker.Item color={colors.mainBlackColor} label="Revenue" value="revenue.desc" />
                    </Picker>
                </View>
            </View>

            {isLoading?
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
                    <FlatList  
                        data={movieData}
                        horizontal={false}
                        keyExtractor={(item)=>item.id.toString()}
                        contentContainerStyle={{alignItems:'center'}}
                        renderItem={({item})=>(
                            <View style={[s.movieWholePosterContainer]}>
                                <TouchableOpacity onPress={()=> type==='movie'?navigation.push('Modal',{screen:'MovieModal',params:{id:item.id,release_date:item.release_date,title:item.title},key: Math.round( Math.random() * 10000000 )})
                                        :navigation.push('TvShowModal',{screen:'TvModal',params:{id:item.id,name:item.name,first_air_date:item.first_air_date},key: Math.round( Math.random() * 10000000 )})} 
                                        >
                                    <View style={s.moviePosterContainer}>
                                        {item.poster_path?
                                            <Image style={s.moviePoster} source={{uri:IMAGE_PATH+item.poster_path}} />
                                            :
                                            <Image style={[styles.moviePoster,{width:'80%',marginLeft:'10%'}]} resizeMode='contain'  source={require('../assets/images/no-image.png')} />
                                        }
                                    </View>
                                </TouchableOpacity>
                                {type==='movie'?
                                    (<View style={s.posterDetail}>
                                        <Text ellipsizeMode={'tail'} numberOfLines={1} style={styles.posterTitle}>{item.title}</Text>
                                        {item.release_date?<Text style={styles.posterYear}>{months[Number(item.release_date.slice(5,7))-1]} {item.release_date.slice(8,10)}, {item.release_date.slice(0,4)}</Text> :null}
                                    </View>)
                                    :
                                    (<View style={styles.posterDetail}>
                                        <Text ellipsizeMode={'tail'} numberOfLines={1} style={styles.posterTitle}>{item.name}</Text>
                                        {item.first_air_date?<Text style={styles.posterYear}>{months[Number(item.first_air_date.slice(5,7))-1]} {item.first_air_date.slice(8,10)}, {item.first_air_date.slice(0,4)}</Text>:<Text style={styles.posterYear}>N/A</Text>}
                                    </View>)
                                }
                            </View>
                        )}
                        ListFooterComponent={()=>(
                            ((movieData.length / 20) + 1)<pages?<ActivityIndicator size='large' color={colors.mainBlue} />:null
                        )}
                        onEndReached={({distanceFromEnd})=>{
                            // distanceFromEnd<0 
                            if(!onEndReachedCalledDuringMomentum &&  ((movieData.length/20)+1)<pages  ){
                                setIsRefreshing(true)
                                getMovies(movieData.length/20+1)
                            }
                        }}
                        onMomentumScrollBegin = {() => {setOnEndReachedCalledDuringMomentum(false)}}
                        onEndReachedThreshold={0.1}
                        numColumns={2}
                    />
                    {/* <Footer  /> */}
                    
                </View>
                }
        </View>
    )
}

const s=StyleSheet.create({
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
        flexDirection:'row',
        alignItems:'center'
    },
    genreFilter:{

    },
    movieWholePosterContainer:{
        width:(42*windowWidth)/100,
        position:'relative',
        marginBottom:20,
        marginTop:8,
        marginHorizontal:(3*windowWidth)/100
    },
    posterDetail:{
        marginVertical:8,
    },
    posterTitle:{
        color:colors.lightWhite,
        fontFamily:'Nunito-SemiBold',
        fontSize:16,
    },
    posterYear:{
        color:colors.lightGray,
        fontFamily:'Nunito-Regular',
        fontSize:14
    },

})