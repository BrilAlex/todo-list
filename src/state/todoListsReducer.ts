import {FilterValueType, TodoListType} from "../App";
import {v1} from "uuid";

type InitialStateType = TodoListType[];

type AddTodoListActionType = {
  type: "ADD-TODOLIST"
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
type RemoveTodoListActionType = {
  type: "REMOVE-TODOLIST"
  id: string
};
type ActionTypes = AddTodoListActionType | ChangeTodoListTitleActionType
  | ChangeTodoListFilterActionType | RemoveTodoListActionType;

export const addTodoListAC = (title: string): AddTodoListActionType =>
  ({type: "ADD-TODOLIST", title});
export const changeTodoListTitleAC = (id: string, title: string): ChangeTodoListTitleActionType =>
  ({type: "CHANGE-TODOLIST-TITLE", id, title});
export const changeTodoListFilterAC = (id: string, filter: FilterValueType): ChangeTodoListFilterActionType =>
  ({type: "CHANGE-TODOLIST-FILTER", id, filter});
export const removeTodoListAC = (id: string): RemoveTodoListActionType =>
  ({type: "REMOVE-TODOLIST", id});

export const todoListsReducer = (state: InitialStateType, action: ActionTypes): InitialStateType => {
  switch(action.type) {
    case "ADD-TODOLIST":
      const newTodoList_ID = v1();
      return [...state, {id: newTodoList_ID, title: action.title, filter: "All"}];
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