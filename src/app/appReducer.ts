import {setIsLoggedInAC} from "../features/Login/authReducer";
import {authAPI} from "../api/todoListsApi";
import {Dispatch} from "redux";
import {handleServerAppError, handleServerNetworkError} from "../utils/errorUtils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

// Types
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type initStateType = typeof initState;
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>;
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>;
type SetIsInitializedActionType = ReturnType<typeof setIsInitializedAC>;
type ActionsType = SetIsInitializedActionType | SetAppStatusActionType | SetAppErrorActionType;

// Initial state
const initState = {
  isInitialized: false,
  status: "idle" as RequestStatusType,
  error: null as string | null,
};

const slice = createSlice({
  name: "app",
  initialState: initState,
  reducers: {
    setIsInitializedAC(state, action: PayloadAction<{isInitialized: boolean}>) {
      state.isInitialized = action.payload.isInitialized;
    },
    setAppStatusAC(state, action: PayloadAction<{status: RequestStatusType}>) {
      state.status = action.payload.status;
    },
    setAppErrorAC(state, action: PayloadAction<{error: string | null}>) {
      state.error = action.payload.error;
    },
  },
});

export const appReducer = slice.reducer;

// Action Creators
export const {setIsInitializedAC, setAppStatusAC, setAppErrorAC} = slice.actions;

// Thunk Creators
export const initializeAppTC = () => (dispatch: Dispatch) => {
  authAPI.me()
    .then(response => {
      if (response.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({value: true}));
      } else {
        handleServerAppError(response.data, dispatch);
      }
      dispatch(setIsInitializedAC({isInitialized: true}));
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch);
    });
};
