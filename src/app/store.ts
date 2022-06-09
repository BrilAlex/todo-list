import {combineReducers} from "redux";
import {TodoListsActionsType, todoListsReducer} from "../features/TodoListsList/todoListsReducer";
import {TasksActionsType, tasksReducer} from "../features/TodoListsList/tasksReducer";
import thunkMiddleware, {ThunkAction} from "redux-thunk";
import {appReducer} from "./appReducer";
import {AuthActionsType, authReducer} from "../features/Login/authReducer";
import {configureStore} from "@reduxjs/toolkit";

export type RootReducerType = typeof rootReducer;
export type AppStateType = ReturnType<RootReducerType>;
export type RootActionsType = TodoListsActionsType | TasksActionsType | AuthActionsType;
export type RootThunkType<ReturnType = void> = ThunkAction<ReturnType, AppStateType, unknown, RootActionsType>;

const rootReducer = combineReducers({
  todoLists: todoListsReducer,
  tasks: tasksReducer,
  app: appReducer,
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware),
});

// @ts-ignore
window.store = store;