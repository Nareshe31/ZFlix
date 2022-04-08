import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import {
    Dimensions,
    BackHandler,
    View,
    Text,
    TextInput,
    StyleSheet,
    Image,
    Animated,
    TouchableOpacity,
    Alert,
    Keyboard,
    ScrollView,
    TouchableWithoutFeedback,
    FlatList,
    StatusBar
} from "react-native";
import { styles, colors } from "../globalStyle";
import { MaterialIcons } from "@expo/vector-icons";
import { API_KEY, URLs } from "../globalUtils";
import { useSelector } from "react-redux";
import GenreBoxContainer from "../components/molecules/GenreBoxContainer";
import SearchSuggestionContainer from "../components/molecules/SearchSuggestionContainer";
import SearchSuggestionLoadingContainer from "../components/molecules/SearchSuggestionLoadingContainer";
import Ripple from "react-native-material-ripple";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const dimensions = {
    posterWidth: (30 * windowWidth) / 100,
    posterHeight: (18 * windowHeight) / 100,
};

export default function Search({ navigation }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [movieGenres, setMovieGenres] = useState([]);
    const [tvGenres, setTvGenres] = useState([]);
    const [isMovieGenreLoading, setIsMovieGenreLoading] = useState(true);
    const [isTvGenreLoading, setIsTvGenreLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isFirstSearch, setIsFirstSearch] = useState(true);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [currentTab, setCurrentTab] = useState(0);
    const [currentGenre, setCurrentGenre] = useState(0);
    const [allLangauages, setAllLangauages] = useState([])
    const user = useSelector((state) => state);

    var d = new Date( "01 " + "January 1940");
    let first = d.getFullYear();

    var secDate = new Date();
    let second = secDate.getFullYear();
    let years = Array();
    let decades = Array();
    
    for(let i = first; i <= second+1; i++) years.push(i);
    for(let i = 1940; i <= second+1; i=i+10) decades.push(i);
    const runtime=['1 hour or less','1-2 hours','2-3 hours','3-4 hours','4 or more hours']
    useEffect(() => {
        getAllGenres();
        const keyboardDidShowListener = Keyboard.addListener(
            "keyboardDidShow",
            () => {
                setKeyboardVisible(true); // or some other action
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            "keyboardDidHide",
            () => {
                setKeyboardVisible(false); // or some other action
            }
        );

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            handleBackButtonClick
        );
        return () => {
            backHandler.remove();
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, [searching]);

    const handleBackButtonClick = () => {
        if (searching && !isKeyboardVisible) {
            setSearching(false);
            Keyboard.dismiss();
            setSearchQuery("");
            setSuggestions([]);
            return true;
        } else if (navigation.isFocused()) {
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
    const getAllGenres = async () => {
        await getAllMovieGenres();
        await getAllTvGenres();
        await getAllLanguages()
    };

    const getAllMovieGenres = async () => {
        try {
            let response = await axios.get(URLs[20]);
            setMovieGenres(response.data.genres);
            setIsMovieGenreLoading(false);
            await axios.post(URLs[26], {
                id: user._id,
                search: {
                    keyword: route.params.searchQuery,
                },
            });
        } catch (error) {
            // Alert.alert('Oops...','Something went wrong',[{text:"Go back",onPress:()=>navigation.goBack()}])
        }
    };

    const getAllLanguages = async () => {
        try {
            let response = await axios.get(URLs[30]);
            let lang=response.data.sort(function (a, b) {
                return a.english_name > b.english_name;
              });
            setAllLangauages(lang)
        } catch (error) {
            // Alert.alert('Oops...','Something went wrong',[{text:"Go back",onPress:()=>navigation.goBack()}])
        }
    };

    const getAllTvGenres = async () => {
        try {
            let response = await axios.get(URLs[21]);
            setTvGenres(response.data.genres);
            setIsTvGenreLoading(false);
        } catch (error) {
            // Alert.alert('Oops...','Something went wrong',[{text:"Go back",onPress:()=>navigation.goBack()}])
        }
    };
    const search = () => {
        navigation.push("SearchModal", { searchQuery: searchQuery });
    };
    const handleEnter = () => {
        if (searchQuery === "") {
            // Alert.alert('Oops...','Search query is empty',[{text:'Ok'}])
        } else {
            search();
        }
    };
    const handleChange = (text) => {
        setSearchQuery(text);
    };
    const timer = useRef(null);

    const searchSuggestions = async () => {
        clearTimeout(timer.current);
        timer.current = setTimeout(async () => {
            try {
                if (searchQuery !== "") {
                    setIsSearching(true);
                    let { data } = await axios.get(
                        `${URLs[22]}${searchQuery}&api_key=${API_KEY}&page=1`
                    );
                    setSuggestions(data.results);
                    setIsSearching(false);
                    setIsFirstSearch(false);
                    await axios.post(URLs[26], {
                        id: user._id,
                        search: {
                            keyword: searchQuery,
                        },
                    });
                    // let response = await axios.get(URL+'/api/search/' + name)
                    // this.setState({ searched_users: response.data.users,searching:false})
                } else {
                }
            } catch (error) { }
        }, 500);
    };
    function handleKeyPress(e) {
        clearTimeout(timer.current);
    }
    function handleScroll() {
        Keyboard.dismiss();
    }
    function handleTabPress(value) {
        if (currentTab !== value) setCurrentTab(value);
    }
    function handleGenreChange(value) {
        if (currentGenre !== value) setCurrentGenre(value);
    }
    return (
        <View
            style={[styles.container,{paddingTop:StatusBar.currentHeight}]}
        >
            <View style={{paddingVertical:8,backgroundColor:colors.mainBlackLightColor}}>
                <View style={s.searchContainer}>
                    {searching ? (
                        <TouchableWithoutFeedback
                            onPress={() => {
                                Keyboard.dismiss();
                                setSearching(false);
                                setSearchQuery("");
                                setSuggestions([]);
                            }}
                        >
                            <View style={s.backIcon}>
                                <MaterialIcons
                                    name="arrow-back"
                                    size={24}
                                    color={colors.lighterWhite}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    ) : null}
                    <TextInput
                        placeholder="Search by title, actor..."
                        placeholderTextColor={colors.lighterWhite}
                        style={[s.searchInput, { paddingLeft: searching ? 0 : 16 }]}
                        onChangeText={handleChange}
                        value={searchQuery}
                        returnKeyType="search"
                        onFocus={() => setSearching(true)}
                        onKeyPress={searchSuggestions}
                        onPressIn={handleKeyPress}
                        selectionColor={colors.lighterWhite}
                        onSubmitEditing={(e) => handleEnter()}
                    />
                {searching && searchQuery.length ? (
                    <TouchableOpacity
                        onPress={() => {
                            setSearchQuery("");
                            setSuggestions([]);
                        }}
                    >
                        <View style={s.searchIcon}>
                            <MaterialIcons
                                name="close"
                                size={28}
                                color={colors.lighterWhite}
                            />
                        </View>
                    </TouchableOpacity>
                ) : (
                    <>
                        {!searching ? (
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    Keyboard.dismiss();
                                    handleEnter();
                                }}
                            >
                                <View style={s.searchIcon}>
                                    <MaterialIcons
                                        name="search"
                                        size={28}
                                        color={colors.lighterWhite}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                        ) : null}
                    </>
                )}
                
                </View>
            </View>

            {!searching ? (
                <ScrollView
                    contentContainerStyle={{paddingTop:0}}
                    keyboardShouldPersistTaps="always"
                    style={[styles.container]}
                >
                    <View style={s.genreContainer}>
                        <Text style={s.genreHeader}>Movie Genres</Text>
                        <GenreBoxContainer
                            data={movieGenres}
                            loading={isMovieGenreLoading}
                            navigation={navigation}
                            type="movie"
                            mVertical={8}
                            mHorizontal={6}
                            fontSize={17}
                        />
                    </View>

                    <View style={s.genreContainer}>
                        <Text style={s.genreHeader}>Tv Show Genres</Text>
                        <GenreBoxContainer
                            loading={isTvGenreLoading}
                            data={tvGenres}
                            navigation={navigation}
                            type="tv"
                            mVertical={8}
                            mHorizontal={6}
                            fontSize={17}
                        />
                    </View>
                </ScrollView>
            ) : (
                <View style={{flex:1}}>
                    <Tab currentTab={currentTab} handleTabPress={handleTabPress} />
                    {currentTab == 0 ? 
                        <RecentTab 
                            isSearching={isSearching}
                            suggestions={suggestions}
                            searchQuery={searchQuery}
                            navigation={navigation}
                            handleScroll={handleScroll}
                        /> 
                        : 
                        <AdvancedSearchTab 
                            movieGenres={movieGenres} 
                            tvGenres={tvGenres} 
                            currentGenre={currentGenre}
                            handleGenreChange={handleGenreChange}
                            years={years}
                            decades={decades}
                            runtime={runtime}
                            allLangauages={allLangauages}
                        />}
                </View>
            )}
        </View>
    );
}

function Tab({ currentTab, handleTabPress }) {
    return (
        <View style={[s.tabContainer]}>
            <Ripple
                rippleColor={colors.rippleColor}
                onPress={() => handleTabPress(0)}
            >
                <View
                    style={[
                        s.eachTab,
                        {
                            borderBottomColor:
                                currentTab == 0 ? colors.lightestWhite : colors.mainBlackColor,
                        },
                    ]}
                >
                    <Text style={[s.tabHeaderText]}>Recent</Text>
                </View>
            </Ripple>
            <Ripple
                rippleColor={colors.rippleColor}
                onPress={() => handleTabPress(1)}
            >
                <View
                    style={[
                        s.eachTab,
                        {
                            borderBottomColor:
                                currentTab == 1 ? colors.lightestWhite : colors.mainBlackColor,
                        },
                    ]}
                >
                    <Text style={[s.tabHeaderText]}>Advanced Search</Text>
                </View>
            </Ripple>
        </View>
    );
}

function RecentTab({isSearching,suggestions,searchQuery,navigation,handleScroll}) {
    return (
        <View style={[styles.container,{paddingTop:10}]}>
             {!isSearching && suggestions.length ? (
                <View style={[styles.container]}>
                    {searchQuery != "" ? (
                        <View
                            style={[
                                styles.popularHeaderContainer,
                                { paddingBottom: 8, marginVertical: 5 },
                            ]}
                        >
                            <Text
                                ellipsizeMode="tail"
                                numberOfLines={1}
                                style={[styles.popularHeaderText, { flex: 1 }]}
                            >
                                Browse Torrents for '{searchQuery}'
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.push("YtsTorrentModal", {
                                        query: searchQuery,
                                        type: "movie",
                                    });
                                }}
                            >
                                <MaterialIcons
                                    style={{ marginRight: 10, paddingLeft: 15 }}
                                    name="keyboard-arrow-right"
                                    size={26}
                                    color={colors.lightWhite}
                                />
                            </TouchableOpacity>
                        </View>
                    ) : null}
                    <View
                        style={[styles.popularHeaderContainer, { paddingBottom: 8 }]}
                    >
                        <Text style={styles.popularHeaderText}>Top Results</Text>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.push("SearchModal", {
                                    searchQuery: searchQuery,
                                });
                            }}
                        >
                            <MaterialIcons
                                style={{ marginRight: 10, paddingLeft: 15 }}
                                name="keyboard-arrow-right"
                                size={26}
                                color={colors.lightWhite}
                            />
                        </TouchableOpacity>
                    </View>
                    <SearchSuggestionContainer data={suggestions} navigation={navigation} scrolling={handleScroll} />
                </View>
            ) : (
                <>
                    {isSearching ? (
                        <View style={[styles.container]}>
                            <View
                                style={[
                                    styles.popularHeaderContainer,
                                    { paddingBottom: 8 },
                                ]}
                            >
                                <Text style={styles.popularHeaderText}>Top Results</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (!isSearching) {
                                            handleEnter();
                                            setSearching(false);
                                            setSuggestions([]);
                                        }
                                    }}
                                >
                                    <MaterialIcons
                                        style={{ marginRight: 10, paddingLeft: 15 }}
                                        name="keyboard-arrow-right"
                                        size={26}
                                        color={colors.lightWhite}
                                    />
                                </TouchableOpacity>
                            </View>
                            <SearchSuggestionLoadingContainer  />
                        </View>
                    ) : (
                        <View style={styles.container}>
                            {searchQuery != "" ? (
                                <View style={[styles.popularHeaderContainer]}>
                                    <Text
                                        ellipsizeMode={"tail"}
                                        numberOfLines={1}
                                        style={[styles.popularHeaderText, { flex: 1 }]}
                                    >
                                        Browse Torrents for '{searchQuery}'
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            navigation.push("TorrentModal", {
                                                query: searchQuery,
                                                type: "movie",
                                            });
                                        }}
                                    >
                                        <MaterialIcons
                                            style={{ marginRight: 10, paddingLeft: 15 }}
                                            name="keyboard-arrow-right"
                                            size={26}
                                            color={colors.lightWhite}
                                        />
                                    </TouchableOpacity>
                                </View>
                            ) : null}
                            {searchQuery != "" ? (
                                <View
                                    style={[
                                        styles.popularHeaderContainer,
                                        { paddingBottom: 8 },
                                    ]}
                                >
                                    <Text style={styles.popularHeaderText}>Top Results</Text>
                                </View>
                            ) : null}
                            <View style={styles.noResultContainer}>
                                {searchQuery != "" &&
                                    !suggestions.length ? (
                                    <Image
                                        source={require("../assets/images/no-result.gif")}
                                        style={{ width: 100, height: 100, margin: 10 }}
                                    />
                                ) : null}
                                <Text style={styles.noResultText}>
                                    {searchQuery == "" &&
                                        suggestions.length
                                        ? "Type to see results"
                                        : "No results"}
                                </Text>
                            </View>
                        </View>
                    )}
                </>
            )}
        </View>
    );
}

