import React from "react";
import { Image, View,StyleSheet,Dimensions} from "react-native";
import { styles,colors } from "../../globalStyle";
import { IMAGE_PATH } from "../../globalUtils";

const windowHeight = Dimensions.get('window').height;

export default function CardImage({ item,type}) {
  return (
    <View style={s.moviePosterContainer}>
      {type === "movie" || type === "tv" ? (
        <>
          {item.poster_path ? (
            <Image
              style={s.moviePoster}
              source={{ uri: IMAGE_PATH + item.poster_path }}
            />
          ) : (
            <Image
              style={[s.moviePoster, { width: "80%", marginLeft: "10%" }]}
              resizeMode="contain"
              source={require("../../assets/images/no-image.png")}
            />
          )}
        </>
      ) : (
        <>
          {item.profile_path ? (
            <Image
              style={s.moviePoster}
              source={{ uri: IMAGE_PATH + item.profile_path }}
            />
          ) : (
            <Image
              style={[s.moviePoster, { width: "80%", marginLeft: "10%" }]}
              resizeMode="contain"
              source={require("../../assets/images/no-image.png")}
            />
          )}
        </>
      )}
    </View>
  );
}


const s=StyleSheet.create({
    moviePoster:{
        width:'100%',
        height:(17*windowHeight)/100,
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        minHeight:80,
        maxHeight:160
    },
    moviePosterContainer:{
        width:'100%',
        position:'relative',
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        backgroundColor:colors.loadingColor
    },
   
})