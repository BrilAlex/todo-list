import {combineReducers} from "redux";
import {TodoListsActionsType, todoListsReducer} from "../features/TodoListsList/todoListsReducer";
import {TasksActionsType, tasksReducer} from "../features/TodoListsList/tasksReducer";
import thunkMiddleware, {ThunkAction} from "redux-thunk";
import {AppActionsType, applicationReducer} from "../features/Application/applicationReducer";
import {AuthActionsType, authReducer} from "../features/Auth/authReducer";
import {configureStore} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";

export type RootReducerType = typeof rootReducer;
export type AppStateType = ReturnType<RootReducerType>;
export type RootActionsType =
  | AppActionsType
  | TodoListsActionsType
  | TasksActionsType
  | AuthActionsType;
export type RootThunkType<ReturnType = void> = ThunkAction<ReturnType, AppStateType, unknown, RootActionsType>;
type AppDispatchType = typeof store.dispatch;

const rootReducer = combineReducers({
  todoLists: todoListsReducer,
  tasks: tasksReducer,
  app: applicationReducer,
  auth: authReducer,
});

export const useAppDispatch = () => useDispatch<AppDispatchType>();

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware),
});

// @ts-ignore
window.store = store;