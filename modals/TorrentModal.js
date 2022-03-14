import React, { useState, useEffect } from "react";
import {
    BackHandler,
    Dimensions,
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Linking,
    FlatList,
    StatusBar
} from "react-native";
import { styles, colors } from "../globalStyle";
import {
    MaterialIcons,
    FontAwesome,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import axios from "axios";
import { Torrent_Search } from "../globalUtils";
import * as WebBrowser from "expo-web-browser";
import LottieView from "lottie-react-native";

const windowWidth = Dimensions.get("window").width;

export default function TorrentModal({ navigation, route }) {
    const [torrents, setTorrents] = useState([]);
    const [refreshing, setRefreshing] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [pages, setPages] = useState(0);
    const [
        onEndReachedCalledDuringMomentum,
        setOnEndReachedCalledDuringMomentum,
    ] = useState(false);
    useEffect(() => {
        getTorrents(1);
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

    const getTorrents = async (page) => {
        try {
            let response = await axios.get(
                `${Torrent_Search}${route.params.query}/${page}`
            );
            setTorrents((prev) => {
                return [...prev, ...response.data.result];
            });
            setPages(response.data.total_pages);
            setIsLoading(false);
            setRefreshing(false);
        } catch (error) {
            // Alert.alert('Oops...','Something went wrong',[{text:"Go back",onPress:()=>navigation.goBack()}])
        }
    };
    return (
        <View
            style={[
                styles.container,
                { backgroundColor: colors.mainBlackColor },
                { paddingTop: StatusBar.currentHeight },
            ]}
        >
            <View style={[s.movieModalHeader]}>
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
                    style={s.movieModalHeaderText}
                >
                    Torrents for "{route.params.query}"{" "}
                </Text>
            </View>
            {isLoading ? (
                <View
                    style={[
                        styles.pageLoader,
                        { backgroundColor: colors.mainBlackColor },
                    ]}
                >
                    {/* <ActivityIndicator size='large' color={colors.mainBlue}  /> */}
                    {/* <Image source={require('../assets/images/loading-hand.gif')} style={{width:250,height:350}}  /> */}
                    <LottieView
                        source={require("../assets/lotties/loading-hand.json")}
                        autoPlay
                        loop
                    />
                </View>
            ) : (
                <View
                    style={[styles.container, { backgroundColor: colors.mainBlackColor }]}
                >
                    {torrents && torrents.length > 0 ? (
                        <SafeAreaView
                            style={[
                                styles.container,
                                { backgroundColor: colors.mainBlackColor },
                            ]}
                        >
                            <FlatList
                                data={torrents}
                                keyExtractor={(item) =>
                                    item.magnet + Math.round(Math.random() * 10000000).toString()
                                }
                                renderItem={({ item }) => (
                                    <View key={item.magnet} style={s.torrentContainer}>
                                        <Text style={s.torrentTitle}>{item.title}</Text>
                                        <View style={[s.torrentDetailsContainer, s.flex]}>
                                            <View style={[s.torrentSizeContainer, s.flex]}>
                                                <FontAwesome
                                                    name="database"
                                                    size={22}
                                                    color={colors.lightGray}
                                                />
                                                <Text style={s.normalText}>{item.size}</Text>
                                            </View>
                                            <View style={[s.torrentPeerContainer, s.flex]}>
                                                <MaterialIcons
                                                    name="file-upload"
                                                    size={22}
                                                    color={colors.lightGray}
                                                />
                                                <Text style={s.normalText}>{item.seeds}</Text>
                                            </View>
                                            <View style={[s.torrentSeederContainer, s.flex]}>
                                                <MaterialIcons
                                                    name="file-download"
                                                    size={22}
                                                    color={colors.lightGray}
                                                />
                                                <Text style={s.normalText}>{item.peers}</Text>
                                            </View>
                                            <View style={[s.flex]}>
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        WebBrowser.openBrowserAsync(item.torrent)
                                                    }
                                                >
                                                    <View style={[s.torrentLinkContainer, s.flex]}>
                                                        <MaterialIcons
                                                            name="file-download"
                                                            size={22}
                                                            color={colors.lightGray}
                                                        />
                                                        {/* <Text style={s.normalText}>Download</Text> */}
                                                    </View>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    onPress={() => Linking.openURL(item.magnet)}
                                                >
                                                    <View style={[s.torrentLinkContainer, s.flex]}>
                                                        <MaterialCommunityIcons
                                                            name="magnet"
                                                            size={22}
                                                            color={colors.lightGray}
                                                        />
                                                        {/* <Text style={s.normalText}>Magnet</Text> */}
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                            {/* }  */}
                                        </View>
                                    </View>
                                )}
                                ListFooterComponent={() =>
                                    torrents.length / 20 + 1 < pages ? (
                                        <ActivityIndicator size="large" color={colors.mainBlue} />
                                    ) : null
                                }
                                onEndReached={({ distanceFromEnd }) => {
                                    if (
                                        !onEndReachedCalledDuringMomentum &&
                                        torrents.length / 20 + 1 < pages
                                    ) {
                                        setRefreshing(true);
                                        setOnEndReachedCalledDuringMomentum(true);
                                        getTorrents(torrents.length / 20 + 1);
                                    }
                                }}
                                onMomentumScrollBegin={() => {
                                    setOnEndReachedCalledDuringMomentum(false);
                                }}
                                onEndReachedThreshold={0.25}
                            />
                            {/* {refreshing?<ActivityIndicator size='large' color={colors.mainBlue}  />:null} */}
                        </SafeAreaView>
                    ) : (
                        <View style={styles.noResultContainer}>
                            <Image
                                source={require("../assets/images/no-result.gif")}
                                style={{ width: 100, height: 100, margin: 10 }}
                            />
                            <Text style={styles.noResultText}>No torrents found</Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

const s = StyleSheet.create({
    movieModalHeader: {
        backgroundColor: colors.mainBlackColor,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    movieModalHeaderText: {
        fontSize: 20,
        color: colors.lightWhite,
        marginLeft: 8,
        marginTop: 1,
        flex: 1,
        flexWrap: "wrap",
    },
    torrentContainer: {
        marginHorizontal: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: colors.lightGray,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    torrentTitle: {
        color: colors.lightWhite,
        fontSize: 18,
        fontFamily: "Nunito-SemiBold",
    },
    torrentDetailsContainer: {
        marginVertical: 8,
        justifyContent: "space-between",
    },
    flex: {
        flexDirection: "row",
        alignItems: "center",
    },
    normalText: {
        color: colors.lightGray,
        fontSize: 15,
        fontFamily: "Nunito-Regular",
        marginHorizontal: 5,
    },
    torrentLinkContainer: {
        marginHorizontal: 8,
    },
});
