import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    ScrollView,
    StyleSheet,
    Image,
    ActivityIndicator,
    Pressable,
    FlatList,
    TouchableHighlight,
    StatusBar
} from "react-native";
import { styles, colors } from "../globalStyle";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
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
import axios from "axios";

const data = [
    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 },
    { id: 11 },
    { id: 12 },
    { id: 13 },
    { id: 14 },
];
const HEADER_MAX_HEIGHT = 450;
const HEADER_MIN_HEIGHT = 40;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function AboutModal({ navigation, route }) {
    const scrollY = new Animated.Value(0);
    const [isLoading, setIsLoading] = useState(true);
    const [movieData, setMovieData] = useState({});
    const [visible, setIsVisible] = useState(false);
    const [images, setImages] = useState([]);
    const [imageIndex, setImageIndex] = useState(0);

    useEffect(() => {
        getMovieInfo();
    }, [route]);

    const getMovieInfo = async () => {
        try {
            setIsLoading(true);
            let response = await axios.get(
                `${URLs[24]}movie/666243?api_key=${API_KEY}${URLs[25]}`
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

    const headerHeight = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        extrapolate: "clamp",
    });

    if (isLoading) {
        return (
            <View
                style={[styles.pageLoader, { backgroundColor: colors.mainBlackColor }]}
            >
                <ActivityIndicator size="large" color={colors.mainBlue} />
            </View>
        );
    }
    return (
        <View style={[s.fill, { paddingTop: StatusBar.currentHeight }]}>
            <ScrollView
                style={[s.scrollViewContent]}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                <View style={s.movieDetailContainer}>
                    <Pressable
                        onPress={() => {
                            movieData.homepage ? Linking.openURL(movieData.homepage) : null;
                        }}
                    >
                        <View style={{ marginVertical: 5 }}>
                            <Text style={[styles.movieName]}>
                                {movieData.title}{" "}
                                {movieData.release_date.length > 0 ? (
                                    <Text style={styles.movieYear}>
                                        ({movieData.release_date.slice(0, 4)})
                                    </Text>
                                ) : null}{" "}
                            </Text>
                            {movieData.tagline ? (
                                <Text style={[styles.taglineText]}>{movieData.tagline}</Text>
                            ) : null}
                        </View>
                    </Pressable>

                    <View style={{ flexDirection: "column", flexWrap: "wrap" }}>
                        <View style={styles.movieTextContainer}>
                            <Text style={[styles.movieText]}>
                                Runtime:{" "}
                                {movieData.runtime
                                    ? getHour(movieData.runtime) +
                                    "hr " +
                                    (getMinute(movieData.runtime)
                                        ? getMinute(movieData.runtime) + " min"
                                        : "")
                                    : "N/A"}
                            </Text>
                        </View>

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
                            <Text style={[styles.movieText]}>Status: {movieData.status}</Text>
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
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() =>
                                        navigation.push("GenreModal", {
                                            genreId: item.id,
                                            genreName: item.name,
                                            type: "movie",
                                        })
                                    }
                                >
                                    <Text style={styles.genreName}>{item.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) : null}

                    <View style={s.movieScore}>
                        <View style={s.movieScoreLeft}>
                            <ProgressCircle
                                percent={Math.floor(movieData.vote_average * 10)}
                                radius={30}
                                borderWidth={5}
                                color={
                                    Math.floor(movieData.vote_average * 10) > 70
                                        ? "hsl(125,90%,35%)"
                                        : Math.floor(movieData.vote_average * 10) > 45
                                            ? "hsl(55,80%,45%)"
                                            : "red"
                                }
                                bgColor={
                                    Math.floor(movieData.vote_average * 10) > 70
                                        ? "hsl(125,30%,15%)"
                                        : Math.floor(movieData.vote_average * 10) > 45
                                            ? "hsl(55,40%,20%)"
                                            : "red"
                                }
                            >
                                <Text style={[{ fontSize: 18 }, styles.text]}>
                                    {Math.floor(movieData.vote_average * 10)}%
                                </Text>
                            </ProgressCircle>
                            <Text
                                style={[
                                    {
                                        fontSize: 16,
                                        fontFamily: "Nunito-Regular",
                                        width: 80,
                                        flexWrap: "wrap",
                                        textAlign: "center",
                                    },
                                    styles.text,
                                ]}
                            >
                                Audience Score
                            </Text>
                        </View>

                        <View style={s.movieScoreRight}>
                            <TouchableOpacity
                                style={{ justifyContent: "center", alignItems: "center" }}
                                onPress={() =>
                                    navigation.push("PlayModal", {
                                        url: `${URLs[15]}${movieData.imdb_id}`,
                                    })
                                }
                            >
                                <Ionicons
                                    name="md-play-circle-sharp"
                                    size={36}
                                    color={colors.mainLightBlue}
                                />
                            </TouchableOpacity>
                            <Text style={[styles.text]}>Watch Now</Text>
                        </View>
                    </View>

                    <View style={styles.torrentSearchContainer}>
                        <TouchableHighlight
                            onPress={() =>
                                navigation.push("TorrentModal", {
                                    query:
                                        movieData.title + " " + movieData.release_date.slice(0, 4),
                                    type: "movie",
                                })
                            }
                        >
                            <Text style={styles.torrentSearchButton}>Browse Torrents</Text>
                        </TouchableHighlight>
                    </View>

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
                                    <TouchableOpacity
                                        onPress={() => {
                                            setImageIndex(index);
                                            setIsVisible(true);
                                        }}
                                    >
                                        <View
                                            style={[
                                                styles.moviePosterContainer,
                                                s.movieImages,
                                                { marginHorizontal: 8 },
                                            ]}
                                        >
                                            <Image
                                                style={styles.moviePoster}
                                                source={{ uri: IMAGE_PATH + item.file_path }}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    ) : null}

                    {movieData.videos.results.length ? (
                        <View style={styles.videoContainer}>
                            <Text style={[styles.heading_1]}>Videos</Text>
                            <FlatList
                                data={movieData.videos.results}
                                horizontal
                                keyExtractor={(item) => item.key}
                                renderItem={({ item }) =>
                                    item.site === "YouTube" ? (
                                        <TouchableHighlight
                                            onPress={() => Linking.openURL(URLs[17] + item.key)}
                                        >
                                            <View style={styles.ytContainer}>
                                                <Image
                                                    resizeMode="cover"
                                                    blurRadius={0.35}
                                                    style={styles.videoThumbnail}
                                                    source={{ uri: URLs[18] + item.key + URLs[19] }}
                                                />
                                                <Text style={styles.ytTitle}>{item.name}</Text>

                                                <View style={styles.videoPlayButton}>
                                                    <Image
                                                        style={styles.youtubeLogo}
                                                        source={require("../assets/images/youtube-logo.png")}
                                                    />
                                                </View>
                                            </View>
                                        </TouchableHighlight>
                                    ) : null
                                }
                            />
                        </View>
                    ) : null}

                    {movieData.credits.cast.length ? (
                        <View style={[s.castContainer, s.imagesContainer]}>
                            <Text style={[styles.heading_1]}>Cast</Text>
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item) => item.id.toString()}
                                data={movieData.credits.cast}
                                renderItem={({ item }) => (
                                    <View style={styles.movieWholePosterContainer}>
                                        <Pressable>
                                            <View style={[styles.moviePosterContainer]}>
                                                {item.profile_path ? (
                                                    <Image
                                                        style={styles.moviePoster}
                                                        source={{ uri: IMAGE_PATH + item.profile_path }}
                                                    />
                                                ) : (
                                                    <Image
                                                        style={[
                                                            styles.moviePoster,
                                                            { width: "80%", marginLeft: "10%" },
                                                        ]}
                                                        resizeMode="contain"
                                                        source={require("../assets/images/no-image.png")}
                                                    />
                                                )}
                                            </View>
                                        </Pressable>
                                        <View style={styles.posterDetail}>
                                            <Text
                                                ellipsizeMode={"tail"}
                                                numberOfLines={1}
                                                style={styles.posterTitle}
                                            >
                                                {item.name}
                                            </Text>
                                            {item.character ? (
                                                <Text style={styles.posterYear}>{item.character}</Text>
                                            ) : null}
                                        </View>
                                    </View>
                                )}
                            />
                        </View>
                    ) : null}

                    {movieData.similar.results.length ? (
                        <View style={[s.similarMovieContainer, s.imagesContainer]}>
                            <Text style={[styles.heading_1]}>More like this</Text>
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item) => item.id.toString()}
                                data={movieData.similar.results}
                                renderItem={({ item }) => (
                                    <View style={styles.movieWholePosterContainer}>
                                        <TouchableOpacity
                                            onPress={() =>
                                                navigation.push("Modal", {
                                                    screen: "MovieModal",
                                                    params: { id: item.id },
                                                    key: Math.round(Math.random() * 10000000),
                                                })
                                            }
                                        >
                                            <View style={styles.moviePosterContainer}>
                                                {item.poster_path ? (
                                                    <Image
                                                        style={styles.moviePoster}
                                                        source={{ uri: IMAGE_PATH + item.poster_path }}
                                                    />
                                                ) : (
                                                    <Image
                                                        style={[
                                                            styles.moviePoster,
                                                            { width: "80%", marginLeft: "10%" },
                                                        ]}
                                                        resizeMode="contain"
                                                        source={require("../assets/images/no-image.png")}
                                                    />
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                        <View style={styles.posterDetail}>
                                            <Text
                                                ellipsizeMode={"tail"}
                                                numberOfLines={1}
                                                style={styles.posterTitle}
                                            >
                                                {item.title}
                                            </Text>
                                            {item.release_date ? (
                                                <Text style={styles.posterYear}>
                                                    {months[Number(item.release_date.slice(5, 7)) - 1]}{" "}
                                                    {item.release_date.slice(8, 10)},{" "}
                                                    {item.release_date.slice(0, 4)}
                                                </Text>
                                            ) : null}
                                        </View>
                                    </View>
                                )}
                            />
                        </View>
                    ) : null}

                    {movieData.recommendations.results.length ? (
                        <View style={[s.imagesContainer]}>
                            <Text style={[styles.heading_1]}>Recommendations</Text>
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item) => item.id.toString()}
                                data={movieData.recommendations.results}
                                renderItem={({ item }) => (
                                    <View style={styles.movieWholePosterContainer}>
                                        <TouchableOpacity
                                            onPress={() =>
                                                navigation.push("Modal", {
                                                    screen: "MovieModal",
                                                    params: { id: item.id },
                                                    key: Math.round(Math.random() * 10000000),
                                                })
                                            }
                                        >
                                            <View style={styles.moviePosterContainer}>
                                                {item.poster_path ? (
                                                    <Image
                                                        style={styles.moviePoster}
                                                        source={{ uri: IMAGE_PATH + item.poster_path }}
                                                    />
                                                ) : (
                                                    <Image
                                                        style={[
                                                            styles.moviePoster,
                                                            { width: "80%", marginLeft: "10%" },
                                                        ]}
                                                        resizeMode="contain"
                                                        source={require("../assets/images/no-image.png")}
                                                    />
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                        <View style={styles.posterDetail}>
                                            <Text
                                                ellipsizeMode={"tail"}
                                                numberOfLines={1}
                                                style={styles.posterTitle}
                                            >
                                                {item.title}
                                            </Text>
                                            {item.release_date ? (
                                                <Text style={styles.posterYear}>
                                                    {months[Number(item.release_date.slice(5, 7)) - 1]}{" "}
                                                    {item.release_date.slice(8, 10)},{" "}
                                                    {item.release_date.slice(0, 4)}
                                                </Text>
                                            ) : null}
                                        </View>
                                    </View>
                                )}
                            />
                        </View>
                    ) : null}

                    <ImageView
                        images={images}
                        imageIndex={imageIndex}
                        visible={visible}
                        onRequestClose={() => setIsVisible(false)}
                    />
                </View>
            </ScrollView>
            <Animated.View style={[s.header, { height: headerHeight }]}>
                <View style={[styles.movieModalHeader]}>
                    <TouchableOpacity
                        style={{ flexDirection: "row", alignItems: "center" }}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialIcons
                            name="arrow-back"
                            size={22}
                            color={colors.lightWhite}
                        />
                        <Text
                            ellipsizeMode={"middle"}
                            numberOfLines={1}
                            style={styles.movieModalHeaderText}
                        >
                            {movieData.title}{" "}
                            {movieData.release_date.length > 0 ? (
                                <Text style={[styles.movieYear]}>
                                    ({movieData.release_date.slice(0, 4)})
                                </Text>
                            ) : null}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.modalPosterContainer}>
                    {movieData.backdrop_path ? (
                        <Image
                            style={styles.modalBackdropPoster}
                            opacity={0.75}
                            source={{ uri: IMAGE_PATH + movieData.backdrop_path }}
                        />
                    ) : (
                        <Image
                            style={[
                                styles.modalBackdropPoster,
                                {
                                    width: "100%",
                                    marginLeft: "0%",
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
                    ) : null}
                    {/* <Image 
                        resizeMode={'cover'}
                        source={{uri:IMAGE_PATH+movieData.poster_path}}
                        style={styles.modalPoster}
                    /> */}
                </View>
            </Animated.View>
        </View>
    );
}

const s = StyleSheet.create({
    movieDetailContainer: {
        flex: 1,
        backgroundColor: colors.mainBlackColor,
        paddingTop: 18,
        paddingBottom: 12,
        paddingHorizontal: 0,
    },
    fill: {
        flex: 1,
        backgroundColor: colors.mainBlackColor,
    },
    scrollViewContent: {
        flex: 1,
        paddingTop: HEADER_MAX_HEIGHT,
    },
    row: {
        height: 50,
        margin: 16,
        backgroundColor: "#D3D3D3",
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#03A9F4",
        overflow: "hidden",
        zIndex: 10,
    },
    bar: {
        height: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        backgroundColor: "transparent",
        color: "white",
        fontSize: 18,
    },
});
