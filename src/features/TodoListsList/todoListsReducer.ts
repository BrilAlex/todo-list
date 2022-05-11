import {todoListsAPI, TodoListType} from "../../api/todoListsApi";
import {Dispatch} from "redux";

// Types
export type FilterValueType = "all" | "active" | "completed";
export type TodoListDomainType = TodoListType & { filter: FilterValueType };
export type AddTodoListActionType = ReturnType<typeof addTodoListAC>;
export type RemoveTodoListActionType = ReturnType<typeof removeTodoListAC>;
export type SetTodoListsActionType = ReturnType<typeof setTodoListsAC>;
type ActionType =
  | RemoveTodoListActionType
  | AddTodoListActionType
  | ReturnType<typeof changeTodoListTitleAC>
  | ReturnType<typeof changeTodoListFilterAC>
  | SetTodoListsActionType;

// Initial state
const initState: Array<TodoListDomainType> = [];

// Action Creators
export const removeTodoListAC = (id: string) =>
  ({type: "REMOVE-TODOLIST", id} as const);
export const addTodoListAC = (todoList: TodoListType) =>
  ({type: "ADD-TODOLIST", todoList} as const);
export const changeTodoListTitleAC = (id: string, title: string) =>
  ({type: "CHANGE-TODOLIST-TITLE", id, title} as const);
export const changeTodoListFilterAC = (id: string, filter: FilterValueType) =>
  ({type: "CHANGE-TODOLIST-FILTER", id, filter} as const);
export const setTodoListsAC = (todoLists: Array<TodoListType>) =>
  ({type: "SET-TODOLISTS", todoLists} as const);

// Thunk Creators
export const fetchTodoListsTC = () => (dispatch: Dispatch<ActionType>) => {
  todoListsAPI.getTodoLists().then(response => {
    const todoLists = response.data;
    dispatch(setTodoListsAC(todoLists));
  });
};
export const removeTodoListTC = (todoList_ID: string) => (dispatch: Dispatch<ActionType>) => {
  todoListsAPI.deleteTodoList(todoList_ID).then(response => {
    if (response.data.resultCode === 0) {
      dispatch(removeTodoListAC(todoList_ID));
    }
  });
};
export const addTodoListTC = (title: string) => (dispatch: Dispatch<ActionType>) => {
  todoListsAPI.createTodoList(title).then(response => {
    const newTodoList = response.data.data.item;
    dispatch(addTodoListAC(newTodoList));
  });
};
export const changeTodoListTitleTC = (todoList_ID: string, newTitle: string) => (dispatch: Dispatch<ActionType>) => {
  todoListsAPI.updateTodoList(todoList_ID, newTitle).then(response => {
    if (response.data.resultCode === 0) {
      dispatch(changeTodoListTitleAC(todoList_ID, newTitle));
    }
  });
};

export const todoListsReducer = (state: Array<TodoListDomainType> = initState, action: ActionType): Array<TodoListDomainType> => {
  switch (action.type) {
    case "SET-TODOLISTS":
      return action.todoLists.map(tl => ({...tl, filter: "all"}));
    case "REMOVE-TODOLIST":
      return state.filter(tl => tl.id !== action.id);
    case "ADD-TODOLIST":
      return [{...action.todoList, filter: "all"}, ...state];
    case "CHANGE-TODOLIST-TITLE":
      return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl);
    case "CHANGE-TODOLIST-FILTER":
      return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl);
    default:
      return state;
  }
};
