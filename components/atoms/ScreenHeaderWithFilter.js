import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../globalStyle";
import {Picker} from '@react-native-picker/picker';

export default function ScreenHeaderWithFilter({ navigation, title,filter,filterValue ,handleFilterChange}) {
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
            {filter ? (
                <View>
                    <Picker
                        selectedValue={filterValue}
                        style={{
                            width: 150,
                            color: colors.lightWhite,
                            fontSize: 18,
                        }}
                        onValueChange={(itemValue, itemIndex) => handleFilterChange(itemValue)}
                        mode="dropdown"
                        dropdownIconColor={colors.lightWhite}
                    >
                        <Picker.Item
                            color={colors.mainBlackColor}
                            label="Popular"
                            value="popularity.desc"
                        />
                        <Picker.Item
                            color={colors.mainBlackColor}
                            label="Release Date"
                            value="release_date.desc"
                        />
                        <Picker.Item
                            color={colors.mainBlackColor}
                            label="Rating (10-0)"
                            value="vote_average.desc"
                        />
                        <Picker.Item
                            color={colors.mainBlackColor}
                            label="Rating (0-10)"
                            value="vote_average.asc"
                        />
                        <Picker.Item
                            color={colors.mainBlackColor}
                            label="Revenue"
                            value="revenue.desc"
                        />
                    </Picker>
                </View>
            ) : null}
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
