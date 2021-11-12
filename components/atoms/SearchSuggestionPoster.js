import React from 'react';
import { View,StyleSheet,Image,Dimensions } from 'react-native';
import {IMAGE_PATH  } from '../../globalUtils';
import { dimensions,colors } from '../../globalStyle';

export default function SearchSuggestionPoster({item}){
    return(
        <View style={[s.moviePosterContainer]}>
            {
                item.media_type=='movie' || item.media_type=='tv'?
                <>
                    {item.poster_path ? (
                        <Image
                            resizeMode="cover"
                            style={s.moviePoster}
                            source={{ uri: IMAGE_PATH + item.poster_path }}
                        ></Image>
                    ) : (
                        <Image
                            style={[s.moviePoster]}
                            resizeMode="contain"
                            source={require("../../assets/images/no-image.png")}
                        />
                    )}
                    </>
                :(
                    <>
                        {item.profile_path ? (
                            <Image
                                resizeMode="cover"
                                style={s.moviePoster}
                                source={{ uri: IMAGE_PATH + item.profile_path }}
                            ></Image>
                        ) : (
                            <Image
                                style={[s.moviePoster]}
                                resizeMode="contain"
                                source={require("../../assets/images/no-image.png")}
                            />
                        )}
                    </>
                )
            }
        </View>
    )
}

const s=StyleSheet.create({
    moviePoster: {
        width: dimensions.posterWidth,
        height: dimensions.posterHeight,
        borderTopLeftRadius:10,
        borderBottomLeftRadius:10,
        minHeight: 100,
        maxHeight: 170,
    },
    moviePosterContainer: {
        borderTopLeftRadius:10,
        borderBottomLeftRadius:10,
        backgroundColor: colors.loadingColor,
    },
})