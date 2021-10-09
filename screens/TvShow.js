import React, { useEffect, useState } from "react";
import {
  BackHandler,
  View,
  ScrollView,
  StyleSheet,
  Animated,
  Alert,
} from "react-native";
import { styles, colors } from "../globalStyle";
import AppHeader from '../components/molecules/AppHeader';
import { URLs } from "../globalUtils";
import axios from "axios";
import PostersContainer from "../components/molecules/PostersContainer";

export default function TvShowScreen({ navigation }) {
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
    getAllData();
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
  };
  const getPopular = async () => {
    try {
      let response = await axios.get(URLs[9]);
      setPopular(response.data.results);
      setIsPopularLoading(false);
    } catch (error) {
      //   Alert.alert('Oops...','Something went wrong',[{text:"Go back",onPress:()=>navigation.goBack()}])
    }
  };
  const getTopRated = async () => {
    try {
      let response = await axios.get(URLs[10]);
      setTopRated(response.data.results);
      setIsTopRatedLoading(false);
    } catch (error) {
      // Alert.alert('Oops...','Something went wrong',[{text:"Go back",onPress:()=>navigation.goBack()}])
    }
  };

  const getUpcoming = async () => {
    try {
      let response = await axios.get(URLs[11]);
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
        <AppHeader navigation={navigation} />
      </Animated.View>
      <ScrollView
        style={[styles.container, s.mainBackground]}
        contentContainerStyle={styles.mainScreen}
        onScroll={(e) => scrollY.setValue(e.nativeEvent.contentOffset.y)}
      >
        <PostersContainer
          data={popular}
          title="Popular Shows"
          loading={isPopularLoading}
          navigation={navigation}
          type="tv"
          apiId="9"
        />
        <PostersContainer
          data={topRated}
          title="Top Rated Shows"
          loading={isTopRatedLoading}
          navigation={navigation}
          type="tv"
          apiId="10"
        />
        <PostersContainer
          data={upcoming}
          title="New Season Shows"
          loading={isUpcomingLoading}
          navigation={navigation}
          type="tv"
          apiId="11"
        />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 15,
  },
  mainBackground: {
    backgroundColor: colors.mainBlackColor,
  },
});
