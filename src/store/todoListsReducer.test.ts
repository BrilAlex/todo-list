import {
  addTodoListAC, changeTodoListFilterAC,
  changeTodoListTitleAC,
  removeTodoListAC,
  todoListsReducer
} from "./todoListsReducer";
import {v1} from "uuid";
import {FilterValueType, TodoListType} from "../App";

let todolistId1: string;
let todolistId2: string;
let startState: Array<TodoListType>;

beforeEach(() => {
  todolistId1 = v1();
  todolistId2 = v1();

  startState = [
    {id: todolistId1, title: "What to learn", filter: "All"},
    {id: todolistId2, title: "What to buy", filter: "All"}
  ];
});

test("correct todolist should be removed", () => {
  const endState = todoListsReducer(startState, removeTodoListAC(todolistId1));

  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todolistId2);
});

test("correct todolist should be added", () => {
  let newTodolistTitle = "New Todolist";
  const endState = todoListsReducer(startState, addTodoListAC(newTodolistTitle));

  expect(endState.length).toBe(3);
  expect(endState[2].title).toBe(newTodolistTitle);
});

test("correct todolist should change its name", () => {
  let newTodolistTitle = "New Todolist";
  const action = changeTodoListTitleAC(todolistId2, newTodolistTitle);
  const endState = todoListsReducer(startState, action);

  expect(endState[0].title).toBe("What to learn");
  expect(endState[1].title).toBe(newTodolistTitle);
});

test("correct filter of todolist should be changed", () => {
  let newFilter: FilterValueType = "Completed";
  const action = changeTodoListFilterAC(todolistId2, newFilter);
  const endState = todoListsReducer(startState, action);

  expect(endState[0].filter).toBe("All");
  expect(endState[1].filter).toBe(newFilter);
});
