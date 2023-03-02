import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import isEmpty from "lodash/isEmpty";
import isUndefined from "lodash/isUndefined";
import config from "../constants/config.js";
import {
  VEHICLE_TYPES,
  VEHICLE_TYPES_UNIQUE_IDS,
} from "../features/vehicles/data/constants.js";
import { fetchService } from "../utils/api";
import { errorToast, successToast } from "../utils/toastFunc.js";
import { store } from "./store.js";

const VEHICLE_BASE_URL = config.vehicles.base;
const initialDetailsState = {
  general: {},
  other: [],
  odometer: [],
  service: [],
};

const initialState = {
  trailer: [],
  truck: [],
  forklift: [],
  details: initialDetailsState,
  loading: false,
  profileImg: "",
};

export const getVehicleList = createAsyncThunk(
  "vehicles/getVehicleList",
  (vehicle) =>
    fetchService({ url: `${VEHICLE_BASE_URL}/${vehicle}/all` }).then(
      (response) => {
        if (response.status === 200 && response.data) {
          return { data: response.data, vehicle };
        } else if (response.status === 200 && isUndefined(response.data)) {
          return { data: [], vehicle };
        }
      }
    )
);

export const getVehicleDetailsById = createAsyncThunk(
  "vehicles/getVehicleDetailsById",
  ({ tabUrl, vehicle, id, tab, callback }, { getState }) => {
    const state = getState();
    if (vehicle === VEHICLE_TYPES.TRUCK && isEmpty(state.vehicles.trailer)) {
      store.dispatch(getVehicleList(VEHICLE_TYPES.TRAILER));
    }
    return fetchService({
      url: `${tabUrl}/${vehicle}?${VEHICLE_TYPES_UNIQUE_IDS[vehicle]}=${id}`,
    }).then((response) => {
      if (response.status === 200) {
        if (response.data) {
          callback && callback(response.data);
          return { data: response.data, tab };
        } else {
          throw new Error("No Data Found");
        }
      }
    });
  }
);

export const getVehicleProfileImage = createAsyncThunk(
  "vehicles/getVehicleProfileImage",
  ({ id, vehicle }) =>
    fetchService({
      url: `/transports/vehicle/${vehicle}/profile-pic/${id}`,
      isFile: true,
    }).then((response) => {
      if (response.status === 200) {
        return response.text();
      }
    })
);

export const postVehicleProfileImage = createAsyncThunk(
  "vehicles/postVehicleProfileImage",
  ({ id, vehicle, event, dispatch }) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("profilepic", file);
    return fetchService({
      method: "POST",
      url: `/transports/vehicle/${vehicle}/profile-pic/${id}`,
      body: formData,
      removeContentType: true,
    }).then((response) => {
      if (response.status === 200) {
        dispatch(getVehicleProfileImage({ id, vehicle }));
        return response;
      }
    });
  }
);

export const deleteVehicleDetail = createAsyncThunk(
  "vehicles/deleteVehicleDetail",
  ({ data, index, tab }) => {
    const { url, uniqueReferenceKey, tabId } = tab;
    return fetchService({
      url: `${url}/${data[uniqueReferenceKey]}`,
      method: "DELETE",
    }).then((response) => {
      if (response) return { index, tabId };
      else throw response;
    });
  }
);

export const deleteVehicle = createAsyncThunk(
  "vehicles/deleteVehicle",
  ({ data, vehicle, index }) => {
    const id = data[VEHICLE_TYPES_UNIQUE_IDS[vehicle]];
    return fetchService({
      url: `${VEHICLE_BASE_URL}/${vehicle}/${id}`,
      method: "DELETE",
    }).then((response) => {
      if (response) return { vehicle, index };
      else throw response;
    });
  }
);

export const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {
    setVehicleDetailsToInitialState: (state) => {
      state.details = initialDetailsState;
      state.profileImg = "";
    },
    setVehicleDetails: (state, action) => {
      const { data, tab } = action.payload;
      if (tab === "general") state.details[tab] = data;
      else state.details[tab].push(data);
    },
    replaceDetailFromDetailsTab: (state, action) => {
      const { data, tabId, uniqueReferenceKey } = action.payload;
      const editedDetailIndex = state.details[tabId].findIndex(
        (tab) => tab[uniqueReferenceKey] === data[uniqueReferenceKey]
      );
      state.details[tabId].splice(editedDetailIndex, 1, data);
    },
    addVehicleToList: (state, action) => {
      const { vehicle, data } = action.payload;
      state[vehicle].push(data);
    },
    updateDetailInVehicleList: (state, action) => {
      const { vehicleUniqueId, data, vehicle } = action.payload;
      const id = data[vehicleUniqueId];
      const index = state[vehicle].findIndex((v) => v[vehicleUniqueId] === id);
      state[vehicle].splice(index, 1, data);
    },
    deleteAttachment: (state, action) => {
      const { tabId, newDetails } = action.payload;
      state.details[tabId] = newDetails[tabId];
      successToast({ mes: "File Deleted successfully" });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getVehicleList.fulfilled, (state, action) => {
        const { data, vehicle } = action.payload;
        state[vehicle] = data;
        state.loading = false;
      })
      .addCase(getVehicleList.rejected, (state) => {
        console.log("Vehicles SlICE");
        state.loading = false;
      })
      .addCase(getVehicleList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVehicleDetailsById.fulfilled, (state, action) => {
        const { data, tab } = action.payload;
        state.details[tab] = data;
        state.loading = false;
      })
      .addCase(getVehicleDetailsById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVehicleDetailsById.rejected, (state, action) => {
        state.loading = false;
        errorToast(action.error.message);
      })
      .addCase(getVehicleProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.profileImg = action.payload;
      })
      .addCase(getVehicleProfileImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVehicleProfileImage.rejected, (state) => {
        state.loading = false;
      })
      .addCase(postVehicleProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        successToast({ mes: "Profile pic uploaded successfully" });
      })
      .addCase(postVehicleProfileImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(postVehicleProfileImage.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteVehicleDetail.fulfilled, (state, action) => {
        state.loading = false;
        const { index, tabId } = action.payload;
        state.details[tabId].splice(index, 1);
        successToast({ mes: "Deleted Successfully" });
      })
      .addCase(deleteVehicleDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteVehicleDetail.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        const { vehicle, index } = action.payload;
        state[vehicle].splice(index, 1);
        state.loading = false;
        successToast({ mes: "Vehicle Deleted successfully" });
      })
      .addCase(deleteVehicle.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteVehicle.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  setVehicleDetailsToInitialState,
  setVehicleDetails,
  replaceDetailFromDetailsTab,
  addVehicleToList,
  updateDetailInVehicleList,
  deleteAttachment,
} = vehiclesSlice.actions;

export const selectVehiclesState = (state) => state.vehicles;
export const selectVehicleDetails = (state) => state.vehicles.details;
export const selectVehicleProfileImg = (state) => state.vehicles.profileImg;
export const selectVehicleLoading = (state) => state.vehicles.loading;
export default vehiclesSlice.reducer;
