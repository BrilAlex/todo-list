import {
  AddTodoListActionType, ClearTodoListsDataActionType,
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
import {
  RequestStatusType,
  SetAppErrorActionType,
  setAppStatusAC,
  SetAppStatusActionType
} from "../../app/appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/errorUtils";

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

// Action Creators
export const removeTaskAC = (todoList_ID: string, task_ID: string) =>
  ({type: "REMOVE-TASK", todoList_ID, task_ID} as const);
export const addTaskAC = (task: TaskType) =>
  ({type: "ADD-TASK", task} as const);
export const updateTaskAC = (todoList_ID: string, task_ID: string, model: UpdateDomainTaskModelType) =>
  ({type: "UPDATE-TASK", todoList_ID, task_ID, model} as const);
export const setTasksAC = (todoList_ID: string, tasks: Array<TaskType>) =>
  ({type: "SET-TASKS", todoList_ID, tasks} as const);
export const changeTaskEntityStatusAC = (todoList_ID: string, task_ID: string, status: RequestStatusType) =>
  ({type: "CHANGE-TASK-ENTITY-STATUS", todoList_ID, task_ID, status} as const);

// Thunk Creators
export const fetchTasksTC = (todoList_ID: string) => (dispatch: ThunkDispatchType) => {
  dispatch(setAppStatusAC("loading"));
  todoListsAPI.getTasks(todoList_ID)
    .then(response => {
      const tasks = response.data.items;
      dispatch(setTasksAC(todoList_ID, tasks));
      dispatch(setAppStatusAC("succeeded"));
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch);
    });
};
export const removeTaskTC = (todoList_ID: string, task_ID: string) => (dispatch: ThunkDispatchType) => {
  dispatch(setAppStatusAC("loading"));
  dispatch(changeTaskEntityStatusAC(todoList_ID, task_ID, "loading"));
  todoListsAPI.deleteTask(todoList_ID, task_ID)
    .then(response => {
      if (response.data.resultCode === 0) {
        dispatch(removeTaskAC(todoList_ID, task_ID));
        dispatch(setAppStatusAC("succeeded"));
      } else {
        handleServerAppError(response.data, dispatch);
      }
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch);
    });
};
export const addTaskTC = (todoList_ID: string, title: string) => (dispatch: ThunkDispatchType) => {
  dispatch(setAppStatusAC("loading"));
  todoListsAPI.createTask(todoList_ID, title)
    .then(response => {
      if (response.data.resultCode === 0) {
        const newTask = response.data.data.item;
        dispatch(addTaskAC(newTask));
        dispatch(setAppStatusAC("succeeded"));
      } else {
        handleServerAppError(response.data, dispatch);
      }
    })
    .catch(error => {
      handleServerNetworkError(error, dispatch);
    });
};
export const updateTaskTC = (todoList_ID: string, task_ID: string, domainModel: UpdateDomainTaskModelType) =>
  (dispatch: ThunkDispatchType, getState: () => AppStateType) => {
    dispatch(setAppStatusAC("loading"));
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
      todoListsAPI.updateTask(todoList_ID, task_ID, apiModel)
        .then(response => {
          if (response.data.resultCode === 0) {
            dispatch(updateTaskAC(todoList_ID, task_ID, domainModel));
            dispatch(setAppStatusAC("succeeded"));
          } else {
            handleServerAppError(response.data, dispatch);
          }
        })
        .catch(error => {
          handleServerNetworkError(error, dispatch);
        });
    }
  };

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
        [action.todoList_ID]: state[action.todoList_ID]
          .map(t => t.id === action.task_ID ? {...t, ...action.model} : t),
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
