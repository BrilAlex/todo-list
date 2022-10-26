import {loginSagaWorker, logoutSagaWorker} from "./authSagas";
import {authAPI} from "../../api/todoListsApi";
import {call, put} from "redux-saga/effects";
import {LoginParamsType, ResponseType} from "../../api/types";
import {commonAppActions} from "../CommonActions/app";
import {commonTodoListsActions} from "../CommonActions/todoLists";
import {setIsLoggedIn} from "./authReducer";

let apiResponseMock: ResponseType;
let loginFormData: LoginParamsType;

// Common App actions
const {setAppStatus, setAppError} = commonAppActions;

// Common TodoLists actions
const {clearTodoListsData} = commonTodoListsActions;

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

  expect(gen.next().value).toEqual(put(setAppStatus({status: "loading"})));
  expect(gen.next().value).toEqual(call(authAPI.login, action.data));
  expect(gen.next(apiResponseMock).value).toEqual(put(setIsLoggedIn({value: true})));
  expect(gen.next().value).toEqual(put(setAppStatus({status: "succeeded"})));
});
test("loginSagaWorker should work correctly when login is unsuccessful", () => {
  const action = {type: "AUTH/LOGIN", data: loginFormData} as const;

  const gen = loginSagaWorker(action);

  expect(gen.next().value).toEqual(put(setAppStatus({status: "loading"})));
  expect(gen.next().value).toEqual(call(authAPI.login, action.data));
  apiResponseMock.resultCode = 1;
  apiResponseMock.messages = ["Login error"];
  expect(gen.next(apiResponseMock).value).toEqual(put(setAppError({error: apiResponseMock.messages[0]})));
  expect(gen.next().value).toEqual(put(setAppStatus({status: "failed"})));
});
test("loginSagaWorker should return an error", () => {
  const action = {type: "AUTH/LOGIN", data: loginFormData} as const;
  const gen = loginSagaWorker(action);

  expect(gen.next().value).toEqual(put(setAppStatus({status: "loading"})));
  expect(gen.next().value).toEqual(call(authAPI.login, action.data));
  expect(gen.throw({message: "Some error occurred"}).value).toEqual(put(setAppError({error: "Some error occurred"})));
  expect(gen.next().value).toEqual(put(setAppStatus({status: "failed"})));
});

test("logoutSagaWorker should work correctly when logout is successful", () => {
  const gen = logoutSagaWorker();

  expect(gen.next().value).toEqual(put(setAppStatus({status: "loading"})));
  expect(gen.next().value).toEqual(call(authAPI.logout));
  expect(gen.next(apiResponseMock).value).toEqual(put(clearTodoListsData()));
  expect(gen.next().value).toEqual(put(setIsLoggedIn({value: false})));
  expect(gen.next().value).toEqual(put(setAppStatus({status: "succeeded"})));
});
test("logoutSagaWorker should work correctly when logout is unsuccessful", () => {
  const gen = logoutSagaWorker();

  expect(gen.next().value).toEqual(put(setAppStatus({status: "loading"})));
  expect(gen.next().value).toEqual(call(authAPI.logout));
  apiResponseMock.resultCode = 1;
  apiResponseMock.messages = ["Logout error"];
  expect(gen.next(apiResponseMock).value).toEqual(put(setAppError({error: apiResponseMock.messages[0]})));
  expect(gen.next().value).toEqual(put(setAppStatus({status: "failed"})));
});
test("logoutSagaWorker should return an error", () => {
  const gen = logoutSagaWorker();

  expect(gen.next().value).toEqual(put(setAppStatus({status: "loading"})));
  expect(gen.next().value).toEqual(call(authAPI.logout));
  expect(gen.throw({message: "Some error occurred"}).value).toEqual(put(setAppError({error: "Some error occurred"})));
  expect(gen.next().value).toEqual(put(setAppStatus({status: "failed"})));
});
