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
} from "../../api/todoListsApi";
import {Dispatch} from "redux";
import {AppStateType} from "../../app/store";

// Types
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
type ActionType =
  | ReturnType<typeof removeTaskAC>
  | ReturnType<typeof addTaskAC>
  | ReturnType<typeof updateTaskAC>
  | AddTodoListActionType
  | RemoveTodoListActionType
  | SetTodoListsActionType
  | ReturnType<typeof setTasksAC>;

// Initial state
const initState: TasksType = {};

// Action Creators
export const removeTaskAC = (todoList_ID: string, task_ID: string) =>
  ({type: "REMOVE-TASK", todoList_ID, task_ID} as const);
export const addTaskAC = (task: TaskType) =>
  ({type: "ADD-TASK", task} as const);
export const updateTaskAC = (todoList_ID: string, task_ID: string, model: UpdateDomainTaskModelType) =>
  ({type: "UPDATE-TASK", todoList_ID, task_ID, model} as const);
export const setTasksAC = (todoList_ID: string, tasks: Array<TaskType>) =>
  ({type: "SET-TASKS", todoList_ID, tasks} as const);

// Thunk Creators
export const fetchTasksTC = (todoList_ID: string) => (dispatch: Dispatch<ActionType>) => {
  todoListsAPI.getTasks(todoList_ID).then(response => {
    const tasks = response.data.items;
    dispatch(setTasksAC(todoList_ID, tasks));
  });
};
export const removeTaskTC = (todoList_ID: string, task_ID: string) => (dispatch: Dispatch<ActionType>) => {
  todoListsAPI.deleteTask(todoList_ID, task_ID).then(response => {
    if (response.data.resultCode === 0) {
      dispatch(removeTaskAC(todoList_ID, task_ID));
    }
  });
};
export const addTaskTC = (todoList_ID: string, title: string) => (dispatch: Dispatch<ActionType>) => {
  todoListsAPI.createTask(todoList_ID, title).then(response => {
    if (response.data.resultCode === 0) {
      const newTask = response.data.data.item;
      dispatch(addTaskAC(newTask));
    }
  });
};
export const updateTaskTC = (todoList_ID: string, task_ID: string, domainModel: UpdateDomainTaskModelType) =>
  (dispatch: Dispatch<ActionType>, getState: () => AppStateType) => {
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

export const tasksReducer = (state: TasksType = initState, action: ActionType): TasksType => {
  switch (action.type) {
    case "SET-TODOLISTS": {
      const stateCopy = {...state};
      action.todoLists.forEach(tl => stateCopy[tl.id] = []);
      return {...stateCopy};
    }
    case "SET-TASKS":
      return {...state, [action.todoList_ID]: action.tasks};
    case "REMOVE-TASK":
      return {
        ...state,
        [action.todoList_ID]: state[action.todoList_ID].filter(t => t.id !== action.task_ID),
      };
    case "ADD-TASK":
      return {
        ...state,
        [action.task.todoListId]: [action.task, ...state[action.task.todoListId]],
      };
    case "UPDATE-TASK":
      return {
        ...state,
        [action.todoList_ID]: state[action.todoList_ID]
          .map(t => t.id === action.task_ID ? {...t, ...action.model} : t),
      };
    case "ADD-TODOLIST":
      return {...state, [action.todoList.id]: []};
    case "REMOVE-TODOLIST": {
      const stateCopy = {...state};
      delete stateCopy[action.id];
      return stateCopy;
    }
    default:
      return state;
  }
};