import {
  addTodoListAC,
  asyncActions as asyncTodoListsActions,
  removeTodoListAC
} from "./todoListsReducer";
import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
} from "../../api/types";
import {RequestStatusType} from "../Application/applicationReducer";
import {createAction, createSlice} from "@reduxjs/toolkit";
import {commonTodoListsActions} from "../CommonActions/todoLists";

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

// Common TodoLists actions
const {clearTodoListsData} = commonTodoListsActions;

// Tasks actions
export const setTasksAC = createAction<{ todoList_ID: string, tasks: TaskType[] }>("tasks/set-tasks");
export const addTaskAC = createAction<TaskType>("tasks/add-task");
export const removeTaskAC = createAction<{ todoList_ID: string, task_ID: string }>("tasks/remove-task");
export const updateTaskAC = createAction<UpdateTaskParamsType>("tasks/update-task");
export const changeTaskEntityStatus = createAction<{ todoList_ID: string, task_ID: string, status: RequestStatusType }>("tasks/change-task-entity-status");

// Slice
export const tasksSlice = createSlice({
  name: "tasks",
  initialState: {} as TasksType,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncTodoListsActions.fetchTodoLists.fulfilled, (state, action) => {
        action.payload.todoLists.forEach(tl => {
          state[tl.id] = [];
        });
      })
      .addCase(addTodoListAC, (state, action) => {
        state[action.payload.todoList.id] = [];
      })
      .addCase(removeTodoListAC, (state, action) => {
        delete state[action.payload.id];
      })
      .addCase(setTasksAC, (state, action) => {
        state[action.payload.todoList_ID] = action.payload.tasks.map(t => ({
          ...t,
          entityStatus: "idle"
        }));
      })
      .addCase(removeTaskAC, (state, action) => {
        const tasks = state[action.payload.todoList_ID];
        const index = tasks.findIndex(t => t.id === action.payload.task_ID);
        if (index > -1) tasks.splice(index, 1);
      })
      .addCase(addTaskAC, (state, action) => {
        state[action.payload.todoListId].unshift({...action.payload, entityStatus: "idle"});
      })
      .addCase(updateTaskAC, (state, action) => {
        const tasks = state[action.payload.todoList_ID];
        const index = tasks.findIndex(t => t.id === action.payload.task_ID);
        if (index > -1) tasks[index] = {...tasks[index], ...action.payload.model};
      })
      .addCase(changeTaskEntityStatus, (state, action) => {
        const tasks = state[action.payload.todoList_ID];
        const index = tasks.findIndex(t => t.id === action.payload.task_ID);
        if (index > -1) tasks[index].entityStatus = action.payload.status;
      })
      .addCase(clearTodoListsData, () => {
        return {};
      });
  },
});
