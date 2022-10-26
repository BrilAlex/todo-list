import {put, call, takeEvery} from "redux-saga/effects";
import {authAPI} from "../../api/todoListsApi";
import {handleServerAppErrorSaga, handleServerNetworkErrorSaga} from "../../utils/errorUtils";
import {MeResponseDataType} from "../../api/types";
import {initializeAppAC} from "./applicationReducer";
import {setIsLoggedIn} from "../Auth/authReducer";

export function* initializeAppSagaWorker() {
  try {
    const data: MeResponseDataType = yield call(authAPI.me);
    if (data.resultCode === 0) {
      yield put(setIsLoggedIn({value: true}));
    } else {
      yield* handleServerAppErrorSaga(data);
    }
    yield put(initializeAppAC());
  } catch (error) {
    yield* handleServerNetworkErrorSaga(error as { message: string });
  }
}
export const initializeApp = () => ({type: "APP/INITIALIZE-APP"} as const);

export function* appSagaWatcher() {
  yield takeEvery("APP/INITIALIZE-APP", initializeAppSagaWorker);
}