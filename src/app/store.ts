import {applyMiddleware, combineReducers, createStore} from "redux";
import {todoListsReducer} from "../features/TodoListsList/todoListsReducer";
import {tasksReducer} from "../features/TodoListsList/tasksReducer";
import thunkMiddleware from "redux-thunk";
import {appReducer} from "./appReducer";
import {authReducer} from "../features/Login/authReducer";

export type AppStateType = ReturnType<typeof rootReducer>;

const rootReducer = combineReducers({
  todoLists: todoListsReducer,
  tasks: tasksReducer,
  app: appReducer,
  auth: authReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

// @ts-ignore
window.store = store;