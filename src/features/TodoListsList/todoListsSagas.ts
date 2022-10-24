import {call, put, takeEvery} from "redux-saga/effects";
import {setAppStatusAC} from "../../app/appReducer";
import {ResponseType, todoListsAPI, TodoListType} from "../../api/todoListsApi";
import {handleServerAppErrorSaga, handleServerNetworkErrorSaga} from "../../utils/errorUtils";
import {
  addTodoListAC,
  changeTodolistEntityStatusAC,
  changeTodoListTitleAC,
  removeTodoListAC
} from "./todoListsReducer";

export function* removeTodoListSagaWorker(action: ReturnType<typeof removeTodoList>) {
  yield put(setAppStatusAC("loading"));
  yield put(changeTodolistEntityStatusAC(action.todoList_ID, "loading"));
  try {
    const data: ResponseType = yield call(todoListsAPI.deleteTodoList, action.todoList_ID);
    if (data.resultCode === 0) {
      yield put(removeTodoListAC(action.todoList_ID));
      yield put(setAppStatusAC("succeeded"));
    }
  } catch (error) {
    yield* handleServerNetworkErrorSaga(error as { message: string });
  }
}

export const removeTodoList = (todoList_ID: string) =>
  ({type: "TODOLISTS/REMOVE-TODOLIST", todoList_ID} as const);

export function* addTodoListSagaWorker(action: ReturnType<typeof addTodoList>) {
  yield put(setAppStatusAC("loading"));
  try {
    const data: ResponseType<{ item: TodoListType }> = yield call(todoListsAPI.createTodoList, action.title);
    if (data.resultCode === 0) {
      const newTodoList = data.data.item;
      yield put(addTodoListAC(newTodoList));
      yield put(setAppStatusAC("succeeded"));
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
  yield put(setAppStatusAC("loading"));
  try {
    const data: ResponseType = yield call(todoListsAPI.updateTodoList, action.todoList_ID, action.newTitle);
    if (data.resultCode === 0) {
      yield put(changeTodoListTitleAC(action.todoList_ID, action.newTitle));
      yield put(setAppStatusAC("succeeded"));
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
