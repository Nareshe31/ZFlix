import React from "react";
import { View, SafeAreaView, FlatList } from "react-native";
import { styles } from "../../globalStyle";
import CastPoster from "./CastPoster";
import PostersLoadingContainer from "./PostersLoadingContainer";
import PosterContainerHeader from "../atoms/PosterContainerHeader";

export default function PostersContainer({
  navigation,
  loading,
  data,
  type,
  title
}) {

  if(data && !data.length)  return null

  return (
    <View style={styles.popularContainer}>
      <PosterContainerHeader
        title={title}
      />
      {loading ? (
        <PostersLoadingContainer />
      ) : (
        <SafeAreaView style={styles.posterSlideShowContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={data}
            keyExtractor={(item) => item.id.toString()+Math.round( Math.random() * 10000000 )}
            renderItem={({ item }) => (
              <CastPoster type={type} item={item} navigation={navigation} />
            )}
          />
        </SafeAreaView>
      )}
    </View>
  );
}
