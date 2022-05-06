import {tasksReducer, TasksType} from "./tasksReducer";
import {addTodoListAC, TodoListDomainType, todoListsReducer} from "./todoListsReducer";

test("Id should be equal", () => {
  const startTasksState: TasksType = {};
  const startTodoListsState: Array<TodoListDomainType> = [];

  const action = addTodoListAC("New TodoList");

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodoListsState = todoListsReducer(startTodoListsState, action)

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodoLists = endTodoListsState[0].id;

  expect(idFromTasks).toBe(action.id);
  expect(idFromTodoLists).toBe(action.id);
});
