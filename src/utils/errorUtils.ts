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
    dispatch(setAppErrorAC({error: data.messages[0]}));
  } else {
    dispatch(setAppErrorAC({error: "Some error occurred"}));
  }
  dispatch(setAppStatusAC({status: "failed"}));
};

export const handleServerNetworkError = (error: { message: string }, dispatch: ErrorUtilsDispatchType) => {
  dispatch(setAppErrorAC({error: error.message ? error.message : "Some error occurred"}));
  dispatch(setAppStatusAC({status: "failed"}));
};
