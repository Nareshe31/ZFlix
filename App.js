import React from 'react';
import authReducer from './redux/auth'
import {createStore} from 'redux'
import { Provider } from 'react-redux'
import Main from './Main';

const store=createStore(authReducer)

export default function App() {
    
  return(
    <Provider store={store}>
      <Main  />
    </Provider>
  )
}
