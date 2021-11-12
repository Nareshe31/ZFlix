import React,{useEffect} from 'react';
import { View,Animated ,FlatList,Dimensions,StyleSheet} from 'react-native'
import { styles,colors} from "../../globalStyle";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const loadingImages=[{id:0},{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7},{id:8},{id:9},{id:10},{id:11}]

export default function SmallPosterLoadingContainer() {
    const opacity = new Animated.Value(0.7)
    useEffect(() => {
        fadeIn()
    })
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
    return(
        <View style={[styles.pageLoader,{backgroundColor:colors.mainBlackColor}]}>
            <FlatList  
                data={loadingImages}
                horizontal={false}
                key="00"
                keyExtractor={(item)=>item.id.toString()}
                contentContainerStyle={{alignItems:'center'}}
                renderItem={({item})=>(
                    <View style={s.movieWholePosterContainer}>
                        <Animated.View style={[s.moviePosterContainer,{opacity:opacity}]}>
                            <View style={s.moviePoster} ></View>
                        </Animated.View>
                        <View style={styles.posterDetail}>
                            <Animated.View style={{opacity:opacity,width:(windowWidth-48)/3-20,backgroundColor:colors.loadingColor,marginVertical:5,borderRadius:10,padding:4}}></Animated.View>
                            <Animated.View style={{opacity:opacity,width:(windowWidth-48)/3-50,backgroundColor:colors.loadingColor,padding:4,borderRadius:10,marginBottom:5}}></Animated.View>
                        </View>
                    </View>
                )}
                numColumns={3}
            />
        </View>
    )
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
    movieWholePosterContainer:{
        width:(windowWidth-48)/3,
        position:'relative',
        marginVertical: 8,
        marginHorizontal: 8,
        minWidth:80,
        maxWidth:160,
        borderRadius:10,
        backgroundColor:colors.mainBlackLightColor
    },
})