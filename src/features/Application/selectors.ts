import {AppStateType} from "../../utils/types";

export const selectAppIsInitialized = (state: AppStateType) => state.app.isInitialized;
export const selectAppStatus = (state: AppStateType) => state.app.status;
