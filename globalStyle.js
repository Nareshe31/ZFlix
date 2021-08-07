import { StyleSheet } from 'react-native'
  
export const mainColor='hsl(190,80%,50%)';
export const backgroundBlackColor='hsl(0,10%,100%)';
export const colors={ 
  mainBlackColor:'#191820',
  lightGray:'#9EA2A2',
  mainBlue:'hsl(220, 85%, 75%)',
  lightWhite:'#BEC6D4'
}

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
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
      color:colors.mainBlue
    },
    text:{
      color:colors.lightWhite
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
    
  });
