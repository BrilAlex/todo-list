import {combineReducers} from "redux";
import thunkMiddleware from "redux-thunk";
import {applicationReducer} from "../features/Application/applicationReducer";
import {authReducer} from "../features/Auth/authReducer";
import {todoListsReducer} from "../features/TodoListsList/todoListsReducer";
import {tasksReducer} from "../features/TodoListsList/tasksReducer";
import {configureStore} from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
  app: applicationReducer,
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
