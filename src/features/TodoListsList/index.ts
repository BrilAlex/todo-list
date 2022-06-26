import * as todoListsSelectors from "./selectors";
import {asyncActions as asyncTodoListsActions, todoListsSlice} from "./todoListsReducer";
import {asyncActions as asyncTasksActions, tasksSlice} from "./tasksReducer";

const todoListsReducer = todoListsSlice.reducer;
const tasksReducer = tasksSlice.reducer;

const todoListsActions = {
  ...todoListsSlice.actions,
  ...asyncTodoListsActions,
}

const tasksActions = {
  ...tasksSlice.actions,
  ...asyncTasksActions,
};

export {
  todoListsSelectors,
  todoListsReducer,
  todoListsActions,
  tasksReducer,
  tasksActions,
};
