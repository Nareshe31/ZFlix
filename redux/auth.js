const LOGIN='LOGIN'
const LOGOUT='LOGOUT'
const ADD_TO_WATCHLIST='ADD_TO_WATCHLIST'
const REMOVE_FROM_WATCHLIST='REMOVE_FROM_WATCHLIST'
const REMOVE_MULTIPLE_FROM_WATCHLIST='REMOVE_MULTIPLE_FROM_WATCHLIST'
const initialState=null
const authReducer=(state=initialState,action)=>{
    switch(action.type){
        case LOGIN:
            return action.payload
        case LOGOUT:
            return null
        case ADD_TO_WATCHLIST:
            return {...state,watchlist:action.payload}
        case REMOVE_FROM_WATCHLIST:
            return {...state,watchlist:state.watchlist.filter(item => item.id !== action.payload)}
        case REMOVE_MULTIPLE_FROM_WATCHLIST:
            return {...state,watchlist:state.watchlist.filter(item => action.payload.includes(item.id)?null:item)}
    }
    return state
}


export default authReducer;