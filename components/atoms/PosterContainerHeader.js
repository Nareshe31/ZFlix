import React from "react";
import { View,Text } from "react-native";
import { styles} from "../../globalStyle";

export default function PosterContainerHeader({title }) {
  return (
    <View style={styles.popularHeaderContainer}>
      <Text style={styles.popularHeaderText}>
        {title}
      </Text>
    </View>
  );
}
