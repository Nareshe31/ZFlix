import React,{useEffect} from 'react';
import { View,Animated ,FlatList,Dimensions} from 'react-native'
import { styles,colors } from "../../globalStyle";

const loadingImages = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }]
const windowWidth = Dimensions.get('window').width;

export default function PostersLoadingContainer() {
    const opacity = new Animated.Value(0.7)
    useEffect(() => {
        fadeIn()
    }, [])
    const fadeIn = () => {
        Animated.timing(opacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true
        }).start(() => fadeOut())
    }
    const fadeOut = () => {
        Animated.timing(opacity, {
            toValue: 0.7,
            duration: 800,
            useNativeDriver: true
        }).start(() => fadeIn())
    }
    return (
        <View style={styles.posterSlideShowContainer}>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={loadingImages}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={[styles.movieWholePosterContainer]}>
                        <Animated.View style={[styles.moviePosterContainer, { opacity: opacity }]}>
                            <View style={[styles.moviePoster,{justifyContent:'center',alignItems:'center'}]} >
                            </View>
                        </Animated.View>
                        <View style={styles.posterDetail}>
                            <Animated.View style={{ width: (33 * windowWidth) / 100, backgroundColor: colors.loadingColor, marginVertical: 6, borderRadius: 10, padding: 5, opacity }}></Animated.View>
                            <Animated.View style={{ width: (25 * windowWidth) / 100, backgroundColor: colors.loadingColor, padding: 5, borderRadius: 10, opacity }}></Animated.View>
                        </View>
                    </View>
                )} />
        </View>
    )
}