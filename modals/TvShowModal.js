import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    Animated,
    BackHandler,
    Dimensions,
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Linking,
    Pressable,
    FlatList,
    SafeAreaView,
    TouchableHighlight,
    ToastAndroid,
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
    API_KEY,
    getHour,
    getMinute,
    URLs,
} from "../globalUtils";
import { Picker } from "@react-native-picker/picker";
import Accordion from "react-native-collapsible/Accordion";
import { useSelector, useDispatch } from "react-redux";
import LottieView from "lottie-react-native";
import PosterContainer from "../components/molecules/PosterContainer";
import { TouchableOpacity } from "react-native-gesture-handler";
import VideoContainer from "../components/molecules/VideoContainer";
import CastPosterContainer from "../components/molecules/CastPosterContainer";
import GenreBox from "../components/atoms/GenreBox";
import Ripple from "react-native-material-ripple";
import * as WebBrowser from 'expo-web-browser';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function TvShowModal({ navigation, route }) {
    const [isLoading, setIsLoading] = useState(true);
    const [tvShowData, setTvShowData] = useState({});
    const [visible, setIsVisible] = useState(false);
    const [images, setImages] = useState([]);
    const [imageIndex, setImageIndex] = useState(0);
    const [seasonData, setSeasonData] = useState({});
    const [seasonLoading, setSeasonLoading] = useState(true);
    const [seasonNumber, setSeasonNumber] = useState(1);
    const [activeSections, setActiveSections] = useState([]);
    const {user,app_info} = useSelector((state) => state);
    const dispatch = useDispatch();

    const scrollY = new Animated.Value(0);
    const diffClamp = Animated.diffClamp(scrollY, 0, 57);
    const translateY = diffClamp.interpolate({
        inputRange: [0, 57],
        outputRange: [0, -57],
    });

    let { name, first_air_date } = route.params;
    useEffect(() => {
        getTvShowInfo();
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            handleBackButtonClick
        );
        return () => {
            backHandler.remove();
        };
    }, [route]);

    useEffect(() => {
        getSeasonData(seasonNumber);
    }, [seasonNumber]);

    const handleBackButtonClick = () => {
        navigation.goBack();
        return true;
    };

    const getTvShowInfo = async () => {
        try {
            setIsLoading(true);
            let response = await axios.get(
                `${URLs[24]}tv/${route.params.id}?api_key=${API_KEY}${URLs[25]}`
            );
            var images = [];
            setSeasonNumber(
                response.data.seasons[0].season_number == 0
                    ? response.data.seasons[1].season_number
                    : response.data.seasons[0].season_number
            );
            // response.data.seasons.length?getSeasonData(response.data.seasons[0].season_number==0?response.data.seasons[1].season_number:response.data.seasons[0].season_number):null
            setTvShowData(response.data);
            response.data.images.backdrops.map((item) => {
                images.push({ uri: IMAGE_PATH + item.file_path });
            });
            setImages(images);
            setIsLoading(false);
        } catch (error) {
            // Alert.alert('Oops...','Something went wrong',[{text:"Go back",onPress:()=>navigation.goBack()}])
        }
    };
    const getSeasonData = async (season) => {
        try {
            setSeasonLoading(true);
            let { data } = await axios.get(
                URLs[13] +
                "tv/" +
                route.params.id +
                "/season/" +
                season +
                "?api_key=" +
                API_KEY
            );
            setSeasonData(data);
            setSeasonLoading(false);
        } catch (error) { }
    };
    const renderSectionTitle = (item) => <View></View>;
    const renderHeader = (item) => (
        <View style={s.episodeHeaderContainer}>
            <View style={s.episodePlayContainer}>
                <TouchableOpacity
                    onPress={() =>{
                        if (app_info?.stream_base==="app") {
                            navigation.push("PlayModal", {
                                url: `${URLs[14]}${route.params.id}/${seasonNumber}/${item.episode_number}`,
                            })
                        } else {
                            WebBrowser.openBrowserAsync(`${URLs[14]}${route.params.id}/${seasonNumber}/${item.episode_number}`)
                        }
                       
                        
                    }
                        // WebBrowser.openBrowserAsync(`${URLs[14]}${route.params.id}/${seasonNumber}/${item.episode_number}`)
                    }
                >
                    <Ionicons
                        name="md-play-circle-sharp"
                        size={36}
                        color={colors.mainLightBlue}
                    />
                </TouchableOpacity>
            </View>
            <View style={s.epsiodeNameContainer}>
                <Text style={s.episodeNumber}>Episode {item.episode_number}</Text>
                <Text style={s.episodeName}>{item.name}</Text>
            </View>
        </View>
    );
    const renderContent = (item) => (
        <View style={s.episodeContentContainer}>
            {item.overview || item.still_path ? (
                <View>
                    {item.still_path ? (
                        <Image
                            style={s.episodePoster}
                            source={{ uri: IMAGE_PATH + item.still_path }}
                        />
                    ) : null}
                    <Text style={s.episodeOverview}>{item.overview}</Text>
                </View>
            ) : (
                <Text style={s.episodeOverview}>Information not available</Text>
            )}
        </View>
    );
    const updateSections = (activeSections) => {
        setActiveSections(activeSections);
    };
    const addToWatchlist = async () => {
        try {
            let { data } = await axios.post(
                URLs[27],
                {
                    id: user._id,
                    watchlist: {
                        id: tvShowData.id,
                        poster_path: tvShowData.poster_path,
                        name: tvShowData.name,
                        year: tvShowData.first_air_date,
                        type: "tv",
                        overview:tvShowData.overview
                    },
                    data:tvShowData
                }
            );
            dispatch({ type: "ADD_TO_WATCHLIST", payload: data.user.watchlist });
            ToastAndroid.show("Added to watchlist", ToastAndroid.SHORT);
        } catch (error) {
            console.log(error);
        }
    };
    const removeFromWatchlist = async () => {
        try {
            let watchlistId = getMovieId();
            let response = await axios.post(
                URLs[34],
                {
                    id: user._id,
                    watchlistId,
                }
            );
            dispatch({ type: "REMOVE_FROM_WATCHLIST", payload: tvShowData.id });
            ToastAndroid.show("Removed from watchlist", ToastAndroid.SHORT);
        } catch (error) {
            console.log(error);
        }
    };
    const isMovieAdded = () => {
        return user?.watchlist.find((ele) => ele.data.id == tvShowData.id);
    };
    const getMovieId = () => {
        return user.watchlist.map((ele) =>
            ele.data.id == tvShowData.id ? ele._id : null
        );
    };
    return (
        <View
            style={[
                styles.container,
                { position: "relative", backgroundColor: colors.mainBlackColor },
                ,{paddingTop:StatusBar.currentHeight}
            ]}
        >
            {/* <Animated.View
                style={{
                    transform: [{ translateY: translateY }],
                    elevation: 1,
                    zIndex: 1000,
                }}
            > */}
            <View style={[styles.movieModalHeader]}>
                <TouchableOpacity
                    style={{ paddingLeft: 0 }}
                    onPress={() => navigation.goBack()}
                >
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
                    {name}{" "}
                    <Text style={[styles.movieYear]}>({first_air_date.slice(0, 4)})</Text>
                </Text>
            </View>
            {/* </Animated.View> */}

            {isLoading ? (
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
                    onScroll={(e) => scrollY.setValue(e.nativeEvent.contentOffset.y)}
                >
                    <View style={styles.modalPosterContainer}>
                        {tvShowData.backdrop_path ? (
                            <Image
                                opacity={0.55}
                                style={styles.modalBackdropPoster}
                                resizeMode={"cover"}
                                source={{ uri: IMAGE_PATH + tvShowData.backdrop_path }}
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
                        {tvShowData.poster_path ? (
                            <Image
                                resizeMode={"cover"}
                                source={{ uri: IMAGE_PATH + tvShowData.poster_path }}
                                style={styles.modalPoster}
                            />
                        ) : (
                            <>
                                {tvShowData.backdrop_path ? (
                                    <Image
                                        style={styles.modalPoster}
                                        resizeMode={"cover"}
                                        source={{ uri: IMAGE_PATH + tvShowData.backdrop_path }}
                                    />
                                ) : null}
                            </>
                        )}

                        <View style={s.movieFeatureContainer}>
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
                                        <Ionicons
                                            name="heart-sharp"
                                            size={30}
                                            color={colors.lightWhite}
                                        />
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
                            <Ripple
                                rippleColor={colors.rippleColor}
                                onPress={() =>
                                    navigation.push("YtsTorrentModal", {
                                        query:
                                            tvShowData.name +
                                            " s" +
                                            (seasonNumber < 10 ? "0" : "") +
                                            seasonNumber,
                                        type: "tv",
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
                            </Ripple>
                        </View>
                    </View>
                    <View style={s.movieDetailContainer}>
                        <Pressable
                            onPress={() => {
                                tvShowData.homepage
                                    ? Linking.openURL(tvShowData.homepage)
                                    : null;
                            }}
                        >
                            <View style={{ marginVertical: 5 }}>
                                <Text style={[styles.movieName]}>
                                    {tvShowData.name}{" "}
                                    <Text style={styles.movieYear}>
                                        ({tvShowData.first_air_date.slice(0, 4)})
                                    </Text>{" "}
                                </Text>
                                {tvShowData.tagline ? (
                                    <Text style={[styles.taglineText]}>{tvShowData.tagline}</Text>
                                ) : null}
                            </View>
                        </Pressable>
                        <View style={{ flexDirection: "column", flexWrap: "wrap" }}>
                            {tvShowData.episode_run_time[0] ? (
                                <View style={styles.movieTextContainer}>
                                    <MaterialCommunityIcons
                                        name="clock-time-four-outline"
                                        size={20}
                                        color={colors.lightestWhite}
                                    />
                                    <Text style={[styles.movieText]}>
                                        {(tvShowData.episode_run_time[0] > 60
                                            ? getHour(tvShowData.episode_run_time[0]) + "hr "
                                            : "") +
                                            (getMinute(tvShowData.episode_run_time[0])
                                                ? getMinute(tvShowData.episode_run_time[0]) + " min"
                                                : "")}
                                    </Text>
                                </View>
                            ) : null}
                            {tvShowData.vote_average ? (
                                <View style={styles.movieTextContainer}>
                                    <AntDesign
                                        name="star"
                                        size={20}
                                        color={colors.lightestWhite}
                                    />
                                    <Text style={[styles.movieText]}>
                                        {tvShowData.vote_average} (Audience Rating)
                                    </Text>
                                </View>
                            ) : null}

                            <View style={styles.movieTextContainer}>
                                <Text style={[styles.movieText]}>
                                    Languages:
                                    {tvShowData.spoken_languages.map((item, index) => (
                                        <Text key={item.name} style={styles.movieText}>
                                            {" "}
                                            {item.english_name}
                                            {index !== tvShowData.spoken_languages.length - 1
                                                ? ","
                                                : null}
                                        </Text>
                                    ))}
                                </Text>
                            </View>

                            {tvShowData.first_air_date ? (
                                <View style={styles.movieTextContainer}>
                                    <Text style={styles.movieText}>
                                        First episode date:{" "}
                                        {months[Number(tvShowData.first_air_date.slice(5, 7)) - 1]}{" "}
                                        {tvShowData.first_air_date.slice(8, 10)},{" "}
                                        {tvShowData.first_air_date.slice(0, 4)}
                                    </Text>
                                </View>
                            ) : null}
                            {tvShowData.last_air_date ? (
                                <View style={styles.movieTextContainer}>
                                    <Text style={styles.movieText}>
                                        Last episode date:{" "}
                                        {months[Number(tvShowData.last_air_date.slice(5, 7)) - 1]}{" "}
                                        {tvShowData.last_air_date.slice(8, 10)},{" "}
                                        {tvShowData.last_air_date.slice(0, 4)}
                                    </Text>
                                </View>
                            ) : null}
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
                            {tvShowData.genres.map((item) => (
                                <GenreBox
                                    item={item}
                                    navigation={navigation}
                                    type="tv"
                                    key={item.id}
                                    mVertical={4}
                                    mHorizontal={4}
                                    fontSize={16}
                                />
                            ))}
                        </View>

                        <View style={styles.movieOverview}>
                            <Text style={styles.heading_1}>Overview</Text>
                            <Text style={[styles.overviewText, styles.text]}>
                                {tvShowData.overview}
                            </Text>
                        </View>

                        <View style={s.seasonDetailContainer}>
                            <View style={s.seasonFilter}>
                                <Picker
                                    selectedValue={seasonNumber}
                                    style={{ height: 50, width: 150, color: colors.lightWhite }}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setSeasonNumber(itemValue)
                                    }
                                    mode="dialog"
                                    dropdownIconColor={colors.lightWhite}
                                >
                                    {tvShowData.seasons.map((item) =>
                                        item.season_number > 0 ? (
                                            <Picker.Item
                                                key={item.id}
                                                style={{ fontFamily: "Nunito-Bold", fontSize: 18 }}
                                                color={colors.mainBlackColor}
                                                label={"Season " + item.season_number}
                                                value={item.season_number}
                                            />
                                        ) : null
                                    )}
                                </Picker>
                            </View>
                            {seasonLoading ? (
                                <View style={[styles.container, { paddingVertical: 200 }]}>
                                    <ActivityIndicator size="large" color={colors.mainBlue} />
                                </View>
                            ) : (
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
                            )}
                        </View>

                        <View style={[s.imagesContainer]}>
                            <FlatList
                                horizontal
                                keyExtractor={(item) => item.file_path}
                                showsHorizontalScrollIndicator={false}
                                data={tvShowData.images.backdrops}
                                renderItem={({ item, index }) => (
                                    <Ripple
                                        onPress={() => {
                                            setImageIndex(index);
                                            setIsVisible(true);
                                        }}
                                        rippleColor={colors.rippleColor}
                                    >
                                        <View
                                            style={[
                                                styles.moviePosterContainer,
                                                styles.movieImages,
                                                { borderRadius: 10 },
                                            ]}
                                        >
                                            <Image
                                                style={[styles.moviePoster, { borderRadius: 10 }]}
                                                source={{ uri: IMAGE_PATH + item.file_path }}
                                            />
                                        </View>
                                    </Ripple>
                                )}
                            />
                        </View>

                        <CastPosterContainer
                            data={tvShowData.credits.cast}
                            title="Cast"
                            loading={false}
                            type="person"
                            navigation={navigation}
                        />

                        <CastPosterContainer
                            data={tvShowData.credits.crew}
                            title="Crew"
                            loading={false}
                            type="person"
                            navigation={navigation}
                        />

                        <VideoContainer data={tvShowData.videos.results} />

                        <PosterContainer
                            data={tvShowData.similar.results}
                            title="More like this"
                            loading={false}
                            navigation={navigation}
                            type="tv"
                        />

                        <PosterContainer
                            data={tvShowData.recommendations.results}
                            title="Recommendations"
                            loading={false}
                            navigation={navigation}
                            type="tv"
                        />

                        <ImageView
                            images={images}
                            imageIndex={imageIndex}
                            visible={visible}
                            onRequestClose={() => setIsVisible(false)}
                        />
                    </View>
                </ScrollView>
            )}
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
        marginVertical: 15,
        marginHorizontal: "4%",
        overflow: "scroll",
        paddingVertical: 12,
        width: "92%",
        position: "relative",
    },
    movieScoreLeft: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "50%",
    },
    movieScoreRight: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        width: "50%",
        paddingHorizontal: 5,
    },
    genreName: {
        fontSize: 16,
        color: colors.lightWhite,
        paddingHorizontal: 5,
        paddingVertical: 2.5,
        fontFamily: "Nunito-Regular",
    },
    movieOverview: {
        marginVertical: 10,
        marginHorizontal: 15,
    },
    imagesContainer: {
        marginTop: 10,
        marginBottom: 10,
        marginHorizontal: 10,
    },
    seasonDetailContainer: {
        marginTop: 12,
        marginBottom: 18,
    },
    episodeHeaderContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 8,
        marginBottom: 5,
        backgroundColor: colors.lightBlack,
    },
    episodeNumber: {
        color: colors.lightWhite,
        fontFamily: "Nunito-SemiBold",
        fontSize: 18,
    },
    episodeName: {
        color: colors.lightGray,
        fontFamily: "Nunito-Regular",
        fontSize: 16,
    },
    epsiodeNameContainer: {
        marginLeft: 10,
        paddingRight: 5,
    },
    episodeContentContainer: {
        marginBottom: 20,
    },
    episodePoster: {
        width: windowWidth,
        height: 250,
        alignSelf: "center",
    },
    episodeOverview: {
        color: colors.lightGray,
        fontSize: 16,
        fontFamily: "Nunito-Regular",
        marginHorizontal: 15,
        marginVertical: 5,
        textAlign: "justify",
    },
    seasonFilter: {
        marginLeft: 10,
    },
    movieFeatureContainer: {
        position: "absolute",
        right: 30,
        top: "40%",
        flexDirection: "column",
        height: "60%",
        justifyContent: "space-evenly",
        alignItems: "center",
        zIndex: 20,
    },
});



{/* <View style={s.movieScore}>
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
        <TouchableHighlight onPress={()=>navigation.push('TorrentModal',{query:tvShowData.name+' s'+(seasonNumber<10?'0':'')+seasonNumber,type:'tv'})}>
            <Text style={styles.torrentSearchButton}>Browse Torrents</Text>
        </TouchableHighlight>
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
</View> */}