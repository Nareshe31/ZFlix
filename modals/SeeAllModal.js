import axios from "axios";
import React, { useState, useEffect } from "react";
import {
    Dimensions,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Animated,
    StatusBar
} from "react-native";
import { colors, styles } from "../globalStyle";
import { API_KEY, IMAGE_PATH, months, URLs } from "../globalUtils";
import SmallPosterLoadingContainer from "../components/molecules/SmallPosterLoadingContainer";
import SmallPosterContainer from "../components/molecules/SmallPosterContainer";
import ScreenHeader from "../components/atoms/ScreenHeader";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const movieIds = [6, 7, 8];
const tvIds = [9, 10, 11];

export default function SeeAllModal({ navigation, route }) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [movieData, setMovieData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pages, setPages] = useState(0);
    const { id, title, type } = route.params;

    useEffect(() => {
        setMovieData([]);
        getMovies(1);
    }, []);

    const getMovies = async (page) => {
        try {
            let response = await axios.get(`${URLs[id]}&page=${page}`);
            setMovieData((prev) => [...prev, ...response.data.results]);
            setIsRefreshing(false);
            setPages(response.data.total_pages);
            setIsLoading(false);
        } catch (error) {
            // Alert.alert('Oops...', 'Something went wrong', [{ text: "Go back", onPress: () => navigation.goBack() }])
        }
    };
    const handleReachEnd = () => {
        setIsRefreshing(true);
        getMovies(movieData.length / 20 + 1);
    };
    return (
        <View
            style={[
                styles.container,
                { width: "100%", position: "relative" },
                { paddingTop: StatusBar.currentHeight },
            ]}
        >
            <ScreenHeader navigation={navigation} title={title} filter={false} />

            {isLoading ? (
                <SmallPosterLoadingContainer />
            ) : (
                <SmallPosterContainer
                    type={type}
                    navigation={navigation}
                    handleReachEnd={handleReachEnd}
                    movieData={movieData}
                    pages={pages}
                />
            )}
        </View>
    );
}

const s = StyleSheet.create({
    posterDetail: {
        marginVertical: 8,
    },
    posterTitle: {
        color: colors.lightWhite,
        fontFamily: "Nunito-SemiBold",
        fontSize: 18,
    },
    posterYear: {
        color: colors.lightGray,
        fontFamily: "Nunito-Regular",
        fontSize: 14,
    },
});
