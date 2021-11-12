import React,{useState,useEffect} from 'react';
import {BackHandler,Dimensions, View,Text,StyleSheet,TouchableOpacity,FlatList,ActivityIndicator,Alert,Image,Animated} from 'react-native'
import {styles,colors} from '../globalStyle'
import { MaterialIcons } from '@expo/vector-icons';
import { API_KEY,IMAGE_PATH,months,URLs} from '../globalUtils';
import axios from 'axios';
import {useSelector} from 'react-redux'
import SmallPosterLoadingContainer from '../components/molecules/SmallPosterLoadingContainer';
import SmallPosterContainer from '../components/molecules/SmallPosterContainer'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function SearchResult({navigation,route}) {
    const [searchResults,setSearchResults]=useState([])
    const [isSearchLoading,setIsSearchLoading]=useState(true)
    const [isRefreshing,setIsRefreshing]=useState(false)
    const [pages,setPages]=useState(0)
    const opacity=new Animated.Value(0.7)
    const [onEndReachedCalledDuringMomentum,setOnEndReachedCalledDuringMomentum]=useState(false)
    const user=useSelector(state=>state)

    useEffect(() => {
        search(1)
        
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
        return () => {
            backHandler.remove()
        }
    }, [])

    const handleBackButtonClick = () => {
            navigation.goBack()
        
            // navigation.navigate('Main')
        
        return true
    }

    const search=async(page)=>{
        try {
            let response=await axios.get(`${URLs[22]}${route.params.searchQuery}&api_key=${API_KEY}&page=${page}`)
            setSearchResults((prev)=>[...prev,...response.data.results])
            setPages(response.data.total_pages)
            setIsSearchLoading(false)
            setIsRefreshing(false)
            await axios.post(URLs[26],{
                id:user._id,
                search:{
                    keyword:route.params.searchQuery
                }
            })
        } catch (error) {
            // Alert.alert('Oops...','Something went wrong',[{text:"Go back",onPress:()=>navigation.goBack()}])
        }
    }

    const handleReachEnd=()=>{
        setIsRefreshing(true)
        search((searchResults.length/20)+1)
    }

    return(
        <View style={[styles.container,{width:'100%',position:'relative',backgroundColor:colors.mainBlackColor}]}>
            <View style={[s.movieModalHeader]}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={22} color={colors.lightWhite} /> 
                </TouchableOpacity>
                <Text ellipsizeMode={'tail'} numberOfLines={1} style={[s.movieModalHeaderText]}>Search results for "{route.params.searchQuery}"</Text>
            </View>
            {isSearchLoading?
                <SmallPosterLoadingContainer  />
                :
                <View style={[styles.container]}>
                    {searchResults.length==0?
                        <View style={styles.noResultContainer}>
                            <Text style={styles.noResultText}>No results found</Text>
                        </View>
                        :
                        <View style={[styles.container]}>
                            <SmallPosterContainer 
                                navigation={navigation} 
                                movieData={searchResults}
                                handleReachEnd={handleReachEnd}
                                pages={pages}
                                addCategory={true}
                                />
                        </View>
                    }
                </View>
            }
        </View>
    )
}

const s=StyleSheet.create({
    movieModalHeader:{
        backgroundColor:colors.mainBlackColor,
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:10,
        paddingVertical:15,
    },
    movieModalHeaderText:{
        fontSize:20,
        color:colors.lightWhite,
        marginLeft:8,
        fontFamily:'Nunito-SemiBold',
    },
    movieWholePosterContainer:{
        width:(38*windowWidth)/100,
        position:'relative',
        marginBottom:20,
        marginTop:8,
        marginHorizontal:(4*windowWidth)/100,
        minWidth:120,
        maxWidth:220
    },
    moviePoster:{
        width:'100%',
        height:(23*windowHeight)/100,
        borderRadius:10,
        minHeight:140,
        maxHeight:200
    },
    moviePosterContainer:{
        width:'100%',
        position:'relative',
        borderRadius:10,
        backgroundColor:colors.loadingColor
    },
})
