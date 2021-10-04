import React from "react";
import { View, SafeAreaView, FlatList } from "react-native";
import { styles } from "../../globalStyle";
import Poster from "./Poster";
import PostersLoadingContainer from "./PostersLoadingContainer";
import PostersContainerHeader from "../atoms/PostersContainerHeader";

export default function PostersContainer({
  navigation,
  loading,
  filter,
  data,
  type,
  title,
  apiId
}) {
  return (
    <View style={styles.popularContainer}>
      <PostersContainerHeader
        navigation={navigation}
        title={title}
        apiId={apiId}
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
