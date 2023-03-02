import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { postData, getData, deleteData } from '../utils/api';
import config from '../constants/config';
import { errorToast, successToast, warningToast } from '../utils/toastFunc';

const initialState = {
    loading: false,
    filter:{type:"ALL"},
    // reports: [],
    queryBody: {}
};
export const fetchReports = createAsyncThunk(
    'inspectionReport/getReports',
    async({apiBody,  showSuccessToast = true, showWarningToast = true, showErrorToast=true ,}) => {
    const url = config.baseUrl + config.inspectionReport.searchByFilter
    const response = await postData(url, apiBody);
    if (response.status === 200) {
        if (response.data) {
            if (showSuccessToast) { successToast({ mes: 'reports fetched successfully!' }) }
        }
        else {
            if (showWarningToast) { warningToast({ mes: 'No reports found!' }) }
        }
    } else {
        if (showErrorToast) {
            errorToast({ mes: 'Something went wrong!' })
        }
    }

    return response;
}
);
export const updateStatus = createAsyncThunk(
    'inspectionReport/updateStatus',
    async (apiBody) => {
        const url = config.baseUrl + config.inspectionReport.updateInspectionStatus
        const response = await postData(url, apiBody);
        return response;
    }
);

export const InspectionReportSlice = createSlice({
    name: 'inspectionReport',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        setQueryBody: (state, action) => {
            state.queryBody = action.payload
        },
        setFilter: (state,action) => {
            state.filter = action.payload
        },
        setFilterType: (state,action) => {
            state.filter.type = action.payload
        },
    },
    // Redux Toolkit allows us to write "mutating" logic in reducers.
    // Mutation logic here consists updating the state},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReports.fulfilled, (state, action) => {
                state.reports = action.payload.data;
                // if (action.payload.status === 200) {
                //     action.payload.data ?
                //         successToast({ mes: 'reports fetched successfully!' }) : warningToast({ mes: "No reports found" });
                // }
                state.loading = false
            })
            .addCase(fetchReports.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(fetchReports.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(updateStatus.fulfilled, (state, action) => {
                // state.reports = action.payload.data;
                if (action.payload.status == 200) successToast({ mes: 'Status changed successfully!' });
                else errorToast({ mes: 'Status change failed!' })
                state.loading = false
            })
            .addCase(updateStatus.rejected, (state, action) => {
                errorToast({ mes: 'something went wrong' })
            })

    },
});
export const getLoading = (state) => state.inspectionReport.loading
export const getReports = (state) => state.inspectionReport.reports;
export const getQueryBody = (state) => state.inspectionReport.queryBody;
export const getFilter = (state) => state.inspectionReport.filter;


export const { setQueryBody,setFilterType,setFilter } = InspectionReportSlice.actions;

export default InspectionReportSlice.reducer;