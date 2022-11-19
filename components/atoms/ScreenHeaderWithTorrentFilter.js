import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../globalStyle";
import {Picker} from '@react-native-picker/picker';

export default function ScreenHeaderWithFilter({ navigation, title,filter,filterValue ,handleFilterChange,type}) {
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
                            width: 140,
                            color: colors.lightWhite,
                            fontSize: 18,
                        }}
                        onValueChange={(itemValue, itemIndex) => handleFilterChange(itemValue)}
                        mode="dropdown"
                        dropdownIconColor={colors.lightWhite}
                    >
                        {type=="movie"?
                            <Picker.Item
                                color={colors.mainBlackColor}
                                label="Yts"
                                value="Yts"
                            />
                            :
                            null
                        }
                        <Picker.Item
                            color={colors.mainBlackColor}
                            label="Pirate Bay"
                            value="ThePirateBay"
                        />
                        <Picker.Item
                            color={colors.mainBlackColor}
                            label="Rarbg"
                            value="Rarbg"
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
        width: "100%",
        alignItems:"center"
    },
    movieModalHeader: {
        backgroundColor: colors.transparentColor,
        flexDirection: "row",
        paddingHorizontal: 0,
        paddingVertical: 10,
        width: "100%",
    },
    movieModalHeaderText: {
        fontSize: 18,
        color: colors.lightWhite,
        flex: 1,
    },
    backArrow: {
        paddingHorizontal: 5,
    },
});
