import {v1} from "uuid";
import {
  addTodoListAC, changeTodoListFilterAC,
  changeTodoListTitleAC, FilterValueType,
  removeTodoListAC, TodoListDomainType,
  todoListsReducer
} from "./todoListsReducer";

let todoList_ID1: string;
let todoList_ID2: string;

let startState: Array<TodoListDomainType>;

beforeEach(() => {
  todoList_ID1 = v1();
  todoList_ID2 = v1();

  startState = [
    {id: todoList_ID1, title: "What to learn", addedDate: "", order: 0, filter: "all"},
    {id: todoList_ID2, title: "What to buy", addedDate: "", order: 0, filter: "all"},
  ];
});

test("Correct TodoList should be removed", () => {
  const endState = todoListsReducer(startState, removeTodoListAC(todoList_ID1));

  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todoList_ID2);
});

test("Correct TodoList should be added", () => {
  const newTodoListTitle = "New TodoList";
  const endState = todoListsReducer(startState, addTodoListAC(newTodoListTitle));

  expect(endState.length).toBe(3);
  expect(endState[0].title).toBe(newTodoListTitle);
  expect(endState[0].filter).toBe("all");
});

test("Correct TodoList should change it's name", () => {
  const newTodoListTitle = "New Title";
  const action = changeTodoListTitleAC(todoList_ID2, newTodoListTitle);
  const endState = todoListsReducer(startState, action);

  expect(endState[0].title).toBe("What to learn");
  expect(endState[1].title).toBe(newTodoListTitle);
});

test("Correct TodoList filter should be changed", () => {
  const newFilter: FilterValueType = "completed";
  const action = changeTodoListFilterAC(todoList_ID2, newFilter);
  const endState = todoListsReducer(startState, action);

  expect(endState[0].filter).toBe("all");
  expect(endState[1].filter).toBe(newFilter);
});