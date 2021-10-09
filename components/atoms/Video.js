import React from "react";
import { View, Image, Text, Linking, TouchableHighlight } from "react-native";
import { styles } from "../../globalStyle";
import { URLs } from "../../globalUtils";

export default function Video({ item }) {

    const handleOpenYoutube = () => {
        Linking.openURL(URLs[17] + item.key)
    }

    return (
        <TouchableHighlight onPress={handleOpenYoutube}>
            <View style={styles.ytContainer}>
                <Image
                    resizeMode="cover"
                    blurRadius={0.4}
                    style={styles.videoThumbnail}
                    source={{ uri: URLs[18] + item.key + URLs[19] }}
                />
                
                <Text ellipsizeMode={"tail"} numberOfLines={2} style={styles.ytTitle}>
                    {item.name}
                </Text>

                <View style={styles.videoPlayButton}>
                    <Image
                        style={styles.youtubeLogo}
                        source={require("../../assets/images/youtube-logo.png")}
                    />
                </View>
            </View>
        </TouchableHighlight>

    );
}
