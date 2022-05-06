import {Story} from "@storybook/react";
import {Provider} from "react-redux";
import {combineReducers, createStore} from "redux";
import {tasksReducer} from "../../store/tasksReducer";
import {todoListsReducer} from "../../store/todoListsReducer";
import {v1} from "uuid";
import {AppStateType} from "../../store/store";
import {TaskPriorities, TaskStatuses} from "../../api/todoListsApi";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todoLists: todoListsReducer
})

const initialGlobalState: AppStateType = {
  todoLists: [
    {id: "todolistId1", title: "What to Learn", addedDate: "", order: 0, filter: "all"},
    {id: "todolistId2", title: "What to Buy", addedDate: "", order: 1, filter: "all"},
  ],
  tasks: {
    "todolistId1": [
      {
        id: v1(), title: "HTML&CSS", todoListId: "todolistId1", description: "",
        status: TaskStatuses.Completed, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0,
      },
      {
        id: v1(), title: "JS", todoListId: "todolistId1", description: "",
        status: TaskStatuses.New, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0,
      },
    ],
    "todolistId2": [
      {
        id: v1(), title: "Bread", todoListId: "todolistId2", description: "",
        status: TaskStatuses.Completed, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0,
      },
      {
        id: v1(), title: "Milk", todoListId: "todolistId2", description: "",
        status: TaskStatuses.New, priority: TaskPriorities.Low,
        startDate: "", deadline: "", addedDate: "", order: 0,
      },
    ],
  },
};

export const storyBookStore = createStore(rootReducer, initialGlobalState);

export const ReduxStoreProviderDecorator = (StoryFn: Story) => {
  return <Provider store={storyBookStore}><StoryFn/></Provider>;
};