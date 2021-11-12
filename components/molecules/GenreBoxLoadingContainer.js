import React,{useEffect} from "react";
import { View, StyleSheet,Animated } from "react-native";
import { colors } from '../../globalStyle';

const genresDummy = [
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
    { id: 15 },
    { id: 16 },
    { id: 17 },
];
export default function GenreBoxLoadingContainer({ data, navigation, type }) {
    const opacity = new Animated.Value(0.7)
    useEffect(() => {
        fadeIn()
    }, [])

    const fadeIn = () => {
        Animated.timing(opacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true
        }).start(() => fadeOut())
    }
    const fadeOut = () => {
        Animated.timing(opacity, {
            toValue: 0.7,
            duration: 800,
            useNativeDriver: true
        }).start(() => fadeIn())
    }

    return (
        <View style={s.genreBoxContainer}>
            {genresDummy.map((item) => (
                <Animated.View key={item.id} style={{opacity}}>
                    <View style={s.genreLoading}></View>
                </Animated.View>
            ))}
        </View>
    );
}

const s = StyleSheet.create({
    genreBoxContainer: {
        width: "100%",
        position: "relative",
        flexDirection: "row",
        flexWrap: "wrap",
        marginVertical: 10,
        alignItems: "stretch",
        justifyContent: "space-evenly",
    },
    genreLoading: {
        width: 100,
        height: 25,
        borderRadius: 10,
        marginHorizontal: 6,
        marginVertical: 8,
        backgroundColor:colors.loadingColor
    },
});