function AdvancedSearchTab({movieGenres,tvGenres,currentGenre,handleGenreChange,years,decades,runtime,allLangauages }) {
    return (
        <View style={[styles.container]}>
            <View style={[styles.noResultContainer]}>
                <Text style={styles.noResultText}>Coming Soon...</Text>
            </View>
            {/* <ScrollView style={[styles.container]} >
            <View style={[s.searchOptionWholeContainer]}>
                <Text style={[s.searchHeader]}>Type</Text>
                <View style={[s.searchOptionContainer]}>
                    <View style={[s.searchOptionBox]}>
                        <Ripple rippleColor={colors.rippleColor} onPress={()=>handleGenreChange(0)}>
                            <Text style={[s.searchOptionText,{backgroundColor:currentGenre===0?colors.lightBlackColor:colors.mainBlackLightColor}]}>Movie</Text>
                        </Ripple>
                    </View>
                    <View style={[s.searchOptionBox]}>
                        <Ripple rippleColor={colors.rippleColor} onPress={()=>handleGenreChange(1)}>
                            <Text style={[s.searchOptionText,{backgroundColor:currentGenre===1?colors.lightBlackColor:colors.mainBlackLightColor}]}>TV</Text>
                        </Ripple>
                    </View>
                </View>
            </View>

            <View style={[s.searchOptionWholeContainer]}>
                <Text style={[s.searchHeader]}>Genre</Text>
                <View style={[s.searchOptionContainer]}>
                    <FlatList 
                        data={currentGenre===0?movieGenres:tvGenres}
                        horizontal
                        keyExtractor={(item)=>item.id.toString()}
                        renderItem={({item})=>(
                            <View key={item.id} style={[s.searchOptionBox]}>
                                <Ripple rippleColor={colors.rippleColor}>
                                    <Text style={[s.searchOptionText]}>{item.name}</Text>
                                </Ripple>
                            </View>
                        )}

                        />
                </View>
            </View>

            <View style={[s.searchOptionWholeContainer]}>
                <Text style={[s.searchHeader]}>Decades</Text>
                <View style={[s.searchOptionContainer]}>
                    {decades.map(item=>(
                        <View key={item} style={[s.searchOptionBox]}>
                            <Ripple rippleColor={colors.rippleColor}>
                                <Text style={[s.searchOptionText]}>{item}s</Text>
                            </Ripple>
                        </View>
                      
                      ))}
                </View>
            </View>

            <View style={[s.searchOptionWholeContainer]}>
                <Text style={[s.searchHeader]}>Runtime</Text>
                <View style={[s.searchOptionContainer]}>
                    {runtime.map(item=>(
                        <View key={item} style={[s.searchOptionBox]}>
                            <Ripple rippleColor={colors.rippleColor}>
                                <Text style={[s.searchOptionText]}>{item}</Text>
                            </Ripple>
                        </View>
                      
                      ))}
                </View>
            </View>

            <View style={[s.searchOptionWholeContainer]}>
                <Text style={[s.searchHeader]}>Languages</Text>
                <View style={[s.searchOptionContainer]}>
                    {allLangauages.map(item=>(
                        <View key={item.iso_639_1} style={[s.searchOptionBox]}>
                            <Ripple rippleColor={colors.rippleColor}>
                                <Text style={[s.searchOptionText]}>{item.english_name}</Text>
                            </Ripple>
                        </View>
                      
                      ))}
                </View>
            </View>
            </ScrollView> */}
        </View>
    );
}

