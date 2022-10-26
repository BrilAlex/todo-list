import {Dispatch} from "redux";
import {ResponseType} from "../api/types";
import {commonAppActions} from "../features/CommonActions/app";
import {AxiosError} from "axios";
import {put} from "redux-saga/effects";

type ThunkAPIType = {
  dispatch: Dispatch
  rejectWithValue: Function
};

const {setAppStatus, setAppError} = commonAppActions;

// Generic function
export const handleServerAppError = <T>(
  data: ResponseType<T>, thunkAPI: ThunkAPIType, showError = true
) => {
  if (showError) {
    thunkAPI.dispatch(setAppError({
      error: data.messages.length ? data.messages[0] : "Some error occurred",
    }));
  }
  thunkAPI.dispatch(setAppStatus({status: "failed"}));
  return thunkAPI.rejectWithValue({errors: data.messages, fieldsErrors: data.fieldsErrors});
};

export const handleServerNetworkError = (
  error: AxiosError, thunkAPI: ThunkAPIType, showError = true
) => {
  if (showError) {
    thunkAPI.dispatch(setAppError({
      error: error.message ? error.message : "Some error occurred"
    }));
  }
  thunkAPI.dispatch(setAppStatus({status: "failed"}));
  return thunkAPI.rejectWithValue({errors: [error.message]});
};

export function* handleServerAppErrorSaga<T>(data: ResponseType<T>) {
  if (data.messages.length) {
    yield put(setAppError({error: data.messages[0]}));
  } else {
    yield put(setAppError({error: "Some error occurred"}));
  }
  yield put(setAppStatus({status: "failed"}));
}

export function* handleServerNetworkErrorSaga(error: { message: string }) {
  yield put(setAppError({error: error.message ? error.message : "Some error occurred"}));
  yield put(setAppStatus({status: "failed"}));
}
