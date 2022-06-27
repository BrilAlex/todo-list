import {todoListsAPI} from "../../api/todoListsApi";
import {TodoListType} from "../../api/types";
import {RequestStatusType} from "../Application/applicationReducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/errorUtils";
import {asyncActions as asyncTaskActions} from "./tasksReducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {commonAppActions} from "../CommonActions/app";
import {commonTodoListsActions} from "../CommonActions/todoLists";
import {AxiosError} from "axios";
import {ThunkErrorType} from "../../utils/types";

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
        thunkAPI.dispatch(asyncTaskActions.fetchTasks(tl.id));
      });
      thunkAPI.dispatch(setAppStatus({status: "succeeded"}));
      return {todoLists};
    } catch (error) {
      return handleServerNetworkError(error as AxiosError, thunkAPI);
    }
  }
);
const removeTodoList = createAsyncThunk(
  "todoLists/removeTodoList",
  async (todoList_ID: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: "loading"}));
    thunkAPI.dispatch(changeTodolistEntityStatus({id: todoList_ID, status: "loading"}));
    try {
      const response = await todoListsAPI.deleteTodoList(todoList_ID);
      if (response.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatus({status: "succeeded"}));
        return {id: todoList_ID};
      } else {
        return handleServerAppError(response.data, thunkAPI);
      }
    } catch (error) {
      return handleServerNetworkError(error as AxiosError, thunkAPI);
    }
  }
);
const addTodoList = createAsyncThunk<{todoList: TodoListType}, string, ThunkErrorType>(
  "todoLists/addTodoList",
  async (title: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: "loading"}));
    try {
      const response = await todoListsAPI.createTodoList(title);
      if (response.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatus({status: "succeeded"}));
        return {todoList: response.data.data.item};
      } else {
        return handleServerAppError(response.data, thunkAPI, false);
      }
    } catch (error) {
      return handleServerNetworkError(error as AxiosError, thunkAPI, false);
    }
  }
);
const changeTodoListTitle = createAsyncThunk(
  "todoLists/changeTodoListTitle",
  async (params: { todoList_ID: string, newTitle: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: "loading"}));
    try {
      const response = await todoListsAPI.updateTodoList(params.todoList_ID, params.newTitle);
      if (response.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatus({status: "succeeded"}));
        return {id: params.todoList_ID, title: params.newTitle};
      } else {
        return handleServerAppError(response.data, thunkAPI, false);
      }
    } catch (error) {
      return handleServerNetworkError(error as AxiosError, thunkAPI, false);
    }
  }
);

export const asyncActions = {
  fetchTodoLists,
  removeTodoList,
  addTodoList,
  changeTodoListTitle,
};

// Slice
export const todoListsSlice = createSlice({
  name: "todoLists",
  initialState: [] as Array<TodoListDomainType>,
  reducers: {
    changeTodoListFilter(state, action: PayloadAction<{ id: string, filter: FilterValueType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id);
      if (index > -1) state[index].filter = action.payload.filter;
    },
    changeTodolistEntityStatus(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id);
      if (index > -1) state[index].entityStatus = action.payload.status;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTodoLists.fulfilled, (state, action) => {
        return action.payload.todoLists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}));
      })
      .addCase(removeTodoList.fulfilled, (state, action) => {
        const index = state.findIndex(tl => tl.id === action.payload.id);
        if (index > -1) state.splice(index, 1);
      })
      .addCase(addTodoList.fulfilled, (state, action) => {
        state.unshift({...action.payload.todoList, filter: "all", entityStatus: "idle"});
      })
      .addCase(changeTodoListTitle.fulfilled, (state, action) => {
        const index = state.findIndex(tl => tl.id === action.payload.id);
        if (index > -1) state[index].title = action.payload.title;
      })
      .addCase(clearTodoListsData, () => {
        return [];
      });
  },
});

// Action Creators
export const {changeTodolistEntityStatus} = todoListsSlice.actions;
