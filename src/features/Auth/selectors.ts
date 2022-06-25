import {AppStateType} from "../../utils/types";

export const selectIsLoggedIn = (state: AppStateType) => state.auth.isLoggedIn;
