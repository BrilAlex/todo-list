import * as todoListsSelectors from "./selectors";
import {asyncActions as asyncTodoListsActions, todoListsSlice} from "./todoListsReducer";

const todoListsReducer = todoListsSlice.reducer;

const todoListsActions = {
  ...todoListsSlice.actions,
  ...asyncTodoListsActions,
}

export {
  todoListsSelectors,
  todoListsReducer,
  todoListsActions,
};
