import React,{useState,useEffect} from 'react';
import { View,Text,BackHandler,ScrollView,Dimensions,StyleSheet,TouchableOpacity,Image,TouchableHighlight,ToastAndroid } from 'react-native';
import {IMAGE_PATH,URLs} from '../globalUtils'
import {useSelector,useDispatch} from 'react-redux'
import { colors,styles } from '../globalStyle';
import { MaterialIcons,FontAwesome } from '@expo/vector-icons';
import axios from 'axios'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function WatchlistModal({navigation,route}) {
    const user=useSelector(state=>state)
    const [isSelected,setIsSelected]=useState(false)
    const [selected,setSelected]=useState([])
    const [selectedTId,setSelectedTId]=useState([])
    const dispatch=useDispatch()

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
        return () => {
            backHandler.remove()
        }
    }, [isSelected])
    const handleLongPress=(item)=>{
        if(selectedTId.includes(item.id)){
            setSelectedTId(prev=>prev.filter(ele=>ele!=item.id))
            setSelected(prev=>prev.filter(ele=>ele!=item._id))
        }
        else{
            setSelectedTId(prev=>[...prev,item.id])
            setSelected(prev=>[...prev,item._id])
        }
    }
    const removeMultipleFromWatchlist=async()=>{
        try {
            let response=await axios.post(URLs[28],{
                id:user._id,
                watchlistIds:selected
            })
            dispatch({type:"REMOVE_MULTIPLE_FROM_WATCHLIST",payload:selectedTId})
            ToastAndroid.show('Removed from watchlist',ToastAndroid.SHORT)
            setIsSelected(false)
            setSelected([])
            setSelectedTId([])
        } catch (error) {
            console.log(error);
        }
    }

    const handleBackButtonClick = () => {
        if(isSelected){
            setIsSelected(false)
            setSelected([])
            setSelectedTId([])
            return true
        }
        return false

    }
    return(
        <View style={styles.container}>
            <View style={[s.movieModalHeader]}>
                <View style={s.genreHeader} >
                    {!isSelected?
                        <View style={{flexDirection:'row'}}>
                            <TouchableOpacity style={{ justifyContent: 'center',paddingLeft:0}} onPress={() => navigation.goBack()}>
                                <MaterialIcons name="arrow-back" size={24} color={colors.lightWhite} />
                            </TouchableOpacity>
                            <Text ellipsizeMode={'tail'} numberOfLines={1} style={s.movieModalHeaderText}>Favourite</Text>
                        </View>
                        :
                        <View style={{flexDirection:'row'}}>
                            <TouchableOpacity style={{ justifyContent: 'center',paddingLeft:0}} onPress={()=>{
                                setSelected([])
                                setSelectedTId([])
                                setIsSelected(false)}
                                }>
                                <MaterialIcons name="close" size={24} color={colors.lightWhite} />
                            </TouchableOpacity>
                            <Text ellipsizeMode={'tail'} numberOfLines={1} style={s.movieModalHeaderText}>Select items to remove</Text>
                        </View>
                    }
                    {user && user?.watchlist.length? 
                        <View>
                            {!isSelected?
                                <TouchableOpacity onPress={()=>setIsSelected(true)}>
                                    <MaterialIcons name="edit" size={24} color={colors.lightWhite} />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={removeMultipleFromWatchlist}>
                                    <MaterialIcons name="delete" size={24} color={colors.lightWhite} />
                                </TouchableOpacity>
                            }
                        </View>
                        :null
                    }
                </View>
            </View>
            
            {user && user?.watchlist.length?
                <ScrollView style={[styles.container,{backgroundColor:'hsla(0,0%,6%,0.7)'}]}>
                    <View style={[s.watchlistContainer]}>
                        {user?.watchlist.map(item=>(
                            <View key={item._id} style={[s.watchlistItemContainer]}>
                                <TouchableHighlight 
                                    onLongPress={()=>{
                                        if(!isSelected){
                                            setIsSelected(true)
                                            handleLongPress(item)
                                        }
                                    }}
                                    onPress={() =>isSelected? 
                                        handleLongPress(item)
                                        :
                                        (item.type=="movie"?
                                            navigation.push('Modal', { screen: 'MovieModal', params: { id: item.id ,release_date:item.year,title:item.name}, key: Math.round(Math.random() * 10000000) })
                                            :
                                            navigation.push('TvShowModal', { screen: 'TvModal', params: { id: item.id ,name:item.name,first_air_date:item.year}, key: Math.round(Math.random() * 10000000) }))
                                        }
                                    >
                                    <View style={[s.moviePosterContainer]}>
                                        {item.poster_path ?
                                            <Image resizeMode='cover' style={[s.moviePoster]} source={{ uri: IMAGE_PATH + item.poster_path }}></Image>
                                            :
                                            <Image style={[s.moviePoster]} resizeMode='contain' source={require('../assets/images/no-image.png')} />
                                        }
                                        {selectedTId.includes(item.id)?
                                            <View style={[s.moviePoster,{position:'absolute',backgroundColor:'hsla(0,0%,0%,0.4)'}]}></View>
                                            :null
                                        }
                                    </View>
                                </TouchableHighlight>
                                {isSelected?
                                    <View style={{position:'absolute',top:18,right:15,backgroundColor:colors.lightWhite,minWidth:20,minHeight:20,borderRadius:10}}>
                                        {selectedTId.includes(item.id)?<MaterialIcons name="done" size={18} color={colors.mainBlackColor} />:null}
                                    </View>
                                    :null
                                }
                            </View>
                        ))}
                    </View>
                </ScrollView>

                :
                <View style={[styles.container,{justifyContent:'center',backgroundColor:colors.mainBlackColor,alignItems:'center'}]}>
                    <Image source={require('../assets/images/movie-roll.gif')} style={{width:120,height:120}} />
                    <Text style={s.infoText}>Browse and add to your favourite</Text>
                </View>
            }
                
        </View>
    )
}

const s=StyleSheet.create({
    movieModalHeader:{
        backgroundColor:colors.mainBlackColor,
        paddingVertical:12,
        paddingHorizontal:10,
        width:'100%',
    },
    movieModalHeaderText:{
        fontSize:20,
        color:colors.lightWhite,
        marginLeft:8,
        marginTop:1,
    },
    genreHeader:{
        width:windowWidth-30,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
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
        marginHorizontal:(1.6/100)* windowWidth,
        marginVertical:10,
    },
    moviePoster:{
        width:(30/100)* windowWidth,
        height:(20/100)* windowHeight,
        borderRadius:10,
        borderWidth:0.2,
        borderColor:colors.lighterWhite
    },
    watchlist:{
        marginVertical:10,
    },
    infoText:{
        color:colors.lightWhite,
        fontFamily:'Nunito-SemiBold',
        fontSize:20,
        marginVertical:2
    },
})