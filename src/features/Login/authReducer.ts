import {SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from "../../app/appReducer";
import {authAPI, LoginParamsType} from "../../api/todoListsApi";
import {handleServerAppError, handleServerNetworkError} from "../../utils/errorUtils";
import {clearTodoListsDataAC} from "../TodoListsList/todoListsReducer";
import {RootThunkType} from "../../app/store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

// Types
export type AuthActionsType =
  | ReturnType<typeof setIsLoggedInAC>
  | SetAppStatusActionType
  | SetAppErrorActionType;
type InitialStateType = typeof initialState;

// Initial state
const initialState = {
  isLoggedIn: false,
};

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{value: boolean}>) {
      state.isLoggedIn = action.payload.value;
    },
  },
});

export const authReducer = slice.reducer;

// Action Creators
export const setIsLoggedInAC = slice.actions.setIsLoggedInAC;

// Thunk Creators
export const loginTC = (data: LoginParamsType): RootThunkType => (dispatch) => {
  dispatch(setAppStatusAC({status: "loading"}));
  authAPI.login(data)
    .then(response => {
      if (response.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({value: true}));
        dispatch(setAppStatusAC({status: "succeeded"}));
      } else {
        handleServerAppError(response.data, dispatch);
      }
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch);
    });
};
export const logoutTC = (): RootThunkType => (dispatch) => {
  dispatch(setAppStatusAC({status: "loading"}));
  authAPI.logout()
    .then(response => {
      if (response.data.resultCode === 0) {
        dispatch(clearTodoListsDataAC());
        dispatch(setIsLoggedInAC({value: false}));
        dispatch(setAppStatusAC({status: "succeeded"}));
      } else {
        handleServerAppError(response.data, dispatch);
      }
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch);
    });
};
