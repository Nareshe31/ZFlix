import React from "react";
import { Image, View } from "react-native";
import { styles } from "../../globalStyle";
import { IMAGE_PATH } from "../../globalUtils";

export default function CardImage({ item,type}) {
  return (
    <View style={styles.castPosterContainer}>
        {item.profile_path ? (
        <Image
            style={styles.castPoster}
            source={{ uri: IMAGE_PATH + item.profile_path }}
        />
        ) : (
        <Image
            style={[styles.castPoster, { width: "80%", marginLeft: "10%" }]}
            resizeMode="contain"
            source={require("../../assets/images/no-image.png")}
        />
        )}
    </View>
  );
}
