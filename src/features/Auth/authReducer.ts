import {authAPI} from "../../api/todoListsApi";
import {LoginParamsType} from "../../api/types";
import {handleServerAppError, handleServerNetworkError} from "../../utils/errorUtils";
import {clearTodoListsDataAC} from "../TodoListsList/todoListsReducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ThunkErrorType} from "../../utils/types";
import {commonAppActions} from "../CommonActions/app";

// Common App actions
const {setAppStatus} = commonAppActions;

// Thunk Creators
const login = createAsyncThunk<undefined, LoginParamsType, ThunkErrorType>(
  "auth/login", async (params, thunkAPI
  ) => {
    thunkAPI.dispatch(setAppStatus({status: "loading"}));
    try {
      const response = await authAPI.login(params);
      if (response.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatus({status: "succeeded"}));
        return;
      } else {
        handleServerAppError(response.data, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue({
          errors: response.data.messages,
          fieldsErrors: response.data.fieldsErrors,
        });
      }
    } catch (error) {
      handleServerNetworkError(error as { message: string }, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue({
        errors: [(error as { message: string }).message],
        fieldsErrors: undefined,
      });
    }
  });
const logout = createAsyncThunk("auth/logout", async (params, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({status: "loading"}));
  try {
    const response = await authAPI.logout();
    if (response.data.resultCode === 0) {
      thunkAPI.dispatch(clearTodoListsDataAC());
      thunkAPI.dispatch(setAppStatus({status: "succeeded"}));
      return;
    } else {
      handleServerAppError(response.data, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue({});
    }
  } catch (error) {
    handleServerNetworkError(error as { message: string }, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue({});
  }
});

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
