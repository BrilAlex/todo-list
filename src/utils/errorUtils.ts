import {
  setAppErrorAC, SetAppErrorActionType,
  setAppStatusAC,
  SetAppStatusActionType
} from "../app/appReducer";
import {Dispatch} from "redux";
import {ResponseType} from "../api/todoListsApi";
import {put} from "redux-saga/effects";

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

export function* handleServerAppErrorSaga<T>(data: ResponseType<T>) {
  if (data.messages.length) {
    yield put(setAppErrorAC(data.messages[0]));
  } else {
    yield put(setAppErrorAC("Some error occurred"));
  }
  yield put(setAppStatusAC("failed"));
}

export function* handleServerNetworkErrorSaga(error: { message: string }) {
  yield put(setAppErrorAC(error.message ? error.message : "Some error occurred"));
  yield put(setAppStatusAC("failed"));
}
