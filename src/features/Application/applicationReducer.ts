import {createAction, createSlice} from "@reduxjs/toolkit";
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

// App actions
export const initializeAppAC = createAction("app/initialize-app");

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
      .addCase(initializeAppAC, (state) => {
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
