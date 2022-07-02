import {combineReducers} from "redux";
import {appReducer} from "../features/Application";
import {authReducer} from "../features/Auth";
import {tasksReducer, todoListsReducer} from "../features/TodoListsList";

export const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  todoLists: todoListsReducer,
  tasks: tasksReducer,
});
