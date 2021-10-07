import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../globalStyle";

export default function ScreenHeader({ navigation, title}) {
    const handleBack = () => {
        navigation.goBack();
    };
    return (
        <View style={[s.movieModalHeader]}>
            <View style={s.screenHeader}>
                <TouchableOpacity onPress={handleBack}>
                    <MaterialIcons
                        name="arrow-back"
                        style={s.backArrow}
                        size={20}
                        color={colors.lightWhite}
                    />
                </TouchableOpacity>
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
        backgroundColor: colors.mainBlackLightColor,
        flexDirection: "row",
        paddingHorizontal: 10,
        paddingVertical: 10,
        width: "100%",
    },
    movieModalHeaderText: {
        fontSize: 21,
        color: colors.lightWhite,
        flex: 1,
        marginTop: 1,
    },
    backArrow: {
        paddingHorizontal: 5,
    },
});
