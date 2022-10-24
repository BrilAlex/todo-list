import {addTaskSagaWorker, fetchTasksSagaWorker, removeTaskSagaWorker} from "./tasksSagas";
import {call, put} from "redux-saga/effects";
import {setAppErrorAC, setAppStatusAC} from "../../app/appReducer";
import {
  GetTasksResponseType, ResponseType,
  TaskPriorities,
  TaskStatuses, TaskType,
  todoListsAPI
} from "../../api/todoListsApi";
import {addTaskAC, changeTaskEntityStatusAC, removeTaskAC, setTasksAC} from "./tasksReducer";

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

  expect(gen.next().value).toEqual(put(setAppStatusAC('loading')));
  expect(gen.next().value).toEqual(call(todoListsAPI.getTasks, action.todoList_ID));
  expect(gen.next(apiResponseMock).value).toEqual(put(setTasksAC(action.todoList_ID, apiResponseMock.items)));
  expect(gen.next().value).toEqual(put(setAppStatusAC('succeeded')));
  expect(gen.next().done).toBeTruthy();
});

test("fetchTasksSagaWorker should return an error", () => {
  const action = {type: "TASKS/FETCH-TASKS", todoList_ID: "todolistId1"} as const;
  const gen = fetchTasksSagaWorker(action);

  expect(gen.next().value).toEqual(put(setAppStatusAC('loading')));
  expect(gen.next().value).toEqual(call(todoListsAPI.getTasks, action.todoList_ID));
  expect(gen.throw({message: "Some error"}).value).toEqual(put(setAppErrorAC("Some error")));
  expect(gen.next().value).toEqual(put(setAppStatusAC('failed')));
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

  expect(gen.next().value).toEqual(put(setAppStatusAC('loading')));
  expect(gen.next().value).toEqual(call(todoListsAPI.createTask, action.todoList_ID, action.title));
  expect(gen.next(apiResponseMock).value).toEqual(put(addTaskAC(apiResponseMock.data.item)));
  expect(gen.next().value).toEqual(put(setAppStatusAC('succeeded')));
  expect(gen.next().done).toBeTruthy();
});

test("addTaskSagaWorker should return an error", () => {
  const action = {type: "TASKS/ADD-TASK", todoList_ID: "todolistId1", title: "New task"} as const;
  const gen = addTaskSagaWorker(action);

  expect(gen.next().value).toEqual(put(setAppStatusAC('loading')));
  expect(gen.next().value).toEqual(call(todoListsAPI.createTask, action.todoList_ID, action.title));
  expect(gen.throw({message: "Some error"}).value).toEqual(put(setAppErrorAC("Some error")));
  expect(gen.next().value).toEqual(put(setAppStatusAC('failed')));
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

  expect(gen.next().value).toEqual(put(setAppStatusAC('loading')));
  expect(gen.next().value).toEqual(put(changeTaskEntityStatusAC(action.todoList_ID, action.task_ID, "loading")));
  expect(gen.next().value).toEqual(call(todoListsAPI.deleteTask, action.todoList_ID, action.task_ID));
  expect(gen.next(apiResponseMock).value).toEqual(put(removeTaskAC(action.todoList_ID, action.task_ID)));
  expect(gen.next().value).toEqual(put(setAppStatusAC('succeeded')));
  expect(gen.next().done).toBeTruthy();
});

test("removeTaskSagaWorker should return an error", () => {
  const action = {type: "TASKS/REMOVE-TASK", todoList_ID: "todolistId1", task_ID: "1"} as const;
  const gen = removeTaskSagaWorker(action);

  expect(gen.next().value).toEqual(put(setAppStatusAC('loading')));
  expect(gen.next().value).toEqual(put(changeTaskEntityStatusAC(action.todoList_ID, action.task_ID, "loading")));
  expect(gen.next().value).toEqual(call(todoListsAPI.deleteTask, action.todoList_ID, action.task_ID));
  expect(gen.throw({message: "Some error"}).value).toEqual(put(setAppErrorAC("Some error")));
  expect(gen.next().value).toEqual(put(setAppStatusAC('failed')));
});
