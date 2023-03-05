import { combineReducers, configureStore } from '@reduxjs/toolkit'
import counterReducer from "./counterSlice"
import productReducer from "./productSlice"
const appReducer = combineReducers({
  counter: counterReducer,
  product: productReducer,
  // router: connectRouter(history),
});

export const store = configureStore({
  reducer: appReducer,
})