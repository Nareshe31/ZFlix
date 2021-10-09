import React, { useEffect, useState } from "react";
import {
    BackHandler,
    View,
    ScrollView,
    Animated,
    RefreshControl,
    Alert,
    ToastAndroid,
} from "react-native";
import { styles } from "../globalStyle";
import AppHeader from '../components/molecules/AppHeader';
import axios from "axios";
import { API_KEY } from "../globalUtils";
import PostersContainer from "../components/molecules/PostersContainer";

export default function PopularScreen({ navigation }) {
    const [refreshing, setRefreshing] = useState(false);
    const [isMovieLoading, setIsMovieLoading] = useState(true);
    const [isTvShowLoading, setIsTvShowLoading] = useState(true);
    const [isPersonLoading, setIsPersonLoading] = useState(true);
    const [movie, setMovie] = useState([]);
    const [tvShow, setTvShow] = useState([]);
    const [person, setPerson] = useState([]);
    const [filter, setFilter] = useState("week");

    const scrollY = new Animated.Value(0);
    const diffClamp = Animated.diffClamp(scrollY, 0, 57);
    const translateY = diffClamp.interpolate({
        inputRange: [0, 57],
        outputRange: [0, -57],
    });

    useEffect(() => {
        getAllData();
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            handleBackButtonClick
        );
        return () => {
            backHandler.remove();
        };
    }, [filter]);

    const handleBackButtonClick = () => {
        if (navigation.isFocused()) {
            Alert.alert(
                "Exit App",
                "Do you want to exit?",
                [
                    { text: "Yes", onPress: () => BackHandler.exitApp() },
                    { text: "No", onPress: () => null, style: "cancel" },
                ],
                { cancelable: false }
            );
            return true;
        }
    };
    const getAllData = async () => {
        setIsMovieLoading(true);
        await getPopularMovies();
        setIsTvShowLoading(true);
        await getPopularTvShows();
        setIsPersonLoading(true);
        await getPopularPersons();
        setRefreshing(false);
    };

    const getPopularMovies = async () => {
        try {
            let response = await axios.get(
                `https://api.themoviedb.org/3/trending/movie/${filter}?api_key=${API_KEY}`
            );
            setMovie(response.data.results);
            setIsMovieLoading(false);
        } catch (error) {
            ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
        }
    };

    const getPopularTvShows = async () => {
        try {
            let response = await axios.get(
                `https://api.themoviedb.org/3/trending/tv/${filter}?api_key=${API_KEY}`
            );
            setTvShow(response.data.results);
            setIsTvShowLoading(false);
        } catch (error) {
            ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
        }
    };

    const getPopularPersons = async () => {
        try {
            let response = await axios.get(
                `https://api.themoviedb.org/3/trending/person/${filter}?api_key=${API_KEY}`
            );
            setPerson(response.data.results);
            setIsPersonLoading(false);
        } catch (error) {
            ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
        }
    };
    const changeFilter = () => {
        setFilter((prev) => (prev == "week" ? "day" : "week"));
    };
    return (
        <View style={[styles.container]}>
            <Animated.View
                style={{
                    transform: [{ translateY: translateY }],
                    elevation: 1,
                    zIndex: 1000,
                }}
            >
                <AppHeader navigation={navigation} />
            </Animated.View>
            <ScrollView
                style={[styles.container]}
                contentContainerStyle={styles.mainScreen}
                onScroll={(e) => scrollY.setValue(e.nativeEvent.contentOffset.y)}
                refreshControl={
                    <RefreshControl onRefresh={changeFilter} refreshing={refreshing} />
                }
            >
                <PostersContainer
                    data={movie}
                    title="Trending Movies"
                    loading={isMovieLoading}
                    filter={filter}
                    navigation={navigation}
                    type="movie"
                    apiId={filter === "week" ? 0 : 1}
                />
                <PostersContainer
                    data={tvShow}
                    title="Trending Shows"
                    loading={isTvShowLoading}
                    filter={filter}
                    navigation={navigation}
                    type="tv"
                    apiId={filter === "week" ? 2 : 3}
                />
                <PostersContainer
                    data={person}
                    title="Trending Persons"
                    loading={isPersonLoading}
                    filter={filter}
                    navigation={navigation}
                    type="person"
                    apiId={filter === "week" ? 4 : 5}
                />
            </ScrollView>
        </View>
    );
}
