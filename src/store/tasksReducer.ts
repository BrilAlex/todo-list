import {
  AddTodoListActionType,
  RemoveTodoListActionType,
  SetTodoListsActionType
} from "./todoListsReducer";
import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todoListsAPI,
  UpdateTaskRequestDataType
} from "../api/todoListsApi";
import {Dispatch} from "redux";
import {AppStateType} from "./store";

export type TasksType = {
  [todoList_ID: string]: Array<TaskType>
}

export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
};

type RemoveTaskActionType = {
  type: "REMOVE-TASK"
  todoList_ID: string
  task_ID: string
};

type AddTaskActionType = {
  type: "ADD-TASK"
  task: TaskType
};

type UpdateTaskActionType = {
  type: "UPDATE-TASK"
  todoList_ID: string
  task_ID: string
  model: UpdateDomainTaskModelType
};

type SetTasksActionType = {
  type: "SET-TASKS"
  todoList_ID: string
  tasks: Array<TaskType>
};

type ActionType = RemoveTaskActionType | AddTaskActionType | UpdateTaskActionType
  | AddTodoListActionType | RemoveTodoListActionType
  | SetTodoListsActionType | SetTasksActionType;

const initState: TasksType = {};

// Action Creators
export const removeTaskAC = (todoList_ID: string, task_ID: string): RemoveTaskActionType => {
  return {type: "REMOVE-TASK", todoList_ID, task_ID};
};
export const addTaskAC = (newTask: TaskType): AddTaskActionType => {
  return {type: "ADD-TASK", task: newTask};
};
export const updateTaskAC = (todoList_ID: string, task_ID: string, model: UpdateDomainTaskModelType): UpdateTaskActionType => {
  return {type: "UPDATE-TASK", todoList_ID, task_ID, model};
};
export const setTasksAC = (todoList_ID: string, tasks: Array<TaskType>): SetTasksActionType => {
  return {type: "SET-TASKS", todoList_ID, tasks};
};

// Thunk Creators
export const fetchTasksTC = (todoList_ID: string) => {
  return (dispatch: Dispatch) => {
    todoListsAPI.getTasks(todoList_ID).then(response => {
      const tasks = response.data.items;
      dispatch(setTasksAC(todoList_ID, tasks));
    });
  };
};
export const removeTaskTC = (todoList_ID: string, task_ID: string) => (dispatch: Dispatch) => {
  todoListsAPI.deleteTask(todoList_ID, task_ID).then(response => {
    if (response.data.resultCode === 0) {
      dispatch(removeTaskAC(todoList_ID, task_ID));
    }
  });
};
export const addTaskTC = (todoList_ID: string, title: string) => (dispatch: Dispatch) => {
  todoListsAPI.createTask(todoList_ID, title).then(response => {
    if (response.data.resultCode === 0) {
      const newTask = response.data.data.item;
      dispatch(addTaskAC(newTask));
    }
  });
};
export const updateTaskTC = (todoList_ID: string, task_ID: string, domainModel: UpdateDomainTaskModelType) => {
  return (dispatch: Dispatch, getState: () => AppStateType) => {
    const task = getState().tasks[todoList_ID].find(t => t.id === task_ID);
    if (task) {
      const apiModel: UpdateTaskRequestDataType = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        ...domainModel,
      };
      todoListsAPI.updateTask(todoList_ID, task_ID, apiModel).then(response => {
        if (response.data.resultCode === 0) {
          dispatch(updateTaskAC(todoList_ID, task_ID, domainModel));
        }
      });
    }
  };
};

export const tasksReducer = (state: TasksType = initState, action: ActionType): TasksType => {
  switch (action.type) {
    case "SET-TODOLISTS": {
      const stateCopy = {...state};
      action.todoLists.forEach(tl => stateCopy[tl.id] = []);
      return {...stateCopy};
    }
    case "SET-TASKS": {
      const stateCopy = {...state};
      stateCopy[action.todoList_ID] = action.tasks;
      return stateCopy;
    }
    case "REMOVE-TASK": {
      return {
        ...state,
        [action.todoList_ID]: state[action.todoList_ID].filter(t => t.id !== action.task_ID)
      };
    }
    case "ADD-TASK": {
      return {
        ...state,
        [action.task.todoListId]: [action.task, ...state[action.task.todoListId]],
      };
    }
    case "UPDATE-TASK": {
      return {
        ...state,
        [action.todoList_ID]: state[action.todoList_ID].map(
          t => t.id === action.task_ID ? {...t, ...action.model} : t
        ),
      };
    }
    case "ADD-TODOLIST": {
      return {...state, [action.todoList.id]: []};
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