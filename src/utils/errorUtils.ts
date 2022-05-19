import {
  setAppErrorAC, SetAppErrorActionType,
  setAppStatusAC,
  SetAppStatusActionType
} from "../app/appReducer";
import {Dispatch} from "redux";
import {ResponseType} from "../api/todoListsApi";

type ErrorUtilsDispatchType = Dispatch<SetAppStatusActionType | SetAppErrorActionType>;

// Generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
  if (data.messages.length) {
    dispatch(setAppErrorAC(data.messages[0]));
  } else {
    dispatch(setAppErrorAC("Some error occurred"));
  }
  dispatch(setAppStatusAC("failed"));
};

export const handleServerNetworkError = (error: { message: string }, dispatch: ErrorUtilsDispatchType) => {
  dispatch(setAppErrorAC(error.message ? error.message : "Some error occurred"));
  dispatch(setAppStatusAC("failed"));
};
