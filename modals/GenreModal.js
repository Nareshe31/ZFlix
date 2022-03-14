import axios from "axios";
import React, { useState, useEffect } from "react";
import {
    Dimensions,
    View,
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
import ScreenHeaderWithFilter from "../components/atoms/ScreenHeaderWithFilter";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function GenreModal({ navigation, route }) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [movieData, setMovieData] = useState([]);
    const [filterValue, setFilterValue] = useState("popularity.desc");
    const [isLoading, setIsLoading] = useState(true);
    const [pages, setPages] = useState(0);

    useEffect(() => {
        setMovieData([]);
        getMovies(1);
        setIsLoading(true);
    }, [filterValue]);

    const { type, genreId, genreName } = route.params;
    const getMovies = async (page) => {
        try {
            let response = await axios.get(
                `${URLs[23]}${type}?api_key=${API_KEY}&page=${page}&language=en-US&sort_by=${filterValue}&with_genres=${genreId}`
            );
            setIsRefreshing(false);
            setPages(response.data.total_pages);
            setMovieData((prev) => {
                return [...prev, ...response.data.results];
            });
            setIsLoading(false);
        } catch (error) {
            // Alert.alert('Oops...','Something went wrong',[{text:"Go back",onPress:()=>navigation.goBack()}])
        }
    };
    const handleReachEnd = () => {
        setIsRefreshing(true);
        getMovies(movieData.length / 20 + 1);
    };

    const handleFilterChange = (value) => {
        setFilterValue(value);
    };
    return (
        <View
            style={[
                styles.container,
                {
                    width: "100%",
                    position: "relative",
                    backgroundColor: colors.mainBlackColor,
                },
                { paddingTop: StatusBar.currentHeight },
            ]}
        >
            <ScreenHeaderWithFilter
                navigation={navigation}
                title={genreName}
                filter={true}
                filterValue={filterValue}
                handleFilterChange={handleFilterChange}
            />

            {isLoading ? (
                <SmallPosterLoadingContainer />
            ) : (
                <SmallPosterContainer
                    navigation={navigation}
                    type={type}
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
        fontSize: 16,
    },
    posterYear: {
        color: colors.lightGray,
        fontFamily: "Nunito-Regular",
        fontSize: 14,
    },
});
