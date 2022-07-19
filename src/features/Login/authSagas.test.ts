import {loginSagaWorker, logoutSagaWorker} from "./authSagas";
import {authAPI, LoginParamsType, ResponseType} from "../../api/todoListsApi";
import {call, put} from "redux-saga/effects";
import {setAppErrorAC, setAppStatusAC} from "../../app/appReducer";
import {setIsLoggedInAC} from "./authReducer";
import {clearTodoListsDataAC} from "../TodoListsList/todoListsReducer";

let apiResponseMock: ResponseType;
let loginFormData: LoginParamsType;

beforeEach(() => {
  apiResponseMock = {
    resultCode: 0,
    messages: [],
    fieldsErrors: [],
    data: {},
  };
  loginFormData = {
    email: "test@test.com",
    password: "testPassword",
    rememberMe: false,
  };
});


test("loginSagaWorker should work correctly when login is successful", () => {
  const action = {type: "AUTH/LOGIN", data: loginFormData} as const;

  const gen = loginSagaWorker(action);

  expect(gen.next().value).toEqual(put(setAppStatusAC("loading")));
  expect(gen.next().value).toEqual(call(authAPI.login, action.data));
  expect(gen.next(apiResponseMock).value).toEqual(put(setIsLoggedInAC(true)));
  expect(gen.next().value).toEqual(put(setAppStatusAC("succeeded")));
});
test("loginSagaWorker should work correctly when login is unsuccessful", () => {
  const action = {type: "AUTH/LOGIN", data: loginFormData} as const;

  const gen = loginSagaWorker(action);

  expect(gen.next().value).toEqual(put(setAppStatusAC("loading")));
  expect(gen.next().value).toEqual(call(authAPI.login, action.data));
  apiResponseMock.resultCode = 1;
  apiResponseMock.messages = ["Login error"];
  expect(gen.next(apiResponseMock).value).toEqual(put(setAppErrorAC(apiResponseMock.messages[0])));
  expect(gen.next().value).toEqual(put(setAppStatusAC("failed")));
});
test("loginSagaWorker should return an error", () => {
  const action = {type: "AUTH/LOGIN", data: loginFormData} as const;
  const gen = loginSagaWorker(action);

  expect(gen.next().value).toEqual(put(setAppStatusAC("loading")));
  expect(gen.next().value).toEqual(call(authAPI.login, action.data));
  expect(gen.throw({message: "Some error occurred"}).value).toEqual(put(setAppErrorAC("Some error occurred")));
  expect(gen.next().value).toEqual(put(setAppStatusAC("failed")));
});

test("logoutSagaWorker should work correctly when logout is successful", () => {
  const gen = logoutSagaWorker();

  expect(gen.next().value).toEqual(put(setAppStatusAC("loading")));
  expect(gen.next().value).toEqual(call(authAPI.logout));
  expect(gen.next(apiResponseMock).value).toEqual(put(clearTodoListsDataAC()));
  expect(gen.next().value).toEqual(put(setIsLoggedInAC(false)));
  expect(gen.next().value).toEqual(put(setAppStatusAC("succeeded")));
});
test("logoutSagaWorker should work correctly when logout is unsuccessful", () => {
  const gen = logoutSagaWorker();

  expect(gen.next().value).toEqual(put(setAppStatusAC("loading")));
  expect(gen.next().value).toEqual(call(authAPI.logout));
  apiResponseMock.resultCode = 1;
  apiResponseMock.messages = ["Logout error"];
  expect(gen.next(apiResponseMock).value).toEqual(put(setAppErrorAC(apiResponseMock.messages[0])));
  expect(gen.next().value).toEqual(put(setAppStatusAC("failed")));
});
test("logoutSagaWorker should return an error", () => {
  const gen = logoutSagaWorker();

  expect(gen.next().value).toEqual(put(setAppStatusAC("loading")));
  expect(gen.next().value).toEqual(call(authAPI.logout));
  expect(gen.throw({message: "Some error occurred"}).value).toEqual(put(setAppErrorAC("Some error occurred")));
  expect(gen.next().value).toEqual(put(setAppStatusAC("failed")));
});
