import React from 'react';
import { View,Text,StyleSheet,TouchableOpacity,Image,Dimensions,ToastAndroid } from 'react-native';
import {colors,styles} from '../globalStyle'
import { MaterialIcons } from '@expo/vector-icons';
import {useSelector,useDispatch} from 'react-redux'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';
import {IMAGE_PATH} from '../globalUtils'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function ProfileModal({navigation}){
    
    const user=useSelector(state=>state)
    const dispatch = useDispatch()
    
    const logout=()=>{
      SecureStore.deleteItemAsync('token')
      dispatch({type:"LOGOUT"})
      ToastAndroid.show("Signed out successfully", ToastAndroid.SHORT);
    }
    return(
        <View style={styles.container}>
            <View style={[s.movieModalHeader]}>
                <TouchableOpacity style={{justifyContent:'center'}} onPress={()=>navigation.goBack()}>
                    <View style={s.genreHeader} >
                        <MaterialIcons name="arrow-back" size={22} color={colors.lightWhite} /> 
                        <Text ellipsizeMode={'tail'} numberOfLines={1} style={s.movieModalHeaderText}>Profile</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={s.wholeInfoContainer}>
                <View style={s.profileImageContainer}>
                    <Image source={require('../assets/images/profile/male-1.png')} style={s.profileImage} />
                </View>
                <View style={s.infoContainer}>
                    <Text style={s.infoText}>{user.name}</Text>
                    <Text style={s.infoText}>{user.email}</Text>
                    <TouchableWithoutFeedback onPress={logout}>
                        <Text style={s.logoutButton}>Sign out</Text>
                    </TouchableWithoutFeedback>
                </View>
            </View>
            <View style={s.watchlist}>
                <Text style={s.watchlistHeader}>Watchlist</Text>
                {user && user?.watchlist.length?
                    <View style={s.watchlistContainer}>
                        {user?.watchlist.map(item=>(
                            <View key={item._id} style={s.watchlistItemContainer}>
                                <TouchableOpacity 
                                    onPress={() => navigation.push('Modal', { screen: 'MovieModal', params: { id: item.id ,release_date:item.year,title:item.name}, key: Math.round(Math.random() * 10000000) })}
                                    >
                                    <View style={s.moviePosterContainer}>
                                        <Image source={{uri:IMAGE_PATH+item.poster_path}} style={s.moviePoster} />
                                    </View>
                                </TouchableOpacity>
                                
                            </View>
                        ))}
                    </View>
                    :
                    <View style={s.center}>
                        <Text style={s.infoText}>Browse and to your watchlist</Text>
                    </View>
                }
            </View>
        </View>
    )
}

const s=StyleSheet.create({
    movieModalHeader:{
        backgroundColor:colors.mainBlackColor,
        flexDirection:'row',
        padding:10,
        width:'100%',
        justifyContent:'space-between'
    },
    movieModalHeaderText:{
        fontSize:20,
        color:colors.lightWhite,
        marginLeft:8,
        marginTop:1,
    },
    genreHeader:{
        maxWidth:250,
        flexDirection:'row',
        alignItems:'center'
    },
    profileImageContainer:{
        width:'50%',
        justifyContent:'center',
        alignItems:'center',
    },
    profileImage:{
        width:(32/100)*windowWidth,
        height:(32/100)*windowWidth,
        borderWidth:1,
        borderRadius:(16/100)*windowWidth,
        borderColor:colors.lightGray
    },
    wholeInfoContainer:{
        flexDirection:'row',
        paddingVertical:20,
        backgroundColor:'hsla(0,0%,10%,1)'
    },
    infoContainer:{
        justifyContent:'center',
        alignItems:'center',
        width:'40%',
    },
    infoText:{
        color:colors.lightWhite,
        fontFamily:'Nunito-SemiBold',
        fontSize:18,
        marginVertical:2
    },
    logoutButton:{
        color:colors.lightWhite,
        fontFamily:'Nunito-SemiBold',
        fontSize:18,
        marginTop:10,
        backgroundColor:'hsla(0,0%,60%,0.6)',
        paddingVertical:8,
        paddingHorizontal:10,
        borderRadius:5
    },
    watchlistContainer:{
        flexDirection:'row',
        flexWrap:'wrap',
        alignItems:'center',
    },
    watchlistHeader:{
        fontFamily:'Nunito-Bold',
        fontSize:20,
        color:colors.lightWhite,
        marginVertical:10,
        marginLeft:5
    },
    moviePosterContainer:{
        borderRadius:10,
        backgroundColor:colors.loadingColor,
        margin:(1.6/100)* windowWidth,
    },
    moviePoster:{
        width:(30/100)* windowWidth,
        height:(20/100)* windowHeight,
        borderRadius:10,
    },
    watchlist:{
        marginVertical:10,
    },
    center:{
        justifyContent:'center',
        alignItems:'center',
        height:200,
        backgroundColor:colors.lightBlack
    }
})