import {TasksType, TaskType} from "../App";
import {v1} from "uuid";
import {AddTodoListActionType, RemoveTodoListActionType} from "./todoListsReducer";

type RemoveTaskActionType = {
  type: "REMOVE-TASK"
  todoList_ID: string
  task_ID: string
};

type AddTaskActionType = {
  type: "ADD-TASK"
  todoList_ID: string
  title: string
};

type ChangeTaskStatusActionType = {
  type: "CHANGE-TASK-STATUS"
  todoList_ID: string
  task_ID: string
  isDone: boolean
};

type ChangeTaskTitleActionType = {
  type: "CHANGE-TASK-TITLE"
  todoList_ID: string
  task_ID: string
  title: string
};

type ActionType = RemoveTaskActionType | AddTaskActionType |
  ChangeTaskStatusActionType | ChangeTaskTitleActionType |
  AddTodoListActionType | RemoveTodoListActionType;

const initState: TasksType = {};

export const removeTaskAC = (todoList_ID: string, task_ID: string): RemoveTaskActionType => {
  return {type: "REMOVE-TASK", todoList_ID, task_ID};
};
export const addTaskAC = (todoList_ID: string, newTaskTitle: string): AddTaskActionType => {
  return {type: "ADD-TASK", todoList_ID, title: newTaskTitle};
};
export const changeTaskStatusAC = (todoList_ID: string, task_ID: string, newStatus: boolean): ChangeTaskStatusActionType => {
  return {type: "CHANGE-TASK-STATUS", todoList_ID, task_ID, isDone: newStatus};
};
export const changeTaskTitleAC = (todoList_ID: string, task_ID: string, newTitle: string): ChangeTaskTitleActionType => {
  return {type: "CHANGE-TASK-TITLE", todoList_ID, task_ID, title: newTitle};
};

export const tasksReducer = (state: TasksType = initState, action: ActionType): TasksType => {
  switch (action.type) {
    case "REMOVE-TASK": {
      return {...state, [action.todoList_ID]: state[action.todoList_ID].filter(t => t.id !== action.task_ID)};
    }
    case "ADD-TASK": {
      const newTask: TaskType = {id: v1(), title: action.title, isDone: false};
      return {
        ...state,
        [action.todoList_ID]: [newTask, ...state[action.todoList_ID]],
      };
    }
    case "CHANGE-TASK-STATUS": {
      return {
        ...state,
        [action.todoList_ID]: state[action.todoList_ID].map(
          t => t.id === action.task_ID ? {...t, isDone: action.isDone} : t
        ),
      };
    }
    case "CHANGE-TASK-TITLE": {
      return {
        ...state,
        [action.todoList_ID]: state[action.todoList_ID].map(
          t => t.id === action.task_ID ? {...t, title: action.title} : t),
      };
    }
    case "ADD-TODOLIST": {
      return {...state, [action.id]: []};
    }
    case "REMOVE-TODOLIST": {
      const newState = {...state};
      delete newState[action.id];
      return newState;
    }
    default:
      return state;
  }
};