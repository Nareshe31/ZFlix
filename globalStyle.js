import { StyleSheet,Dimensions } from 'react-native'
  
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const mainColor='hsl(190,80%,50%)';
export const backgroundBlackColor='hsl(0,10%,100%)';
export const colors={ 
  // mainBlackColor:'#191820',
  mainBlackColor:'#0a0608',
  // lightGray:'#9EA2A2',
  lightGray:'hsl(0,0%,78%)',
  // mainBlue:'hsl(220, 85%, 75%)' bluepurple,
  mainBlue:'#b52522',
  mainDarkBlue:'#DA0037',
  mainLightBlue:'	hsl(1, 68%, 52%)',
  // #314665
  // '#9d291f' red
  // mainBlue:'	hsl(216, 35%, 50%)',
  // lightWhite:'#BEC6D4'
  lightWhite:'hsl(0,0%,85%)',
  lightBlack:'hsl(0,0%,10%)',
  loadingColor:'hsl(0,0%,75%)'
}

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.mainBlackColor,
      position:'relative'
    },
    header:{
      flexDirection:'row',
      backgroundColor:colors.mainBlackColor,
      alignItems:'center',
      paddingHorizontal:20,
      paddingVertical:12
    },
    headerLeftContainer:{
      flex:0.3
    },
    headerTextContainer:{
      flex:1.8,
      textAlign:'center',
      justifyContent:'center',
      alignItems:'center'
    },
    headerText:{
      fontSize:28,
      fontFamily:'Nunito-Bold',
      color:colors.mainDarkBlue
    },
    text:{
      color:colors.lightWhite,
      fontFamily:'Nunito-SemiBold'
    },
    drawerHeader:{
      padding:15,
      backgroundColor:'hsl(190,80%,50%)',
      marginBottom:15
    },
    drawerHeaderText:{
      fontSize:32,
      color:'white',
      textAlign:'center',
      fontFamily:'Nunito-Bold'
    },
    loadingContainer:{
      width:'100%',
      height:250,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:colors.mainBlackColor
    },
    pageLoader:{
      flex:1,
      alignItems:'center',
      justifyContent:'center',
      backgroundColor:colors.mainBlackColor
    },
    popularContainer:{
      width:'100%',
      marginBottom:15,
  },
  popularHeaderText:{
      fontSize:20,
      marginVertical:5,
      marginHorizontal:15,
      fontWeight:'600',
      fontFamily:'Nunito-Bold',
      color:colors.lightWhite
  },
  movieWholePosterContainer:{
      width:(40*windowWidth)/100,
      marginHorizontal:8,
  },
  posterDetail:{
      marginVertical:8,
  },
  posterTitle:{
      color:colors.lightWhite,
      fontFamily:'Nunito-SemiBold',
      fontSize:18,
  },
  posterYear:{
      color:colors.lightGray,
      fontFamily:'Nunito-Regular',
      fontSize:15
  },
  moviePoster:{
      width:(40*windowWidth)/100,
      height:(26*windowHeight)/100,
      borderRadius:10,
  },
  moviePosterContainer:{
      borderRadius:10,
      backgroundColor:colors.loadingColor
  },
  posterSlideShowContainer:{
      marginLeft:5,
      paddingVertical:10,
      borderRadius:10,
  },
  
  popularHeaderContainer:{
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center'
  } ,
  movieImages:{
      marginHorizontal:8,
      marginVertical:0
  },
  heading_1:{
      fontSize:20,
      fontFamily:'Nunito-Bold',
      color:colors.lightWhite,
      marginBottom:10
  },
  tv:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:2,
    alignItems:'center'
  },
  tvBox:{
    color:colors.lightWhite,
    paddingHorizontal:5,
    paddingTop:3,
    fontSize:12,
    textAlign:'center',
    textAlignVertical:'center',
    borderWidth:0.8,
    borderColor:colors.lightGray,
    borderRadius:5
  },
  noResultContainer:{
    flex:1,
    backgroundColor:colors.mainBlackColor,
    justifyContent:'center',
    alignItems:'center'
  },
  noResultText:{
    fontSize:24,
    fontFamily:'Nunito-SemiBold',
    color:colors.lightWhite,
    marginTop:-20
  },
  genreContainer:{
      width:'94%',
      marginHorizontal:'3%',
      flexDirection:'row',
      marginVertical:10,
      flexWrap:'wrap',
  },
  genreName:{
      fontSize:16,
      color:colors.lightWhite,
      paddingHorizontal:8,
      paddingVertical:5,
      fontFamily:'Nunito-SemiBold',
      borderWidth:1,
      margin:5,
      borderColor:colors.lightGray,
      borderRadius:3,
  },
  torrentSearchContainer:{
    maxWidth:'70%',
    marginVertical:12,
    alignSelf:'center'
  },
  torrentSearchButton:{
    paddingVertical:10,
    color:colors.lightWhite,
    paddingHorizontal:24,
    borderRadius:3,
    fontSize:16,
    fontFamily:'Nunito-SemiBold',
    backgroundColor:colors.mainBlue,
    textAlign:'center'
  },
  navText:{
    fontFamily:'Nunito-SemiBold',
    fontSize:14
  },
  movieModalHeader:{
    backgroundColor:'hsla(0,0%,10%,0.3)',
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:10,
    paddingVertical:10,
    position:'absolute',
    left:0,
    top:0,
    zIndex:10
  },
  movieModalHeaderText:{
    fontSize:18,
    color:colors.lightWhite,
    marginLeft:8,
    flex:1,
    flexWrap:'wrap'
  },
  movieYear:{
    fontSize:18,
    fontWeight:'300',
    fontFamily:'Nunito-Regular'
  },
  movieName:{
    fontSize:22,
    fontFamily:'Nunito-Bold',
    textAlign:'center',
    marginVertical:2,
    color:colors.lightWhite,
    paddingHorizontal:10
  },
  movieOverview:{
    marginVertical:10,
    marginHorizontal:15
  },
  overviewHeader:{
    fontSize:20,
    fontFamily:'Nunito-Bold',
    color:colors.lightWhite,
    marginBottom:5
  },
  overviewText:{
    fontFamily:'Nunito-Regular',
    fontSize:18,
    marginBottom:5,
    textAlign:'justify'
  },
  modalPosterContainer:{
    margin:0,
    position:'relative',
    backgroundColor:colors.mainBlackColor,
    height:450,
  },
  modalPoster:{
    width:150,
    height:200,
    borderRadius:10,
    position:'absolute',
    top:110,
    left:20
  },
  modalBackdropPoster:{
      width:'100%',
      height:450,
      backgroundColor:colors.mainBlackColor,
  },
  taglineText:{
    fontFamily:'Nunito-Italic',
    fontSize:18,
    textAlign:'center',
    paddingHorizontal:10,
    marginTop:3,
    marginBottom:10,
    color:colors.lightWhite
  },
  movieTextContainer:{
    marginHorizontal:10,
    marginVertical:4
  },
  movieText:{
    fontSize:18,
    color:colors.lightWhite,
    fontFamily:'Nunito-Regular'
  },
  videoContainer:{
    backgroundColor:colors.mainBlackColor,
    marginHorizontal:10,
    marginVertical:10
  },
  ytContainer:{
    width:(45*windowWidth)/100,
    backgroundColor:colors.mainBlackColor,
    marginHorizontal:18,
    marginTop:-30,
    position:'relative'
  },
  videoThumbnail:{
    width:(48*windowWidth)/100,
    height:(25*windowHeight)/100,
    borderRadius:10,
  },
  ytTitle:{
    color:colors.lightWhite,
    fontFamily:'Nunito-SemiBold',
    fontSize:16,
    marginTop:-15
  },
  videoPlayButton:{
    position:'absolute',
    alignSelf:'center',
    marginTop:(6*windowHeight)/100,
  },
  youtubeLogo:{
    width:100,
    height:100
  },
  
});
