import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { postData, getData, deleteData } from '../utils/api';
import config from '../constants/config';
import { errorToast, successToast } from '../utils/toastFunc';

const initialState = {
    loading: true,
    profileList: [],
    driverGroup: [],
    usersData: []
};

/* Creating a thunk that will be used to get the list of profiles. */
export const getProfileList = createAsyncThunk(
    'globalReducer/getProfileList',
    async () => {
        const url = config.baseUrl + config.getProfileList;
        const response = await getData(url);
        return response;
    }
);

/* Creating a thunk that will be used to get the list of driver groups. */
export const getDriverGroup = createAsyncThunk(
    'globalReducer/getDriverGroup',
    async () => {
        const url = config.baseUrl + config.getDriverGroupList;
        const response = await getData(url);
        // console.log("runed")
        return response;
    }
);

/* Creating a thunk that will be used to get the list of users. */
export const getUsersData = createAsyncThunk(
    'globalReducer/getUsersData',
    async () => {
        const url = config.baseUrl + config.getAllUserList;
        const response = await postData(url, { userId: "" });
        return response;
    }
);

/* Creating a thunk that will be used to delete a user. */
export const deleteUserById = createAsyncThunk(
    'globalReducer/deleteUserById',
    async (id) => {
        const url = config.baseUrl + config.deleteUser + "/" + id;
        const response = await deleteData(url);
        return response;
    }
);
export const activateUserById = createAsyncThunk(
    'globalReducer/activateUserById',
    async (id) => {
        const url = config.baseUrl + config.activateUser + "/" + id;
        const response = await postData(url);
        return response;
    }
);
export const resetAdditionsDetails = createAsyncThunk(
    'globalReducer/resetAdditionsDetails',
    async () => {
        const url = config.baseUrl + config.driverAdditionsUrls.resetDriverAdditionDetails
        const response = await postData(url)
        return response
    }

);
export const downloadUserDetails = createAsyncThunk(
    'globalReducer/downloadUserDetails',
    async () => {
        const url = config.baseUrl + config.getAllUserReportFile
        getData(url, {}, true)
            .then((response) => {
                return response.blob();
            })
            .then((blob) => {
                const file = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.target = "_blank";
                link.href = file;
                link.download = "UserDetailsReports.csv";
                // Append to html link element page
                document.body.appendChild(link);
                // Start download
                link.click();
                link.parentNode.removeChild(link);
                // clean up Url
                window.URL.revokeObjectURL(file);
                successToast({ mes: "File downloaded!" });
            });
    }
    // async (id) => {
    //     const url = config.baseUrl + config.activateUser+"/"+id;
    //     const response = await postData(url);
    //     return response;
    // }
);

export const userManagementSlice = createSlice({
    name: 'userManagement',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        // deleteUser: (state,action)=>{
        //     state.usersData = state.usersData.filter(user=> user.userId !== action.payload)
        // }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProfileList.fulfilled, (state, action) => {
                state.profileList = action.payload;
                // state.loading = false
            })
            .addCase(getDriverGroup.fulfilled, (state, action) => {
                state.driverGroup = action.payload;
                // state.loading = false
            })
            .addCase(getUsersData.fulfilled, (state, action) => {
                state.usersData = action.payload;
                state.loading = false
            })
            .addCase(deleteUserById.fulfilled, (state, action) => {
                // state.usersData = state.usersData.filter(user=> user.userId !== action.payload)
                state.loading = false
                successToast({ mes: "Deactivated User successfully" })
            })
            .addCase(activateUserById.fulfilled, (state, action) => {
                // state.usersData = state.usersData.filter(user=> user.userId !== action.payload)
                state.loading = false
                successToast({ mes: "Activated User successfully" })
            })
            .addCase(resetAdditionsDetails.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload.data === "reset successfuly") {
                    successToast({ mes: "Reset Additions Details Successfull" })
                } else {
                    errorToast({ mes: "Error Reseting Details" })
                }
            })

    },
});

// export const { deleteUser } = userManagementSlice.actions;

export const getProfiles = (state) => state.userManagement.profileList;
export const getDriverGroups = (state) => state.userManagement.driverGroup;
export const getUsers = (state) => state.userManagement.usersData?.data;
export const getLoading = (state) => state.userManagement.loading;

export default userManagementSlice.reducer;
