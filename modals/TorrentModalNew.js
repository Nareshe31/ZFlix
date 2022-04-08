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
import { months, Torrent_Search_New } from "../globalUtils";
import * as WebBrowser from "expo-web-browser";
import LottieView from "lottie-react-native";
import ScreenHeaderWithTorrentFilter from "../components/atoms/ScreenHeaderWithTorrentFilter";

const windowWidth = Dimensions.get("window").width;

export default function TorrentModal({ navigation, route }) {
    const [torrents, setTorrents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pages, setPages] = useState(0);
    const [
        onEndReachedCalledDuringMomentum,
        setOnEndReachedCalledDuringMomentum,
    ] = useState(false);
    const [filterValue, setFilterValue] = useState(route.params.type=="movie"?"Yts":"ThePirateBay");

    let {query}=route.params
    useEffect(() => {
        getTorrents();
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            handleBackButtonClick
        );
        return () => {
            backHandler.remove();
        };
    }, []);

    useEffect(() => {
    
        getTorrents();
      return () => {
      }
    }, [filterValue])
    

    const handleBackButtonClick = () => {
        navigation.goBack();
        return true;
    };

    const handleFilterChange = (value) => {
        setFilterValue(value);
    };

    const getTorrents = async () => {
        try {
            setIsLoading(true)
            let response = await axios.post(
                `${Torrent_Search_New}`,
                {
                    query:query,
                    type:"All",
                    providers:[filterValue]
                }
            );
            setTorrents(response.data.results)
            setPages(response.data.total_pages);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
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
            <ScreenHeaderWithTorrentFilter
                navigation={navigation}
                title={"Torrents - "+route.params.query}
                filter={true}
                filterValue={filterValue}
                type={route.params.type}
                handleFilterChange={handleFilterChange}
            />
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
                                ListHeaderComponent={()=>
                                    <Text style={s.torrentTitle}>Total results: {torrents.length}</Text>
                                }
                                keyExtractor={(item) =>
                                    item.magnet + Math.round(Math.random() * 10000000).toString()
                                }
                                renderItem={({ item }) =><YtsBox query={query} type={filterValue} item={item} />}
                              
                            />
                            {/* {refreshing?<ActivityIndicator size='large' color={colors.mainBlue}  />:null} */}
                        </SafeAreaView>
                    ) : (
                        <View style={styles.noResultContainer}>
                            <Image
                                source={require("../assets/images/no-result.gif")}
                                style={{ width: 100, height: 100, margin: 10 }}
                            />
                            <Text style={styles.noResultText}>No torrents found in YTS</Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

const YtsBox=({item,type,query})=>{

    const getDate=(date)=>{
        let d=new Date(String(date).split(' ')[0])
        return months[d.getMonth()]+" "+d.getDate()+", "+d.getFullYear()
    }

    const getDate2=(date)=>{
        let d=new Date(date)
        return months[d.getMonth()]+" "+d.getDate()+", "+d.getFullYear()
    }

    let magnet=type=="Yts"?"magnet:?xt=urn:btih:"+String(item.link).slice(-40)+"&amp;dn="+query+"&amp;tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce&amp;tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&amp;tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&amp;tr=udp%3A%2F%2Fp4p.arenabg.ch%3A1337&amp;tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337":item.magnet
    let date=type=="ThePirateBay"?getDate2(item.time):getDate(item.time)
    
    return(
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
                <View style={[s.torrentSeederContainer, s.flex]}>
                    <MaterialCommunityIcons
                        name="calendar-month"
                        size={22}
                        color={colors.lightGray}
                    />
                    <Text style={s.normalText}>{date}</Text>
                </View>
                <View style={[s.flex]}>

                    <TouchableOpacity
                        onPress={() => Linking.openURL(magnet)}
                    >
                        <View style={[s.torrentLinkContainer, s.flex]}>
                            <MaterialCommunityIcons
                                name="magnet"
                                size={22}
                                color={colors.lightGray}
                            />
                            {/* <Text style={s.normalText}>Link</Text> */}
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
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
        marginHorizontal: 3,
    },
    torrentLinkContainer: {
        marginHorizontal: 8,
    },
});
