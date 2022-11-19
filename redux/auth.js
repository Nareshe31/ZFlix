const LOGIN='LOGIN'
const LOGOUT='LOGOUT'
const ADD_TO_WATCHLIST='ADD_TO_WATCHLIST'
const REMOVE_FROM_WATCHLIST='REMOVE_FROM_WATCHLIST'
const REMOVE_MULTIPLE_FROM_WATCHLIST='REMOVE_MULTIPLE_FROM_WATCHLIST'
const ADD_APP_INFO="ADD_APP_INFO"
const initialState={user:null,app_info:{}}
const authReducer=(state=initialState,action)=>{
    switch(action.type){
        case LOGIN:
            return {...state,user:{...action.payload}}
        case LOGOUT:
            return null
        case ADD_TO_WATCHLIST:
            return {...state,user:{...state.user,watchlist:action.payload}}
        case REMOVE_FROM_WATCHLIST:
            return {...state,user:{...state.user,watchlist:state.user.watchlist.filter(item => item.data.id !== action.payload)}}
        case REMOVE_MULTIPLE_FROM_WATCHLIST:
            return {...state,user:{...state.user,watchlist:state.user.watchlist.filter(item => action.payload.includes(item.data.id)?null:item)}}
        case ADD_APP_INFO:
            return {...state,app_info:{...action.payload}}
    }
    return state
}


export default authReducer;