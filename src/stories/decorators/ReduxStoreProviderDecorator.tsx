import {Story} from "@storybook/react";
import {Provider} from "react-redux";
import {combineReducers, createStore} from "redux";
import {tasksReducer} from "../../store/tasksReducer";
import {todoListsReducer} from "../../store/todoListsReducer";
import {v1} from "uuid";
import {AppStateType} from "../../store/store";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todoLists: todoListsReducer
})

const initialGlobalState = {
  todoLists: [
    {id: "todolistId1", title: "What to learn", filter: "all"},
    {id: "todolistId2", title: "What to buy", filter: "all"},
  ],
  tasks: {
    "todolistId1": [
      {id: v1(), title: "HTML&CSS", isDone: true},
      {id: v1(), title: "JS", isDone: true},
    ],
    "todolistId2": [
      {id: v1(), title: "Milk", isDone: true},
      {id: v1(), title: "React Book", isDone: true},
    ],
  }
};

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppStateType);

export const ReduxStoreProviderDecorator = (StoryFn: Story) => {
  return <Provider store={storyBookStore}><StoryFn/></Provider>;
};