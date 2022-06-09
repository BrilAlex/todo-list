import {
  addTodoListAC,
  AddTodoListActionType, clearTodoListsDataAC, ClearTodoListsDataActionType, removeTodoListAC,
  RemoveTodoListActionType, setTodoListsAC,
  SetTodoListsActionType
} from "./todoListsReducer";
import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todoListsAPI,
  UpdateTaskRequestDataType
} from "../../api/todoListsApi";
import {Dispatch} from "redux";
import {AppStateType} from "../../app/store";
import {
  RequestStatusType,
  SetAppErrorActionType,
  setAppStatusAC,
  SetAppStatusActionType
} from "../../app/appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/errorUtils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

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
  | ReturnType<typeof removeTaskAC>
  | ReturnType<typeof addTaskAC>
  | ReturnType<typeof updateTaskAC>
  | AddTodoListActionType
  | RemoveTodoListActionType
  | SetTodoListsActionType
  | ReturnType<typeof setTasksAC>
  | ReturnType<typeof changeTaskEntityStatusAC>
  | ClearTodoListsDataActionType;
type ThunkDispatchType = Dispatch<TasksActionsType | SetAppStatusActionType | SetAppErrorActionType>;

// Initial state
const initState: TasksType = {};

const slice = createSlice({
  name: "tasks",
  initialState: initState,
  reducers: {
    removeTaskAC(state, action: PayloadAction<{todoList_ID: string, task_ID: string}>) {
      const tasks = state[action.payload.todoList_ID];
      const index = tasks.findIndex(t => t.id === action.payload.task_ID);
      if (index > -1) tasks.splice(index, 1);
    },
    addTaskAC(state, action: PayloadAction<{task: TaskType}>) {
      state[action.payload.task.todoListId].unshift({...action.payload.task, entityStatus: "idle"});
    },
    updateTaskAC(state, action: PayloadAction<{todoList_ID: string, task_ID: string, model: UpdateDomainTaskModelType}>) {
      const tasks = state[action.payload.todoList_ID];
      const index = tasks.findIndex(t => t.id === action.payload.task_ID);
      if (index > -1) tasks[index] = {...tasks[index], ...action.payload.model};
    },
    setTasksAC(state, action: PayloadAction<{todoList_ID: string, tasks: Array<TaskType>}>) {
      state[action.payload.todoList_ID] = action.payload.tasks.map(t => ({...t, entityStatus: "idle"}));
    },
    changeTaskEntityStatusAC(state, action: PayloadAction<{todoList_ID: string, task_ID: string, status: RequestStatusType}>) {
      const tasks = state[action.payload.todoList_ID];
      const index = tasks.findIndex(t => t.id === action.payload.task_ID);
      if (index > -1) tasks[index].entityStatus = action.payload.status;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setTodoListsAC, (state, action) => {
      action.payload.todoLists.forEach(tl => {
        state[tl.id] = [];
      });
    });
    builder.addCase(addTodoListAC, (state, action) => {
      state[action.payload.todoList.id] = [];
    });
    builder.addCase(removeTodoListAC, (state, action) => {
      delete state[action.payload.id];
    });
    builder.addCase(clearTodoListsDataAC, () => {
      return {};
    });
  },
});

export const tasksReducer = slice.reducer;

// Action Creators
export const {
  removeTaskAC,
  addTaskAC,
  updateTaskAC,
  setTasksAC,
  changeTaskEntityStatusAC,
} = slice.actions;

// Thunk Creators
export const fetchTasksTC = (todoList_ID: string) => (dispatch: ThunkDispatchType) => {
  dispatch(setAppStatusAC({status: "loading"}));
  todoListsAPI.getTasks(todoList_ID)
    .then(response => {
      const tasks = response.data.items;
      dispatch(setTasksAC({todoList_ID, tasks}));
      dispatch(setAppStatusAC({status: "succeeded"}));
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch);
    });
};
export const removeTaskTC = (todoList_ID: string, task_ID: string) => (dispatch: ThunkDispatchType) => {
  dispatch(setAppStatusAC({status: "loading"}));
  dispatch(changeTaskEntityStatusAC({todoList_ID, task_ID, status: "loading"}));
  todoListsAPI.deleteTask(todoList_ID, task_ID)
    .then(response => {
      if (response.data.resultCode === 0) {
        dispatch(removeTaskAC({todoList_ID, task_ID}));
        dispatch(setAppStatusAC({status: "succeeded"}));
      } else {
        handleServerAppError(response.data, dispatch);
      }
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch);
    });
};
export const addTaskTC = (todoList_ID: string, title: string) => (dispatch: ThunkDispatchType) => {
  dispatch(setAppStatusAC({status: "loading"}));
  todoListsAPI.createTask(todoList_ID, title)
    .then(response => {
      if (response.data.resultCode === 0) {
        const newTask = response.data.data.item;
        dispatch(addTaskAC({task: newTask}));
        dispatch(setAppStatusAC({status: "succeeded"}));
      } else {
        handleServerAppError(response.data, dispatch);
      }
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch);
    });
};
export const updateTaskTC = (todoList_ID: string, task_ID: string, model: UpdateDomainTaskModelType) =>
  (dispatch: ThunkDispatchType, getState: () => AppStateType) => {
    dispatch(setAppStatusAC({status: "loading"}));
    const task = getState().tasks[todoList_ID].find(t => t.id === task_ID);
    if (task) {
      const apiModel: UpdateTaskRequestDataType = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        ...model,
      };
      todoListsAPI.updateTask(todoList_ID, task_ID, apiModel)
        .then(response => {
          if (response.data.resultCode === 0) {
            dispatch(updateTaskAC({todoList_ID, task_ID, model}));
            dispatch(setAppStatusAC({status: "succeeded"}));
          } else {
            handleServerAppError(response.data, dispatch);
          }
        })
        .catch(error => {
          handleServerNetworkError(error, dispatch);
        });
    }
  };
