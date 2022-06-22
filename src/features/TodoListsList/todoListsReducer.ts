import {todoListsAPI, TodoListType} from "../../api/todoListsApi";
import {RequestStatusType, setAppStatusAC} from "../../app/appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/errorUtils";
import {fetchTasksTC} from "./tasksReducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

// Types
export type FilterValueType = "all" | "active" | "completed";
export type TodoListDomainType = TodoListType & {
  filter: FilterValueType
  entityStatus: RequestStatusType
};
export type ClearTodoListsDataActionType = ReturnType<typeof clearTodoListsDataAC>;
export type TodoListsActionsType =
  | ReturnType<typeof changeTodoListFilterAC>
  | ReturnType<typeof changeTodolistEntityStatusAC>
  | ClearTodoListsDataActionType;

// Thunk Creators
export const fetchTodoListsTC = createAsyncThunk("todoLists/fetchTodoLists", async (
  params, {dispatch, rejectWithValue}
) => {
  dispatch(setAppStatusAC({status: "loading"}));
  const response = await todoListsAPI.getTodoLists();
  try {
    const todoLists = response.data;
    todoLists.forEach(tl => {
      dispatch(fetchTasksTC(tl.id));
    });
    dispatch(setAppStatusAC({status: "succeeded"}));
    return {todoLists};
  } catch (error) {
    handleServerNetworkError(error as { message: string }, dispatch);
    return rejectWithValue(null);
  }
});
export const removeTodoListTC = createAsyncThunk("todoLists/removeTodoList", async (
  todoList_ID: string, {dispatch, rejectWithValue}
) => {
  dispatch(setAppStatusAC({status: "loading"}));
  dispatch(changeTodolistEntityStatusAC({id: todoList_ID, status: "loading"}));
  const response = await todoListsAPI.deleteTodoList(todoList_ID);
  try {
    if (response.data.resultCode === 0) {
      dispatch(setAppStatusAC({status: "succeeded"}));
      return {id: todoList_ID};
    } else {
      handleServerAppError(response.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (error) {
    handleServerNetworkError(error as { message: string }, dispatch);
    return rejectWithValue(null);
  }
});
export const addTodoListTC = createAsyncThunk("todoLists/addTodoList", async (
  title: string, {dispatch, rejectWithValue}
) => {
  dispatch(setAppStatusAC({status: "loading"}));
  const response = await todoListsAPI.createTodoList(title);
  try {
    if (response.data.resultCode === 0) {
      dispatch(setAppStatusAC({status: "succeeded"}));
      return {todoList: response.data.data.item};
    } else {
      handleServerAppError(response.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (error) {
    handleServerNetworkError(error as { message: string }, dispatch);
    return rejectWithValue(null);
  }
});
export const changeTodoListTitleTC = createAsyncThunk("todoLists/changeTodoListTitle", async (
  params: { todoList_ID: string, newTitle: string }, {dispatch, rejectWithValue}
) => {
  dispatch(setAppStatusAC({status: "loading"}));
  const response = await todoListsAPI.updateTodoList(params.todoList_ID, params.newTitle);
  try {
    if (response.data.resultCode === 0) {
      dispatch(setAppStatusAC({status: "succeeded"}));
      return {id: params.todoList_ID, title: params.newTitle};
    } else {
      handleServerAppError(response.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (error) {
    handleServerNetworkError(error as { message: string }, dispatch);
    return rejectWithValue(null);
  }
});

// Slice
const slice = createSlice({
  name: "todoLists",
  initialState: [] as Array<TodoListDomainType>,
  reducers: {
    changeTodoListFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValueType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id);
      if (index > -1) state[index].filter = action.payload.filter;
    },
    changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id);
      if (index > -1) state[index].entityStatus = action.payload.status;
    },
    clearTodoListsDataAC() {
      return [];
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchTodoListsTC.fulfilled, (state, action) => {
      return action.payload.todoLists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}));
    });
    builder.addCase(removeTodoListTC.fulfilled, (state, action) => {
      const index = state.findIndex(tl => tl.id === action.payload.id);
      if (index > -1) state.splice(index, 1);
    });
    builder.addCase(addTodoListTC.fulfilled, (state, action) => {
      state.unshift({...action.payload.todoList, filter: "all", entityStatus: "idle"});
    });
    builder.addCase(changeTodoListTitleTC.fulfilled, (state, action) => {
      const index = state.findIndex(tl => tl.id === action.payload.id);
      if (index > -1) state[index].title = action.payload.title;
    });
  },
});

// Reducer
export const todoListsReducer = slice.reducer;

// Action Creators
export const {
  changeTodoListFilterAC,
  changeTodolistEntityStatusAC,
  clearTodoListsDataAC
} = slice.actions;
