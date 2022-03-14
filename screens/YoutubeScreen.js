import React, { useEffect, useRef } from "react";
import {
  View,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback
} from "react-native";
import { WebView } from "react-native-webview";
import * as ScreenOrientation from "expo-screen-orientation";
import { styles, colors } from "../globalStyle";
import { MaterialIcons } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function YoutubeScreen({ navigation, route }) {
  const view = useRef();
  useEffect(() => {
    // changeScreenOrientation()
    StatusBar.setHidden(true);
    return function removeOrientation() {
      // changeScreenOrientationLock()
      StatusBar.setHidden(false);
    };
  }, []);
  async function changeScreenOrientationLock() {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT
    );
  }
  async function changeScreenOrientation() {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE
    );
  }
  return (
    <View
      style={[styles.container]}
    >
      {/* <TouchableWithoutFeedback onPress={()=>console.log("clicked")}> */}
        <WebView
          source={{ uri:route.params.url}}
          startInLoadingState={true}
          renderLoading={() => (
            <View
              style={[
                {
                  width: windowWidth,
                  height: windowHeight+50,
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  backgroundColor: colors.mainBlackColor,
                },
              ]}
            >
              <ActivityIndicator size={"large"} color={colors.mainBlue} />
            </View>
          )}
          mixedContentMode='never'
          onShouldStartLoadWithRequest={()=>{return false}}
          allowsFullscreenVideo={true}
        />
      {/* </TouchableWithoutFeedback> */}
    </View>
  );
}

{
  /* <View style={[styles.container,{backgroundColor:colors.mainBlackColor}]}>
  <WebView 
  source={{uri:route.params.url}} 
  startInLoadingState={true}
  renderError={()=>(
    <View style={[styles.container,{position:'absolute',width:windowWidth,height:windowHeight+50,justifyContent:'center',alignItems:'center'}]}>
      <Text style={[styles.text,{fontSize:20,marginHorizontal:15}]}>Something went wrong😥</Text>
      <Text style={[styles.text,{fontSize:20,marginHorizontal:15}]}>Please go back!</Text>
      <View style={[styles.movieModalHeader]}>
        <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={()=>navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color={colors.lightWhite} /> 
            <Text ellipsizeMode={'middle'} numberOfLines={1} style={styles.movieModalHeaderText}></Text>
        </TouchableOpacity>
    </View>
    </View>
  )}
  renderLoading={()=>(
    <View style={[{width:windowWidth,height:windowHeight+50,alignItems:'center',justifyContent:'center',position:'absolute',top:0,left:0,backgroundColor:colors.mainBlackColor}]}>
      <ActivityIndicator size={'large'} color={colors.mainBlue}  />
    </View>
  )}
  mixedContentMode='never'
  onShouldStartLoadWithRequest={()=>{return false}}
  allowsFullscreenVideo={true}
  />
</View> */
}
