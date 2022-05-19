import {todoListsAPI, TodoListType} from "../../api/todoListsApi";
import {Dispatch} from "redux";
import {
  RequestStatusType, SetAppErrorActionType,
  setAppStatusAC,
  SetAppStatusActionType
} from "../../app/appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/errorUtils";

// Types
export type FilterValueType = "all" | "active" | "completed";
export type TodoListDomainType = TodoListType & {
  filter: FilterValueType
  entityStatus: RequestStatusType
};
export type AddTodoListActionType = ReturnType<typeof addTodoListAC>;
export type RemoveTodoListActionType = ReturnType<typeof removeTodoListAC>;
export type SetTodoListsActionType = ReturnType<typeof setTodoListsAC>;
type ActionsType =
  | RemoveTodoListActionType
  | AddTodoListActionType
  | ReturnType<typeof changeTodoListTitleAC>
  | ReturnType<typeof changeTodoListFilterAC>
  | SetTodoListsActionType
  | ReturnType<typeof changeTodolistEntityStatusAC>;
type ThunkDispatchType = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType>;

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
export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) =>
  ({type: "CHANGE-TODOLIST-ENTITY-STATUS", id, status} as const);

// Thunk Creators
export const fetchTodoListsTC = () => (dispatch: ThunkDispatchType) => {
  dispatch(setAppStatusAC("loading"));
  todoListsAPI.getTodoLists()
    .then(response => {
      const todoLists = response.data;
      dispatch(setTodoListsAC(todoLists));
      dispatch(setAppStatusAC("succeeded"));
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch);
    });
};
export const removeTodoListTC = (todoList_ID: string) => (dispatch: ThunkDispatchType) => {
  dispatch(setAppStatusAC("loading"));
  dispatch(changeTodolistEntityStatusAC(todoList_ID, "loading"));
  todoListsAPI.deleteTodoList(todoList_ID)
    .then(response => {
      if (response.data.resultCode === 0) {
        dispatch(removeTodoListAC(todoList_ID));
        dispatch(setAppStatusAC("succeeded"));
      }
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch);
    });
};
export const addTodoListTC = (title: string) => (dispatch: ThunkDispatchType) => {
  dispatch(setAppStatusAC("loading"));
  todoListsAPI.createTodoList(title)
    .then(response => {
      if (response.data.resultCode === 0) {
        const newTodoList = response.data.data.item;
        dispatch(addTodoListAC(newTodoList));
        dispatch(setAppStatusAC("succeeded"));
      } else {
        handleServerAppError(response.data, dispatch);
      }
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch);
    });
};
export const changeTodoListTitleTC = (todoList_ID: string, newTitle: string) => (dispatch: ThunkDispatchType) => {
  dispatch(setAppStatusAC("loading"));
  todoListsAPI.updateTodoList(todoList_ID, newTitle)
    .then(response => {
      if (response.data.resultCode === 0) {
        dispatch(changeTodoListTitleAC(todoList_ID, newTitle));
        dispatch(setAppStatusAC("succeeded"));
      } else {
        handleServerAppError(response.data, dispatch);
      }
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch);
    });
};

export const todoListsReducer = (state: Array<TodoListDomainType> = initState, action: ActionsType): Array<TodoListDomainType> => {
  switch (action.type) {
    case "SET-TODOLISTS":
      return action.todoLists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}));
    case "REMOVE-TODOLIST":
      return state.filter(tl => tl.id !== action.id);
    case "ADD-TODOLIST":
      return [{...action.todoList, filter: "all", entityStatus: "idle"}, ...state];
    case "CHANGE-TODOLIST-TITLE":
      return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl);
    case "CHANGE-TODOLIST-FILTER":
      return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl);
    case "CHANGE-TODOLIST-ENTITY-STATUS":
      return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.status} : tl);
    default:
      return state;
  }
};
