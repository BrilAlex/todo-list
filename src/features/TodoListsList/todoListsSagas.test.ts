import {ResponseType, todoListsAPI, TodoListType} from "../../api/todoListsApi";
import {call, put} from "redux-saga/effects";
import {setAppErrorAC, setAppStatusAC} from "../../app/appReducer";
import {
  addTodoList,
  addTodoListSagaWorker, changeTodoListTitle, changeTodoListTitleSagaWorker,
  removeTodoList,
  removeTodoListSagaWorker
} from "./todoListsSagas";
import {
  addTodoListAC,
  changeTodolistEntityStatusAC,
  changeTodoListTitleAC,
  removeTodoListAC
} from "./todoListsReducer";
import {v1} from "uuid";

let apiResponseMock: ResponseType

beforeEach(() => {
  apiResponseMock = {
    resultCode: 0,
    messages: [],
    fieldsErrors: [],
    data: {},
  };
});

test("removeTodoListSagaWorker should work correctly when request is successful", () => {
  const action = removeTodoList("todolistId1");
  const gen = removeTodoListSagaWorker(action);

  expect(gen.next().value).toEqual(put(setAppStatusAC('loading')));
  expect(gen.next().value).toEqual(put(changeTodolistEntityStatusAC(action.todoList_ID, "loading")));
  expect(gen.next().value).toEqual(call(todoListsAPI.deleteTodoList, action.todoList_ID));
  expect(gen.next(apiResponseMock).value).toEqual(put(removeTodoListAC(action.todoList_ID)));
  expect(gen.next().value).toEqual(put(setAppStatusAC('succeeded')));
  expect(gen.next().done).toBeTruthy();
});

test("removeTodoListSagaWorker should return an error", () => {
  const action = removeTodoList("todolistId1");
  const gen = removeTodoListSagaWorker(action);

  expect(gen.next().value).toEqual(put(setAppStatusAC('loading')));
  expect(gen.next().value).toEqual(put(changeTodolistEntityStatusAC(action.todoList_ID, "loading")));
  expect(gen.next().value).toEqual(call(todoListsAPI.deleteTodoList, action.todoList_ID));
  expect(gen.throw({message: "Some error"}).value).toEqual(put(setAppErrorAC("Some error")));
  expect(gen.next().value).toEqual(put(setAppStatusAC('failed')));
});

test("addTodoListSagaWorker should work correctly when request is successful", () => {
  const action = addTodoList("New TodoList");
  const apiResponseMock: ResponseType<{ item: TodoListType }> = {
    resultCode: 0,
    messages: [],
    fieldsErrors: [],
    data: {
      item: {id: v1(), title: action.title, addedDate: "", order: 0}
    },
  };
  const gen = addTodoListSagaWorker(action);

  expect(gen.next().value).toEqual(put(setAppStatusAC('loading')));
  expect(gen.next().value).toEqual(call(todoListsAPI.createTodoList, action.title));
  expect(gen.next(apiResponseMock).value).toEqual(put(addTodoListAC(apiResponseMock.data.item)));
  expect(gen.next().value).toEqual(put(setAppStatusAC('succeeded')));
  expect(gen.next().done).toBeTruthy();
});

test("addTodoListSagaWorker should return an error", () => {
  const action = addTodoList("New TodoList");
  const gen = addTodoListSagaWorker(action);

  expect(gen.next().value).toEqual(put(setAppStatusAC('loading')));
  expect(gen.next().value).toEqual(call(todoListsAPI.createTodoList, action.title));
  expect(gen.throw({message: "Some error"}).value).toEqual(put(setAppErrorAC("Some error")));
  expect(gen.next().value).toEqual(put(setAppStatusAC('failed')));
});

test("changeTodoListTitleSagaWorker should work correctly when request is successful", () => {
  const action = changeTodoListTitle("todolistId1", "New Title");
  const gen = changeTodoListTitleSagaWorker(action);

  expect(gen.next().value).toEqual(put(setAppStatusAC('loading')));
  expect(gen.next().value).toEqual(call(todoListsAPI.updateTodoList, action.todoList_ID, action.newTitle));
  expect(gen.next(apiResponseMock).value).toEqual(put(changeTodoListTitleAC(action.todoList_ID, action.newTitle)));
  expect(gen.next().value).toEqual(put(setAppStatusAC('succeeded')));
  expect(gen.next().done).toBeTruthy();
});

test("changeTodoListTitleSagaWorker should return an error", () => {
  const action = changeTodoListTitle("todolistId1", "New Title");
  const gen = changeTodoListTitleSagaWorker(action);

  expect(gen.next().value).toEqual(put(setAppStatusAC('loading')));
  expect(gen.next().value).toEqual(call(todoListsAPI.updateTodoList, action.todoList_ID, action.newTitle));
  expect(gen.throw({message: "Some error"}).value).toEqual(put(setAppErrorAC("Some error")));
  expect(gen.next().value).toEqual(put(setAppStatusAC('failed')));
});
