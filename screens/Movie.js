import React,{useState,useEffect} from 'react';
import { View,Text,ScrollView,FlatList,Image,StyleSheet,TouchableOpacity,ActivityIndicator} from 'react-native'
import { styles,mainColor,backgroundBlackColor,colors} from "../globalStyle";
import CustomHeader from './CustomHeader'
import axios from 'axios'

export default function MovieScreen({navigation}) {
  const [isMovieLoading,setIsMovieLoading]=useState(true)
  const [paginationLoading,setPaginationLoading]=useState(true)
  const [movie,setMovie]=useState([])
  const [pages,setPages]=useState(0)
  const [currentPage,setCurrentPage]=useState(0)
  useEffect(() => {
        getPopularMovies(1)
    }, [])
  const getPopularMovies=async(page)=>{
        try {
            setPaginationLoading(true)
            let response=await axios.get(`https://api.themoviedb.org/3/trending/movie/day?api_key=dfc43a605d906f9da6982495ad7bb34e&page=${page}`)
            setMovie(response.data.results)
            setCurrentPage(page)
            setPages(response.data.total_pages)
            setIsMovieLoading(false)
            setPaginationLoading(false)
        } catch (error) {
            console.log(error);
        }
    }

    const getAllPages=()=>{
      var pageArray=[]
      for (let i = 1; i < pages+1; i++) {
        pageArray.push(i)
      }
      return pageArray;
    }
    
    return(
      <View style={[styles.container,s.mainBackground]}>
        <CustomHeader navigation={navigation} tittle='Movies'  />
        <View style={[styles.container,s.mainBackground]}> 
          {isMovieLoading?
            <View style={[styles.container,s.mainBackground,{justifyContent:'center',alignItems:'center'}]}>
              <ActivityIndicator size='large' color={colors.mainBlue} />
            </View>
            :(
              <View style={[styles.container,s.mainBackground]}>
                <View style={styles.container}>
                  <View style={s.pagesContainer}>
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item)=>item.toString()}
                      data={getAllPages()}
                      renderItem={({item})=>(
                        <TouchableOpacity onPress={()=>{
                          setCurrentPage(item)
                          getPopularMovies(item)
                          }}>
                          <Text style={currentPage==item?[s.pageText,s.currentPage]:s.pageText}>{item}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                  {
                    paginationLoading?
                      <View style={[styles.container,s.mainBackground,{justifyContent:'center',alignItems:'center',height:750}]}>
                        <ActivityIndicator size='large' color={colors.mainBlue} />
                      </View>
                    :
                      <ScrollView>
                        <View style={[styles.container,s.moviePostersContainer,s.mainBackground]}>
                          {movie.map(item=>(
                            <View key={item.id.toString()} style={s.moviePosterContainer}>
                              <TouchableOpacity onPress={()=>navigation.push('Modal',{screen:'MovieModal',params:{id:item.id},key: Math.round( Math.random() * 10000000 )})}>
                                <Image style={s.moviePoster} source={{uri:'https://image.tmdb.org/t/p/original'+item.poster_path}} />                    
                              </TouchableOpacity>
                            </View>
                            ))}
                        </View>
                      </ScrollView>
                  }
                </View>
               </View> 
            )
          }
        </View>
      </View>
    )
  }

const s=StyleSheet.create({
  popularContainer:{
        width:'100%',
        marginVertical:10,
        marginBottom:10,
    },
    popularHeaderText:{
        fontSize:20,
        marginVertical:5,
        marginHorizontal:15,
        fontWeight:'600',
        fontFamily:'Nunito-Bold'
    },
    moviePoster:{
        width:'100%',
        height:225,
        borderRadius:10,
        backgroundColor:colors.lightGray
    },
    moviePostersContainer:{
      flex:1,
      width:'100%',
      flexDirection:'row',
      flexWrap:'wrap',
      justifyContent:'center',
      position:'relative',
      paddingBottom:15,
      backgroundColor:colors.mainBlackColor
    },
    moviePosterContainer:{
      width:'44%',
      position:'relative',
      marginHorizontal:'2%',
      marginVertical:10,
    },
    container:{
      paddingTop:10,
      paddingBottom:15
    },
    pagesContainer:{
      paddingHorizontal:10,
      backgroundColor:colors.mainBlackColor
    },
    pageText:{
      marginHorizontal:6,
      marginVertical:8,
      fontSize:20,
      fontFamily:'Nunito-Regular',
      color:colors.lightGray
    },
    currentPage:{
      color:colors.mainBlue,
      fontFamily:'Nunito-Bold'
    },
    mainBackground:{
      backgroundColor:colors.mainBlackColor
    }
})