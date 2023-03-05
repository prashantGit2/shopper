import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getData, postData } from '../utils/api';
import { errorToast, successToast } from '../utils/toastFunc';
import config from '../constants/config';

const initialState = {
    inductionChecklist:{},
    inductionData: []
};

export const getInductionData = createAsyncThunk(
    'induction/getInductionData',
    async (postDataObj) => {
        const url = config.inductionBaseUrl + "/admin/get/induction";
        const response = await postData(url, postDataObj);
        if (response.errorCode === '40') {
            return errorToast({ mes: response.error });
        }
        return response;
    }
);
export const fetchInductionChecklist = createAsyncThunk(
    'induction/fetchInductionChecklist',
    async (body) => {
        const url = config.inductionBaseUrl + config.inductionChecklist + `?${Object.keys(body)[0]}=${Object.values(body)[0]}`;
        const response = await getData(url);
        return response;
    }
);
export const signupInductionUser = createAsyncThunk(
    'induction/signupInductionUser',
    async (data) => {
        const url = config.inductionBaseUrl + "/admin/signup";
        const response = await postData(url, data);
        if (response.errorCode === '40') {
            return errorToast({ mes: response.error });
        }
        return response;
    }
);
export const registerPhone = createAsyncThunk(
    'induction/registerPhone',
    async (data) => {
        const url = config.inductionBaseUrl + "/admin/register/phoneNo";
        const response = await postData(url, data);
        return response;
    }
);


export const inductionSlice = createSlice({
    name: 'induction',
    initialState,
    reducers: {
        clearDocsChecks: (state, action) => {
            state.inductionChecklist = false
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getInductionData.fulfilled, (state, action) => {
                state.inductionData = action.payload.data.induction;
            })
            .addCase(fetchInductionChecklist.fulfilled, (state, action) => {
                state.inductionChecklist = action.payload;
            })
            .addCase(signupInductionUser.fulfilled, (state, action) => {
                if (action.payload?.token === "created"){
                    successToast({mes:"Induction User Created Successfully"})
                }else if (action.payload?.token === "updated"){
                    successToast({mes:"Password Updated Successfully"})
                    
                }else{
                    errorToast({mes:"Try Again"})
                }          
            })
            .addCase(registerPhone.fulfilled, (state, action) => {
                if( action.payload.token === "created") return successToast({ mes: "Success" })
                else if (action.payload.error) {
                    errorToast({mes:action.payload.error})
                }else{
                    errorToast({mes:"Something went wrong"})
                }       
            })
    },
});

export const getInductionDataFromStore = (state) => state.induction.inductionData;
export const getInductionDocsChecklist = (state) => state.induction.inductionChecklist;

export const {clearDocsChecks}  = inductionSlice.actions;

export default inductionSlice.reducer;
