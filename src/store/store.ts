import {combineReducers, createStore} from "redux";
import {todoListsReducer} from "./todoListsReducer";
import {tasksReducer} from "./tasksReducer";

export type AppStateType = ReturnType<typeof appRootReducer>;

const appRootReducer = combineReducers({
  todoLists: todoListsReducer,
  tasks: tasksReducer
});

export const store = createStore(appRootReducer);

// @ts-ignore
window.store = store;