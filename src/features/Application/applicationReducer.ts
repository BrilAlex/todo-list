import {authAPI} from "../../api/todoListsApi";
import {handleServerAppError, handleServerNetworkError} from "../../utils/errorUtils";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {commonAppActions} from "../CommonActions/app";
import {authActions} from "../Auth";
import {AxiosError} from "axios";

// Types
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type InitStateType = {
  isInitialized: boolean
  status: RequestStatusType
  error: string | null
};

// Common App actions
const {setAppStatus, setAppError} = commonAppActions;

// Auth actions
const {setIsLoggedIn} = authActions;

// Thunk Creators
const initializeApp = createAsyncThunk(
  "app/initializeApp",
  async (params, thunkAPI) => {
    try {
      const response = await authAPI.me();
      if (response.data.resultCode === 0) {
        thunkAPI.dispatch(setIsLoggedIn({value: true}));
      } else {
        handleServerAppError(response.data, thunkAPI);
      }
    } catch (error) {
      handleServerNetworkError(error as AxiosError, thunkAPI);
    }
  }
);

// Async App actions
export const asyncAppActions = {
  initializeApp,
};

// Slice
export const appSlice = createSlice({
  name: "app",
  initialState: {
    isInitialized: false,
    status: "idle" as RequestStatusType,
    error: null as string | null,
  } as InitStateType,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(initializeApp.fulfilled, (state) => {
        state.isInitialized = true;
      })
      .addCase(setAppStatus, (state, action) => {
        state.status = action.payload.status;
      })
      .addCase(setAppError, (state, action) => {
        state.error = action.payload.error;
      });
  },
});
