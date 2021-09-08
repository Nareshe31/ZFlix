import React, { useEffect, useState } from 'react';
import { BackHandler,Dimensions, View, Text, ScrollView, FlatList, Image, StyleSheet, SafeAreaView, RefreshControl, TouchableOpacity, Animated, Alert } from 'react-native'
import { styles, colors } from "../globalStyle";
import CustomHeader from './CustomHeader';
import { months,URLs } from '../globalUtils';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios'

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
                    <View style={styles.movieWholePosterContainer}>
                        <Animated.View style={[styles.moviePosterContainer, { opacity }]}>
                            <View style={styles.moviePoster} ></View>
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

export default function TvShowScreen({ navigation }) {
    const [refreshing, setRefreshing] = useState(false)
    const [isPopularLoading, setIsPopularLoading] = useState(true)
    const [isTopRatedLoading, setIsTopRatedLoading] = useState(true)
    const [isUpcomingLoading, setIsUpcomingLoading] = useState(true)
    const [popular, setPopular] = useState([])
    const [topRated, setTopRated] = useState([])
    const [upcoming, setUpcoming] = useState([])

    useEffect(() => {
        getAllData()
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
        return () => {
            backHandler.remove()
        }
    }, [])
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
        setIsPopularLoading(true)
        await getPopular()
        setIsTopRatedLoading(true)
        await getTopRated()
        setIsUpcomingLoading(true)
        await getUpcoming()
        setRefreshing(false)
    }
    const getPopular = async () => {
        try {
            let response = await axios.get(URLs[9])
            setPopular(response.data.results)
            setIsPopularLoading(false)
        } catch (error) {
            //   Alert.alert('Oops...','Something went wrong',[{text:"Go back",onPress:()=>navigation.goBack()}])
        }
    }
    const getTopRated = async () => {
        try {
            let response = await axios.get(URLs[10])
            setTopRated(response.data.results)
            setIsTopRatedLoading(false)
        } catch (error) {
            // Alert.alert('Oops...','Something went wrong',[{text:"Go back",onPress:()=>navigation.goBack()}])
        }
    }

    const getUpcoming = async () => {
        try {
            let response = await axios.get(URLs[11])
            setUpcoming(response.data.results)
            setIsUpcomingLoading(false)
        } catch (error) {
            // Alert.alert('Oops...','Something went wrong',[{text:"Go back",onPress:()=>navigation.goBack()}])
        }
    }
    return (
        <View style={[styles.container, s.mainBackground]}>
            <CustomHeader navigation={navigation} />
            <ScrollView
                style={[styles.container, s.mainBackground]}
                contentContainerStyle={{ paddingBottom: 40 }}
                refreshControl={<RefreshControl onRefresh={getAllData} refreshing={refreshing} />}
            >
                <View style={styles.popularContainer}>
                    <View style={styles.popularHeaderContainer}>
                        <Text style={styles.popularHeaderText}>Popular Shows</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SeeAllModal', { id: 9, title: "Popular Shows" })}>
                            <MaterialIcons style={{ marginRight: 10 }} name="keyboard-arrow-right" size={24} color={colors.lightWhite} />
                        </TouchableOpacity>
                    </View>

                    {isPopularLoading ?
                        <ContainerLoading />
                        :

                        <SafeAreaView style={{ flex: 1 }} style={styles.posterSlideShowContainer}>

                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={popular}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <View style={styles.movieWholePosterContainer}>
                                        <TouchableOpacity onPress={() => navigation.push('TvShowModal', { screen: 'TvModal', params: { id: item.id ,name:item.name,first_air_date:item.first_air_date}, key: Math.round(Math.random() * 10000000) })}>
                                            <View key={item.id} style={styles.moviePosterContainer}>
                                                <Image resizeMode='cover' style={styles.moviePoster} source={{ uri: 'https://image.tmdb.org/t/p/original' + item.poster_path }}></Image>
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
                        <Text style={styles.popularHeaderText}>Top Rated Shows</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SeeAllModal', { id: 10, title: "Top Rated Shows" })}>
                            <MaterialIcons style={{ marginRight: 10 }} name="keyboard-arrow-right" size={24} color={colors.lightWhite} />
                        </TouchableOpacity>
                    </View>
                    {isTopRatedLoading ?
                        <ContainerLoading />
                        :
                        <SafeAreaView style={styles.posterSlideShowContainer}>
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={topRated}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <View style={styles.movieWholePosterContainer}>
                                        <TouchableOpacity onPress={() => navigation.push('TvShowModal', { screen: 'TvModal', params: { id: item.id,name:item.name,first_air_date:item.first_air_date }, key: Math.round(Math.random() * 10000000) })}>
                                            <View key={item.id} style={styles.moviePosterContainer}>
                                                <Image resizeMode='cover' style={styles.moviePoster} source={{ uri: 'https://image.tmdb.org/t/p/original' + item.poster_path }}></Image>
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
                        <Text style={styles.popularHeaderText}>New Season Shows</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SeeAllModal', { id: 11, title: "New Season Shows" })}>
                            <MaterialIcons style={{ marginRight: 10 }} name="keyboard-arrow-right" size={24} color={colors.lightWhite} />
                        </TouchableOpacity>
                    </View>
                    {isUpcomingLoading ?
                        <ContainerLoading />
                        :
                        <SafeAreaView style={styles.posterSlideShowContainer}>
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={upcoming}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) =>
                                (
                                    <View style={styles.movieWholePosterContainer}>
                                        <TouchableOpacity onPress={() => navigation.push('TvShowModal', { screen: 'TvModal', params: { id: item.id ,name:item.name,first_air_date:item.first_air_date}, key: Math.round(Math.random() * 10000000) })}>
                                            <View key={item.id} style={styles.moviePosterContainer}>
                                                <Image resizeMode='cover' style={styles.moviePoster} source={{ uri: 'https://image.tmdb.org/t/p/original' + item.poster_path }}></Image>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={styles.posterDetail}>
                                            <Text ellipsizeMode={'tail'} numberOfLines={1} style={styles.posterTitle}>{item.name}</Text>
                                            {item.first_air_date ? <Text style={styles.posterYear}>{months[Number(item.first_air_date.slice(5, 7)) - 1]} {item.first_air_date.slice(8, 10)}, {item.first_air_date.slice(0, 4)}</Text> : null}
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

const s = StyleSheet.create({
    container: {
        paddingTop: 10,
        paddingBottom: 15
    },
    mainBackground: {
        backgroundColor: colors.mainBlackColor
    },
})