const s = StyleSheet.create({
    searchInput: {
        paddingVertical: 10,
        paddingRight: 12,
        borderRadius: 5,
        color: colors.lightWhite,
        fontSize: 16,
        fontFamily: "Nunito-Regular",
        flex: 1,
    },
    genreContainer: {
        marginVertical: 14,
        marginHorizontal: 10,
        position: "relative",
    },
    genreHeader: {
        fontSize: 18,
        fontFamily: "Nunito-Bold",
        color: colors.lightWhite,
        marginLeft: 10,
    },
    searchContainer: {
        flexDirection: "row",
        marginHorizontal:8,
        borderWidth: 0,
        borderColor: colors.lightWhite,
        borderRadius: 6,
        width: (windowWidth-16),
        position: "relative",
        backgroundColor: colors.mainBlackColor,
        alignItems: "center",
    },
    searchIcon: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 8,
    },
    backIcon: {
        paddingHorizontal: 10,
    },
    tabContainer: {
        width: windowWidth,
        flexDirection: "row",
    },
    eachTab: {
        width: windowWidth / 2,
        backgroundColor: colors.mainBlackColor,
        borderBottomColor: colors.mainBlackColor,
        borderBottomWidth: 2,
        paddingVertical: 14,
        paddingHorizontal: 12,
    },
    tabHeaderText: {
        fontSize: 17,
        textAlign: "center",
        color: colors.lightWhite,
        fontFamily:'Nunito-Bold'
    },
    searchOptionWholeContainer:{
        marginHorizontal:10,
        marginVertical:5
    },
    searchHeader:{
        fontSize: 17,
        color: colors.lightWhite,
        fontFamily:'Nunito-Bold',
        marginBottom:5
    },
    searchOptionContainer:{
        flexDirection:'row',
        flexWrap:'wrap',
    },
    searchOptionBox:{
        alignSelf: "flex-start",
        marginVertical:5,
        marginRight:10,
    },
    searchOptionText:{
        fontSize: 15,
        color: colors.lightWhite,
        fontFamily:'Nunito-Regular',
        paddingVertical:8,
        paddingHorizontal:14,
        backgroundColor:colors.lightestBlackColor,
        borderRadius:5
    }
});
