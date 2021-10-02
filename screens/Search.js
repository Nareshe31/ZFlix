import axios from 'axios';
import React,{useState,useEffect,useRef} from 'react';
import {Dimensions, BackHandler,View,Text,TextInput,StyleSheet,Image,Animated, TouchableOpacity,FlatList,TouchableHighlight ,Alert,Keyboard, ScrollView, ActivityIndicator,TouchableWithoutFeedback} from 'react-native';
import {styles,colors} from '../globalStyle'
import CustomHeader from './CustomHeader'
import { MaterialIcons } from '@expo/vector-icons';
import {API_KEY,URLs,IMAGE_PATH} from '../globalUtils'
import {useSelector} from 'react-redux'

const genresDummy=[{id:0},{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7},{id:8},{id:9},{id:10},{id:11},{id:12},{id:13},{id:14},{id:15},{id:16},{id:17}]
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const dimensions={
    posterWidth:(30*windowWidth)/100,
    posterHeight:(18*windowHeight)/100
  }
export default function Search({navigation}) {
    const [searchQuery,setSearchQuery]=useState('')
    const [suggestions,setSuggestions]=useState([])
    const [movieGenres,setMovieGenres]=useState([])
    const [tvGenres,setTvGenres]=useState([])
    const [isMovieGenreLoading,setIsMovieGenreLoading]=useState(true)
    const [isTvGenreLoading,setIsTvGenreLoading]=useState(true)
    const [searching,setSearching]=useState(false)
    const [isSearching,setIsSearching]=useState(false)
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const user=useSelector(state=>state)

    useEffect(() => {
        getAllGenres()
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
              setKeyboardVisible(true); // or some other action
            }
          );
          const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
              setKeyboardVisible(false); // or some other action
            }
          );

        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
        return () => {
            backHandler.remove()
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        }
    }, [searching])

    const handleBackButtonClick = () => {
        if (searching && !isKeyboardVisible) {
            setSearching(false)
            Keyboard.dismiss()
            setSearchQuery('')
            setSuggestions([])
            return true
        }
        else if(navigation.isFocused()) {
            Alert.alert(
                'Exit App',
                'Do you want to exit?',
                [
                    { text: 'Yes', onPress: () => BackHandler.exitApp() },
                    { text: 'No', onPress: () => null, style: 'cancel' },
                ],
                { cancelable: false });
            return true
        }
    }
    const getAllGenres=async()=>{
        await getAllMovieGenres()
        await getAllTvGenres()
    }

    const getAllMovieGenres=async()=>{
        try {
            let response=await axios.get(URLs[20])
            setMovieGenres(response.data.genres)
            setIsMovieGenreLoading(false)
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

    const getAllTvGenres=async()=>{
        try {
            let response=await axios.get(URLs[21])
            setTvGenres(response.data.genres)
            setIsTvGenreLoading(false)
        } catch (error) {
            // Alert.alert('Oops...','Something went wrong',[{text:"Go back",onPress:()=>navigation.goBack()}])
        }
    }
    const search=()=>{
        navigation.push('SearchModal',{searchQuery:searchQuery})
    }
    const handleEnter=()=>{
        if(searchQuery===''){
            // Alert.alert('Oops...','Search query is empty',[{text:'Ok'}])
        }
        else{
            search()
        }
    }
    const handleChange=(text)=>{
        setSearchQuery(text)
    }
    const timer = useRef(null);

    const searchSuggestions = async () => {
        clearTimeout(timer.current)
        timer.current=setTimeout(async()=>{
            try {
                if (searchQuery!== '') {
                    setIsSearching(true)
                    let {data}=await axios.get(`${URLs[22]}${searchQuery}&api_key=${API_KEY}&page=1`)
                    setSuggestions(data.results)
                    setIsSearching(false)
                    // let response = await axios.get(URL+'/api/search/' + name)
                    // this.setState({ searched_users: response.data.users,searching:false})
                }
                else {

                }

            } catch (error) {
            }
        },500)
        
    }
    function handleKeyPress(e) {
        clearTimeout(timer.current);
    }
    return(
        <View style={[styles.container,{backgroundColor:colors.mainBlackColor}]}>
            <View style={s.searchContainer}>
                {searching?
                    <TouchableWithoutFeedback onPress={()=>{
                        Keyboard.dismiss()
                        setSearching(false)
                        setSearchQuery('')
                        setSuggestions([])
                    }} >
                        <View style={s.backIcon}>
                            <MaterialIcons name="arrow-back" size={24} color={colors.lighterWhite} /> 
                        </View>
                    </TouchableWithoutFeedback>
                :null
                }
                <TextInput 
                    placeholder='Search by title, actor...' 
                    placeholderTextColor={colors.lighterWhite} 
                    style={[s.searchInput,{paddingLeft:searching?0:16}]}
                    onChangeText={handleChange}
                    value={searchQuery}
                    returnKeyType='search'
                    onFocus={()=>setSearching(true)}
                    onKeyPress={searchSuggestions}
                    onPressIn={handleKeyPress}
                    onSubmitEditing={(e)=>handleEnter()}
                    />
                
                    {searching && searchQuery.length? 

                        <TouchableOpacity onPress={()=>{
                                setSearchQuery('')
                                setSuggestions([])
                            }} >
                            <View style={s.searchIcon}>
                                <MaterialIcons name="close" size={28} color={colors.lighterWhite} />
                            </View>
                        </TouchableOpacity>
                        :
                        <>
                        {
                            !searching?
                                <TouchableWithoutFeedback onPress={()=>{
                                    Keyboard.dismiss()
                                    handleEnter()
                                }} >
                                    <View style={s.searchIcon}>
                                        <MaterialIcons name="search" size={28} color={colors.lighterWhite} />
                                    </View>
                                </TouchableWithoutFeedback>
                            :
                            null
                        }
                        
                        </>

                        
                }
            </View>
            
            {!searching?
                <ScrollView  
                    contentContainerStyle={{paddingBottom:40,paddingTop:0}}
                    keyboardShouldPersistTaps='always'
                    style={[styles.container,{backgroundColor:colors.mainBlackColor}]}>

                    <View style={s.genreContainer}>
                        <Text style={s.genreHeader}>Movie Genres</Text>
                        {
                            isMovieGenreLoading?
                                <View style={s.genreBoxContainer}>
                                    {
                                    genresDummy.map(item=>(
                                            <View key={item.id} style={[{width:100,height:30,borderRadius:20,marginHorizontal:6,marginVertical:8,borderColor:colors.lightGray,borderWidth:1}]}>
                                            </View>
                                        ))
                                    }
                                </View>
                            :
                                <View style={s.genreBoxContainer}>
                                    {
                                        movieGenres.map(item=>(
                                            <TouchableOpacity key={item.id} onPress={()=>navigation.push('GenreModal',{genreId:item.id,genreName:item.name,type:'movie'})}>
                                                <View style={s.genreBox}>
                                                    <Text style={s.genreText}>{item.name}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        ))
                                    }
                                    
                                </View>
                        }
                                
                    </View>

                    <View style={s.genreContainer}>
                        <Text style={s.genreHeader}>Tv Show Genres</Text>
                        {
                            isTvGenreLoading?
                                <View style={s.genreBoxContainer}>
                                    {
                                    genresDummy.map(item=>(
                                            <View key={item.id} style={[{width:100,height:30,borderRadius:20,marginHorizontal:6,marginVertical:8,borderColor:colors.lightGray,borderWidth:1}]}>
                                            </View>
                                        ))
                                    }
                                </View>
                            :
                            <View style={s.genreBoxContainer}>
                                {
                                    tvGenres.map(item=>(
                                        <TouchableOpacity key={item.id} onPress={()=>navigation.push('GenreModal',{genreId:item.id,genreName:item.name,type:'tv'})}>
                                            <View style={s.genreBox}>
                                                <Text style={s.genreText}>{item.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))
                                }
                                
                            </View>
                        }
                            
                    </View>
                    
                </ScrollView>
                :
                <>
                {
                    !isSearching && suggestions.length?
                        <View style={[styles.container,{paddingBottom:55}]}>
                            {searchQuery!=''?
                                <View style={[styles.popularHeaderContainer,{paddingBottom:8,marginVertical:5}]}>
                                    <Text ellipsizeMode='tail' numberOfLines={1} style={[styles.popularHeaderText,{flex:1}]}>Browse Torrents for '{searchQuery}'</Text>
                                    <TouchableOpacity onPress={() => {
                                            navigation.push('TorrentModal',{query:searchQuery,type:'movie'})
                                        }}>
                                        <MaterialIcons style={{ marginRight: 10, paddingLeft: 15 }} name="keyboard-arrow-right" size={26} color={colors.lightWhite} />
                                    </TouchableOpacity>
                                </View>
                                :null
                            }
                            <View style={[styles.popularHeaderContainer,{paddingBottom:8}]}>
                                <Text style={styles.popularHeaderText}>Top Results</Text>
                                <TouchableOpacity onPress={() => {
                                    handleEnter()
                                    }}>
                                    <MaterialIcons style={{ marginRight: 10, paddingLeft: 15 }} name="keyboard-arrow-right" size={26} color={colors.lightWhite} />
                                </TouchableOpacity>
                            </View>
                            <FlatList 
                                data={suggestions}
                                keyboardShouldPersistTaps='always'
                                keyExtractor={(item)=>item.id.toString()}
                                renderItem={({item})=>(
                                    item.media_type=='movie'? <Movie item={item} navigation={navigation}  />:
                                    (
                                        item.media_type=='tv'?
                                            <TvShow item={item} navigation={navigation} />
                                            :
                                            <Person item={item} navigation={navigation} />
                                        )   
                                )}
                            />
                        </View>
                    :
                    <>
                    {
                        isSearching?
                            <View style={[styles.container,{paddingBottom:55}]}>
                                <View style={[styles.popularHeaderContainer,{paddingBottom:8}]}>
                                    <Text style={styles.popularHeaderText}>Top Results</Text>
                                    <TouchableOpacity onPress={() => {
                                        if(!isSearching){
                                            handleEnter()
                                            setSearching(false)
                                            setSuggestions([])
                                        }
                                    }}>
                                        <MaterialIcons style={{ marginRight: 10, paddingLeft: 15 }} name="keyboard-arrow-right" size={26} color={colors.lightWhite} />
                                    </TouchableOpacity>
                                </View>
                                <ContainerLoading  />
                            </View>
                        :
                        <View style={styles.container}>
                            {searchQuery!=''?
                                <View style={[styles.popularHeaderContainer]}>
                                    <Text ellipsizeMode={'tail'} numberOfLines={1} style={[styles.popularHeaderText,{flex:1}]}>Browse Torrents for '{searchQuery}'</Text>
                                    <TouchableOpacity onPress={() => {
                                            navigation.push('TorrentModal',{query:searchQuery,type:'movie'})
                                        }}>
                                        <MaterialIcons style={{ marginRight: 10, paddingLeft: 15 }} name="keyboard-arrow-right" size={26} color={colors.lightWhite} />
                                    </TouchableOpacity>
                                </View>
                                :null
                            }
                            {searchQuery!=''?
                                <View style={[styles.popularHeaderContainer,{paddingBottom:8}]}>
                                    <Text style={styles.popularHeaderText}>Top Results</Text>
                                    
                                </View>
                                :null
                            }
                            <View style={styles.noResultContainer}>
                                {searchQuery!='' && !searchSuggestions.length?
                                    <Image source={require('../assets/images/no-result.gif')} style={{width:100,height:100,margin:10}} />
                                    :null
                                }
                                <Text style={styles.noResultText}>{searchQuery=='' && !searchSuggestions.length?"Type to see results":"No results"}</Text>                                
                            </View>
                        </View>
                    }
                           
                    </>
                }
                
                </>
                }
        </View>
    )
}

function Movie({navigation,item}) {
    return(
        <TouchableOpacity onPress={() => navigation.push('Modal', { screen: 'MovieModal', params: { id: item.id ,release_date:item.release_date,title:item.title}, key: Math.round(Math.random() * 10000000) })}>
            <View key={item.id} style={s.suggestionMainContainer}>
                <View style={[s.moviePosterContainer]}>
                    {item.poster_path ?
                        <Image resizeMode='cover' style={s.moviePoster} source={{ uri: IMAGE_PATH + item.poster_path }}></Image>
                        :
                        <Image style={[s.moviePoster]} resizeMode='contain' source={require('../assets/images/no-image.png')} />
                    }
                </View>
                <View style={s.suggestionDetailContainer}>
                    <Text style={s.posterTitle}>{item.title} {item.release_date?'('+item.release_date.slice(0, 4)+')':''}</Text>
                    <Text style={s.movieText} ellipsizeMode={'tail'} numberOfLines={4} >{item.overview?item.overview:"Overview not available"}</Text>
                    <Text style={[styles.tvBox,{width:50,marginVertical:5}]}>Movie</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}
function TvShow({navigation,item}) {
    return(
        <TouchableOpacity onPress={() => navigation.push('TvShowModal', { screen: 'TvModal', params: { id: item.id ,name:item.name,first_air_date:item.first_air_date}, key: Math.round(Math.random() * 10000000) })}>
            <View key={item.id} style={s.suggestionMainContainer}>
                <View style={[s.moviePosterContainer]}>
                    {item.poster_path ?
                        <Image resizeMode='cover' style={s.moviePoster} source={{ uri: IMAGE_PATH + item.poster_path }}></Image>
                        :
                        <Image style={[s.moviePoster]} resizeMode='contain' source={require('../assets/images/no-image.png')} />
                    }
                </View>
                <View style={s.suggestionDetailContainer}>
                    <Text style={s.posterTitle}>{item.name} {item.first_air_date?'('+item.first_air_date.slice(0, 4)+')':''}</Text>
                    <Text style={s.movieText} ellipsizeMode={'tail'} numberOfLines={4} >{item.overview?item.overview:"Overview not available"}</Text>
                    <Text style={[styles.tvBox,{width:30,marginVertical:5}]}>TV</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}
function Person({navigation,item}) {
    return(
        <TouchableOpacity onPress={()=>navigation.push('PersonModal',{screen:'PersonScreen',params:{id:item.id,name:item.name},key: Math.round( Math.random() * 10000000 )})}>
            <View key={item.id} style={s.suggestionMainContainer}>
                <View style={[s.moviePosterContainer]}>
                    {item.profile_path ?
                        <Image resizeMode='cover' style={s.moviePoster} source={{ uri: IMAGE_PATH + item.profile_path }}></Image>
                        :
                        <Image style={[s.moviePoster]} resizeMode='contain' source={require('../assets/images/no-image.png')} />
                    }
                </View>
                <View style={[s.suggestionDetailContainer]}>
                    <Text style={s.posterTitle}>{item.name}</Text>
                    <Text style={s.movieText} >{item.known_for_department?item.known_for_department:"Information not available"}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}


const loadingImages = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }]

function ContainerLoading() {
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
        <FlatList
            showsHorizontalScrollIndicator={false}
            data={loadingImages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={s.suggestionMainContainer}>
                    <Animated.View style={[s.moviePosterContainer, { opacity: opacity }]}>
                        <View style={[s.moviePoster,{justifyContent:'center',alignItems:'center'}]} >
                        </View>
                    </Animated.View>
                    <View style={s.suggestionDetailContainer}>
                        <Animated.View style={{ width: (33 * windowWidth) / 100, backgroundColor: colors.loadingColor, marginVertical: 6, borderRadius: 10, padding: 5, opacity }}></Animated.View>
                        <Animated.View style={{ width: (55 * windowWidth) / 100, backgroundColor: colors.loadingColor, padding: 5, borderRadius: 10, opacity,marginVertical: 6 }}></Animated.View>
                        <Animated.View style={{ width: (55 * windowWidth) / 100, backgroundColor: colors.loadingColor, padding: 5, borderRadius: 10, opacity,marginVertical: 6 }}></Animated.View>
                        <Animated.View style={{ width: (55 * windowWidth) / 100, backgroundColor: colors.loadingColor, padding: 5, borderRadius: 10, opacity,marginVertical: 6 }}></Animated.View>
                    </View>
                </View>
            )} />
    )
}

const s=StyleSheet.create({
    searchInput:{
        paddingVertical:8,
        paddingRight:12,
        borderRadius:5,
        color:colors.lightWhite,
        fontSize:18,
        fontFamily:'Nunito-Regular',
        flex:1,
    },
    genreContainer:{
        marginVertical:10,
        marginHorizontal:10,
        position:'relative'
    },
    genreHeader:{
        fontSize:20,
        fontFamily:'Nunito-SemiBold',
        color:colors.lightWhite,
        marginLeft:10
    },
    genreBoxContainer:{
        width:'100%',
        position:'relative',
        flexDirection:'row',
        flexWrap:'wrap',
        marginVertical:10,
        alignItems:'stretch',
        justifyContent:'space-evenly',
    },
    genreBox:{
        paddingVertical:8,
        paddingHorizontal:12,
        borderWidth:1,
        borderColor:colors.lighterWhite,
        alignSelf:'flex-start',
        marginVertical:8,
        marginHorizontal:6,
        flexWrap:'wrap',
        borderRadius:20
    },
    genreText:{
        fontSize:18,
        color:colors.lightWhite,
        fontFamily:'Nunito-Regular',
        textAlign:'center',
    },
    searchContainer:{
        flexDirection:'row',
        marginHorizontal:'3%',
        marginTop:10,
        marginBottom:10,
        borderWidth:0,
        borderColor:colors.lightWhite,
        borderRadius:6,
        width:'94%',
        position:'relative',
        backgroundColor:'hsla(0,0%,20%,0.6)',
        alignItems:'center'
    },
    searchIcon:{
        alignItems:'center',
        justifyContent:'center',
        paddingHorizontal:8
    },
    backIcon:{
        paddingHorizontal:10,
    },
    suggestionMainContainer:{
        flexDirection:'row',
        marginVertical:10,
        marginHorizontal:14,
        backgroundColor:'#111',
        borderRadius:10,
    },
    suggestionDetailContainer:{
        flex:1,
        paddingHorizontal:12,
        justifyContent:'center',
    },
    moviePoster:{
        width:dimensions.posterWidth,
        height:dimensions.posterHeight,
        borderRadius:10,
        minHeight:100,
        maxHeight:170
    },
    moviePosterContainer:{
        borderRadius:10,
        backgroundColor:colors.loadingColor
    },
    posterTitle:{
        color:colors.lightWhite,
        fontFamily:'Nunito-Bold',
        fontSize:17
    },
    movieText:{
        color:colors.lightGray,
        fontFamily:'Nunito-Regular',
        fontSize:15,
        textAlign:'justify'
    },
    torrentContainer:{

    }
})