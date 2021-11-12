import React from "react";
import { View, StyleSheet } from "react-native";
import SearchSuggestionPoster from "../atoms/SearchSuggestionPoster";
import Ripple from "react-native-material-ripple";
import { colors } from "../../globalStyle";
import SearchSuggestionDetail from "../atoms/SearchSuggestionDetail";

export default function SearchSuggestion({ item, navigation }) {
    const navigateToScreen = () => {
        if (item.media_type === "movie") {
            navigation.push("Modal", {
                screen: "MovieModal",
                params: {
                    id: item.id,
                    release_date: item.release_date,
                    title: item.title,
                },
                key: Math.round(Math.random() * 10000000),
            });
        } else if (item.media_type === "tv") {
            navigation.push("TvShowModal", {
                screen: "TvModal",
                params: {
                    id: item.id,
                    name: item.name,
                    first_air_date: item.first_air_date,
                },
                key: Math.round(Math.random() * 10000000),
            });
        } else {
            navigation.push("PersonModal", {
                screen: "PersonScreen",
                params: { id: item.id, name: item.name },
                key: Math.round(Math.random() * 10000000),
            });
        }
    };

    return (
        <View style={s.suggestionWholeBox}>
            <Ripple rippleColor={colors.rippleColor} onPress={navigateToScreen}>
                <View style={s.suggestionMainContainer}>
                    <SearchSuggestionPoster item={item} />
                    <SearchSuggestionDetail item={item} />
                </View>
            </Ripple>
        </View>
    );
}

const s = StyleSheet.create({
    suggestionMainContainer: {
        flexDirection: "row",
        backgroundColor: colors.mainBlackLightColor,
        borderRadius: 10,
    },
    suggestionWholeBox:{
        marginVertical: 10,
        marginHorizontal: 14,
    },
});
