import {todoListsAPI} from "../../api/todoListsApi";
import {handleServerAppErrorSaga, handleServerNetworkErrorSaga} from "../../utils/errorUtils";
import {
  addTaskAC,
  changeTaskEntityStatus, removeTaskAC,
  setTasksAC,
  TasksType,
  UpdateDomainTaskModelType, updateTaskAC
} from "./tasksReducer";
import {call, put, select, takeEvery} from "redux-saga/effects";
import {commonAppActions} from "../CommonActions/app";
import {
  GetTasksResponseType,
  ResponseType,
  TaskType,
  UpdateTaskRequestDataType
} from "../../api/types";

// Common App actions
const {setAppStatus} = commonAppActions;

export function* fetchTasksSagaWorker(action: FetchTasksActionType) {
  yield put(setAppStatus({status: "loading"}));
  try {
    const data: GetTasksResponseType = yield call(todoListsAPI.getTasks, action.todoList_ID);
    const tasks = data.items;
    yield put(setTasksAC({todoList_ID: action.todoList_ID, tasks}));
    yield put(setAppStatus({status: "succeeded"}));
  } catch (error) {
    yield* handleServerNetworkErrorSaga(error as { message: string });
  }
}

export type FetchTasksActionType = ReturnType<typeof fetchTasks>;

export const fetchTasks = (todoList_ID: string) =>
  ({type: "TASKS/FETCH-TASKS", todoList_ID} as const);

export function* removeTaskSagaWorker(action: ReturnType<typeof removeTask>) {
  yield put(setAppStatus({status: "loading"}));
  yield put(changeTaskEntityStatus({
    todoList_ID: action.todoList_ID,
    task_ID: action.task_ID,
    status: "loading"
  }));
  try {
    const data: ResponseType = yield call(todoListsAPI.deleteTask, action.todoList_ID, action.task_ID);

    if (data.resultCode === 0) {
      yield put(removeTaskAC({todoList_ID: action.todoList_ID, task_ID: action.task_ID}));
      yield put(setAppStatus({status: "succeeded"}));
    } else {
      yield* handleServerAppErrorSaga(data);
    }
  } catch (error) {
    yield* handleServerNetworkErrorSaga(error as { message: string });
  }
}

export const removeTask = (todoList_ID: string, task_ID: string) =>
  ({type: "TASKS/REMOVE-TASK", todoList_ID, task_ID} as const);

export function* addTaskSagaWorker(action: ReturnType<typeof addTask>) {
  yield put(setAppStatus({status: "loading"}));
  try {
    const data: ResponseType<{ item: TaskType }> = yield call(todoListsAPI.createTask, action.todoList_ID, action.title);
    if (data.resultCode === 0) {
      const newTask = data.data.item;
      yield put(addTaskAC(newTask));
      yield put(setAppStatus({status: "succeeded"}));
    } else {
      yield* handleServerAppErrorSaga(data);
    }
  } catch (error) {
    yield* handleServerNetworkErrorSaga(error as { message: string });
  }
}

export const addTask = (todoList_ID: string, title: string) =>
  ({type: "TASKS/ADD-TASK", todoList_ID, title} as const);

export function* updateTaskSagaWorker(action: ReturnType<typeof updateTask>) {
  yield put(setAppStatus({status: "loading"}));
  try {
    const tasks: TasksType = yield select(state => state.tasks);
    const task = tasks[action.todoList_ID].find(t => t.id === action.task_ID);

    if (task) {
      const apiModel: UpdateTaskRequestDataType = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        ...action.domainModel,
      };

      const data: ResponseType<{ item: TaskType }> = yield call(todoListsAPI.updateTask, action.todoList_ID, action.task_ID, apiModel);

      if (data.resultCode === 0) {
        yield put(updateTaskAC({
          todoList_ID: action.todoList_ID,
          task_ID: action.task_ID,
          model: action.domainModel,
        }));
        yield put(setAppStatus({status: "succeeded"}));
      } else {
        yield* handleServerAppErrorSaga(data);
      }
    }
  } catch (error) {
    yield* handleServerNetworkErrorSaga(error as { message: string });
  }
}

export const updateTask = (todoList_ID: string, task_ID: string, domainModel: UpdateDomainTaskModelType) =>
  ({type: "TASKS/UPDATE-TASK", todoList_ID, task_ID, domainModel} as const);

export function* tasksSagaWatcher() {
  yield takeEvery("TASKS/FETCH-TASKS", fetchTasksSagaWorker);
  yield takeEvery("TASKS/REMOVE-TASK", removeTaskSagaWorker);
  yield takeEvery("TASKS/ADD-TASK", addTaskSagaWorker);
  yield takeEvery("TASKS/UPDATE-TASK", updateTaskSagaWorker);
}
