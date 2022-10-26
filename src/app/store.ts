import thunkMiddleware from "redux-thunk";
import {configureStore} from "@reduxjs/toolkit";
import {rootReducer} from "./reducers";
import createSagaMiddleware from "redux-saga";
import {all} from "redux-saga/effects";
import {appSagaWatcher} from "../features/Application/applicationSagas";
import {authSagaWatcher} from "../features/Auth/authSagas";
import {todoListsSagaWatcher} from "../features/TodoListsList/todoListsSagas";
import {tasksSagaWatcher} from "../features/TodoListsList/tasksSagas";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware, sagaMiddleware),
});

function* rootSagaWatcher() {
  yield all([
    appSagaWatcher(),
    authSagaWatcher(),
    todoListsSagaWatcher(),
    tasksSagaWatcher(),
  ]);
}

sagaMiddleware.run(rootSagaWatcher);

// @ts-ignore
window.store = store;

if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept("./reducers", () => {
    store.replaceReducer(rootReducer);
  });
}
