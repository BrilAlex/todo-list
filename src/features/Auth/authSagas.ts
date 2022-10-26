import {authAPI} from "../../api/todoListsApi";
import {call, put, takeEvery} from "redux-saga/effects";
import {handleServerAppErrorSaga, handleServerNetworkErrorSaga} from "../../utils/errorUtils";
import {LoginParamsType, LoginResponseDataType, ResponseType} from "../../api/types";
import {commonTodoListsActions} from "../CommonActions/todoLists";
import {commonAppActions} from "../CommonActions/app";
import {setIsLoggedIn} from "./authReducer";

// Common App actions
const {setAppStatus} = commonAppActions;

// Common TodoLists actions
const {clearTodoListsData} = commonTodoListsActions;

export function* loginSagaWorker(action: ReturnType<typeof login>) {
  yield put(setAppStatus({status: "loading"}));
  try {
    const data: LoginResponseDataType = yield call(authAPI.login, action.data);
    if (data.resultCode === 0) {
      yield put(setIsLoggedIn({value: true}));
      yield put(setAppStatus({status: "succeeded"}));
    } else {
      yield* handleServerAppErrorSaga(data);
    }
  } catch (error) {
    yield* handleServerNetworkErrorSaga(error as { message: string });
  }
}
export const login = (data: LoginParamsType) => ({type: "AUTH/LOGIN", data} as const);

export function* logoutSagaWorker() {
  yield put(setAppStatus({status: "loading"}));
  try {
    const data: ResponseType = yield call(authAPI.logout);
    if (data.resultCode === 0) {
      yield put(clearTodoListsData());
      yield put(setIsLoggedIn({value: false}));
      yield put(setAppStatus({status: "succeeded"}));
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