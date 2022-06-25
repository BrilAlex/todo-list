import {setIsLoggedInAC} from "../Auth/authReducer";
import {authAPI} from "../../api/todoListsApi";
import {handleServerAppError, handleServerNetworkError} from "../../utils/errorUtils";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {commonAppActions} from "../CommonActions/app";

// Types
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type InitStateType = {
  isInitialized: boolean
  status: RequestStatusType
  error: string | null
};

// Common App actions
const {setAppStatus, setAppError} = commonAppActions;

// Thunk Creators
const initializeApp = createAsyncThunk("app/initializeApp", async (
  params, {dispatch, rejectWithValue}
) => {
  try {
    const response = await authAPI.me();
    if (response.data.resultCode === 0) {
      dispatch(setIsLoggedInAC({value: true}));
    } else {
      handleServerAppError(response.data, dispatch);
    }
  } catch (error) {
    handleServerNetworkError(error as { message: string }, dispatch);
    return rejectWithValue({});
  }
});

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
