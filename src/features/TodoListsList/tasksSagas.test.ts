import {addTaskSagaWorker, fetchTasksSagaWorker, removeTaskSagaWorker} from "./tasksSagas";
import {call, put} from "redux-saga/effects";
import {todoListsAPI} from "../../api/todoListsApi";
import {
  GetTasksResponseType,
  ResponseType,
  TaskPriorities,
  TaskStatuses,
  TaskType
} from "../../api/types";
import {commonAppActions} from "../CommonActions/app";
import {addTaskAC, changeTaskEntityStatus, removeTaskAC, setTasksAC} from "./tasksReducer";

// Common App actions
const {setAppStatus, setAppError} = commonAppActions;

test("fetchTasksSagaWorker should work correctly", () => {
  const action = {type: "TASKS/FETCH-TASKS", todoList_ID: "todolistId1"} as const;
  const apiResponseMock: GetTasksResponseType = {
    items: [
      {
        id: "1", title: "CSS", status: TaskStatuses.New, todoListId: action.todoList_ID,
        description: '', startDate: '', deadline: '', addedDate: '',
        order: 0, priority: TaskPriorities.Low,
      },
    ],
    error: "",
    totalCount: 1
  };
  const gen = fetchTasksSagaWorker(action);

  expect(gen.next().value).toEqual(put(setAppStatus({status: 'loading'})));
  expect(gen.next().value).toEqual(call(todoListsAPI.getTasks, action.todoList_ID));
  expect(gen.next(apiResponseMock).value).toEqual(put(setTasksAC({
    todoList_ID: action.todoList_ID,
    tasks: apiResponseMock.items,
  })));
  expect(gen.next().value).toEqual(put(setAppStatus({status: 'succeeded'})));
  expect(gen.next().done).toBeTruthy();
});

test("fetchTasksSagaWorker should return an error", () => {
  const action = {type: "TASKS/FETCH-TASKS", todoList_ID: "todolistId1"} as const;
  const gen = fetchTasksSagaWorker(action);

  expect(gen.next().value).toEqual(put(setAppStatus({status: 'loading'})));
  expect(gen.next().value).toEqual(call(todoListsAPI.getTasks, action.todoList_ID));
  expect(gen.throw({message: "Some error"}).value).toEqual(put(setAppError({error: "Some error"})));
  expect(gen.next().value).toEqual(put(setAppStatus({status: 'failed'})));
});

test("addTaskSagaWorker should work correctly when request is successful", () => {
  const action = {type: "TASKS/ADD-TASK", todoList_ID: "todolistId1", title: "New task"} as const;
  const apiResponseMock: ResponseType<{ item: TaskType }> = {
    resultCode: 0,
    messages: [],
    fieldsErrors: [],
    data: {
      item: {
        id: "1", title: action.title, status: TaskStatuses.New, todoListId: action.todoList_ID,
        description: '', startDate: '', deadline: '', addedDate: '',
        order: 0, priority: TaskPriorities.Low,
      }
    },
  };
  const gen = addTaskSagaWorker(action);

  expect(gen.next().value).toEqual(put(setAppStatus({status: 'loading'})));
  expect(gen.next().value).toEqual(call(todoListsAPI.createTask, action.todoList_ID, action.title));
  expect(gen.next(apiResponseMock).value).toEqual(put(addTaskAC(apiResponseMock.data.item)));
  expect(gen.next().value).toEqual(put(setAppStatus({status: 'succeeded'})));
  expect(gen.next().done).toBeTruthy();
});

test("addTaskSagaWorker should return an error", () => {
  const action = {type: "TASKS/ADD-TASK", todoList_ID: "todolistId1", title: "New task"} as const;
  const gen = addTaskSagaWorker(action);

  expect(gen.next().value).toEqual(put(setAppStatus({status: 'loading'})));
  expect(gen.next().value).toEqual(call(todoListsAPI.createTask, action.todoList_ID, action.title));
  expect(gen.throw({message: "Some error"}).value).toEqual(put(setAppError({error: "Some error"})));
  expect(gen.next().value).toEqual(put(setAppStatus({status: 'failed'})));
});

test("removeTaskSagaWorker should work correctly when request is successful", () => {
  const action = {type: "TASKS/REMOVE-TASK", todoList_ID: "todolistId1", task_ID: "1"} as const;
  const apiResponseMock: ResponseType = {
    resultCode: 0,
    messages: [],
    fieldsErrors: [],
    data: {},
  };
  const gen = removeTaskSagaWorker(action);

  expect(gen.next().value).toEqual(put(setAppStatus({status: 'loading'})));
  expect(gen.next().value).toEqual(put(changeTaskEntityStatus({
    todoList_ID: action.todoList_ID,
    task_ID: action.task_ID,
    status: "loading",
  })));
  expect(gen.next().value).toEqual(call(todoListsAPI.deleteTask, action.todoList_ID, action.task_ID));
  expect(gen.next(apiResponseMock).value).toEqual(put(removeTaskAC({
    todoList_ID: action.todoList_ID,
    task_ID: action.task_ID,
  })));
  expect(gen.next().value).toEqual(put(setAppStatus({status: 'succeeded'})));
  expect(gen.next().done).toBeTruthy();
});

test("removeTaskSagaWorker should return an error", () => {
  const action = {type: "TASKS/REMOVE-TASK", todoList_ID: "todolistId1", task_ID: "1"} as const;
  const gen = removeTaskSagaWorker(action);

  expect(gen.next().value).toEqual(put(setAppStatus({status: 'loading'})));
  expect(gen.next().value).toEqual(put(changeTaskEntityStatus({
    todoList_ID: action.todoList_ID,
    task_ID: action.task_ID,
    status: "loading",
  })));
  expect(gen.next().value).toEqual(call(todoListsAPI.deleteTask, action.todoList_ID, action.task_ID));
  expect(gen.throw({message: "Some error"}).value).toEqual(put(setAppError({error: "Some error"})));
  expect(gen.next().value).toEqual(put(setAppStatus({status: 'failed'})));
});
