import {todoListsAPI} from "../../api/todoListsApi";
import {TodoListType} from "../../api/types";
import {RequestStatusType} from "../Application/applicationReducer";
import {handleServerNetworkError} from "../../utils/errorUtils";
import {createAction, createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {commonAppActions} from "../CommonActions/app";
import {commonTodoListsActions} from "../CommonActions/todoLists";
import {AxiosError} from "axios";
import {ThunkErrorType} from "../../utils/types";
import {fetchTasks} from "./tasksSagas";

// Types
export type FilterValueType = "all" | "active" | "completed";
export type TodoListDomainType = TodoListType & {
  filter: FilterValueType
  entityStatus: RequestStatusType
};

// Common App actions
const {setAppStatus} = commonAppActions;

// Common TodoLists actions
const {clearTodoListsData} = commonTodoListsActions;

// Thunk Creators
const fetchTodoLists = createAsyncThunk<{ todoLists: Array<TodoListType> }, void, ThunkErrorType>(
  "todoLists/fetchTodoLists",
  async (params, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: "loading"}));
    try {
      const response = await todoListsAPI.getTodoLists();
      const todoLists = response.data;
      todoLists.forEach(tl => {
        thunkAPI.dispatch(fetchTasks(tl.id));
      });
      thunkAPI.dispatch(setAppStatus({status: "succeeded"}));
      return {todoLists};
    } catch (error) {
      return handleServerNetworkError(error as AxiosError, thunkAPI);
    }
  }
);

// TodoLists async actions
export const asyncActions = {
  fetchTodoLists,
};

// TodoLists actions
export const addTodoListAC = createAction<{ todoList: TodoListType }>("todoLists/add-todolist");
export const removeTodoListAC = createAction<{ id: string }>("todoLists/remove-todolist");
export const changeTodoListTitleAC = createAction<{ id: string, title: string }>("todoLists/update-todolist");
export const changeTodoListFilter = createAction<{ id: string, filter: FilterValueType }>("todoLists/change-todolist-filter");
export const changeTodolistEntityStatus = createAction<{ id: string, status: RequestStatusType }>("todoLists/change-todolist-entity-status");

// Slice
export const todoListsSlice = createSlice({
  name: "todoLists",
  initialState: [] as Array<TodoListDomainType>,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTodoLists.fulfilled, (state, action) => {
        return action.payload.todoLists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}));
      })
      .addCase(removeTodoListAC, (state, action) => {
        const index = state.findIndex(tl => tl.id === action.payload.id);
        if (index > -1) state.splice(index, 1);
      })
      .addCase(addTodoListAC, (state, action) => {
        state.unshift({...action.payload.todoList, filter: "all", entityStatus: "idle"});
      })
      .addCase(changeTodoListTitleAC, (state, action) => {
        const index = state.findIndex(tl => tl.id === action.payload.id);
        if (index > -1) state[index].title = action.payload.title;
      })
      .addCase(changeTodoListFilter, (state, action) => {
        const index = state.findIndex(tl => tl.id === action.payload.id);
        if (index > -1) state[index].filter = action.payload.filter;
      })
      .addCase(changeTodolistEntityStatus, (state, action) => {
        const index = state.findIndex(tl => tl.id === action.payload.id);
        if (index > -1) state[index].entityStatus = action.payload.status;
      })
      .addCase(clearTodoListsData, () => {
        return [];
      });
  },
});
