import {tasksSlice, TasksType} from "./tasksReducer";
import {
  asyncActions as asyncTodoListsActions,
  TodoListDomainType,
  todoListsSlice
} from "./todoListsReducer";
import {TodoListType} from "../../api/types";
import {v1} from "uuid";

const todoListsReducer = todoListsSlice.reducer;
const tasksReducer = tasksSlice.reducer;
const {addTodoList} = asyncTodoListsActions;

test("Id should be equal", () => {
  const startTasksState: TasksType = {};
  const startTodoListsState: Array<TodoListDomainType> = [];

  const newTodoList: TodoListType = {id: v1(), title: "New TodoList", addedDate: "", order: 0};
  const action = addTodoList.fulfilled(
    {todoList: newTodoList},
    "request_ID",
    newTodoList.title,
  );

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodoListsState = todoListsReducer(startTodoListsState, action)

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodoLists = endTodoListsState[0].id;

  expect(idFromTasks).toBe(action.payload.todoList.id);
  expect(idFromTodoLists).toBe(action.payload.todoList.id);
});
