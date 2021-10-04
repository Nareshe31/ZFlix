import React, { useState, useEffect } from "react";
import {
  BackHandler,
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Animated,
  Alert,
} from "react-native";
import { styles, colors } from "../globalStyle";
import CustomHeader from "./CustomHeader";
import axios from "axios";
import {URLs} from "../globalUtils";
import PostersContainer from "../components/molecules/PostersContainer";

export default function MovieScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [isPopularLoading, setIsPopularLoading] = useState(true);
  const [isTopRatedLoading, setIsTopRatedLoading] = useState(true);
  const [isUpcomingLoading, setIsUpcomingLoading] = useState(true);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, 55);
  const translateY = diffClamp.interpolate({
    inputRange: [0, 55],
    outputRange: [0, -55],
  });
  useEffect(() => {
    getAllData()
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButtonClick
    );
    return () => {
      backHandler.remove();
    };
  }, []);

  const handleBackButtonClick = () => {
    if (navigation.isFocused()) {
      Alert.alert(
        "Exit App",
        "Do you want to exit?",
        [
          { text: "Yes", onPress: () => BackHandler.exitApp() },
          { text: "No", onPress: () => null, style: "cancel" },
        ],
        { cancelable: false }
      );
      return true;
    }
  };
  const getAllData = async () => {
    setIsPopularLoading(true);
    await getPopular();
    setIsTopRatedLoading(true);
    await getTopRated();
    setIsUpcomingLoading(true);
    await getUpcoming();
    setRefreshing(false);
  };
  const getPopular = async () => {
    try {
      let response = await axios.get(URLs[6]);
      setPopular(response.data.results);
      setIsPopularLoading(false);
    } catch (error) {
      //   Alert.alert('Oops...','Something went wrong',[{text:"Go back",onPress:()=>navigation.goBack()}])
    }
  };
  const getTopRated = async () => {
    try {
      let response = await axios.get(URLs[7]);
      setTopRated(response.data.results);
      setIsTopRatedLoading(false);
    } catch (error) {
      // Alert.alert('Oops...','Something went wrong',[{text:"Go back",onPress:()=>navigation.goBack()}])
    }
  };

  const getUpcoming = async () => {
    try {
      let response = await axios.get(URLs[8]);
      setUpcoming(response.data.results);
      setIsUpcomingLoading(false);
    } catch (error) {
      // Alert.alert('Oops...','Something went wrong',[{text:"Go back",onPress:()=>navigation.goBack()}])
    }
  };

  return (
    <View style={[styles.container, s.mainBackground]}>
      <Animated.View
        style={{
          transform: [{ translateY: translateY }],
          elevation: 1,
          zIndex: 1000,
        }}
      >
        <CustomHeader navigation={navigation} />
      </Animated.View>
      <ScrollView
        style={[styles.container, s.mainBackground]}
        contentContainerStyle={styles.mainScreen}
        onScroll={(e) => scrollY.setValue(e.nativeEvent.contentOffset.y)}
        refreshControl={
          <RefreshControl onRefresh={getAllData} refreshing={refreshing} />
        }
      >
        <PostersContainer
          data={popular}
          title="Popular Movies"
          loading={isPopularLoading}
          navigation={navigation}
          type="movie"
          apiId='6'
        />
        <PostersContainer
          data={topRated}
          title="Top Rated Movies"
          loading={isTopRatedLoading}
          navigation={navigation}
          type="movie"
          apiId='7'
        />
        <PostersContainer
          data={upcoming}
          title="Upcoming Movies"
          loading={isUpcomingLoading}
          navigation={navigation}
          type="movie"
          apiId='8'
        />
      </ScrollView>
    </View>
  );
}

//Popular Top Rated Upcoming

const s = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 15,
  },
  mainBackground: {
    backgroundColor: colors.mainBlackColor,
  },
});
