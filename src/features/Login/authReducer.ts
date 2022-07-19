import {SetAppErrorActionType, SetAppStatusActionType} from "../../app/appReducer";

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

// Action Creators
export const setIsLoggedInAC = (value: boolean) =>
  ({type: "login/SET-IS-LOGGED-IN", value} as const);

export const authReducer = (state: InitialStateType = initialState, action: AuthActionsType): InitialStateType => {
  switch (action.type) {
    case "login/SET-IS-LOGGED-IN":
      return {...state, isLoggedIn: action.value};
    default:
      return state;
  }
};
