import {createAction} from "@reduxjs/toolkit";
import {RequestStatusType} from "../Application/applicationReducer";

const setAppStatus = createAction<{ status: RequestStatusType }>("app/setAppStatus");
const setAppError = createAction<{ error: string | null }>("app/setAppError");

export const appActions = {
  setAppStatus,
  setAppError
};
