import React from 'react';
import { View,Text,StyleSheet,TouchableOpacity,Image,ToastAndroid,Dimensions,Linking,TouchableHighlight } from 'react-native';
import {colors,styles} from '../globalStyle'
import { MaterialIcons,FontAwesome ,Ionicons} from '@expo/vector-icons';
import {useSelector,useDispatch} from 'react-redux'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';
import Constants from "expo-constants"

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
                <View style={s.genreHeader} >
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={22} color={colors.lightWhite} /> 
                    </TouchableOpacity>
                    
                    <Text ellipsizeMode={'tail'} numberOfLines={1} style={s.movieModalHeaderText}>Profile</Text>
                </View>
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
            <View style={s.optionWholeContainer}>

                <TouchableHighlight onPress={() => navigation.push('WatchlistModal')}>
                    <View style={s.optionContainer}>
                        <Ionicons name="heart" size={26} color={colors.lighterWhite} />
                        <View style={s.optionTextContainer}>
                            <Text style={s.optionText}>Favourite</Text>
                            <Text style={s.optionTwoText}>Add to your favourite</Text>
                        </View>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight onPress={() => Linking.openURL('mailto:zflix.contact@pm.me')}>
                    <View style={s.optionContainer}>
                        <MaterialIcons name="mail-outline" size={26} color={colors.lighterWhite} />
                        <View style={s.optionTextContainer}>
                            <Text style={s.optionText}>Contact us</Text>
                            <Text style={s.optionTwoText}>zflix.contact@pm.me</Text>
                        </View>
                    </View>
                </TouchableHighlight>

                <View style={s.optionContainer}>
                    <FontAwesome name="question-circle" size={26} color={colors.lighterWhite} />
                    <View style={s.optionTextContainer}>
                        <Text style={s.optionText}>Help</Text>
                        <Text style={s.optionTwoText}>Ask your queries</Text>
                    </View>
                </View>
                <View style={s.optionContainer}>
                    <MaterialIcons name="developer-mode" size={24} color={colors.lighterWhite} />
                    <View style={s.optionTextContainer}>
                        <Text style={s.optionText}>Developer</Text>
                        <Text style={s.optionTwoText}>Naresh E</Text>
                    </View>
                </View>
                
                
            </View>

            <View style={s.verionContainer}>
                <Text style={s.versionText}>Privacy Policy  .  T&C</Text>
                <Text style={s.versionText}>v{Constants.manifest.version}</Text>
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
    center:{
        justifyContent:'center',
        alignItems:'center',
        height:200,
        backgroundColor:colors.lightBlack
    },
    optionWholeContainer:{
        marginVertical:10,
        borderBottomWidth:0,
        paddingBottom:5,
        borderBottomColor:colors.lighterWhite
    },
    optionContainer:{
        flexDirection:'row',
        marginVertical:10,
        marginHorizontal:10,
        alignItems:'center'
    },
    optionText:{
        color:colors.lightestWhite,
        fontFamily:'Nunito-Bold',
        fontSize:17,
    },
    optionTextContainer:{
        marginLeft:10
    },
    optionTwoText:{
        color:colors.lighterWhite,
        fontFamily:'Nunito-Regular',
        fontSize:15,
    },
    verionContainer:{
        paddingLeft:12,
        borderBottomWidth:0,
        paddingBottom:5,
        borderBottomColor:colors.lighterWhite
    },
    versionText:{
        fontFamily:'Nunito-SemiBold',
        fontSize:14,
        color:colors.lighterWhite,
        marginVertical:3
    }
})