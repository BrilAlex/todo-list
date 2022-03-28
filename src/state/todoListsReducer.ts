import {FilterValueType, TodoListType} from "../App";
import {v1} from "uuid";

export type RemoveTodoListActionType = {
  type: "REMOVE-TODOLIST"
  id: string
};

export type AddTodoListActionType = {
  type: "ADD-TODOLIST"
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

export const removeTodoListAC = (todoList_ID: string): RemoveTodoListActionType => {
  return {type: "REMOVE-TODOLIST", id: todoList_ID};
};

export const addTodoListAC = (title: string): AddTodoListActionType => {
  return {type: "ADD-TODOLIST", title};
};

export const changeTodoListTitleAC = (todoList_ID: string, newTitle: string): ChangeTodoListTitleActionType => {
  return {type: "CHANGE-TODOLIST-TITLE", id: todoList_ID, title: newTitle};
};

export const changeTodoListFilterAC = (todoList_ID: string, newFilter: FilterValueType): ChangeTodoListFilterActionType => {
  return {type: "CHANGE-TODOLIST-FILTER", id: todoList_ID, filter: newFilter};
};

export const todoListsReducer = (state: Array<TodoListType>, action: ActionType): Array<TodoListType> => {
  switch (action.type) {
    case "REMOVE-TODOLIST": {
      return state.filter(tl => tl.id !== action.id);
    }
    case "ADD-TODOLIST": {
      return [
        ...state,
        {id: v1(), title: action.title, filter: "all"}
      ];
    }
    case "CHANGE-TODOLIST-TITLE": {
      const todoList = state.find(tl => tl.id === action.id);
      if (todoList) {
        todoList.title = action.title;
      }
      return [...state];
    }
    case "CHANGE-TODOLIST-FILTER": {
      const todoList = state.find(tl => tl.id === action.id);
      if (todoList) {
        todoList.filter = action.filter;
      }
      return [...state];
    }
    default:
      throw new Error("Invalid action type");
  }
};