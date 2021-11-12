import React from 'react';
import {View,Text,StyleSheet } from 'react-native'
import { styles,colors } from "../../globalStyle";

export default function SearchSuggestionDetail({item}){

    const MovieOverview=()=>(
        <View style={s.suggestionDetailContainer}>
            <Text style={s.posterTitle}>
                {item.title}{" "}
                {item.release_date ? "(" + item.release_date.slice(0, 4) + ")" : ""}
            </Text>
            <Text style={s.movieText} ellipsizeMode={"tail"} numberOfLines={3}>
                {item.overview ? item.overview : "Overview not available"}
            </Text>
            <Text style={[styles.tvBox, { width: 40, marginVertical: 5 }]}>
                Movie
            </Text>
        </View>
    )
    const TvOverview=()=>(
        <View style={s.suggestionDetailContainer}>
            <Text style={s.posterTitle}>
                {item.name}{" "}
                {item.first_air_date
                    ? "(" + item.first_air_date.slice(0, 4) + ")"
                    : ""}
            </Text>
            <Text style={s.movieText} ellipsizeMode={"tail"} numberOfLines={3}>
                {item.overview ? item.overview : "Overview not available"}
            </Text>
            <Text style={[styles.tvBox, { width: 25, marginVertical: 5 }]}>
                TV
            </Text>
        </View>
    )
    const PersonOverview=()=>(
        <View style={[s.suggestionDetailContainer]}>
            <Text style={s.posterTitle}>{item.name}</Text>
            <Text style={s.movieText}>
                {item.known_for_department
                    ? item.known_for_department
                    : "Information not available"}
            </Text>
        </View>
    )
    if (item.media_type === "movie") return <MovieOverview />;
    else if (item.media_type === "tv") return <TvOverview />;
    else return <PersonOverview />;
}

const s=StyleSheet.create({
    
    suggestionDetailContainer: {
        flex: 1,
        paddingHorizontal: 16,
        justifyContent: "center",
    },
    posterTitle: {
        color: colors.lightWhite,
        fontFamily: "Nunito-Bold",
        fontSize: 16,
    },
    movieText: {
        color: colors.lightGray,
        fontFamily: "Nunito-Regular",
        fontSize: 14,
        textAlign: "justify",
    },
})