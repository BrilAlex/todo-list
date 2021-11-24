import {FilterValueType, TodoListType} from "../App";
import {v1} from "uuid";

type InitialStateType = typeof initialState;

export type AddTodoListActionType = {
  type: "ADD-TODOLIST"
  todoList_ID: string
  title: string
};
type ChangeTodoListTitleActionType = {
  type: "CHANGE-TODOLIST-TITLE"
  id: string
  title: string
};
type ChangeTodoListFilterActionType = {
  type: "CHANGE-TODOLIST-FILTER"
  id: string
  filter: FilterValueType
}
export type RemoveTodoListActionType = {
  type: "REMOVE-TODOLIST"
  id: string
};
type ActionTypes = AddTodoListActionType | ChangeTodoListTitleActionType
  | ChangeTodoListFilterActionType | RemoveTodoListActionType;

let initialState = [] as TodoListType[];

export const addTodoListAC = (title: string): AddTodoListActionType =>
  ({type: "ADD-TODOLIST", todoList_ID: v1(), title});
export const changeTodoListTitleAC = (id: string, title: string): ChangeTodoListTitleActionType =>
  ({type: "CHANGE-TODOLIST-TITLE", id, title});
export const changeTodoListFilterAC = (id: string, filter: FilterValueType): ChangeTodoListFilterActionType =>
  ({type: "CHANGE-TODOLIST-FILTER", id, filter});
export const removeTodoListAC = (id: string): RemoveTodoListActionType =>
  ({type: "REMOVE-TODOLIST", id});

export const todoListsReducer = (state: InitialStateType = initialState, action: ActionTypes): InitialStateType => {
  switch (action.type) {
    case "ADD-TODOLIST":
      return [...state, {id: action.todoList_ID, title: action.title, filter: "All"}];
    case "CHANGE-TODOLIST-TITLE":
      return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl);
    case "CHANGE-TODOLIST-FILTER":
      return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl);
    case "REMOVE-TODOLIST":
      return state.filter(tl => tl.id !== action.id);
    default:
      return state;
  }
};