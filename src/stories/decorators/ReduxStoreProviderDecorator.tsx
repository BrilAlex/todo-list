import {Story} from "@storybook/react";
import {Provider} from "react-redux";
import {applyMiddleware, combineReducers, createStore} from "redux";
import {tasksReducer} from "../../features/TodoListsList/tasksReducer";
import {todoListsReducer} from "../../features/TodoListsList/todoListsReducer";
import {v1} from "uuid";
import {AppStateType} from "../../app/store";
import {TaskPriorities, TaskStatuses} from "../../api/todoListsApi";
import thunk from "redux-thunk";
import {appReducer} from "../../app/appReducer";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todoLists: todoListsReducer,
  app: appReducer,
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
    isInitialized: false,
    status: "idle",
    error: null,
  },
  auth: {
    isLoggedIn: false,
  },
};

export const storyBookStore = createStore(rootReducer, initialGlobalState, applyMiddleware(thunk));

export const ReduxStoreProviderDecorator = (StoryFn: Story) => {
  return <Provider store={storyBookStore}><StoryFn/></Provider>;
};