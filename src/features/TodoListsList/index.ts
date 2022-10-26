import * as todoListsSelectors from "./selectors";
import {
  asyncActions as asyncTodoListsActions,
  changeTodoListFilter,
  todoListsSlice
} from "./todoListsReducer";
import {tasksSlice} from "./tasksReducer";
import {addTask, removeTask, updateTask} from "./tasksSagas";
import {addTodoList, changeTodoListTitle, removeTodoList} from "./todoListsSagas";

const todoListsReducer = todoListsSlice.reducer;
const tasksReducer = tasksSlice.reducer;

const todoListsActions = {
  removeTodoList,
  addTodoList,
  changeTodoListTitle,
  changeTodoListFilter,
  ...asyncTodoListsActions,
}

const tasksActions = {
  removeTask,
  addTask,
  updateTask,
};

export {
  todoListsSelectors,
  todoListsReducer,
  todoListsActions,
  tasksReducer,
  tasksActions,
};
