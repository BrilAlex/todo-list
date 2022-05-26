import {applyMiddleware, combineReducers, createStore} from "redux";
import {TodoListsActionsType, todoListsReducer} from "../features/TodoListsList/todoListsReducer";
import {TasksActionsType, tasksReducer} from "../features/TodoListsList/tasksReducer";
import thunkMiddleware, {ThunkAction} from "redux-thunk";
import {appReducer} from "./appReducer";
import {AuthActionsType, authReducer} from "../features/Login/authReducer";

export type AppStateType = ReturnType<typeof rootReducer>;
export type RootActionsType = TodoListsActionsType | TasksActionsType | AuthActionsType;
export type RootThunkType<ReturnType = void> = ThunkAction<ReturnType, AppStateType, unknown, RootActionsType>;

const rootReducer = combineReducers({
  todoLists: todoListsReducer,
  tasks: tasksReducer,
  app: appReducer,
  auth: authReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

// @ts-ignore
window.store = store;