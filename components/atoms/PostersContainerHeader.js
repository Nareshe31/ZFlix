import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { styles, colors } from "../../globalStyle";
import { MaterialIcons } from "@expo/vector-icons";

export default function PostersContainerHeader({ navigation,title,apiId,type }) {
  const navigateToScreen = () => {
      navigation.navigate("SeeAllModal", {
        id: apiId,
        title:title,
        type:type
      });
  };

  return (
    <View style={styles.popularHeaderContainer}>
      <Text style={styles.popularHeaderText}>
        {title}
      </Text>
      <TouchableOpacity onPress={navigateToScreen}>
        <MaterialIcons
          style={styles.rightArrowIcon}
          name="keyboard-arrow-right"
          size={24}
          color={colors.lighterWhite}
        />
      </TouchableOpacity>
    </View>
  );
}
