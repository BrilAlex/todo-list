import {TasksType} from "../App";
import {v1} from "uuid";
import {AddTodoListActionType, RemoveTodoListActionType} from "./todoListsReducer";

type InitialStateType = typeof initialState;

type AddTaskActionType = {
  type: "ADD-TASK"
  todoList_ID: string
  title: string
};
type ChangeTaskTitleActionType = {
  type: "CHANGE-TASK-TITLE"
  todoList_ID: string
  task_ID: string
  title: string
}
type ChangeTaskStatusActionType = {
  type: "CHANGE-TASK-STATUS"
  todoList_ID: string
  task_ID: string
  isDone: boolean
};
type RemoveTaskActionType = {
  type: "REMOVE-TASK"
  todoList_ID: string
  task_ID: string
};

type ActionTypes = AddTaskActionType | ChangeTaskStatusActionType
  | ChangeTaskTitleActionType | RemoveTaskActionType
  | AddTodoListActionType | RemoveTodoListActionType;

let initialState = {} as TasksType;

export const addTaskAC = (todoList_ID: string, title: string): AddTaskActionType =>
  ({type: "ADD-TASK", todoList_ID, title});
export const changeTaskTitleAC = (todoList_ID: string, task_ID: string, title: string): ChangeTaskTitleActionType =>
  ({type: "CHANGE-TASK-TITLE", todoList_ID, task_ID, title});
export const changeTaskStatusAC = (todoList_ID: string, task_ID: string, isDone: boolean): ChangeTaskStatusActionType =>
  ({type: "CHANGE-TASK-STATUS", todoList_ID, task_ID, isDone});
export const removeTaskAC = (todoList_ID: string, task_ID: string): RemoveTaskActionType =>
  ({type: "REMOVE-TASK", todoList_ID, task_ID});

export const tasksReducer = (state: InitialStateType = initialState, action: ActionTypes): InitialStateType => {
  switch (action.type) {
    case "ADD-TASK":
      const newTask = {id: v1(), title: action.title, isDone: false};
      return {
        ...state,
        [action.todoList_ID]: [...state[action.todoList_ID], newTask]
      };
    case "CHANGE-TASK-TITLE":
      return {
        ...state,
        [action.todoList_ID]: state[action.todoList_ID].map(t => t.id === action.task_ID ?
          {...t, title: action.title} : t)
      };
    case "CHANGE-TASK-STATUS":
      return {
        ...state,
        [action.todoList_ID]: state[action.todoList_ID].map(t => t.id === action.task_ID ?
          {...t, isDone: action.isDone} : t)
      };
    case "REMOVE-TASK":
      return {
        ...state,
        [action.todoList_ID]: state[action.todoList_ID].filter(t => t.id !== action.task_ID)
      };
    case "ADD-TODOLIST":
      return {...state, [action.todoList_ID]: []};
    case "REMOVE-TODOLIST":
      const stateCopy = {...state};
      delete stateCopy[action.id]
      return stateCopy;
    default:
      return state;
  }
};