import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    BackHandler,
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    Image,
    StyleSheet,
    Animated,
    Linking,
    Alert,
    ToastAndroid,
    Pressable,
    FlatList,
    TouchableOpacity,
    TouchableHighlight,
    StatusBar
} from "react-native";
import { styles, colors } from "../globalStyle";
import {
    MaterialIcons,
    Ionicons,
    MaterialCommunityIcons,
    AntDesign,
} from "@expo/vector-icons";
import ImageView from "react-native-image-viewing";
import {
    IMAGE_PATH,
    months,
    getHour,
    getMinute,
    convertMoney,
    URLs,
    API_KEY,
} from "../globalUtils";
import { useSelector, useDispatch } from "react-redux";
import LottieView from "lottie-react-native";
import PosterContainer from "../components/molecules/PosterContainer";
import CastPosterContainer from "../components/molecules/CastPosterContainer";
import VideoContainer from "../components/molecules/VideoContainer";
import GenreBox from "../components/atoms/GenreBox";
import Ripple from "react-native-material-ripple";
import * as WebBrowser from 'expo-web-browser';

const HEADER_MAX_HEIGHT = 450;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function ModalScreen({ navigation, route }) {
    const scrollY = new Animated.Value(0);
    const [isLoading, setIsLoading] = useState(true);
    const [movieData, setMovieData] = useState({});
    const [visible, setIsVisible] = useState(false);
    const [images, setImages] = useState([]);
    const [imageIndex, setImageIndex] = useState(0);
    const user = useSelector((state) => state);
    const dispatch = useDispatch();

    let { title, release_date } = route.params;
    useEffect(() => {
        getMovieInfo();

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            handleBackButtonClick
        );
        return () => {
            backHandler.remove();
        };
    }, []);

    const handleBackButtonClick = () => {
        navigation.goBack();
        return true;
    };

    const getMovieInfo = async () => {
        try {
            setIsLoading(true);
            let response = await axios.get(
                `${URLs[24]}movie/${route.params.id}?api_key=${API_KEY}${URLs[25]}`
            );
            var images = [];
            setMovieData(response.data);
            response.data.images.backdrops.map((item) => {
                images.push({ uri: IMAGE_PATH + item.file_path });
            });
            setImages(images);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            // Alert.alert('Oops...','Something went wrong',[{text:"Go back",onPress:()=>navigation.goBack()}])
        }
    };

    const addToWatchlist = async () => {
        try {
            // fadeIn()
            let { data } = await axios.post(URLs[27], {
                id: user._id,
                watchlist: {
                    id: movieData.id,
                    poster_path: movieData.poster_path,
                    name: movieData.title,
                    year: movieData.release_date,
                    type: "movie",
                },
            });
            dispatch({ type: "ADD_TO_WATCHLIST", payload: data.user.watchlist });
            ToastAndroid.show("Added to watchlist", ToastAndroid.SHORT);
        } catch (error) {
            console.log(error);
            ToastAndroid.show('Something went wrong',ToastAndroid.SHORT)

        }
    };
    const removeFromWatchlist = async () => {
        try {
            let watchlistId = getMovieId();
            console.log(user,watchlistId);
            let response = await axios.post(URLs[34], {
                id: user._id,
                watchlistId,
            });
            dispatch({ type: "REMOVE_FROM_WATCHLIST", payload: movieData.id });
            ToastAndroid.show("Removed from watchlist", ToastAndroid.SHORT);
        } catch (error) {
            console.log(error);
            ToastAndroid.show('Something went wrong',ToastAndroid.SHORT)

        }
    };
    const isMovieAdded = () => {
        return user?.watchlist.find((ele) => ele.data.id == movieData.id);
    };
    const getMovieId = () => {
        return user?.watchlist.map((ele) =>
            ele.data.id == movieData.id ? ele._id : null
        );
    };

    const headerHeight = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        extrapolate: "clamp",
    });
    const watchMovie = async () => {
        try {
            navigation.push("PlayModal", { url: `${URLs[15]}${movieData.imdb_id}` });
            // WebBrowser.openBrowserAsync(`${URLs[15]}${movieData.imdb_id}`)
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <View style={[styles.container, { position: "relative" },{paddingTop:StatusBar.currentHeight}]}>
            <View style={[styles.movieModalHeader]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons
                        name="arrow-back"
                        size={22}
                        color={colors.lightWhite}
                    />
                </TouchableOpacity>
                <Text
                    ellipsizeMode={"middle"}
                    numberOfLines={1}
                    style={styles.movieModalHeaderText}
                >
                    {title}{" "}
                    {release_date.length > 0 ? (
                        <Text style={[styles.movieYear]}>({release_date.slice(0, 4)})</Text>
                    ) : null}
                </Text>
            </View>
            {
                isLoading ? (
                    <View
                        style={[
                            styles.pageLoader,
                            { backgroundColor: colors.mainBlackColor },
                        ]}
                    >
                        {/* <ActivityIndicator size='large' color={colors.mainBlue} /> */}
                        {/* <Image source={require('../assets/images/loading-hand.gif')} style={{width:250,height:350}}  /> */}
                        <LottieView
                            source={require("../assets/lotties/loading-hand.json")}
                            autoPlay
                            loop
                        />
                    </View>
                ) : (
                    <ScrollView
                        style={[styles.container]}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: false }
                        )}
                        scrollEventThrottle={16}
                    >
                        <View
                            style={[
                                styles.modalPosterContainer,
                                { position: "relative", zIndex: 15 },
                            ]}
                        >
                            {movieData.backdrop_path ? (
                                <Image
                                    style={styles.modalBackdropPoster}
                                    opacity={0.55}
                                    source={{ uri: IMAGE_PATH + movieData.backdrop_path }}
                                />
                            ) : (
                                <Image
                                    style={[
                                        styles.modalBackdropPoster,
                                        {
                                            width: "80%",
                                            marginLeft: "10%",
                                            backgroundColor: "#999",
                                            zIndex: -10,
                                        },
                                    ]}
                                    resizeMode="contain"
                                    source={require("../assets/images/no-image.png")}
                                />
                            )}
                            {/* <Image
                            opacity={0.75}
                            style={styles.modalBackdropPoster}
                            resizeMode={'cover'}
                            source={{uri:IMAGE_PATH+movieData.backdrop_path}}
                        /> */}
                            {movieData.poster_path ? (
                                <Image
                                    style={styles.modalPoster}
                                    source={{ uri: IMAGE_PATH + movieData.poster_path }}
                                />
                            ) : (
                                <>
                                    {movieData.backdrop_path ? (
                                        <Image
                                            style={styles.modalPoster}
                                            source={{ uri: IMAGE_PATH + movieData.backdrop_path }}
                                        />
                                    ) : null}
                                </>
                            )}
                            <View
                                style={[
                                    styles.movieFeatureContainer,
                                    {
                                        top:
                                            new Date(movieData.release_date) < new Date()
                                                ? "20%"
                                                : "45%",
                                    },
                                ]}
                            >
                                {!isMovieAdded() ? (
                                    <TouchableOpacity onPress={addToWatchlist}>
                                        <View>
                                            <Ionicons
                                                name="heart-outline"
                                                size={30}
                                                color={colors.lightWhite}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={removeFromWatchlist}>
                                        <View>
                                            <Ionicons name="heart-sharp" size={30} color={colors.lightWhite} />
                                            {/* <LottieView
                                                source={require("../assets/lotties/like.json")}
                                                autoPlay
                                                loop
                                            /> */}
                                        </View>
                                    </TouchableOpacity>
                                )}
                                <View>
                                    <MaterialIcons
                                        name="share"
                                        size={30}
                                        color={colors.lightWhite}
                                    />
                                </View>
                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.push("TorrentModal", {
                                            query:
                                                movieData.title +
                                                " " +
                                                movieData.release_date.slice(0, 4),
                                            type: "movie",
                                        })
                                    }
                                >
                                    <View>
                                        <MaterialCommunityIcons
                                            name="download-circle"
                                            size={30}
                                            color={colors.lightWhite}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.moviePlayContainer]}>
                                {new Date(movieData.release_date) < new Date() ? (
                                    <TouchableOpacity
                                        style={{ justifyContent: "center", alignItems: "center" }}
                                        onPress={watchMovie}
                                    >
                                        <View>
                                            <Ionicons
                                                name="play-circle-sharp"
                                                size={50}
                                                color={colors.mainLightBlue}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                            {/* <Image 
                            resizeMode={'cover'}
                            source={{uri:IMAGE_PATH+movieData.poster_path}}
                            style={styles.modalPoster}
                        /> */}
                        </View>

                        <View style={s.movieDetailContainer}>
                            <Pressable
                                onPress={() => {
                                    movieData.homepage
                                        ? Linking.openURL(movieData.homepage)
                                        : null;
                                }}
                            >
                                <View style={{ marginTop: 5 }}>
                                    <Text style={[styles.movieName]}>
                                        {movieData.title}
                                        {movieData.release_date.length > 0 ? (
                                            <Text style={styles.movieYear}>
                                                {" (" + movieData.release_date.slice(0, 4) + ")"}
                                            </Text>
                                        ) : null}
                                    </Text>
                                    {movieData.tagline ? (
                                        <Text style={[styles.taglineText]}>
                                            {movieData.tagline}
                                        </Text>
                                    ) : null}
                                </View>
                            </Pressable>

                            <View style={{ flexDirection: "column", flexWrap: "wrap" }}>
                                {movieData.runtime ? (
                                    <View style={[styles.movieTextContainer]}>
                                        <MaterialCommunityIcons
                                            name="clock-time-four-outline"
                                            size={20}
                                            color={colors.lightestWhite}
                                        />
                                        <Text style={[styles.movieText]}>
                                            {getHour(movieData.runtime) +
                                                "hr " +
                                                (getMinute(movieData.runtime)
                                                    ? getMinute(movieData.runtime) + " min"
                                                    : "")}
                                        </Text>
                                    </View>
                                ) : null}
                                {movieData.vote_average ? (
                                    <View style={styles.movieTextContainer}>
                                        <AntDesign
                                            name="star"
                                            size={20}
                                            color={colors.lightestWhite}
                                        />
                                        <Text style={[styles.movieText]}>
                                            {movieData.vote_average} (Audience Rating)
                                        </Text>
                                    </View>
                                ) : null}

                                {movieData.spoken_languages.length ? (
                                    <View style={styles.movieTextContainer}>
                                        <Text style={[styles.movieText]}>
                                            Languages:
                                            {movieData.spoken_languages.map((item, index) => (
                                                <Text key={item.name} style={styles.movieText}>
                                                    {" "}
                                                    {item.english_name}
                                                    {index !== movieData.spoken_languages.length - 1
                                                        ? ","
                                                        : null}
                                                </Text>
                                            ))}
                                        </Text>
                                    </View>
                                ) : null}

                                <View style={styles.movieTextContainer}>
                                    <Text style={[styles.movieText]}>
                                        Status: {movieData.status}
                                    </Text>
                                </View>

                                {movieData.release_date !== "" ? (
                                    <View style={styles.movieTextContainer}>
                                        <Text style={styles.movieText}>
                                            Release Date:{" "}
                                            {months[Number(movieData.release_date.slice(5, 7)) - 1]}{" "}
                                            {movieData.release_date.slice(8, 10)},{" "}
                                            {movieData.release_date.slice(0, 4)}
                                        </Text>
                                    </View>
                                ) : (
                                    <View style={styles.movieTextContainer}>
                                        <Text style={styles.movieText}>Release Date: N/A</Text>
                                    </View>
                                )}
                                <View style={styles.movieTextContainer}>
                                    <Text style={[styles.movieText]}>
                                        Budget:{" "}
                                        {movieData.budget
                                            ? "$" + convertMoney(movieData.budget)
                                            : "N/A"}
                                    </Text>
                                </View>

                                <View style={styles.movieTextContainer}>
                                    <Text style={[styles.movieText]}>
                                        Revenue:{" "}
                                        {movieData.revenue
                                            ? "$" + convertMoney(movieData.revenue)
                                            : "N/A"}
                                    </Text>
                                </View>
                            </View>

                            {movieData.genres.length ? (
                                <View style={styles.genreContainer}>
                                    {movieData.genres.map((item) => (
                                        <GenreBox
                                            item={item}
                                            navigation={navigation}
                                            type="movie"
                                            key={item.id}
                                            mVertical={4}
                                            mHorizontal={4}
                                            fontSize={16}
                                        />
                                    ))}
                                </View>
                            ) : null}

                            {/* <View style={s.movieScore}>
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
                            
                        </View> */}

                            {/* <View style={styles.torrentSearchContainer}>
                            {isMovieAdded()?
                                <TouchableHighlight onPress={removeFromWatchlist}>
                                    <View style={styles.addWatchlistButton}>
                                        <Ionicons name="md-remove-outline" size={24} color={colors.lightWhite} />
                                        <MaterialIcons style={{marginRight:5}} name="done" size={26} color={colors.lightWhite} />
                                        <Text style={styles.watchlistText}>Watchlist</Text>
                                    </View>
                                </TouchableHighlight>
                                :
                                <TouchableHighlight onPress={addToWatchlist}>
                                    <View style={styles.addWatchlistButton}>
                                        <Ionicons name="ios-add-sharp" size={26} color={colors.lightWhite} />
                                        <Text style={styles.watchlistText}>Watchlist</Text>
                                    </View>
                                </TouchableHighlight>
                            }
                            <TouchableHighlight onPress={()=>navigation.push('TorrentModal',{query:movieData.title+' '+movieData.release_date.slice(0,4),type:'movie'})}>
                                <Text style={styles.torrentSearchButton}>Browse Torrents</Text>
                            </TouchableHighlight>
                        </View> */}

                            {movieData.overview ? (
                                <View style={styles.movieOverview}>
                                    <Text style={styles.overviewHeader}>Overview</Text>
                                    <Text style={[styles.overviewText, styles.text]}>
                                        {movieData.overview}
                                    </Text>
                                </View>
                            ) : null}

                            {movieData.images.backdrops.length ? (
                                <View style={[{ marginBottom: 15 }]}>
                                    <FlatList
                                        horizontal
                                        keyExtractor={(item) => item.file_path}
                                        showsHorizontalScrollIndicator={false}
                                        data={movieData.images.backdrops}
                                        renderItem={({ item, index }) => (
                                            <Ripple
                                                rippleColor={colors.rippleColor}
                                                onPress={() => {
                                                    setImageIndex(index);
                                                    setIsVisible(true);
                                                }}
                                            >
                                                <View
                                                    style={[
                                                        styles.moviePosterContainer,
                                                        s.movieImages,
                                                        { marginHorizontal: 8,borderRadius:10 },
                                                    ]}
                                                >
                                                    <Image
                                                        style={[styles.moviePoster,{borderRadius:10}]}
                                                        source={{ uri: IMAGE_PATH + item.file_path }}
                                                    />
                                                </View>
                                            </Ripple>
                                        )}
                                    />
                                </View>
                            ) : null}

                            <CastPosterContainer
                                data={movieData.credits.cast}
                                title="Cast"
                                loading={false}
                                type="person"
                                navigation={navigation}
                            />

                            <CastPosterContainer
                                data={movieData.credits.crew}
                                title="Crew"
                                loading={false}
                                type="person"
                                navigation={navigation}
                                crew={true}
                            />

                            <VideoContainer data={movieData.videos.results} />

                            {movieData?.similar?.results.length ? (
                                <PosterContainer
                                    data={movieData.similar.results}
                                    title="More like this"
                                    loading={false}
                                    navigation={navigation}
                                    type="movie"
                                />
                            ) : null}

                            {movieData?.recommendations?.results.length ? (
                                <PosterContainer
                                    data={movieData.recommendations.results}
                                    title="Recommendations"
                                    loading={false}
                                    navigation={navigation}
                                    type="movie"
                                />
                            ) : null}

                            <ImageView
                                images={images}
                                imageIndex={imageIndex}
                                visible={visible}
                                onRequestClose={() => setIsVisible(false)}
                            />
                        </View>
                    </ScrollView>
                )
                // </View>
            }
        </View>
    );
}

const s = StyleSheet.create({
    movieDetailContainer: {
        flex: 1,
        backgroundColor: colors.mainBlackColor,
        paddingVertical: 12,
        paddingHorizontal: 0,
    },
    movieScore: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 5,
        marginHorizontal: "6%",
        paddingVertical: 12,
        width: "90%",
        position: "relative",
    },
    movieScoreLeft: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "50%",
    },
    movieScoreRight: {
        justifyContent: "center",
        alignItems: "center",
        width: "40%",
        paddingHorizontal: 5,
    },
    watchNowButton: {
        paddingVertical: 10,
        color: colors.lightWhite,
        paddingHorizontal: 18,
        borderRadius: 3,
        fontSize: 14,
        fontFamily: "Nunito-SemiBold",
        backgroundColor: colors.mainLightBlue,
    },
    imagesContainer: {
        marginVertical: 14,
        marginHorizontal: 10,
    },
});
