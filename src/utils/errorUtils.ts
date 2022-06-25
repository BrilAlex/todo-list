import {setAppErrorAC, setAppStatusAC} from "../features/Application/applicationReducer";
import {Dispatch} from "redux";
import {ResponseType} from "../api/types";

// Generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(setAppErrorAC({error: data.messages[0]}));
  } else {
    dispatch(setAppErrorAC({error: "Some error occurred"}));
  }
  dispatch(setAppStatusAC({status: "failed"}));
};

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch) => {
  dispatch(setAppErrorAC({error: error.message ? error.message : "Some error occurred"}));
  dispatch(setAppStatusAC({status: "failed"}));
};
