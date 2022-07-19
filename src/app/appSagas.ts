import {put, call, takeEvery} from "redux-saga/effects";
import {authAPI, MeResponseDataType} from "../api/todoListsApi";
import {setIsLoggedInAC} from "../features/Login/authReducer";
import {handleServerAppErrorSaga, handleServerNetworkErrorSaga} from "../utils/errorUtils";
import {setIsInitializedAC} from "./appReducer";

export function* initializeAppSagaWorker() {
  try {
    const data: MeResponseDataType = yield call(authAPI.me);
    if (data.resultCode === 0) {
      yield put(setIsLoggedInAC(true));
    } else {
      yield* handleServerAppErrorSaga(data);
    }
    yield put(setIsInitializedAC(true));
  } catch (error) {
    yield* handleServerNetworkErrorSaga(error as { message: string });
  }
}
export const initializeApp = () => ({type: "APP/INITIALIZE-APP"} as const);

export function* appSagaWatcher() {
  yield takeEvery("APP/INITIALIZE-APP", initializeAppSagaWorker);
}