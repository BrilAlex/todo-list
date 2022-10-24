import {
  AddTodoListActionType,
  ClearTodoListsDataActionType,
  RemoveTodoListActionType,
  SetTodoListsActionType
} from "./todoListsReducer";
import {TaskPriorities, TaskStatuses, TaskType} from "../../api/todoListsApi";
import {RequestStatusType} from "../../app/appReducer";

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

// Initial state
const initState: TasksType = {};

// Action Creators
export const removeTaskAC = (todoList_ID: string, task_ID: string) =>
  ({type: "REMOVE-TASK", todoList_ID, task_ID} as const);
export const addTaskAC = (task: TaskType) =>
  ({type: "ADD-TASK", task} as const);
export const updateTaskAC = (updatedTask: TaskType) =>
  ({type: "UPDATE-TASK", updatedTask} as const);
export const setTasksAC = (todoList_ID: string, tasks: Array<TaskType>) =>
  ({type: "SET-TASKS", todoList_ID, tasks} as const);
export const changeTaskEntityStatusAC = (todoList_ID: string, task_ID: string, status: RequestStatusType) =>
  ({type: "CHANGE-TASK-ENTITY-STATUS", todoList_ID, task_ID, status} as const);

export const tasksReducer = (state: TasksType = initState, action: TasksActionsType): TasksType => {
  switch (action.type) {
    case "SET-TODOLISTS": {
      const stateCopy = {...state};
      action.todoLists.forEach(tl => stateCopy[tl.id] = []);
      return {...stateCopy};
    }
    case "SET-TASKS":
      return {
        ...state,
        [action.todoList_ID]: action.tasks.map(t => ({...t, entityStatus: "idle"}))
      };
    case "REMOVE-TASK":
      return {
        ...state,
        [action.todoList_ID]: state[action.todoList_ID].filter(t => t.id !== action.task_ID),
      };
    case "ADD-TASK":
      return {
        ...state,
        [action.task.todoListId]: [
          {...action.task, entityStatus: "idle"},
          ...state[action.task.todoListId],
        ],
      };
    case "UPDATE-TASK":
      return {
        ...state,
        [action.updatedTask.todoListId]: state[action.updatedTask.todoListId]
          .map(t => t.id === action.updatedTask.id ? {...t, ...action.updatedTask} : t),
      };
    case "CHANGE-TASK-ENTITY-STATUS":
      return {
        ...state,
        [action.todoList_ID]: state[action.todoList_ID]
          .map(t => t.id === action.task_ID ? {...t, entityStatus: action.status} : t),
      }
    case "ADD-TODOLIST":
      return {...state, [action.todoList.id]: []};
    case "REMOVE-TODOLIST": {
      const stateCopy = {...state};
      delete stateCopy[action.id];
      return stateCopy;
    }
    case "CLEAR-TODOLISTS-DATA":
      return {};
    default:
      return state;
  }
};
