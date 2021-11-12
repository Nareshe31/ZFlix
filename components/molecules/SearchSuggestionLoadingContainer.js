import React,{useEffect} from 'react';
import { Animated,FlatList,View,StyleSheet,Dimensions } from 'react-native'
import { colors,dimensions } from '../../globalStyle';

const windowWidth = Dimensions.get("window").width;

const loadingImages = [
    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
];


export default function SearchSuggestionLoadingContainer({}) {
    const opacity = new Animated.Value(0.7);
    useEffect(() => {
        fadeIn();
    }, []);
    const fadeIn = () => {
        Animated.timing(opacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start(() => fadeOut());
    };
    const fadeOut = () => {
        Animated.timing(opacity, {
            toValue: 0.7,
            duration: 800,
            useNativeDriver: true,
        }).start(() => fadeIn());
    };
    return (
        <FlatList
            showsHorizontalScrollIndicator={false}
            data={loadingImages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={s.suggestionMainContainer}>
                    <Animated.View style={[s.moviePosterContainer, { opacity: opacity }]}>
                        <View
                            style={[
                                s.moviePoster,
                                { justifyContent: "center", alignItems: "center" },
                            ]}
                        ></View>
                    </Animated.View>
                    <View style={s.suggestionDetailContainer}>
                        <Animated.View
                            style={{
                                width: (33 * windowWidth) / 100,
                                backgroundColor: colors.loadingColor,
                                marginVertical: 6,
                                borderRadius: 10,
                                padding: 5,
                                opacity,
                            }}
                        ></Animated.View>
                        <Animated.View
                            style={{
                                width: (55 * windowWidth) / 100,
                                backgroundColor: colors.loadingColor,
                                padding: 5,
                                borderRadius: 10,
                                opacity,
                                marginVertical: 6,
                            }}
                        ></Animated.View>
                        <Animated.View
                            style={{
                                width: (55 * windowWidth) / 100,
                                backgroundColor: colors.loadingColor,
                                padding: 5,
                                borderRadius: 10,
                                opacity,
                                marginVertical: 6,
                            }}
                        ></Animated.View>
                        <Animated.View
                            style={{
                                width: (55 * windowWidth) / 100,
                                backgroundColor: colors.loadingColor,
                                padding: 5,
                                borderRadius: 10,
                                opacity,
                                marginVertical: 6,
                            }}
                        ></Animated.View>
                    </View>
                </View>
            )}
        />
    );
}

const s=StyleSheet.create({
    suggestionMainContainer: {
        flexDirection: "row",
        marginVertical: 10,
        marginHorizontal: 14,
        backgroundColor: colors.mainBlackLightColor,
        borderRadius: 10,
    },
    suggestionDetailContainer: {
        flex: 1,
        paddingHorizontal: 12,
        justifyContent: "center",
    },
    
    moviePoster: {
        width: dimensions.posterWidth,
        height: dimensions.posterHeight,
        borderTopLeftRadius:10,
        borderBottomLeftRadius:10,
        minHeight: 100,
        maxHeight: 170,
    },
    moviePosterContainer: {
        borderTopLeftRadius:10,
        borderBottomLeftRadius:10,
        backgroundColor: colors.loadingColor,
    },
})