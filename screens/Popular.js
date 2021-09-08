import React, { useEffect, useState } from 'react'
import { BackHandler, Dimensions, View, Text, StyleSheet, ScrollView, Image, FlatList, Animated, RefreshControl, Alert, SafeAreaView, TouchableOpacity } from 'react-native'
import { styles, colors } from "../globalStyle";
import CustomHeader from './CustomHeader'
import axios from 'axios'
import { months, API_KEY, IMAGE_PATH } from '../globalUtils';
import { MaterialIcons } from '@expo/vector-icons';

const loadingImages = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }]
const windowWidth = Dimensions.get('window').width;

function ContainerLoading() {
    const opacity = new Animated.Value(0.7)
    useEffect(() => {
        fadeIn()
    }, [])
    const fadeIn = () => {
        Animated.timing(opacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true
        }).start(() => fadeOut())
    }
    const fadeOut = () => {
        Animated.timing(opacity, {
            toValue: 0.7,
            duration: 800,
            useNativeDriver: true
        }).start(() => fadeIn())
    }
    return (
        <View style={styles.posterSlideShowContainer}>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={loadingImages}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={[styles.movieWholePosterContainer]}>
                        <Animated.View key={item.id} style={[styles.moviePosterContainer, { opacity: opacity }]}>
                            <View style={[styles.moviePoster,{justifyContent:'center',alignItems:'center'}]} >
                                {/* <Image style={{width:120,height:120}} resizeMode='stretch' source={require('../assets/images/load.png')} /> */}
                            </View>
                        </Animated.View>
                        <View style={styles.posterDetail}>
                            <Animated.View style={{ width: (33 * windowWidth) / 100, backgroundColor: colors.loadingColor, marginVertical: 6, borderRadius: 10, padding: 5, opacity }}></Animated.View>
                            <Animated.View style={{ width: (25 * windowWidth) / 100, backgroundColor: colors.loadingColor, padding: 5, borderRadius: 10, opacity }}></Animated.View>
                        </View>
                    </View>
                )} />
        </View>
    )
}

