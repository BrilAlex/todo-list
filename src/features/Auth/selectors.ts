import {AppStateType} from "../../app/store";

export const selectIsLoggedIn = (state: AppStateType) => state.auth.isLoggedIn;
