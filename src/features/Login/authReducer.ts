import {SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from "../../app/appReducer";
import {authAPI} from "../../api/todoListsApi";
import {FieldErrorType, LoginParamsType} from "../../api/types";
import {handleServerAppError, handleServerNetworkError} from "../../utils/errorUtils";
import {clearTodoListsDataAC} from "../TodoListsList/todoListsReducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

// Types
export type AuthActionsType =
  | ReturnType<typeof setIsLoggedInAC>
  | SetAppStatusActionType
  | SetAppErrorActionType;

// Thunk Creators
export const loginTC = createAsyncThunk<undefined, LoginParamsType, { rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> } }>(
  "auth/login", async (params, thunkAPI
  ) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}));
    try {
      const response = await authAPI.login(params);
      if (response.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}));
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
export const logoutTC = createAsyncThunk("auth/logout", async (params, thunkAPI) => {
  thunkAPI.dispatch(setAppStatusAC({status: "loading"}));
  try {
    const response = await authAPI.logout();
    if (response.data.resultCode === 0) {
      thunkAPI.dispatch(clearTodoListsDataAC());
      thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}));
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

// Slice
const slice = createSlice({
  name: "app",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value;
    },
  },
  extraReducers: builder => {
    builder.addCase(loginTC.fulfilled, (state) => {
      state.isLoggedIn = true;
    });
    builder.addCase(logoutTC.fulfilled, (state) => {
      state.isLoggedIn = false;
    });
  },
});

// Reducer
export const authReducer = slice.reducer;

// Action Creators
export const setIsLoggedInAC = slice.actions.setIsLoggedInAC;
