import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Dimensions, View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert,Animated } from 'react-native';
import { colors, styles } from '../globalStyle';
import { API_KEY, IMAGE_PATH, months, URLs } from '../globalUtils';
import { MaterialIcons } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const movieIds = [6, 7, 8]
const tvIds = [9, 10, 11]

const loadingImages=[{id:0},{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7},{id:8},{id:9}]

export default function SeeAllModal({ navigation, route }) {
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [movieData, setMovieData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [pages, setPages] = useState(0)
    const [onEndReachedCalledDuringMomentum,setOnEndReachedCalledDuringMomentum]=useState(false)
    const { id, title } = route.params
    const opacity=new Animated.Value(0.7)

    useEffect(() => {
        setMovieData([])
        fadeIn()
        getMovies(1)
    }, [])

    const fadeIn=()=>{
        Animated.timing(opacity,{
            toValue:1,
            duration:800,
            useNativeDriver:true
        }).start(()=>fadeOut())
    }
    const fadeOut=()=>{
        Animated.timing(opacity,{
            toValue:0.7,
            duration:800,
            useNativeDriver:true
        }).start(()=>fadeIn())
    }

    const getMovies = async (page) => {
        try {
            let response = await axios.get(`${URLs[id]}&page=${page}`)
            setMovieData((prev) => [...prev, ...response.data.results])
            setIsRefreshing(false)
            setPages(response.data.total_pages)
            setIsLoading(false)
        } catch (error) {
            // Alert.alert('Oops...', 'Something went wrong', [{ text: "Go back", onPress: () => navigation.goBack() }])
        }
    }
    return (
        <View style={[styles.container, { width: '100%', position: 'relative', backgroundColor: colors.mainBlackColor }]} >
            <View style={[s.movieModalHeader]}>
                <View style={s.genreHeader} >
                    <TouchableOpacity style={{ justifyContent: 'center',paddingLeft:0}} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={22} color={colors.lightWhite} />
                    </TouchableOpacity>
                    <Text ellipsizeMode={'tail'} numberOfLines={1} style={s.movieModalHeaderText}>{title}</Text>
                </View>
            </View>

            {isLoading ?
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
                <View style={[styles.container, { backgroundColor: colors.mainBlackColor }]}>
                    <FlatList
                        data={movieData}
                        horizontal={false}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={{ alignItems: 'center' }}
                        initialNumToRender={5}
                        renderItem={({ item }) => (
                            <View style={[s.movieWholePosterContainer]}>
                                <TouchableOpacity 
                                    onPress={() => (item.media_type === 'movie' || movieIds.includes(id)) ? 
                                                    navigation.push('Modal', { screen: 'MovieModal', params: { id: item.id ,release_date:item.release_date,title:item.title}, key: Math.round(Math.random() * 10000000) }) 
                                                    : 
                                                    (item.media_type === 'tv' || tvIds.includes(id)?
                                                        navigation.push('TvShowModal', { screen: 'TvModal', params: { id: item.id,name:item.name,first_air_date:item.first_air_date }, key: Math.round(Math.random() * 10000000) })
                                                        :
                                                        navigation.push('PersonModal',{screen:'PersonScreen',params:{id:item.id,name:item.name},key: Math.round( Math.random() * 10000000 )}))
                                                }>
                                    <View style={s.moviePosterContainer}>
                                            {item.profile_path || item.poster_path?
                                                <Image resizeMode='cover' style={s.moviePoster} source={{ uri: IMAGE_PATH + (item.media_type=='person'?item.profile_path: item.poster_path) }} />
                                                :
                                                <Image style={[s.moviePoster,{width:'80%',marginLeft:'10%'}]} resizeMode='contain'  source={require('../assets/images/no-image.png')} />
                                            }
                                    </View>
                                </TouchableOpacity>
                                {
                                    item.media_type === 'movie' || movieIds.includes(id) ?
                                        (<View style={s.posterDetail}>
                                            <Text ellipsizeMode={'tail'} numberOfLines={1} style={styles.posterTitle}>{item.title}</Text>
                                            {item.release_date ? <Text style={styles.posterYear}>{months[Number(item.release_date.slice(5, 7)) - 1]} {item.release_date.slice(8, 10)}, {item.release_date.slice(0, 4)}</Text> : null}
                                        </View>)
                                        :
                                        item.media_type === 'tv' || tvIds.includes(id)?
                                            (<View style={styles.posterDetail}>
                                                <Text ellipsizeMode={'tail'} numberOfLines={1} style={styles.posterTitle}>{item.name}</Text>
                                                {item.first_air_date ? <Text style={styles.posterYear}>{months[Number(item.first_air_date.slice(5, 7)) - 1]} {item.first_air_date.slice(8, 10)}, {item.first_air_date.slice(0, 4)}</Text> : <Text style={styles.posterYear}>N/A</Text>}
                                            </View>)
                                            :
                                            <View style={styles.posterDetail}>
                                                <Text ellipsizeMode={'tail'} numberOfLines={1} style={styles.posterTitle}>{item.name}</Text>
                                                {item.known_for_department?<Text style={styles.posterYear}>{item.known_for_department}</Text>:null}
                                            </View>
                                }
                            </View>
                        )}
                        ListFooterComponent={()=>(
                            ((movieData.length / 20) + 1)<pages?<ActivityIndicator size='large' color={colors.mainBlue} />:null
                        )}
                        onEndReached={() => {
                            if ( !onEndReachedCalledDuringMomentum && movieData.length >= 20 && ((movieData.length / 20) + 1) <= pages) {
                                setIsRefreshing(true)
                                setOnEndReachedCalledDuringMomentum(true)
                                getMovies(movieData.length / 20 + 1)
                            }
                        }}
                        onMomentumScrollBegin = {() => {setOnEndReachedCalledDuringMomentum(false)}}
                        onEndReachedThreshold={0.25}
                        numColumns={2}
                    />
                    {/* {isRefreshing ?
                        <ActivityIndicator size='large' color={colors.mainBlue} />
                        : null} */}
                </View>
            }
        </View>
    )
}

const s = StyleSheet.create({
    moviePoster: {
        width: '100%',
        height: (23*windowHeight)/100,
        borderRadius: 10,
        minHeight:140,
        maxHeight:200
    },
    moviePosterContainer: {
        width: '100%',
        position: 'relative',
        borderRadius: 10,
        backgroundColor: colors.loadingColor
    },
    movieModalHeader: {
        backgroundColor: colors.mainBlackColor,
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 10,
        width: '100%',
        justifyContent: 'space-between'
    },
    movieModalHeaderText: {
        fontSize: 20,
        color: colors.lightWhite,
        marginLeft: 8,
        marginTop: 1,
    },
    genreHeader: {
        maxWidth: 250,
        flexDirection: 'row',
        alignItems:'center'
    },
    genreFilter: {

    },
    movieWholePosterContainer: {
        width: (38 * windowWidth) / 100,
        position: 'relative',
        marginBottom: 20,
        marginTop:8,
        marginHorizontal: (4 * windowWidth) / 100,
        minWidth:120,
        maxWidth:220
    },
    posterDetail: {
        marginVertical: 8,
    },
    posterTitle: {
        color: colors.lightWhite,
        fontFamily: 'Nunito-SemiBold',
        fontSize: 18,
    },
    posterYear: {
        color: colors.lightGray,
        fontFamily: 'Nunito-Regular',
        fontSize: 14
    },

})