import { combineReducers, configureStore } from '@reduxjs/toolkit'
import counterReducer from "./counterSlice"
const appReducer = combineReducers({
  counter: counterReducer,
  // router: connectRouter(history),
});

export const store = configureStore({
  reducer: appReducer,
})