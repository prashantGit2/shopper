import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { connectRouter, routerMiddleware } from "connected-react-router";
import manualRunsheetReducer from "./manualRunsheetSlice";
import globalReducer from "./globalSlice";
import userManagementReducer from "./userManagement";
import history from "../utils/history";
import inductionReducer from "./InductionAdmin";
import inspectionReportReducer from "./inspectionReportSlice";
import vehiclesReducer from "./vehiclesSlice";
// import authReducer from '../utils/authReducer';

const appReducer = combineReducers({
  manualRunsheet: manualRunsheetReducer,
  globalReducer: globalReducer,
  userManagement: userManagementReducer,
  induction: inductionReducer,
  inspectionReport: inspectionReportReducer,
  vehicles: vehiclesReducer,
  // authReducer: authReducer,
  router: connectRouter(history),
});

const rootReducer = (state, action) => {
  if (action.type === "CLEAR_STATE") {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(routerMiddleware(history)),
});
