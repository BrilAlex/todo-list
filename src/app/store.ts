import {applyMiddleware, combineReducers, createStore} from "redux";
import {TodoListsActionsType, todoListsReducer} from "../features/TodoListsList/todoListsReducer";
import {TasksActionsType, tasksReducer} from "../features/TodoListsList/tasksReducer";
import thunkMiddleware, {ThunkAction} from "redux-thunk";
import {appReducer} from "./appReducer";
import {AuthActionsType, authReducer} from "../features/Login/authReducer";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";
import {initializeAppSagaWorker} from "./appSagas";
import {authSagaWatcher} from "../features/Login/authSagas";
import {tasksSagaWatcher} from "../features/TodoListsList/tasksSagas";
import {todoListsSagaWatcher} from "../features/TodoListsList/todoListsSagas";

export type AppStateType = ReturnType<typeof rootReducer>;
export type RootActionsType = TodoListsActionsType | TasksActionsType | AuthActionsType;
export type RootThunkType<ReturnType = void> = ThunkAction<ReturnType, AppStateType, unknown, RootActionsType>;

const rootReducer = combineReducers({
  todoLists: todoListsReducer,
  tasks: tasksReducer,
  app: appReducer,
  auth: authReducer,
});

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware, sagaMiddleware));

function* rootSagaWatcher() {
  yield all([
    initializeAppSagaWorker(),
    authSagaWatcher(),
    todoListsSagaWatcher(),
    tasksSagaWatcher(),
  ]);
}

sagaMiddleware.run(rootSagaWatcher);

// @ts-ignore
window.store = store;