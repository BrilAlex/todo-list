import {Story} from "@storybook/react";
import {Provider} from "react-redux";
import {combineReducers} from "redux";
import {v1} from "uuid";
import {TaskPriorities, TaskStatuses} from "../../api/types";
import thunk from "redux-thunk";
import {appReducer} from "../../features/Application";
import {authReducer} from "../../features/Auth";
import {tasksReducer} from "../../features/TodoListsList/tasksReducer";
import {todoListsReducer} from "../../features/TodoListsList/todoListsReducer";
import {configureStore} from "@reduxjs/toolkit";
import {HashRouter} from "react-router-dom";
import {AppStateType, RootReducerType} from "../../utils/types";

const rootReducer: RootReducerType = combineReducers({
  app: appReducer,
  auth: authReducer,
  tasks: tasksReducer,
  todoLists: todoListsReducer,
})

const initialGlobalState: AppStateType = {
  todoLists: [
    {
      id: "todolistId1",
      title: "What to Learn",
      addedDate: "",
      order: 0,
      filter: "all",
      entityStatus: "idle",
    },
    {
      id: "todolistId2",
      title: "What to Buy",
      addedDate: "",
      order: 1,
      filter: "all",
      entityStatus: "loading",
    },
  ],
  tasks: {
    "todolistId1": [
      {
        id: v1(), title: "HTML&CSS", todoListId: "todolistId1", description: "",
        status: TaskStatuses.Completed, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0, entityStatus: "idle",
      },
      {
        id: v1(), title: "JS", todoListId: "todolistId1", description: "",
        status: TaskStatuses.New, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0, entityStatus: "loading",
      },
    ],
    "todolistId2": [
      {
        id: v1(), title: "Bread", todoListId: "todolistId2", description: "",
        status: TaskStatuses.Completed, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0, entityStatus: "idle",
      },
      {
        id: v1(), title: "Milk", todoListId: "todolistId2", description: "",
        status: TaskStatuses.New, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0, entityStatus: "idle",
      },
    ],
  },
  app: {
    isInitialized: true,
    status: "idle",
    error: null,
  },
  auth: {
    isLoggedIn: true,
  },
};

export const storyBookStore = configureStore({
  reducer: rootReducer,
  preloadedState: initialGlobalState,
  middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk),
});

export const ReduxStoreProviderDecorator = (StoryFn: Story) => {
  return (
    <Provider store={storyBookStore}>
      <StoryFn/>
    </Provider>
  );
};

export const BrowserRouterDecorator = (StoryFn: Story) => {
  return (
    <HashRouter>
      <StoryFn/>
    </HashRouter>
  );
};
