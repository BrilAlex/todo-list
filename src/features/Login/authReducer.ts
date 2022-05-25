import {Dispatch} from "redux";
import {SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from "../../app/appReducer";
import {authAPI, LoginParamsType} from "../../api/todoListsApi";
import {handleServerAppError, handleServerNetworkError} from "../../utils/errorUtils";


// Types
type ActionsType =
  | ReturnType<typeof setIsLoggedInAC>
  | SetAppStatusActionType
  | SetAppErrorActionType;
type InitialStateType = typeof initialState;

// Initial state
const initialState = {
  isLoggedIn: false,
};

// Action Creators
export const setIsLoggedInAC = (value: boolean) =>
  ({type: "login/SET-IS-LOGGED-IN", value} as const);

// Thunk Creators
export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch<ActionsType>) => {
  dispatch(setAppStatusAC("loading"));
  authAPI.login(data)
    .then(response => {
      if (response.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(true));
        dispatch(setAppStatusAC("succeeded"));
      } else {
        handleServerAppError(response.data, dispatch);
      }
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch);
    });
};
export const logoutTC = () => (dispatch: Dispatch<ActionsType>) => {
  dispatch(setAppStatusAC("loading"));
  authAPI.logout()
    .then(response => {
      if (response.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(false));
        dispatch(setAppStatusAC("succeeded"));
      } else {
        handleServerAppError(response.data, dispatch);
      }
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch);
    });
};

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case "login/SET-IS-LOGGED-IN":
      return {...state, isLoggedIn: action.value};
    default:
      return state;
  }
};
