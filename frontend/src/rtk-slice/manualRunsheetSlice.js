import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getData, postData } from '../utils/api';
import config from '../constants/config';
import { errorToast, successToast } from '../utils/toastFunc';

const initialState = {
  addedDrivers: []
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const getRunsheetSummary = createAsyncThunk(
  'manualRunsheet/getRunsheetSummary',
  async ({ postDataObj }) => {
    let url = config.baseUrl + config.getRunsheetSummary;
    if (postDataObj.runsheetType === 'auto') {
      url = config.baseUrl + config.getAutoRunsheetSummary;
    }
    const response = await postData(url, postDataObj);
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

export const getDateRangeRunsheets = createAsyncThunk(
  'manualRunsheet/getDateRangeRunsheets',
  async ({ postDataObj }) => {
    const url = config.baseUrl + config.getDateRangeRunsheets;
    const response = await postData(url, postDataObj);
    return response;
  }
);

export const removeRunsheets = createAsyncThunk(
  'manualRunsheet/removeRunsheets',
  async ({ postDataObj, driverUserId }) => {
    const url = config.baseUrl + config.deleteRunsheets;
    const response = await postData(url, postDataObj);
    response.userId = driverUserId;
    if (!response.errorMessage) {
      if (postDataObj?.manualRunsheetIds?.length === 1) {
        successToast({ mes: 'Runsheet removed!' });
      } else {
        successToast({ mes: 'Runsheets removed!' });
      }
    }
    return response;
  }
);

export const submitRunsheet = createAsyncThunk(
  'manualRunsheet/submitRunsheet',
  async ({ postDataObj }) => {
    const url = config.baseUrl + config.submitRunsheet;
    const response = await postData(url, postDataObj);
    successToast({ mes: 'Runsheets submitted successfully!' });
    return response;
  }
);

export const saveRunsheet = createAsyncThunk(
  'manualRunsheet/saveRunsheet',
  async ({ postDataObj, runsheetIndex }) => {
    const url = config.baseUrl + config.saveOrUpdateRunsheet;
    const response = await postData(url, postDataObj);
    response.runsheetIndex = runsheetIndex;
    return response;
  }
);

export const verifyRunsheetsHours = createAsyncThunk(
  'manualRunsheet/verifyRunsheetsHours',
  async ({ postDataObj }) => {
    let url = config.baseUrl + config.verifyRunsheetsHours;
    if (postDataObj.runsheetType === 'auto') {
      url = config.baseUrl + config.verifyAutoRunsheetHours;
    }
    const response = await postData(url, postDataObj);
    successToast({ mes: 'Runsheets verified successfully!' });
    return response;
  }
);

export const getApprovedRunsheets = createAsyncThunk(
  'manualRunsheet/getApprovedRunsheets',
  async ({ postDataObj }) => {
    let url = config.baseUrl + config.getApprovedRunsheets;
    if (postDataObj.runsheetType === 'auto') {
      url = config.baseUrl + config.getApprovedAutoRunsheets;
    }
    const response = await postData(url, postDataObj);
    return response;
  }
);

export const getVerifiedRunsheets = createAsyncThunk(
  'manualRunsheet/getVerifiedRunsheets',
  async ({ postDataObj }) => {
    let url = config.baseUrl + config.getVerifiedRunsheets;
    if (postDataObj.runsheetType === 'auto') {
      url = config.baseUrl + config.getVerifiedAutoRunsheets;
    }
    const response = await postData(url, postDataObj);
    return response;
  }
);

export const approveRunsheets = createAsyncThunk(
  'manualRunsheet/approveRunsheets',
  async ({ postDataObj }) => {
    let url = config.baseUrl + config.approveRunsheets;
    if (postDataObj.runsheetType === 'auto') {
      url = config.baseUrl + config.approveAutoRunsheets;
    }
    const response = await postData(url, postDataObj);
    successToast({ mes: 'Runsheets approved successfully!' });
    return response;
  }
);

export const downloadReport = createAsyncThunk(
  'manualRunsheet/downloadReport',
  async ({ postDataObj }) => {
    let url = config.baseUrl + config.downloadReports;
    if (postDataObj.runsheetType === 'auto') {
      url = config.baseUrl + config.downloadAutoRunsheetReports;
    }
    if (postDataObj.reportType === 'Verified Reports') {
      url += `/verified/${postDataObj.downloadFormat}?start-date=${postDataObj.startDate}&end-date=${postDataObj.finishDate}`;
    } else if (postDataObj.reportType === 'Approved Reports') {
      url += `/approved/${postDataObj.downloadFormat}?start-date=${postDataObj.startDate}&end-date=${postDataObj.finishDate}`;
    } else if (postDataObj.reportType === 'Annual Reports') {
      url += `/annual/${postDataObj.downloadFormat}/${postDataObj.yearRange}`;
    } else if (postDataObj.reportType === 'TPAR Reports') {
      url += `/tpar/${postDataObj.downloadFormat}/${postDataObj.yearRange}`;
    } else if (postDataObj.reportType === 'Driver') {
      url += `/driver/${postDataObj.userName}/${postDataObj.downloadFormat}?start-date=${postDataObj.startDate}&end-date=${postDataObj.finishDate}`;
    }
    let filename;
    getData(url, {}, true).then((response) => {
      const contentDisposition = response.headers.get("content-disposition")
      filename = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition)[1];
      return response.blob();
    }).then((blob) => {
      const pdfUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.target = '_blank';
      link.href = pdfUrl;
      link.download = filename;
      // Append to html link element page
      document.body.appendChild(link);
      // Start download
      link.click();
      link.parentNode.removeChild(link);
      // clean up Url
      window.URL.revokeObjectURL(pdfUrl);
      successToast({ mes: 'Report successfully downloaded!' })
    });
  }
);

export const getAdvancedSearchResults = createAsyncThunk(
  'manualRunsheet/getAdvancedSearchResults',
  async ({ postDataObj }) => {
    const url = config.baseUrl + config.getAdvancedSearchResults;
    const response = await postData(url, postDataObj);
    return response;
  }
);

export const getManualRunsheetWeeks = createAsyncThunk(
  'manualRunsheet/getManualRunsheetWeeks',
  async (runsheetType) => {
    let url = config.baseUrl + config.getManualRunsheetWeeks;
    if (runsheetType === 'auto') {
      url = config.baseUrl + config.getAutoRunsheetWeeks;
    }

    const response = await getData(url);
    return response;
  }
);

export const ManualRunsheetSlice = createSlice({
  name: 'manualRunsheet',
  initialState,
  reducers: {
    addDriver: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      const found = state.addedDrivers.some(el => el.userId === action.payload.userId);
      if (!found) state.addedDrivers.push(action.payload);
    },
    addAllDrivers: (state, action) => {
      action.payload.forEach(driver => {
        const found = state.addedDrivers.some(el => el.userId === driver.userId);
        if (!found) state.addedDrivers.push(driver);
      });
    },
    addRunsheet: (state, action) => {
      const driverIndex = state.addedDrivers.findIndex(el => el.userId === action.payload.driverUserId);
      if (!state.addedDrivers[driverIndex].manualRunsheetDTOS?.length) {
        state.addedDrivers[driverIndex].manualRunsheetDTOS = [];
      }
      state.addedDrivers[driverIndex].manualRunsheetDTOS.push({ date: action.payload.date });
    },
    addRunsheetRows: (state, action) => {
      state.addedDrivers.forEach((driver) => {
        if (driver.selected) {
          if (!driver.manualRunsheetDTOS?.length) {
            driver.manualRunsheetDTOS = action.payload;
          } else {
            action.payload.forEach((dateObj) => {
              const found = driver.manualRunsheetDTOS.some(el => {
                return el.date === dateObj.date
              });
              if (!found) driver.manualRunsheetDTOS.push({ date: dateObj.date });
            })
          }
        }
      })
    },
    deleteRunsheet: (state, action) => {
      const driverIndex = state.addedDrivers.findIndex(el => el.userId === action.payload);
      state.addedDrivers[driverIndex].manualRunsheetDTOS =
        state.addedDrivers[driverIndex].manualRunsheetDTOS.filter((runsheet) => !runsheet.selected);
    },
    editRunsheet: (state, action) => {
      const driverIndex = state.addedDrivers.findIndex(el => el.userId === action.payload.userId);
      state.addedDrivers[driverIndex].manualRunsheetDTOS[action.payload.runsheetIndex].editing = true;
    },
    selectRunsheet: (state, action) => {
      const driverIndex = state.addedDrivers.findIndex(el => el.userId === action.payload.userId);
      const selectedVal = state.addedDrivers[driverIndex].manualRunsheetDTOS[action.payload.runsheetIndex].selected;
      state.addedDrivers[driverIndex].manualRunsheetDTOS[action.payload.runsheetIndex].selected = !selectedVal;
    },
    selectDriver: (state, action) => {
      const driverIndex = state.addedDrivers.findIndex(el => el.userId === action.payload.userId);
      const selectedVal = state.addedDrivers[driverIndex].selected;
      state.addedDrivers[driverIndex].selected = !selectedVal;
    },
    removeDriver: (state, action) => {
      state.addedDrivers = state.addedDrivers.filter((driver) => driver.userId !== action.payload.userId);
    },
    reset: (state, action) => {
      if (action.payload === 'runsheet') {
        state.addedDrivers = [];
        state.runsheetWeeklyStatus = '';
      } else if (action.payload === 'reports') {
        state.approvedRunsheets = [];
        state.verifiedRunsheets = [];
      } else {
        state.summaryDateRangeRunsheetDTOs = [];
        state.manualRunsheetDateRangeDTOs = [];
        state.runsheetSummaryWeeklyStatus = '';
      }
    }
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(saveRunsheet.fulfilled, (state, action) => {
        if (!action.payload.errorMessage) {
          successToast({ mes: 'Runsheet saved successfully!' });
          const driverIndex = state.addedDrivers.findIndex(el => el.userId === action.payload.data.userId);
          state.addedDrivers[driverIndex].manualRunsheetDTOS[action.payload.runsheetIndex] = action.payload.data;
        } else {
          errorToast({ mes: action.payload.errorMessage });
        }
      })
      .addCase(removeRunsheets.fulfilled, (state, action) => {
        if (action.payload.errorMessage) {
          errorToast({ mes: action.payload.errorMessage });
        } else {
          if (action.payload.userId) {
            const driverIndex = state.addedDrivers.findIndex(el => el.userId === action.payload.userId);
            state.addedDrivers[driverIndex].manualRunsheetDTOS =
              state.addedDrivers[driverIndex].manualRunsheetDTOS.filter((runsheet) => !runsheet.selected);
          }
          state.addedDrivers = state.addedDrivers.filter((driver) => !driver.selected);
        }
      })
      .addCase(getDateRangeRunsheets.pending, (state) => {
        state.isRunsheetTabLoading = true;
      })
      .addCase(getDateRangeRunsheets.fulfilled, (state, action) => {
        state.isRunsheetTabLoading = false;
        if (action.payload.errorMessage) {
          errorToast({ mes: "7 days difference should be between the start date and end date" });
          state.addedDrivers = [];
          state.runsheetWeeklyStatus = '';
        } else {
          state.addedDrivers = action.payload.data.summaryDateRangeRunsheetDTOs;
          state.runsheetWeeklyStatus = action.payload.data.weekStatus;
          if (!state.addedDrivers?.length) {
            errorToast({ mes: 'No runsheet data available for the specified date range' });
          } else {
            successToast({ mes: 'Runsheet data loaded!' });
          }
        }
      })
      .addCase(getRunsheetSummary.pending, (state) => {
        state.isRunsheetSummaryLoading = true;
      })
      .addCase(getRunsheetSummary.fulfilled, (state, action) => {
        state.isRunsheetSummaryLoading = false;
        if (action.payload.errorMessage) {
          errorToast({ mes: action.payload.errorMessage });
          state.summaryDateRangeRunsheetDTOs = [];
          state.manualRunsheetDateRangeDTOs = [];
        } else {
          state.summaryDateRangeRunsheetDTOs = action.payload.data.summaryDateRangeRunsheetDTOs;
          state.manualRunsheetDateRangeDTOs = action.payload.data.manualRunsheetDateRangeDTOs;
          state.runsheetSummaryWeeklyStatus = action.payload.data.weekStatus;
          if (!state.summaryDateRangeRunsheetDTOs?.length) {
            errorToast({ mes: 'No runsheet summary available for the specified date range' });
          } else {
            successToast({ mes: 'Runsheet data loaded!' });
          }
        }
      })
      .addCase(getApprovedRunsheets.fulfilled, (state, action) => {
        if (action.payload.errorMessage) {
          errorToast({ mes: action.payload.errorMessage });
          state.approvedRunsheets = [];
        } else {
          state.approvedRunsheets = action.payload.data;
          if (!state.approvedRunsheets?.length) {
            errorToast({ mes: 'No approved runsheets available for the specified date range' });
          } else {
            successToast({ mes: 'Approved runsheet data loaded!' });
          }
        }
      })
      .addCase(getVerifiedRunsheets.fulfilled, (state, action) => {
        if (action.payload.errorMessage) {
          errorToast({ mes: action.payload.errorMessage });
          state.verifiedRunsheets = [];
        } else {
          state.verifiedRunsheets = action.payload.data;
          if (!state.verifiedRunsheets?.length) {
            errorToast({ mes: 'No verified runsheets available for the specified date range' });
          } else {
            successToast({ mes: 'Verified runsheet data loaded!' });
          }
        }
      })
      .addCase(getAdvancedSearchResults.pending, (state, action) => {
        state.isAdvancedSearchLoading = true;
      })
      .addCase(getAdvancedSearchResults.fulfilled, (state, action) => {
        state.isAdvancedSearchLoading = false;
        if (action.payload.errorMessage) {
          errorToast({ mes: action.payload.errorMessage });
          state.advancedSearchResults = [];
        } else {
          state.advancedSearchResults = action.payload.data;
          if (!state.advancedSearchResults?.length) {
            errorToast({ mes: 'No data available for the specified criteria' });
          } else {
            successToast({ mes: 'Search results loaded!' });
          }
        }
      })
      .addCase(getManualRunsheetWeeks.fulfilled, (state, action) => {
        if (action.payload.errorMessage) {
          errorToast({ mes: action.payload.errorMessage });
          state.manualRunsheetWeeks = [];
        } else {
          state.manualRunsheetWeeks = action.payload.data;
        }
      });
  },
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.ManualRunsheet.value)`
export const getAddedDrivers = (state) => state.manualRunsheet.addedDrivers;
export const getRunsheetWeeklyStatus = (state) => state.manualRunsheet.runsheetWeeklyStatus;
export const getRunsheetSummaryWeeklyStatus = (state) => state.manualRunsheet.runsheetSummaryWeeklyStatus;
export const getIsRunsheetTabLoading = (state) => state.manualRunsheet.isRunsheetTabLoading;
export const getIsAdvancedSearchLoading = (state) => state.manualRunsheet.isAdvancedSearchLoading;
export const getIsRunsheetSummaryLoading = (state) => state.manualRunsheet.isRunsheetSummaryLoading;
export const getSummaryDateRangeRunsheetDTOs = (state) => state.manualRunsheet.summaryDateRangeRunsheetDTOs;
export const getManualRunsheetDateRangeDTOs = (state) => state.manualRunsheet.manualRunsheetDateRangeDTOs;
export const getApprovedRunsheetsData = (state) => state.manualRunsheet.approvedRunsheets;
export const getVerifiedRunsheetsData = (state) => state.manualRunsheet.verifiedRunsheets;
export const getAdvancedSearchResultsData = (state) => state.manualRunsheet.advancedSearchResults;
export const getManualRunsheetWeeksData = (state) => state.manualRunsheet.manualRunsheetWeeks;

export const { addDriver, addAllDrivers, addRunsheet, editRunsheet, selectRunsheet, selectDriver, deleteRunsheet, addRunsheetRows,
  removeDriver, reset } = ManualRunsheetSlice.actions;

export default ManualRunsheetSlice.reducer;
