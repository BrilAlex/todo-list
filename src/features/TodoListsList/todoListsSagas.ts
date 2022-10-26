import {call, put, takeEvery} from "redux-saga/effects";
import {todoListsAPI} from "../../api/todoListsApi";
import {handleServerAppErrorSaga, handleServerNetworkErrorSaga} from "../../utils/errorUtils";
import {commonAppActions} from "../CommonActions/app";
import {ResponseType, TodoListType} from "../../api/types";
import {
  addTodoListAC,
  changeTodolistEntityStatus,
  changeTodoListTitleAC,
  removeTodoListAC
} from "./todoListsReducer";

// Common App actions
const {setAppStatus} = commonAppActions;

export function* removeTodoListSagaWorker(action: ReturnType<typeof removeTodoList>) {
  yield put(setAppStatus({status: "loading"}));
  yield put(changeTodolistEntityStatus({id: action.todoList_ID, status: "loading"}));
  try {
    const data: ResponseType = yield call(todoListsAPI.deleteTodoList, action.todoList_ID);
    if (data.resultCode === 0) {
      yield put(removeTodoListAC({id: action.todoList_ID}));
      yield put(setAppStatus({status: "succeeded"}));
    }
  } catch (error) {
    yield* handleServerNetworkErrorSaga(error as { message: string });
  }
}

export const removeTodoList = (todoList_ID: string) =>
  ({type: "TODOLISTS/REMOVE-TODOLIST", todoList_ID} as const);

export function* addTodoListSagaWorker(action: ReturnType<typeof addTodoList>) {
  yield put(setAppStatus({status: "loading"}));
  try {
    const data: ResponseType<{ item: TodoListType }> = yield call(todoListsAPI.createTodoList, action.title);
    if (data.resultCode === 0) {
      const newTodoList = data.data.item;
      yield put(addTodoListAC({todoList: newTodoList}));
      yield put(setAppStatus({status: "succeeded"}));
    } else {
      yield* handleServerAppErrorSaga(data);
    }
  } catch (error) {
    yield* handleServerNetworkErrorSaga(error as { message: string });
  }
}

export const addTodoList = (title: string) =>
  ({type: "TODOLISTS/ADD-TODOLIST", title} as const);

export function* changeTodoListTitleSagaWorker(action: ReturnType<typeof changeTodoListTitle>) {
  yield put(setAppStatus({status: "loading"}));
  try {
    const data: ResponseType = yield call(todoListsAPI.updateTodoList, action.todoList_ID, action.newTitle);
    if (data.resultCode === 0) {
      yield put(changeTodoListTitleAC({id: action.todoList_ID, title: action.newTitle}));
      yield put(setAppStatus({status: "succeeded"}));
    } else {
      yield* handleServerAppErrorSaga(data);
    }
  } catch (error) {
    yield* handleServerNetworkErrorSaga(error as { message: string });
  }
}

export const changeTodoListTitle = (todoList_ID: string, newTitle: string) =>
  ({type: "TODOLISTS/CHANGE-TODOLIST-TITLE", todoList_ID, newTitle} as const);

export function* todoListsSagaWatcher() {
  yield takeEvery("TODOLISTS/REMOVE-TODOLIST", removeTodoListSagaWorker);
  yield takeEvery("TODOLISTS/ADD-TODOLIST", addTodoListSagaWorker);
  yield takeEvery("TODOLISTS/CHANGE-TODOLIST-TITLE", changeTodoListTitleSagaWorker);
}