export default function PopularScreen({ navigation }) {
    const [refreshing, setRefreshing] = useState(false)
    const [isMovieLoading, setIsMovieLoading] = useState(true)
    const [isTvShowLoading, setIsTvShowLoading] = useState(true)
    const [isPersonLoading, setIsPersonLoading] = useState(true)
    const [movie, setMovie] = useState([])
    const [tvShow, setTvShow] = useState([])
    const [person, setPerson] = useState([])
    const [filter, setFilter] = useState('week')

    useEffect(() => {
        getAllData()
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
        return () => {
            backHandler.remove()
        }
    }, [filter])
    

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
    const getAllData = async () => {
        setIsMovieLoading(true)
        await getPopularMovies()
        setIsTvShowLoading(true)
        await getPopularTvShows()
        setIsPersonLoading(true)
        await getPopularPersons()
        setRefreshing(false)
    }

    const getPopularMovies = async () => {
        try {
            let response = await axios.get(`https://api.themoviedb.org/3/trending/movie/${filter}?api_key=${API_KEY}`)
            setMovie(response.data.results)
            setIsMovieLoading(false)
        } catch (error) {
            // Alert.alert('Oops...','Something went wrong',[{text:"Ok"}])
        }
    }

    const getPopularTvShows = async () => {
        try {
            let response = await axios.get(`https://api.themoviedb.org/3/trending/tv/${filter}?api_key=${API_KEY}`)
            setTvShow(response.data.results)
            setIsTvShowLoading(false)
        } catch (error) {
            // Alert.alert('Oops...','Something went wrong',[{text:"Ok"}])
        }
    }

    const getPopularPersons = async () => {
        try {
            let response = await axios.get(`https://api.themoviedb.org/3/trending/person/${filter}?api_key=${API_KEY}`)
            setPerson(response.data.results)
            setIsPersonLoading(false)
        } catch (error) {
            // Alert.alert('Oops...','Something went wrong',[{text:"Ok"}])
        }
    }
    const changeFilter = () => {
        setFilter((prev) => prev == 'week' ? 'day' : 'week')
    }
    return (
        <View style={[styles.container]}>
            <CustomHeader navigation={navigation} />
            <ScrollView
                style={[styles.container]}
                contentContainerStyle={{ paddingBottom: 40 }}
                refreshControl={<RefreshControl onRefresh={changeFilter} refreshing={refreshing} />}>

                <View style={styles.popularContainer}>
                    <View style={styles.popularHeaderContainer}>
                        <Text style={styles.popularHeaderText}>Trending Movies</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SeeAllModal', { id: filter === 'week' ? 0 : 1, title: "Trending Movies" })}>
                            <MaterialIcons style={{ marginRight: 10, paddingLeft: 15 }} name="keyboard-arrow-right" size={24} color={colors.lightWhite} />
                        </TouchableOpacity>
                    </View>

                    {isMovieLoading ?
                        <ContainerLoading />
                        :

                        <SafeAreaView style={{ flex: 1 }} style={styles.posterSlideShowContainer}>

                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={movie}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <View style={styles.movieWholePosterContainer}>
                                        <TouchableOpacity onPress={() => navigation.push('Modal', { screen: 'MovieModal', params: { id: item.id ,release_date:item.release_date,title:item.title}, key: Math.round(Math.random() * 10000000) })}>
                                            <View key={item.id} style={styles.moviePosterContainer}>
                                                {item.poster_path ?
                                                    <Image resizeMode='cover' style={styles.moviePoster} source={{ uri: IMAGE_PATH + item.poster_path }}></Image>
                                                    :
                                                    <Image style={[styles.moviePoster, { width: '80%', marginLeft: '10%' }]} resizeMode='contain' source={require('../assets/images/no-image.png')} />
                                                }
                                            </View>
                                        </TouchableOpacity>
                                        <View style={styles.posterDetail}>
                                            <Text ellipsizeMode={'tail'} numberOfLines={1} style={styles.posterTitle}>{item.title}</Text>
                                            {item.release_date ? <Text style={styles.posterYear}>{months[Number(item.release_date.slice(5, 7)) - 1]} {item.release_date.slice(8, 10)}, {item.release_date.slice(0, 4)}</Text> : null}
                                        </View>
                                    </View>
                                )} />

                        </SafeAreaView>
                    }
                </View>

                <View style={styles.popularContainer}>
                    <View style={styles.popularHeaderContainer}>
                        <Text style={styles.popularHeaderText}>Trending Shows</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SeeAllModal', { id: filter === 'week' ? 2 : 3, title: "Trending Shows" })}>
                            <MaterialIcons style={{ marginRight: 10, paddingLeft: 15 }} name="keyboard-arrow-right" size={24} color={colors.lightWhite} />
                        </TouchableOpacity>
                    </View>
                    {isTvShowLoading ?
                        <ContainerLoading />
                        :
                        <SafeAreaView style={styles.posterSlideShowContainer}>
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={tvShow}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <View style={styles.movieWholePosterContainer}>
                                        <TouchableOpacity onPress={() => navigation.push('TvShowModal', { screen: 'TvModal', params: { id: item.id ,name:item.name,first_air_date:item.first_air_date}, key: Math.round(Math.random() * 10000000) })}>
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
                                            {item.first_air_date ? <Text style={styles.posterYear}>{months[Number(item.first_air_date.slice(5, 7)) - 1]} {item.first_air_date.slice(8, 10)}, {item.first_air_date.slice(0, 4)}</Text> : null}
                                        </View>
                                    </View>
                                )} />
                        </SafeAreaView>
                    }

                </View>

                <View style={styles.popularContainer}>
                    <View style={styles.popularHeaderContainer}>
                        <Text style={styles.popularHeaderText}>Trending Persons</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SeeAllModal', { id: filter === 'week' ? 4 : 5, title: "Trending Persons" })}>
                            <MaterialIcons style={{ marginRight: 10, paddingLeft: 15 }} name="keyboard-arrow-right" size={24} color={colors.lightWhite} />
                        </TouchableOpacity>
                    </View>
                    {isPersonLoading ?
                        <ContainerLoading />
                        :
                        <SafeAreaView style={styles.posterSlideShowContainer}>
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={person}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) =>
                                (
                                    <View style={styles.movieWholePosterContainer}>
                                        <TouchableOpacity onPress={()=>navigation.push('PersonModal',{screen:'PersonScreen',params:{id:item.id,name:item.name},key: Math.round( Math.random() * 10000000 )})}>
                                            <View key={item.id} style={[styles.moviePosterContainer]}>
                                                {item.profile_path ?
                                                    <Image resizeMode='cover' style={[styles.moviePoster]} source={{ uri: IMAGE_PATH + item.profile_path }}></Image>
                                                    :
                                                    <Image style={[styles.moviePoster, { width: '80%', marginLeft: '10%' }]} resizeMode='contain' source={require('../assets/images/no-image.png')} />
                                                }

                                            </View>
                                        </TouchableOpacity>
                                        <View style={styles.posterDetail}>
                                            <Text ellipsizeMode={'tail'} numberOfLines={1} style={styles.posterTitle}>{item.name}</Text>
                                            {item.known_for_department ? <Text style={styles.posterYear}>{item.known_for_department}</Text> : null}
                                        </View>
                                    </View>
                                )

                                } />
                        </SafeAreaView>
                    }

                </View>

            </ScrollView>
        </View>
    )
}
