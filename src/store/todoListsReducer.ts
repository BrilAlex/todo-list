import {v1} from "uuid";
import {TodoListType} from "../api/todoListsApi";

export type FilterValueType = "all" | "active" | "completed";

export type TodoListDomainType = TodoListType & { filter: FilterValueType };

export type RemoveTodoListActionType = {
  type: "REMOVE-TODOLIST"
  id: string
};

export type AddTodoListActionType = {
  type: "ADD-TODOLIST"
  id: string
  title: string
};

export type ChangeTodoListTitleActionType = {
  type: "CHANGE-TODOLIST-TITLE"
  id: string
  title: string
};

export type ChangeTodoListFilterActionType = {
  type: "CHANGE-TODOLIST-FILTER"
  id: string
  filter: FilterValueType
};

type ActionType =
  RemoveTodoListActionType | AddTodoListActionType |
  ChangeTodoListTitleActionType | ChangeTodoListFilterActionType;

const initState: Array<TodoListDomainType> = [];

export const removeTodoListAC = (todoList_ID: string): RemoveTodoListActionType => {
  return {type: "REMOVE-TODOLIST", id: todoList_ID};
};
export const addTodoListAC = (title: string): AddTodoListActionType => {
  return {type: "ADD-TODOLIST", id: v1(), title};
};
export const changeTodoListTitleAC = (todoList_ID: string, newTitle: string): ChangeTodoListTitleActionType => {
  return {type: "CHANGE-TODOLIST-TITLE", id: todoList_ID, title: newTitle};
};
export const changeTodoListFilterAC = (todoList_ID: string, newFilter: FilterValueType): ChangeTodoListFilterActionType => {
  return {type: "CHANGE-TODOLIST-FILTER", id: todoList_ID, filter: newFilter};
};

export const todoListsReducer = (state: Array<TodoListDomainType> = initState, action: ActionType): Array<TodoListDomainType> => {
  switch (action.type) {
    case "REMOVE-TODOLIST": {
      return state.filter(tl => tl.id !== action.id);
    }
    case "ADD-TODOLIST": {
      return [
        {id: action.id, title: action.title, addedDate: "", order: 0, filter: "all"},
        ...state,
      ];
    }
    case "CHANGE-TODOLIST-TITLE": {
      return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl);
    }
    case "CHANGE-TODOLIST-FILTER": {
      return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl);
    }
    default:
      return state;
  }
};