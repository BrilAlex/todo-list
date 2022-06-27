import {asyncActions as asyncTodoListsActions} from "./todoListsReducer";
import {todoListsAPI} from "../../api/todoListsApi";
import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  UpdateTaskRequestDataType
} from "../../api/types";
import {RequestStatusType} from "../Application/applicationReducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/errorUtils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppStateType, ThunkErrorType} from "../../utils/types";
import {commonAppActions} from "../CommonActions/app";
import {commonTodoListsActions} from "../CommonActions/todoLists";
import {AxiosError} from "axios";

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
type UpdateTaskParamsType = {
  todoList_ID: string
  task_ID: string
  model: UpdateDomainTaskModelType
};

// Common App actions
const {setAppStatus} = commonAppActions;

// Common TodoLists actions
const {clearTodoListsData} = commonTodoListsActions;

// Thunk Creators
const fetchTasks = createAsyncThunk<{ todoList_ID: string, tasks: Array<TaskType> }, string, ThunkErrorType>(
  "tasks/fetchTasks",
  async (todoList_ID: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: "loading"}));
    try {
      const response = await todoListsAPI.getTasks(todoList_ID);
      const tasks = response.data.items;
      thunkAPI.dispatch(setAppStatus({status: "succeeded"}));
      return {todoList_ID, tasks};
    } catch (error) {
      return handleServerNetworkError(error as AxiosError, thunkAPI);
    }
  }
);
const removeTask = createAsyncThunk(
  "tasks/removeTask",
  async (params: { todoList_ID: string, task_ID: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: "loading"}));
    thunkAPI.dispatch(changeTaskEntityStatus({
      todoList_ID: params.todoList_ID,
      task_ID: params.task_ID,
      status: "loading",
    }));
    try {
      const response = await todoListsAPI.deleteTask(params.todoList_ID, params.task_ID);
      if (response.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatus({status: "succeeded"}));
        return {todoList_ID: params.todoList_ID, task_ID: params.task_ID};
      } else {
        return handleServerAppError(response.data, thunkAPI);
      }
    } catch (error) {
      return handleServerNetworkError(error as AxiosError, thunkAPI);
    }
  }
);
const addTask = createAsyncThunk<TaskType, { todoList_ID: string, title: string }, ThunkErrorType>(
  "tasks/addTask", async (
    params: { todoList_ID: string, title: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: "loading"}));
    try {
      const response = await todoListsAPI.createTask(params.todoList_ID, params.title);
      if (response.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatus({status: "succeeded"}));
        return response.data.data.item;
      } else {
        return handleServerAppError(response.data, thunkAPI, false);
      }
    } catch (error) {
      return handleServerNetworkError(error as AxiosError, thunkAPI, false);
    }
  }
);
const updateTask = createAsyncThunk<UpdateTaskParamsType, UpdateTaskParamsType, ThunkErrorType>(
  "tasks/updateTask",
  async (
    params: UpdateTaskParamsType,
    thunkAPI,
  ) => {
    thunkAPI.dispatch(setAppStatus({status: "loading"}));
    const state = thunkAPI.getState() as AppStateType;
    const task = state.tasks[params.todoList_ID].find(t => t.id === params.task_ID);

    if (!task) {
      return thunkAPI.rejectWithValue({errors: ["Task not found in state"]});
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
        thunkAPI.dispatch(setAppStatus({status: "succeeded"}));
        return params;
      } else {
        return handleServerAppError(response.data, thunkAPI);
      }
    } catch (error) {
      return handleServerNetworkError(error as AxiosError, thunkAPI);
    }
  }
);

export const asyncActions = {
  fetchTasks,
  addTask,
  updateTask,
  removeTask,
};

// Slice
export const tasksSlice = createSlice({
  name: "tasks",
  initialState: {} as TasksType,
  reducers: {
    changeTaskEntityStatus(state, action: PayloadAction<{ todoList_ID: string, task_ID: string, status: RequestStatusType }>) {
      const tasks = state[action.payload.todoList_ID];
      const index = tasks.findIndex(t => t.id === action.payload.task_ID);
      if (index > -1) tasks[index].entityStatus = action.payload.status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncTodoListsActions.fetchTodoLists.fulfilled, (state, action) => {
        action.payload.todoLists.forEach(tl => {
          state[tl.id] = [];
        });
      })
      .addCase(asyncTodoListsActions.addTodoList.fulfilled, (state, action) => {
        state[action.payload.todoList.id] = [];
      })
      .addCase(asyncTodoListsActions.removeTodoList.fulfilled, (state, action) => {
        delete state[action.payload.id];
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todoList_ID] = action.payload.tasks.map(t => ({
          ...t,
          entityStatus: "idle"
        }));
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todoList_ID];
        const index = tasks.findIndex(t => t.id === action.payload.task_ID);
        if (index > -1) tasks.splice(index, 1);
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state[action.payload.todoListId].unshift({...action.payload, entityStatus: "idle"});
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todoList_ID];
        const index = tasks.findIndex(t => t.id === action.payload.task_ID);
        if (index > -1) tasks[index] = {...tasks[index], ...action.payload.model};
      })
      .addCase(clearTodoListsData, () => {
        return {};
      });
  },
});

// Action Creators
const {changeTaskEntityStatus} = tasksSlice.actions;
