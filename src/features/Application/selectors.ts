import {AppStateType} from "../../app/store";

export const selectAppIsInitialized = (state: AppStateType) => state.app.isInitialized;
export const selectAppStatus = (state: AppStateType) => state.app.status;
