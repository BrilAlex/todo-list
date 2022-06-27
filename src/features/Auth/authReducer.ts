import {authAPI} from "../../api/todoListsApi";
import {LoginParamsType} from "../../api/types";
import {handleServerAppError, handleServerNetworkError} from "../../utils/errorUtils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ThunkErrorType} from "../../utils/types";
import {commonAppActions} from "../CommonActions/app";
import {commonTodoListsActions} from "../CommonActions/todoLists";
import {AxiosError} from "axios";

// Common App actions
const {setAppStatus} = commonAppActions;

// Common TodoLists actions
const {clearTodoListsData} = commonTodoListsActions;

// Thunk Creators
const login = createAsyncThunk<undefined, LoginParamsType, ThunkErrorType>(
  "auth/login",
  async (params, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: "loading"}));
    try {
      const response = await authAPI.login(params);
      if (response.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatus({status: "succeeded"}));
        return;
      } else {
        return handleServerAppError(response.data, thunkAPI);
      }
    } catch (error) {
      return handleServerNetworkError(error as AxiosError, thunkAPI);
    }
  }
);
const logout = createAsyncThunk(
  "auth/logout",
  async (params, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: "loading"}));
    try {
      const response = await authAPI.logout();
      if (response.data.resultCode === 0) {
        thunkAPI.dispatch(clearTodoListsData());
        thunkAPI.dispatch(setAppStatus({status: "succeeded"}));
        return;
      } else {
        return handleServerAppError(response.data, thunkAPI);
      }
    } catch (error) {
      return handleServerNetworkError(error as AxiosError, thunkAPI);
    }
  }
);

export const asyncAuthActions = {
  login,
  logout,
};

// Slice
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.fulfilled, (state) => {
        state.isLoggedIn = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false;
      });
  },
});
