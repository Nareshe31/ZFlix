import React from "react";
import { View, Text } from "react-native";
import { styles } from "../../globalStyle";
import { months } from "../../globalUtils";

export default function CardText({ item ,type}) {
  const MoviePosterText = () => (
    <View style={styles.posterDetail}>
      <Text ellipsizeMode={"tail"} numberOfLines={1} style={styles.posterTitle}>
        {item.title}
      </Text>
      {item.release_date ? (
        <Text style={styles.posterYear}>
          {months[Number(item.release_date.slice(5, 7)) - 1]}{" "}
          {item.release_date.slice(8, 10)}, {item.release_date.slice(0, 4)}
        </Text>
      ) : null}
    </View>
  );

  const TvPosterText = () => (
    <View style={styles.posterDetail}>
      <Text ellipsizeMode={"tail"} numberOfLines={1} style={styles.posterTitle}>
        {item.name}
      </Text>
      {item.first_air_date ? (
        <Text style={styles.posterYear}>
          {months[Number(item.first_air_date.slice(5, 7)) - 1]}{" "}
          {item.first_air_date.slice(8, 10)}, {item.first_air_date.slice(0, 4)}
        </Text>
      ) : null}
    </View>
  );

  const PersonPosterText = () => (
    <View style={styles.posterDetail}>
      <Text ellipsizeMode={"tail"} numberOfLines={1} style={styles.posterTitle}>
        {item.name}
      </Text>
      {item.known_for_department ? (
        <Text style={styles.posterYear}>{item.known_for_department}</Text>
      ) : null}
    </View>
  );
  if (type === "movie") return <MoviePosterText />;
  else if (type === "tv") return <TvPosterText />;
  else return <PersonPosterText />;
}
