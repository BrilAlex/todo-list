import {
  addTodoListTC,
  clearTodoListsDataAC,
  ClearTodoListsDataActionType,
  fetchTodoListsTC, removeTodoListTC
} from "./todoListsReducer";
import {todoListsAPI} from "../../api/todoListsApi";
import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  UpdateTaskRequestDataType
} from "../../api/types";
import {AppStateType} from "../../app/store";
import {
  RequestStatusType,
  setAppStatusAC,
} from "../Application/applicationReducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/errorUtils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

// Types
export type TaskDomainType = TaskType & { entityStatus: RequestStatusType }
export type TasksType = {
  [todoList_ID: string]: Array<TaskDomainType>
}
export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
};
export type TasksActionsType =
  | ReturnType<typeof changeTaskEntityStatusAC>
  | ClearTodoListsDataActionType;

// Thunk Creators
export const fetchTasksTC = createAsyncThunk("tasks/fetchTasks", async (todoList_ID: string, thunkAPI) => {
  thunkAPI.dispatch(setAppStatusAC({status: "loading"}));
  try {
    const response = await todoListsAPI.getTasks(todoList_ID);
    const tasks = response.data.items;
    thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}));
    return {todoList_ID, tasks};
  } catch (error) {
    handleServerNetworkError(error as { message: string }, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue(error);
  }
});
export const removeTaskTC = createAsyncThunk("tasks/removeTask", async (params: { todoList_ID: string, task_ID: string }, thunkAPI) => {
  thunkAPI.dispatch(setAppStatusAC({status: "loading"}));
  thunkAPI.dispatch(changeTaskEntityStatusAC({
    todoList_ID: params.todoList_ID,
    task_ID: params.task_ID,
    status: "loading"
  }));
  try {
    const response = await todoListsAPI.deleteTask(params.todoList_ID, params.task_ID);
    if (response.data.resultCode === 0) {
      thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}));
      return {todoList_ID: params.todoList_ID, task_ID: params.task_ID};
    } else {
      handleServerAppError(response.data, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(response.data);
    }
  } catch (error) {
    handleServerNetworkError(error as { message: string }, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue(error);
  }
});
export const addTaskTC = createAsyncThunk("tasks/addTask", async (
  params: { todoList_ID: string, title: string }, {dispatch, rejectWithValue}
) => {
  dispatch(setAppStatusAC({status: "loading"}));
  try {
    const response = await todoListsAPI.createTask(params.todoList_ID, params.title);
    if (response.data.resultCode === 0) {
      dispatch(setAppStatusAC({status: "succeeded"}));
      return response.data.data.item;
    } else {
      handleServerAppError(response.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (error) {
    handleServerNetworkError(error as { message: string }, dispatch);
    return rejectWithValue(null);
  }
});
export const updateTaskTC = createAsyncThunk("tasks/updateTask", async (
  params: { todoList_ID: string, task_ID: string, model: UpdateDomainTaskModelType },
  {dispatch, getState, rejectWithValue},
) => {
  dispatch(setAppStatusAC({status: "loading"}));
  const state = getState() as AppStateType;
  const task = state.tasks[params.todoList_ID].find(t => t.id === params.task_ID);

  if (!task) {
    return rejectWithValue("Task not found in state");
  }

  const apiModel: UpdateTaskRequestDataType = {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    startDate: task.startDate,
    deadline: task.deadline,
    ...params.model,
  };
  try {
    const response = await todoListsAPI.updateTask(params.todoList_ID, params.task_ID, apiModel);
    if (response.data.resultCode === 0) {
      dispatch(setAppStatusAC({status: "succeeded"}));
      return params;
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
  name: "tasks",
  initialState: {} as TasksType,
  reducers: {
    changeTaskEntityStatusAC(state, action: PayloadAction<{ todoList_ID: string, task_ID: string, status: RequestStatusType }>) {
      const tasks = state[action.payload.todoList_ID];
      const index = tasks.findIndex(t => t.id === action.payload.task_ID);
      if (index > -1) tasks[index].entityStatus = action.payload.status;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodoListsTC.fulfilled, (state, action) => {
      action.payload.todoLists.forEach(tl => {
        state[tl.id] = [];
      });
    });
    builder.addCase(addTodoListTC.fulfilled, (state, action) => {
      state[action.payload.todoList.id] = [];
    });
    builder.addCase(removeTodoListTC.fulfilled, (state, action) => {
      delete state[action.payload.id];
    });
    builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
      state[action.payload.todoList_ID] = action.payload.tasks.map(t => ({
        ...t,
        entityStatus: "idle"
      }));
    });
    builder.addCase(removeTaskTC.fulfilled, (state, action) => {
      const tasks = state[action.payload.todoList_ID];
      const index = tasks.findIndex(t => t.id === action.payload.task_ID);
      if (index > -1) tasks.splice(index, 1);
    });
    builder.addCase(addTaskTC.fulfilled, (state, action) => {
      state[action.payload.todoListId].unshift({...action.payload, entityStatus: "idle"});
    });
    builder.addCase(updateTaskTC.fulfilled, (state, action) => {
      const tasks = state[action.payload.todoList_ID];
      const index = tasks.findIndex(t => t.id === action.payload.task_ID);
      if (index > -1) tasks[index] = {...tasks[index], ...action.payload.model};
    });
    builder.addCase(clearTodoListsDataAC, () => {
      return {};
    });
  },
});

// Reducer
export const tasksReducer = slice.reducer;

// Action Creators
export const {changeTaskEntityStatusAC} = slice.actions;
