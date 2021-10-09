import React, { useState } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { styles, colors } from "../../globalStyle";
import SmallPoster from "./SmallPoster";

export default function SmallPosterContainer({
    navigation,
    movieData,
    pages,
    handleReachEnd,
    type,
}) {
    const [
        onEndReachedCalledDuringMomentum,
        setOnEndReachedCalledDuringMomentum,
    ] = useState(false);
    return (
        <View style={[styles.container]}>
            <FlatList
                data={
                    movieData.length / 20 === pages
                        ? movieData
                        : movieData.slice(0, movieData.length - (movieData.length % 3))
                }
                horizontal={false}
                keyExtractor={(item) => item.id.toString()}
                key="2"
                renderItem={({ item }) => (
                    <SmallPoster
                        navigation={navigation}
                        item={item}
                        type={type ? type : item.media_type}
                    />
                )}
                ListFooterComponent={() =>
                    movieData.length / 20 + 1 < pages ? (
                        <ActivityIndicator size="large" color={colors.mainBlue} />
                    ) : null
                }
                onEndReached={() => {
                    if (
                        !onEndReachedCalledDuringMomentum &&
                        movieData.length >= 20 &&
                        movieData.length / 20 + 1 <= pages
                    ) {
                        setOnEndReachedCalledDuringMomentum(true);
                        handleReachEnd();
                    }
                }}
                onMomentumScrollBegin={() => {
                    setOnEndReachedCalledDuringMomentum(false);
                }}
                onEndReachedThreshold={0.25}
                numColumns={3}
            />
        </View>
    );
}
