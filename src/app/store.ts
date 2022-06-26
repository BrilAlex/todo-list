import {combineReducers} from "redux";
import thunkMiddleware from "redux-thunk";
import {appReducer} from "../features/Application";
import {authReducer} from "../features/Auth";
import {todoListsReducer} from "../features/TodoListsList";
import {tasksReducer} from "../features/TodoListsList/tasksReducer";
import {configureStore} from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  todoLists: todoListsReducer,
  tasks: tasksReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware),
});

// @ts-ignore
window.store = store;
