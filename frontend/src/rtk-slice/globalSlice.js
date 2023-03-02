import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postData, getData } from "../utils/api";
import { errorToast, successToast } from "../utils/toastFunc";

import config from "../constants/config";
import { getVehicleList } from "./vehiclesSlice";
import {
  VEHICLE_TYPES,
  VEHICLE_TYPES_UNIQUE_IDS,
} from "../features/vehicles/data/constants";

const initialState = {
  driverList: [],
  driverTypeList: [],
  otpObj: {},
  profileDetails: {},
  isLookUpDataFilled: false,
  allLookUpsData: {},
};

export const getDriverList = createAsyncThunk(
  "globalReducer/getDriverList",
  async () => {
    const url = config.baseUrl + config.getDriverList;
    const response = await getData(url);
    return response;
  }
);
export const getVehicleTypeList = createAsyncThunk(
  "globalReducer/getVehicleTypeList",
  async (headers) => {
    const url = config.baseUrl + config.getVehicleTypeList;
    const response = await getData(url, headers);
    return response;
  }
);
export const fetchProfileDetails = createAsyncThunk(
  "globalReducer/getProfileDetails",
  async () => {
    const url = config.baseUrl + "/getProfileDetails";
    const { data } = await getData(url);
    return data;
  }
);

export const getLookUpValues = createAsyncThunk(
  "globalReducer/getLookUpValues",
  async () => {
    const url = config.baseUrl + config.getLookUpValues;
    const response = await getData(url);
    return response;
  }
);
export const getAllLookUpsData = createAsyncThunk(
  "globalReducer/getAllLookUpsData",
  async () => {
    const url = config.baseUrl + config.getAllLookUps;
    const response = await getData(url);
    return response;
  }
);
export const getDriverTypeList = createAsyncThunk(
  "globalReducer/getDriverTypeList",
  async () => {
    const url = config.baseUrl + config.getDriverTypeList;
    const response = await getData(url);
    return response;
  }
);

export const doLogin = createAsyncThunk(
  "globalReducer/doLogin",
  async ({ username, password }) => {
    const url = `${config.baseUrl}${config.login}?username=${username}&password=${password}`;
    const response = await postData(url, {});
    return response;
  }
);
export const doLoginWithOtp = createAsyncThunk(
  "globalReducer/doLoginWithOtp",
  async ({ otp, phoneNumber }) => {
    const url = `${config.baseUrl}${config.otpLogin}?otp=${otp}&phoneNumber=${phoneNumber}`;
    const response = await postData(url, {});
    return response;
  }
);
export const sendOtp = createAsyncThunk(
  "globalReducer/sendOtp",
  async (mobile) => {
    const url = `${config.baseUrl}${config.sendOtp}?phoneNumber=${mobile}`;
    const response = await postData(url, {});
    return response;
  }
);
export const doLogout = createAsyncThunk(
  "globalReducer/doLogout",
  async (_payload, thunkAPI) => {
    const url = `${config.baseUrl}${config.logout}`;
    localStorage.removeItem("userdetails");
    thunkAPI.dispatch({ type: "CLEAR_STATE" });
    const response = await postData(url, {});
    return response;
  }
);

export const globalSlice = createSlice({
  name: "globalReducer",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setProfilePicData: (state, action) => {
      state.profileDetails.profilePic = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDriverList.fulfilled, (state, action) => {
        const driverList = action.payload?.data?.map((driver) => {
          driver.fullName = driver.firstName + " " + (driver.lastName || "");
          return driver;
        });
        state.driverList = driverList;
      })
      .addCase(doLogin.fulfilled, (state, action) => {
        if (action.payload.success)
          successToast({ mes: "Logged in successfully" });
        localStorage.setItem("userdetails", JSON.stringify(action.payload));
        state.userData = action.payload;
      })
      .addCase(doLoginWithOtp.fulfilled, (state, action) => {
        if (action.payload.success)
          successToast({ mes: "Logged in successfully" });
        else errorToast({ mes: action.payload.message });
        localStorage.setItem("userdetails", JSON.stringify(action.payload));
        state.userData = action.payload;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.otpObj = action.payload;
        if (action.payload?.success)
          successToast({ mes: "OTP sent successfully" });
        else if (action.payload?.success === false)
          errorToast({ mes: action.payload.message });
      })
      .addCase(doLogout.fulfilled, (state, action) => {
        // state.userData = undefined;
      })
      .addCase(getVehicleTypeList.fulfilled, (state, action) => {
        state.vehicleTypeList = action.payload;
      })
      .addCase(getDriverTypeList.fulfilled, (state, action) => {
        state.driverTypeList = action.payload;
      })
      .addCase(fetchProfileDetails.fulfilled, (state, action) => {
        state.profileDetails = action.payload;
      })
      .addCase(getLookUpValues.fulfilled, (state, action) => {
        state.lookUpValues = action.payload.data;
      })
      .addCase(getAllLookUpsData.fulfilled, (state, action) => {
        state.allLookUpsData = action.payload;
        state.isLookUpDataFilled = true;
      })
      .addCase(getVehicleList.fulfilled, (state, action) => {
        const { data, vehicle } = action.payload;
        if (vehicle === VEHICLE_TYPES.TRAILER)
          state.allLookUpsData.defaultTrailerIds = data.map((fl) => ({
            id: fl[VEHICLE_TYPES_UNIQUE_IDS[VEHICLE_TYPES.TRAILER]],
            description: fl.licensePlatNo,
          }));
      });
  },
});

export const { setUserData, setProfilePicData } = globalSlice.actions;

export const getDrivers = (state) => state.globalReducer.driverList;
export const getUserData = (state) => state.globalReducer.userData;
export const getVehicles = (state) => state.globalReducer.vehicleTypeList;
export const getDriverTypes = (state) => state.globalReducer.driverTypeList;
export const getRole = (state) =>
  state.globalReducer.userData?.userDetails?.role;
export const getProfilePicture = (state) =>
  state.globalReducer.userData?.userDetails?.profilePic;
export const getProfileDetails = (state) => state.globalReducer?.profileDetails;
export const getLookUpDataValues = (state) => state.globalReducer?.lookUpValues;
export const getOtpResponse = (state) => state.globalReducer?.otpObj;
// export const getUserName = (state) => state.globalReducer.userData.userDetails.firstName + ' ' + state.globalReducer.userData.userDetails.lastName;
export const getUserName = (state) =>
  state.globalReducer?.profileDetails?.firstName +
  " " +
  state.globalReducer?.profileDetails?.lastName;
export const getUserId = (state) =>
  state.globalReducer.userData?.userContext?.userId;
export const getUserModules = (state) =>
  state.globalReducer.userData?.userDetails?.userModules;
export const selectIsLookUpDataFilled = (state) =>
  state.globalReducer.isLookUpDataFilled;
export const selectAllLookUpsData = (state) =>
  state.globalReducer.allLookUpsData;

export default globalSlice.reducer;
