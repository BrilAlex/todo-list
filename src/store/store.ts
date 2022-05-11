import {applyMiddleware, combineReducers, createStore} from "redux";
import {todoListsReducer} from "./todoListsReducer";
import {tasksReducer} from "./tasksReducer";
import thunkMiddleware from "redux-thunk";

export type AppStateType = ReturnType<typeof rootReducer>;

const rootReducer = combineReducers({
  todoLists: todoListsReducer,
  tasks: tasksReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

// @ts-ignore
window.store = store;