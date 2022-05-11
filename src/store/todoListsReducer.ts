import {todoListsAPI, TodoListType} from "../api/todoListsApi";
import {Dispatch} from "redux";

export type FilterValueType = "all" | "active" | "completed";

export type TodoListDomainType = TodoListType & { filter: FilterValueType };

export type RemoveTodoListActionType = {
  type: "REMOVE-TODOLIST"
  id: string
};

export type AddTodoListActionType = {
  type: "ADD-TODOLIST"
  todoList: TodoListType
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

export type SetTodoListsActionType = {
  type: "SET-TODOLISTS"
  todoLists: Array<TodoListType>
};

type ActionType = RemoveTodoListActionType | AddTodoListActionType
  | ChangeTodoListTitleActionType | ChangeTodoListFilterActionType
  | SetTodoListsActionType;

const initState: Array<TodoListDomainType> = [];

// Action Creators
export const removeTodoListAC = (todoList_ID: string): RemoveTodoListActionType => {
  return {type: "REMOVE-TODOLIST", id: todoList_ID};
};
export const addTodoListAC = (newTodoList: TodoListType): AddTodoListActionType => {
  return {type: "ADD-TODOLIST", todoList: newTodoList};
};
export const changeTodoListTitleAC = (todoList_ID: string, newTitle: string): ChangeTodoListTitleActionType => {
  return {type: "CHANGE-TODOLIST-TITLE", id: todoList_ID, title: newTitle};
};
export const changeTodoListFilterAC = (todoList_ID: string, newFilter: FilterValueType): ChangeTodoListFilterActionType => {
  return {type: "CHANGE-TODOLIST-FILTER", id: todoList_ID, filter: newFilter};
};
export const setTodoListsAC = (todoLists: Array<TodoListType>): SetTodoListsActionType => {
  return {type: "SET-TODOLISTS", todoLists};
};

// Thunk
export const fetchTodoListsThunk = (dispatch: Dispatch) => {
  todoListsAPI.getTodoLists().then(response => {
    const todoLists = response.data;
    dispatch(setTodoListsAC(todoLists));
  });
};

// Thunk Creators
export const removeTodoListTC = (todoList_ID: string) => (dispatch: Dispatch) => {
  todoListsAPI.deleteTodoList(todoList_ID).then(response => {
    if (response.data.resultCode === 0) {
      dispatch(removeTodoListAC(todoList_ID));
    }
  });
};
export const addTodoListTC = (title: string) => (dispatch: Dispatch) => {
  todoListsAPI.createTodoList(title).then(response => {
    const newTodoList = response.data.data.item;
    dispatch(addTodoListAC(newTodoList));
  });
};
export const changeTodoListTitleTC = (todoList_ID: string, newTitle: string) => (dispatch: Dispatch) => {
  todoListsAPI.updateTodoList(todoList_ID, newTitle).then(response => {
    if (response.data.resultCode === 0) {
      dispatch(changeTodoListTitleAC(todoList_ID, newTitle));
    }
  });
};

export const todoListsReducer = (state: Array<TodoListDomainType> = initState, action: ActionType): Array<TodoListDomainType> => {
  switch (action.type) {
    case "SET-TODOLISTS": {
      return action.todoLists.map(tl => ({...tl, filter: "all"}));
    }
    case "REMOVE-TODOLIST": {
      return state.filter(tl => tl.id !== action.id);
    }
    case "ADD-TODOLIST": {
      return [
        {...action.todoList, filter: "all"},
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