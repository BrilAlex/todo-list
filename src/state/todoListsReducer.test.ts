import {v1} from "uuid";
import {
  addTodoListAC, changeTodoListFilterAC,
  changeTodoListTitleAC,
  removeTodoListAC,
  todoListsReducer
} from "./todoListsReducer";
import {FilterValueType, TodoListType} from "../App";

test("Correct TodoList should be removed", () => {
  const todoList_ID1 = v1();
  const todoList_ID2 = v1();

  const startState: Array<TodoListType> = [
    {id: todoList_ID1, title: "What to learn", filter: "all"},
    {id: todoList_ID2, title: "What to buy", filter: "all"},
  ];

  const endState = todoListsReducer(startState, removeTodoListAC(todoList_ID1));

  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todoList_ID2);
});

test("Correct TodoList should be added", () => {
  const todoList_ID1 = v1();
  const todoList_ID2 = v1();

  const newTodoListTitle = "New TodoList";

  const startState: Array<TodoListType> = [
    {id: todoList_ID1, title: "What to learn", filter: "all"},
    {id: todoList_ID2, title: "What to buy", filter: "all"},
  ];

  const endState = todoListsReducer(startState, addTodoListAC(newTodoListTitle));

  expect(endState.length).toBe(3);
  expect(endState[2].title).toBe(newTodoListTitle);
  expect(endState[2].filter).toBe("all");
});

test("Correct TodoList should change it's name", () => {
  const todoList_ID1 = v1();
  const todoList_ID2 = v1();

  const newTodoListTitle = "New Title";

  const startState: Array<TodoListType> = [
    {id: todoList_ID1, title: "What to learn", filter: "all"},
    {id: todoList_ID2, title: "What to buy", filter: "all"},
  ];

  const action = changeTodoListTitleAC(todoList_ID2, newTodoListTitle);
  const endState = todoListsReducer(startState, action);

  expect(endState[0].title).toBe("What to learn");
  expect(endState[1].title).toBe(newTodoListTitle);
});

test("Correct TodoList filter should be changed", () => {
  const todoList_ID1 = v1();
  const todoList_ID2 = v1();

  const newFilter: FilterValueType = "completed";

  const startState: Array<TodoListType> = [
    {id: todoList_ID1, title: "What to learn", filter: "all"},
    {id: todoList_ID2, title: "What to buy", filter: "all"},
  ];

  const action = changeTodoListFilterAC(todoList_ID2, newFilter);
  const endState = todoListsReducer(startState, action);

  expect(endState[0].filter).toBe("all");
  expect(endState[1].filter).toBe(newFilter);
});