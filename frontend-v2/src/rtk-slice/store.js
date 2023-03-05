import { combineReducers, configureStore } from '@reduxjs/toolkit'
import productReducer from "./productSlice"
const appReducer = combineReducers({
  product: productReducer,
  // router: connectRouter(history),
});

export const store = configureStore({
  reducer: appReducer,
})