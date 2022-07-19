import {
  authAPI,
  LoginParamsType,
  LoginResponseDataType,
  ResponseType
} from "../../api/todoListsApi";
import {call, put, takeEvery} from "redux-saga/effects";
import {setAppStatusAC} from "../../app/appReducer";
import {handleServerAppErrorSaga, handleServerNetworkErrorSaga} from "../../utils/errorUtils";
import {setIsLoggedInAC} from "./authReducer";
import {clearTodoListsDataAC} from "../TodoListsList/todoListsReducer";

export function* loginSagaWorker(action: ReturnType<typeof login>) {
  yield put(setAppStatusAC("loading"));
  try {
    const data: LoginResponseDataType = yield call(authAPI.login, action.data);
    if (data.resultCode === 0) {
      yield put(setIsLoggedInAC(true));
      yield put(setAppStatusAC("succeeded"));
    } else {
      yield* handleServerAppErrorSaga(data);
    }
  } catch (error) {
    yield* handleServerNetworkErrorSaga(error as { message: string });
  }
}
export const login = (data: LoginParamsType) => ({type: "AUTH/LOGIN", data} as const);

export function* logoutSagaWorker() {
  yield put(setAppStatusAC("loading"));
  try {
    const data: ResponseType = yield call(authAPI.logout);
    if (data.resultCode === 0) {
      yield put(clearTodoListsDataAC());
      yield put(setIsLoggedInAC(false));
      yield put(setAppStatusAC("succeeded"));
    } else {
      yield* handleServerAppErrorSaga(data);
    }
  } catch (error) {
    yield* handleServerNetworkErrorSaga(error as { message: string });
  }
}
export const logout = () => ({type: "AUTH/LOGOUT"} as const);

export function* authSagaWatcher() {
  yield takeEvery("AUTH/LOGIN", loginSagaWorker);
  yield takeEvery("AUTH/LOGOUT", logoutSagaWorker);
}