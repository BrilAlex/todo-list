import {initializeAppSagaWorker} from "./appSagas";
import {authAPI, MeResponseDataType} from "../api/todoListsApi";
import {call, put} from "redux-saga/effects";
import {setIsLoggedInAC} from "../features/Login/authReducer";
import {setAppErrorAC, setAppStatusAC, setIsInitializedAC} from "./appReducer";

let meResponseMock: MeResponseDataType;

beforeEach(() => {
  meResponseMock = {
    resultCode: 0,
    messages: [],
    fieldsErrors: [],
    data: {
      id: 1,
      login: "",
      email: "",
    },
  };
});

test("initializeAppSagaWorker should work correctly when login is successful", () => {
  const gen = initializeAppSagaWorker();

  expect(gen.next().value).toEqual(call(authAPI.me));
  expect(gen.next(meResponseMock).value).toEqual(put(setIsLoggedInAC(true)));
  expect(gen.next().value).toEqual(put(setIsInitializedAC(true)));
});
test("initializeAppSagaWorker should work correctly when login is unsuccessful", () => {
  const gen = initializeAppSagaWorker();

  expect(gen.next().value).toEqual(call(authAPI.me));
  meResponseMock.resultCode = 1;
  meResponseMock.messages = ["Initialization error"];
  expect(gen.next(meResponseMock).value).toEqual(put(setAppErrorAC(meResponseMock.messages[0])));
  expect(gen.next().value).toEqual(put(setAppStatusAC("failed")));
});
test("initializeAppSagaWorker should return an error", () => {
  const gen = initializeAppSagaWorker();

  expect(gen.next().value).toEqual(call(authAPI.me));
  expect(gen.throw({message: "Some error occurred"}).value).toEqual(put(setAppErrorAC("Some error occurred")));
  expect(gen.next().value).toEqual(put(setAppStatusAC("failed")));
});
