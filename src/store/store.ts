import {combineReducers, createStore} from "redux";
import {todoListsReducer} from "./todoListsReducer";
import {tasksReducer} from "./tasksReducer";

export type AppStateType = ReturnType<typeof rootReducer>;

const rootReducer = combineReducers({
  todoLists: todoListsReducer,
  tasks: tasksReducer,
});

export const store = createStore(rootReducer);

// @ts-ignore
window.store = store;