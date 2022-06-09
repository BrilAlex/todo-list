import {todoListsAPI, TodoListType} from "../../api/todoListsApi";
import {RequestStatusType, setAppStatusAC} from "../../app/appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/errorUtils";
import {fetchTasksTC} from "./tasksReducer";
import {RootThunkType} from "../../app/store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

// Types
export type FilterValueType = "all" | "active" | "completed";
export type TodoListDomainType = TodoListType & {
  filter: FilterValueType
  entityStatus: RequestStatusType
};
export type AddTodoListActionType = ReturnType<typeof addTodoListAC>;
export type RemoveTodoListActionType = ReturnType<typeof removeTodoListAC>;
export type SetTodoListsActionType = ReturnType<typeof setTodoListsAC>;
export type ClearTodoListsDataActionType = ReturnType<typeof clearTodoListsDataAC>;
export type TodoListsActionsType =
  | RemoveTodoListActionType
  | AddTodoListActionType
  | ReturnType<typeof changeTodoListTitleAC>
  | ReturnType<typeof changeTodoListFilterAC>
  | SetTodoListsActionType
  | ReturnType<typeof changeTodolistEntityStatusAC>
  | ClearTodoListsDataActionType;

// Initial state
const initState: Array<TodoListDomainType> = [];

const slice = createSlice({
  name: "todoLists",
  initialState: initState,
  reducers: {
    removeTodoListAC(state, action: PayloadAction<{ id: string }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id);
      if (index > -1) state.splice(index, 1);
    },
    addTodoListAC(state, action: PayloadAction<{ todoList: TodoListType }>) {
      state.unshift({...action.payload.todoList, filter: "all", entityStatus: "idle"})
    },
    changeTodoListTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id);
      if (index > -1) state[index].title = action.payload.title;
    },
    changeTodoListFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValueType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id);
      if (index > -1) state[index].filter = action.payload.filter;
    },
    setTodoListsAC(state, action: PayloadAction<{ todoLists: Array<TodoListType> }>) {
      return action.payload.todoLists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}));
    },
    changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id);
      if (index > -1) state[index].entityStatus = action.payload.status;
    },
    clearTodoListsDataAC() {
      return [];
    },
  },
});

export const todoListsReducer = slice.reducer;

// Action Creators
export const {
  removeTodoListAC,
  addTodoListAC,
  changeTodoListTitleAC,
  changeTodoListFilterAC,
  setTodoListsAC,
  changeTodolistEntityStatusAC,
  clearTodoListsDataAC,
} = slice.actions;

// Thunk Creators
export const fetchTodoListsTC = (): RootThunkType => (dispatch) => {
  dispatch(setAppStatusAC({status: "loading"}));
  todoListsAPI.getTodoLists()
    .then(response => {
      const todoLists = response.data;
      dispatch(setTodoListsAC({todoLists: todoLists}));
      dispatch(setAppStatusAC({status: "succeeded"}));
      return todoLists;
    })
    .then(todoLists => {
      todoLists.forEach(tl => {
        dispatch(fetchTasksTC(tl.id));
      });
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch);
    });
};
export const removeTodoListTC = (todoList_ID: string): RootThunkType => (dispatch) => {
  dispatch(setAppStatusAC({status: "loading"}));
  dispatch(changeTodolistEntityStatusAC({id: todoList_ID, status: "loading"}));
  todoListsAPI.deleteTodoList(todoList_ID)
    .then(response => {
      if (response.data.resultCode === 0) {
        dispatch(removeTodoListAC({id: todoList_ID}));
        dispatch(setAppStatusAC({status: "succeeded"}));
      }
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch);
    });
};
export const addTodoListTC = (title: string): RootThunkType => (dispatch) => {
  dispatch(setAppStatusAC({status: "loading"}));
  todoListsAPI.createTodoList(title)
    .then(response => {
      if (response.data.resultCode === 0) {
        const newTodoList = response.data.data.item;
        dispatch(addTodoListAC({todoList: newTodoList}));
        dispatch(setAppStatusAC({status: "succeeded"}));
      } else {
        handleServerAppError(response.data, dispatch);
      }
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch);
    });
};
export const changeTodoListTitleTC = (todoList_ID: string, newTitle: string): RootThunkType => (dispatch) => {
  dispatch(setAppStatusAC({status: "loading"}));
  todoListsAPI.updateTodoList(todoList_ID, newTitle)
    .then(response => {
      if (response.data.resultCode === 0) {
        dispatch(changeTodoListTitleAC({id: todoList_ID, title: newTitle}));
        dispatch(setAppStatusAC({status: "succeeded"}));
      } else {
        handleServerAppError(response.data, dispatch);
      }
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch);
    });
};
