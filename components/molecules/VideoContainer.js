import React from "react";
import { View, Text, FlatList } from "react-native";
import Video from "../atoms/Video";
import { styles } from "../../globalStyle";

export default function VideoContainer({ data }) {
    if (data && !data.length) return null;
    return (
        <View style={styles.videoContainer}>
            <Text style={[styles.heading_1]}>Trailers & Extras</Text>
            <FlatList
                data={data}
                horizontal
                keyExtractor={(item) => item.key}
                renderItem={({ item }) =>
                    item.site === "YouTube" ? <Video item={item} /> : null
                }
            />
        </View>
    );
}
