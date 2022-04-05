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

export const tasksReducer = (state: TasksType, action: ActionType): TasksType => {
  switch (action.type) {
    case "REMOVE-TASK": {
      const newState = {...state};
      newState[action.todoList_ID] = newState[action.todoList_ID].filter(t => t.id !== action.task_ID);
      return newState;
    }
    case "ADD-TASK": {
      const newState = {...state};
      const newTask: TaskType = {id: v1(), title: action.title, isDone: false};
      newState[action.todoList_ID] = [newTask, ...newState[action.todoList_ID]];
      return newState;
    }
    case "CHANGE-TASK-STATUS": {
      const newState = {...state};
      const task = newState[action.todoList_ID].find(t => t.id === action.task_ID);
      if (task) {
        task.isDone = action.isDone;
      }
      return newState;
    }
    case "CHANGE-TASK-TITLE": {
      const newState = {...state};
      const task = newState[action.todoList_ID].find(t => t.id === action.task_ID);
      if (task) {
        task.title = action.title;
      }
      return newState;
    }
    case "ADD-TODOLIST": {
      const newState = {...state};
      newState[action.id] = [];
      return newState;
    }
    case "REMOVE-TODOLIST": {
      const newState = {...state};
      delete newState[action.id];
      return newState;
    }
    default:
      throw new Error("Invalid action type for tasksReducer");
  }
};