import React from "react";
import { View, Text } from "react-native";
import { styles,colors } from "../../globalStyle";
import { months } from "../../globalUtils";
import {AntDesign} from '@expo/vector-icons'

export default function CardText({ item ,type,addCategory,crew}) {
  const MoviePosterText = () => (
    <View style={styles.posterDetail}>
      <Text ellipsizeMode={"tail"} numberOfLines={1} style={styles.posterTitle}>
        {item.title}
      </Text>
      <View style={styles.tv}>
        {item.release_date ? (
          <Text style={styles.posterYear}>
            {/* {months[Number(item.release_date.slice(5, 7)) - 1]+" "} */}
            {item.release_date.slice(0, 4)}
            
          </Text>
        ) : <Text style={styles.posterYear}>N/A</Text>}
        {addCategory?<Text style={styles.tvBox}>Movie</Text>:null}
      </View>
    </View>
  );

  const TvPosterText = () => (
    <View style={styles.posterDetail}>
      <Text ellipsizeMode={"tail"} numberOfLines={1} style={styles.posterTitle}>
        {item.name}
      </Text>
      <View style={styles.tv}>
        {item.first_air_date ? (
          <Text style={styles.posterYear}>
            {/* {months[Number(item.first_air_date.slice(5, 7)) - 1]}{" "} */}
            {/* {item.first_air_date.slice(8, 10)},  */}
            {item.first_air_date.slice(0, 4)}
          </Text>
        ) :  <Text style={styles.posterYear}>N/A</Text>}
        {addCategory?<Text style={styles.tvBox}>TV</Text>:null}
      </View>
    </View>
  );

  const PersonPosterText = () => (
    <View style={styles.posterDetail}>
      <Text ellipsizeMode={"tail"} numberOfLines={1} style={styles.posterTitle}>
        {item.name}
      </Text>
      {item.known_for_department ? (
        <Text style={styles.posterYear}>{crew?item.job:item.known_for_department}</Text>
      ) : null}
    </View>
  );
  if (type === "movie") return <MoviePosterText />;
  else if (type === "tv") return <TvPosterText />;
  else return <PersonPosterText />;
}
