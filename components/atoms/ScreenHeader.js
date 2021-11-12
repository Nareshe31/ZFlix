import React from "react";
import { View, StyleSheet, Text,Animated } from "react-native";
import { TouchableOpacity,TouchableHighlight } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../globalStyle";
import Ripple from 'react-native-material-ripple'

export default function ScreenHeader({ navigation, title}) {
    const handleBack = () => {
        navigation.goBack();
    };
    return (
        <View style={[s.movieModalHeader]}>
            <View style={s.screenHeader}>
                <TouchableHighlight onPress={handleBack}>
                    <MaterialIcons
                        name="arrow-back"
                        style={s.backArrow}
                        size={20}
                        color={colors.lightWhite}
                    />
                </TouchableHighlight>
                <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={s.movieModalHeaderText}
                >
                    {title}
                </Text>
            </View>
        </View>
    );
}

const s = StyleSheet.create({
    screenHeader: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },
    movieModalHeader: {
        backgroundColor: colors.transparentColor,
        flexDirection: "row",
        paddingHorizontal: 10,
        paddingVertical: 12,
        width: "100%",
    },
    movieModalHeaderText: {
        fontSize: 18,
        color: colors.lightWhite,
        flex: 1,
        marginTop: 1,
        fontFamily:'Nunito-Bold'
    },
    backArrow: {
        paddingLeft:5,
        paddingRight:12,
    },
});
