import React from "react";
import { View, SafeAreaView, FlatList } from "react-native";
import { styles } from "../../globalStyle";
import Poster from "./Poster";
import PostersLoadingContainer from "./PostersLoadingContainer";
import PosterContainerHeader from "../atoms/PosterContainerHeader";

export default function PostersContainer({
  navigation,
  loading,
  data,
  type,
  title
}) {
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
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Poster type={type} item={item} navigation={navigation} />
            )}
          />
        </SafeAreaView>
      )}
    </View>
  );
}
