import {Dispatch} from "redux";
import {ResponseType} from "../api/types";
import {commonAppActions} from "../features/CommonActions/app";
import {AxiosError} from "axios";

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
