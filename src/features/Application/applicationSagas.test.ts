import {initializeAppSagaWorker} from "./applicationSagas";
import {authAPI} from "../../api/todoListsApi";
import {call, put} from "redux-saga/effects";
import {MeResponseDataType} from "../../api/types";
import {commonAppActions} from "../CommonActions/app";
import {setIsLoggedIn} from "../Auth/authReducer";
import {initializeAppAC} from "./applicationReducer";

let meResponseMock: MeResponseDataType;

// Common App actions
const {setAppStatus, setAppError} = commonAppActions;

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
  expect(gen.next(meResponseMock).value).toEqual(put(setIsLoggedIn({value: true})));
  expect(gen.next().value).toEqual(put(initializeAppAC()));
});
test("initializeAppSagaWorker should work correctly when login is unsuccessful", () => {
  const gen = initializeAppSagaWorker();

  expect(gen.next().value).toEqual(call(authAPI.me));
  meResponseMock.resultCode = 1;
  meResponseMock.messages = ["Initialization error"];
  expect(gen.next(meResponseMock).value).toEqual(put(setAppError({error: meResponseMock.messages[0]})));
  expect(gen.next().value).toEqual(put(setAppStatus({status: "failed"})));
});
test("initializeAppSagaWorker should return an error", () => {
  const gen = initializeAppSagaWorker();

  expect(gen.next().value).toEqual(call(authAPI.me));
  expect(gen.throw({message: "Some error occurred"}).value).toEqual(put(setAppError({error: "Some error occurred"})));
  expect(gen.next().value).toEqual(put(setAppStatus({status: "failed"})));
});
